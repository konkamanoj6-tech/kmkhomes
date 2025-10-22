import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "KMK Homes – Luxury Villas, Budget Homes & Verified Plots in Hyderabad",
  description = "KMK Homes is a trusted real estate developer in Hyderabad, building luxury villas, budget-friendly homes, and verified plots across prime locations like Sainikpuri and Gachibowli.",
  keywords = "KMK Homes, Luxury Villas Hyderabad, Budget Homes Hyderabad, Plots for Sale Hyderabad, Real Estate Developers Hyderabad, Sainikpuri Villas, Gachibowli Properties",
  ogImage = "/kmk-logo.jpeg",
  ogType = "website",
  canonical,
  schema
}) => {
  const siteUrl = window.location.origin;
  const currentUrl = window.location.href;
  const canonicalUrl = canonical || currentUrl;
  const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="KMK Homes" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Favicon */}
      <link rel="icon" type="image/jpeg" href="/kmk-logo.jpeg" />
      <link rel="apple-touch-icon" href="/kmk-logo.jpeg" />
      
      {/* Open Graph / Facebook / WhatsApp / LinkedIn */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="KMK Homes Logo" />
      <meta property="og:site_name" content="KMK Homes" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content="KMK Homes Logo" />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IN-TG" />
      <meta name="geo.placename" content="Hyderabad" />
      <meta name="geo.position" content="17.385044;78.486671" />
      <meta name="ICBM" content="17.385044, 78.486671" />
      
      {/* Mobile */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content="KMK Homes" />
      
      {/* Schema.org Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
