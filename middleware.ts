import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Matcher que acepta todo excepto archivos internos de Next y estáticos
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
