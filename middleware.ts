import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  // Get hostname (e.g., 'titanflow.aldoarbizu.com', 'localhost:3000')
  const hostname = req.headers.get('host') || '';

  // Extract subdomain
  // If it's a localhost testing environment:
  // titanflow.localhost:3000 -> subdomain 'titanflow'
  // Or production: titanflow.aldoarbizu.com -> subdomain 'titanflow'
  let subdomain = '';
  if (hostname.includes('.aldoarbizu.com')) {
    subdomain = hostname.replace('.aldoarbizu.com', '');
  } else if (hostname.includes('.localhost')) {
    subdomain = hostname.split('.')[0];
  }

  // If there is a valid subdomain (and it's not 'www')
  if (subdomain && subdomain !== 'www') {
    // We rewrite the URL to point to our dynamic route: /sites/[subdomain]/[path...]
    // We also need to preserve the locale logic if needed, but next-intl will run first.
    // For simplicity, we rewrite to the sites folder.
    url.pathname = `/sites/${subdomain}${url.pathname}`;
    // We don't want next-intl to intercept subdomain static assets, but intl middleware usually handles basic routes.
  }

  // Run next-intl middleware first to get the locale
  const response = intlMiddleware(req);

  // If it's a subdomain, we need to rewrite AFTER intl has figured out the locale
  if (subdomain && subdomain !== 'www') {
    // next-intl might have rewritten the URL internally. 
    // We can inject the /sites/[subdomain] part into the Next-Intl rewrite
    const locale = response.headers.get('x-middleware-request-x-next-intl-locale') || routing.defaultLocale;
    
    // We do a direct rewrite to the localized sites path
    return NextResponse.rewrite(new URL(`/${locale}/sites/${subdomain}${req.nextUrl.pathname}`, req.url));
  }

  return response;
}

export const config = {
  // Skip all internal paths (_next, api, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
// NEXUS REFRESH
