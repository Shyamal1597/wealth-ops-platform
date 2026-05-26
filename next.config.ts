import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // TDL-009: Disable source maps in production so internal file paths embedded
  // in Next.js JS bundles are not exposed to the public.
  productionBrowserSourceMaps: false,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year for static images
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // TDL-009: Disable webpack's eval-source-map devtool so that JS chunks do
  // not embed inline base64 source maps containing absolute server file paths.
  // productionBrowserSourceMaps:false (above) kills external .map files;
  // this kills the inline data-URI source maps that appear in dev-mode chunks.
  webpack: (config, { isServer }) => {
    config.devtool = false;
    // pdf-parse and xlsx are server-only (used in API routes).
    // Keep them as Node.js externals so webpack doesn't try to bundle them,
    // which avoids the pdf-parse test-file loader issue in Next.js.
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'pdf-parse',
        'xlsx',
      ];
    }
    return config;
  },

  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 60 * 1000,
      pagesBufferLength: 5,
    },
  }),

  // Security headers
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';

    // ── Headers applied to ALL routes ───────────────────────────────────────
    // TDL-005: Content-Security-Policy.
    // `upgrade-insecure-requests` is production-only: it instructs browsers to
    // rewrite HTTP sub-resource requests as HTTPS. On a pre-prod HTTP server it
    // breaks every asset load, so we omit it outside production.
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.googleapis.com https://apis.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https://query1.finance.yahoo.com https://www.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com wss: ws:",
      "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      // upgrade-insecure-requests must only be sent when the server actually
      // serves HTTPS. On a plain HTTP production server it breaks every asset
      // load. Gate on HTTPS_SERVER=true rather than NODE_ENV.
      ...(process.env.HTTPS_SERVER === 'true' ? ["upgrade-insecure-requests"] : []),
    ];

    const globalHeaders = [
      { key: 'Content-Security-Policy', value: cspDirectives.join('; ') },
      // TDL-005: Cross-Origin-Opener-Policy
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      // Cross-Origin-Resource-Policy: cross-origin in dev (CDN fonts/images work),
      // same-origin in production.
      { key: 'Cross-Origin-Resource-Policy', value: isProduction ? 'same-origin' : 'cross-origin' },
      { key: 'X-DNS-Prefetch-Control',  value: 'on' },
      { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options',  value: 'nosniff' },
      { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
      { key: 'X-XSS-Protection',        value: '1; mode=block' },
      { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
      // TDL-005: HSTS — production only. Sending HSTS over plain HTTP is ignored
      // by browsers and can confuse some clients; it only has effect over HTTPS.
      ...(isProduction ? [{
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      }] : []),
    ];

    // ── TDL-006: Cache-Control for sensitive authenticated routes ────────────
    const noCacheHeaders = [
      { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
      { key: 'Pragma',        value: 'no-cache' },
      { key: 'Expires',       value: '0' },
    ];

    return [
      { source: '/:path*',          headers: globalHeaders },
      { source: '/admin/:path*',    headers: noCacheHeaders },
      { source: '/api/admin/:path*',headers: noCacheHeaders },
      { source: '/api/auth/:path*',        headers: noCacheHeaders },
      { source: '/research-login',  headers: noCacheHeaders },
      { source: '/markets/sip-products', headers: noCacheHeaders },
    ];
  },

  async redirects() {
    return [
      {
        source: '/services/foreign-exchange',
        destination: '/expertise/foreign-exchange',
        permanent: true,
      },
    ];
  },

  // Compression
  compress: true,

  // Production optimizations
  poweredByHeader: false,
};

export default nextConfig;
