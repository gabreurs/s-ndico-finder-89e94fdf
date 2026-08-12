import { useEffect } from "react";

const SITE_URL = "https://quero1sindico.com";
const SITE_NAME = "Quero 1 Síndico";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return el;
}

function setLinkTag(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
}

/** Componente utilitário para SEO client-side: title, meta description, canonical, OG e JSON-LD. */
export function Seo({ title, description, path, ogImage, jsonLd }: SeoProps) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const canonicalUrl = `${SITE_URL}${path}`;

    const metaDescription = setMetaTag("name", "description", description);
    const ogTitle = setMetaTag("property", "og:title", title);
    const ogDescription = setMetaTag("property", "og:description", description);
    const ogUrl = setMetaTag("property", "og:url", canonicalUrl);
    const ogType = setMetaTag("property", "og:type", "article");
    const ogSiteName = setMetaTag("property", "og:site_name", SITE_NAME);
    const twitterCard = setMetaTag("name", "twitter:card", "summary_large_image");
    const twitterTitle = setMetaTag("name", "twitter:title", title);
    const twitterDescription = setMetaTag("name", "twitter:description", description);
    const ogImageTag = ogImage ? setMetaTag("property", "og:image", ogImage) : null;

    const canonicalLink = setLinkTag("canonical", canonicalUrl);

    let scriptTag: HTMLScriptElement | null = null;
    if (jsonLd) {
      scriptTag = document.createElement("script");
      scriptTag.type = "application/ld+json";
      scriptTag.text = JSON.stringify(jsonLd);
      document.head.appendChild(scriptTag);
    }

    return () => {
      document.title = previousTitle;
      metaDescription.remove();
      ogTitle.remove();
      ogDescription.remove();
      ogUrl.remove();
      ogType.remove();
      ogSiteName.remove();
      twitterCard.remove();
      twitterTitle.remove();
      twitterDescription.remove();
      ogImageTag?.remove();
      canonicalLink.remove();
      scriptTag?.remove();
    };
  }, [title, description, path, ogImage, jsonLd]);

  return null;
}

export { SITE_URL };
