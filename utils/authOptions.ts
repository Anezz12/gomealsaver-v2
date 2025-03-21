import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '../config/database';
import User from '../models/User';
import { JWT } from 'next-auth/jwt';

// define costum types for extending the session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      username: string;
      image: string;
      provider: string;
      password: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    username: string;
    image: string;
    provider: string;
    password: string;
  }
}
// define costume types for extending JWT
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    username: string;
    role: string;
    image: string;
    provider: string;
  }
}
// Add type definition for Google profile
interface GoogleProfile {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  sub: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    //  Credentials Provider for email and password
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        mode: { label: 'Mode', type: 'text' }, // Optional: can be 'login' or 'register'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password.');
        }

        // Connect to the database
        await connectDB();

        try {
          // Check if the user exists
          const existingUser = await User.findOne({ email: credentials.email });

          // If this is explicitly a login request
          const isLoginMode = credentials.mode === 'login';

          // Handle login attempt for non-existent user
          if (
            !existingUser &&
            (isLoginMode || credentials.mode === undefined)
          ) {
            throw new Error(
              'No account found with this email. Please register first.'
            );
          }

          // Handle registration attempt for existing user
          if (existingUser && credentials.mode === 'register') {
            throw new Error(
              'An account with this email already exists. Please log in instead.'
            );
          }

          // Login flow - user exists, verify password
          if (existingUser) {
            // Check if this is a social login account trying to use password
            if (existingUser.provider === 'google' && !existingUser.password) {
              throw new Error(
                'This account uses Google login. Please sign in with Google.'
              );
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              existingUser.password
            );

            if (!isPasswordValid) {
              throw new Error('Incorrect password. Please try again.');
            }

            // Return the user if login successful
            return {
              id: existingUser._id.toString(),
              email: existingUser.email,
              name: existingUser.name,
              role: existingUser.role,
              username: existingUser.username,
              image: existingUser.image,
              provider: existingUser.provider || 'credentials',
              password: '',
            };
          }

          // This should never execute if we have proper mode checking above
          throw new Error('Authentication error. Please try again.');
        } catch (error) {
          // Re-throw authentication errors
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error(
            'An unexpected error occurred. Please try again later.'
          );
        }
      },
    }),
  ],
  // Database connection
  //   Callbacks for session and JWT
  callbacks: {
    async signIn({ account, profile }) {
      try {
        await connectDB();
        if (account?.provider === 'google' && profile) {
          const googleProfile = profile as unknown as GoogleProfile;
          const userExists = await User.findOne({ email: googleProfile.email });

          if (!userExists) {
            await User.create({
              username: googleProfile.name,
              email: googleProfile.email,
              name: googleProfile.name,
              image: googleProfile.picture,
              role: 'user',
              provider: 'google',
              password: '',
            });
          }
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },

    async session({ session }: { session: any; token: JWT }) {
      try {
        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (user) {
          session.user = {
            ...session.user,
            id: user._id.toString(),
            role: user.role,
            name: user.name || user.username,
            username: user.username,
            image: user.image,
            provider: user.provider,
            password: user.password,
          };
        }
        return session;
      } catch (error) {
        console.error('Error in session callback:', error);
        return session;
      }
    },

    // async jwt({ token, user }: { token: JWT; user: JWT }) {
    //   if (user) {
    //     token.id = user.id;
    //     token.name = user.name;
    //     token.username = user.username;
    //     token.role = user.role;
    //   }
    //   return token;
    // },

    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.username = user.username;
        token.role = user.role;
        token.image = user.image;
        token.provider = user.provider;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/',
  },
};
