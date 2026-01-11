import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '../constants';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "The Ultimate Marketplace for Sex Workers. Secure, Verified, and Professional.",
  image = "/logo.png",
  url = window.location.href
}) => {
  const fullTitle = `${title} | ${APP_NAME}`;
  
  // Ensure image is an absolute URL for social cards to work
  // Replace 'https://peachy.market' with your actual domain when deployed
  const siteDomain = 'https://peachy.market'; 
  const absoluteImage = image.startsWith('http') ? image : `${siteDomain}${image.startsWith('/') ? '' : '/'}${image}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:site_name" content={APP_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
    </Helmet>
  );
};