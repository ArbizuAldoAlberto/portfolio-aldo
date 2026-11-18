import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'es', 'zh'],
  defaultLocale: 'es',
  localePrefix: 'always' // Forzamos a que siempre use /es, /en o /zh
});

export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
