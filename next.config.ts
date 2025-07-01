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

  // 🔧 FIX: Add CORS and CSP headers for Midtrans
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // CORS Headers
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

          // Content Security Policy for Midtrans
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.sandbox.midtrans.com https://app.midtrans.com https://js-agent.newrelic.com https://bam-cell.nr-data.net",
              "connect-src 'self' https://api.sandbox.midtrans.com https://api.midtrans.com https://app.sandbox.midtrans.com https://app.midtrans.com https://bam.nr-data.net https://bam-cell.nr-data.net wss:",
              "img-src 'self' data: https: blob:",
              "style-src 'self' 'unsafe-inline' https://app.sandbox.midtrans.com https://app.midtrans.com",
              "font-src 'self' data: https:",
              "frame-src 'self' https://app.sandbox.midtrans.com https://app.midtrans.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://app.sandbox.midtrans.com https://app.midtrans.com",
            ].join('; '),
          },

          // Additional Security Headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
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

      // Specific headers for API routes
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

      // Headers for Midtrans webhook
      {
        source: '/api/webhook/midtrans',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://api.sandbox.midtrans.com, https://api.midtrans.com',
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

  // 🔧 FIX: Handle rewrites for better routing
  async rewrites() {
    return [
      // Proxy untuk Midtrans API jika diperlukan
      {
        source: '/api/midtrans/:path*',
        destination: 'https://api.sandbox.midtrans.com/:path*',
      },
    ];
  },

  // 🔧 FIX: Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 🔧 FIX: Experimental features untuk better performance
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app', '*.netlify.app'],
    },
  },
};

export default nextConfig;
