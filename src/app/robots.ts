import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunidhisecurities.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about/*',
          '/services/*',
          '/expertise/*',
          '/markets/*',
          '/tools/*',
          '/support/*',
          '/legal/*',
          '/resources/*',
          '/blog/*',
          '/open-account',
          '/search',
        ],
        disallow: [
          '/admin/*',
          '/dashboard',
          '/login',
          '/register',
          '/api/*',
          '/feedback',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/about/*',
          '/services/*',
          '/expertise/*',
          '/markets/*',
          '/tools/*',
          '/support/*',
          '/legal/*',
          '/resources/*',
          '/blog/*',
          '/open-account',
          '/search',
        ],
        disallow: [
          '/admin/*',
          '/dashboard',
          '/login',
          '/register',
          '/api/*',
          '/feedback',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
