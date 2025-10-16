import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "KMK Homes | Luxury Villas & Premium Real Estate in Hyderabad",
  description = "KMK Homes - Building dream homes since 2009. Ultra-luxury triplex villas, budget homes & premium plots in Hyderabad. Class, trust & professionalism.",
  keywords = "luxury villas Hyderabad, KMK Homes, Sainikpuri villas, triplex villas, open plots Hyderabad, budget homes, Gachibowli properties, premium real estate Hyderabad",
  ogImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
  ogType = "website",
  canonical,
  schema
}) => {
  const siteUrl = window.location.origin;
  const currentUrl = window.location.href;
  const canonicalUrl = canonical || currentUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="KMK Homes" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="KMK Homes" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IN-TG" />
      <meta name="geo.placename" content="Hyderabad" />
      <meta name="geo.position" content="17.385044;78.486671" />
      <meta name="ICBM" content="17.385044, 78.486671" />
      
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
