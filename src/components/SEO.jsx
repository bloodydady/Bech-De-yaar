import React from 'react';

const SEO = ({ title, description, keywords, image, url, type = 'website' }) => {
  const siteTitle = "Bech De Yaar";
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultDesc = "India's smartest campus marketplace for student trading, buying, and selling with zero commission.";

  return (
    <>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description || defaultDesc} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || '/logo.png'} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || window.location.href} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description || defaultDesc} />
      <meta property="twitter:image" content={image || '/logo.png'} />
    </>
  );
};

export default SEO;
