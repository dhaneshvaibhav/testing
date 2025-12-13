import { Helmet } from 'react-helmet-async';

export default function SEO({
  title = "Collegaess - Anonymous College Reviews & Experiences",
  description = "Discover honest college reviews, scams, and experiences from anonymous students. Share your story, find the truth about colleges, and make informed decisions.",
  keywords = "college reviews, college scams, anonymous reviews, student experiences, college ratings, college admissions, college life",
  image = "/og-image.png",
  url = window.location.href,
  type = "website"
}) {
  const siteName = "Collegaess";
  const twitterHandle = "@collegaess";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Collegaess Team" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content={twitterHandle} />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#00FFE4" />
      <meta name="msapplication-TileColor" content="#00FFE4" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": siteName,
          "description": description,
          "url": window.location.origin,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": siteName
          }
        })}
      </script>
    </Helmet>
  );
}