import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunidhisecurities.com';
  const currentDate = new Date();

  return [
    // Homepage - Highest Priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // Core Pages - High Priority
    {
      url: `${baseUrl}/open-account`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },

    // Services - High Priority
    {
      url: `${baseUrl}/services/equity-trading`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/derivatives`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/debt-market`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    {
      url: `${baseUrl}/services/mutual-funds`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/wealth-management`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/insurance`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // Expertise - High Priority
    {
      url: `${baseUrl}/expertise/retail-equity`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/expertise/institution-equity`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/expertise/wholesale-debt-market`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/expertise/foreign-exchange`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/expertise/commodities-trading`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/expertise/mutual-fund-distribution`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/expertise/depository-services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/expertise/research`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/expertise/sunidhi-capital`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/expertise/mtf`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Markets - Dynamic Content (High Priority)
    {
      url: `${baseUrl}/markets/overview`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/markets/ipo`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/markets/updates`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/markets/research`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/markets/education`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/markets/nse-rss`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.8,
    },

    // Tools - Important for SEO
    {
      url: `${baseUrl}/tools/margin-calculator`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/sip-calculator`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/tax-calculator`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/brokerage-calculator`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // About - Company Information
    {
      url: `${baseUrl}/about/story`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/leadership`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/careers`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/awards`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/life-at-sunidhi`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/csr`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/foundation`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // Support
    {
      url: `${baseUrl}/support/help`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support/branches`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support/downloads`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // Legal & Compliance - Important for Trust
    {
      url: `${baseUrl}/legal/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/legal/regulatory-information`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/legal/kyc-advisory`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/legal/disclosure-disclaimer`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/legal/investor-charter`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // Resources
    {
      url: `${baseUrl}/resources/holidays`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/resources/settlement-calendar`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // Blog - Dynamic Content
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Note: Individual blog posts with [slug] would need to be fetched dynamically
    // For now, we'll include the main blog page. You can extend this by fetching
    // blog posts from your API and adding them dynamically
  ];
}
