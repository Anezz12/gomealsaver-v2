/* eslint-disable @typescript-eslint/no-explicit-any */
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
  }
}
// define costume types for extending JWT
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    username: string;
    role: string;
  }
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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password.');
        }

        // Connect to the database
        await connectDB();

        // Check if the user exists
        const existingUser = await User.findOne({ email: credentials.email });

        // Register the user if it doesn't exist & regster Flow

        if (!existingUser) {
          try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(credentials.password, 12);

            // Create Username from email
            const username = credentials.email.split('@')[0];

            //  Create a new user
            const newUser = await User.create({
              email: credentials.email,
              password: hashedPassword,
              username: username,
              role: 'user',
              provider: 'credentials',
              image: '',
            });

            return {
              id: newUser._id.toString(),
              email: newUser.email,
              name: newUser.name,
              role: newUser.role,
              username: newUser.username,
              provider: 'credentials',
              image: '',
            };
          } catch (error) {
            const err = error as Error;
            throw new Error('Registration failed: ' + err.message);
          }
        }

        //   Login Flow
        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          existingUser.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        // Return the user if the password is correct
        return {
          id: existingUser._id.toString(),
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          username: existingUser.username,
          image: existingUser.image,
          provider: existingUser.provider || 'credentials',
        };
      },
    }),
  ],

  //   Callbacks for session and JWT
  callbacks: {
    async signIn({ account, profile }) {
      try {
        await connectDB();
        if (account?.provider === 'google' && profile) {
          const userExists = await User.findOne({ email: profile.email });

          if (!userExists) {
            await User.create({
              email: profile.email,
              name: profile.name,
              image: profile.image,
              password: '',
              role: 'user',
              provider: 'google',
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
