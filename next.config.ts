/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
      },
    ],
  },

  // 🔧 FIX: Environment-specific headers
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Development headers (more permissive)
    if (isDevelopment) {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, PUT, DELETE, OPTIONS',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Content-Type, Authorization',
            },
          ],
        },
      ];
    }

    // Production headers (more secure)
    return [
      {
        source: '/(.*)',
        headers: [
          // CORS Headers for production
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, Accept',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },

          // 🔧 FIX: Production-optimized CSP
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.sandbox.midtrans.com https://app.midtrans.com *.newrelic.com *.nr-data.net",
              "script-src-elem 'self' 'unsafe-inline' https://app.sandbox.midtrans.com https://app.midtrans.com *.newrelic.com *.nr-data.net",
              "connect-src 'self' https://api.sandbox.midtrans.com https://api.midtrans.com https://app.sandbox.midtrans.com https://app.midtrans.com *.newrelic.com *.nr-data.net wss: ws:",
              "img-src 'self' data: https: blob:",
              "style-src 'self' 'unsafe-inline' https://app.sandbox.midtrans.com https://app.midtrans.com",
              "font-src 'self' data: https:",
              "frame-src 'self' https://app.sandbox.midtrans.com https://app.midtrans.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://app.sandbox.midtrans.com https://app.midtrans.com",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
            ].join('; '),
          },

          // Security Headers
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },

      // API routes headers
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, Accept',
          },
        ],
      },

      // Midtrans webhook headers
      {
        source: '/api/webhook/midtrans',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // 🔧 FIX: Use wildcard for production
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Callback-Token',
          },
        ],
      },
    ];
  },

  // 🔧 FIX: Remove rewrites for production
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/midtrans/:path*',
  //       destination: 'https://api.sandbox.midtrans.com/:path*',
  //     },
  //   ];
  // },

  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app', '*.netlify.app'],
    },
  },
};

export default nextConfig;
