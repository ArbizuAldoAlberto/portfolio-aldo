import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const securityHeaders = [
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY',
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()',
    },
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
    },
    {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob: https://va.vercel-scripts.com https://unpkg.com https://static.cloudflareinsights.com; script-src-elem 'self' 'unsafe-inline' blob: https://va.vercel-scripts.com https://unpkg.com https://static.cloudflareinsights.com; worker-src 'self' blob:; child-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https: wss: blob: https://cloudflareinsights.com; frame-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
    },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    images: {
        formats: ['image/avif', 'image/webp'] as any,
    },
    experimental: {
        optimizePackageImports: ['lucide-react', 'framer-motion'],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/compare.html',
                destination: '/es/compare',
            },
            {
                source: '/es/compare.html',
                destination: '/es/compare',
            },
            {
                source: '/en/compare.html',
                destination: '/en/compare',
            },
        ];
    },
};

export default withNextIntl(nextConfig);
