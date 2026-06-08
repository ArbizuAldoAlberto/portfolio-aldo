import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'es',
  localePrefix: 'always' // Forzamos a que siempre use /es o /en
});

export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
