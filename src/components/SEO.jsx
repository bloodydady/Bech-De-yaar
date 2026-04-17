import React from 'react';

/**
 * SEO Component — injects per-page meta tags for Google, Open Graph, and Twitter.
 * Usage: <SEO title="Page Title" description="..." keywords="..." image="..." />
 */
const SEO = ({ title, description, keywords, image, url, type = 'website', structuredData }) => {
  const siteTitle = "Bech De Yaar";
  const fullTitle = title ? `${title} | ${siteTitle} — India's Student Marketplace` : `${siteTitle} | India's #1 Student Marketplace – Buy Sell Rent for Students`;
  
  const defaultDesc = "Bech De Yaar is India's #1 student marketplace. Buy and sell used books, hostel items, cycles, calculators, laptops and study materials with zero commission. Founded by Deepak Singh.";
  const finalDesc = description || defaultDesc;

  const defaultKeywords = "student marketplace India, buy used books, sell old books online India, hostel items buy sell, second hand books for students, used calculator for sale, Bech De Yaar, bechdeyaar, Deepak Singh, zero commission marketplace";
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  const finalImage = image || 'https://bechdeyaar.vercel.app/logo.png';
  const finalUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://bechdeyaar.vercel.app');

  return (
    <>
      {/* === Primary Meta Tags === */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={finalDesc} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="Deepak Singh" />
      <meta name="robots" content="index, follow" />

      {/* === Open Graph / Facebook === */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content="Bech De Yaar" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />

      {/* === Twitter === */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalImage} />

      {/* === Custom JSON-LD (page-specific structured data) === */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </>
  );
};

export default SEO;
