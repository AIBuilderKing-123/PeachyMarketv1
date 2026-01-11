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
  
  // 1. Check for overrides in LocalStorage (Public URL is preferred for meta tags)
  const storedPublicUrl = localStorage.getItem('site_logo_public_url');
  const storedInternalLogo = localStorage.getItem('site_logo'); // DataURL

  // 2. Determine best image source
  let finalImage = image;
  if (image === '/logo.png') {
      // If using default logo, try to use configured logo
      if (storedPublicUrl) {
          finalImage = storedPublicUrl;
      } else if (storedInternalLogo) {
          // Note: DataURLs often don't work in meta tags for social scrapers, but work for browser tabs
          finalImage = storedInternalLogo;
      }
  }

  // 3. Ensure absolute URL if it's a relative path (and not a DataURL)
  const siteDomain = 'https://peachy.market'; 
  const absoluteImage = finalImage.startsWith('http') || finalImage.startsWith('data:') 
    ? finalImage 
    : `${siteDomain}${finalImage.startsWith('/') ? '' : '/'}${finalImage}`;

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