import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const securityHeaders = [
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
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
        value: 'strict-origin-when-cross-origin',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
    },
    {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob: https://va.vercel-scripts.com https://unpkg.com; worker-src 'self' blob:; child-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https: wss: blob:; frame-src 'self';",
    },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
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
