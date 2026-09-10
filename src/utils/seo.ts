/**
 * SEO utilities for Ujjwal SEO
 * Provides type-safe defaults for page metadata.
 */

export const SITE_NAME = 'Ujjwal SEO';
export const SITE_URL = 'https://ujjwalseo.com';
export const DEFAULT_AUTHOR = 'Ujjwal Lage';
export const DEFAULT_LOCALE = 'fr_FR';
export const TWITTER_HANDLE = ''; // Add if/when a Twitter/X account exists

export interface SEOMeta {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Builds a full <title> tag value.
 * Pattern: "Page Title | Ujjwal SEO"
 * For the homepage, the title is used as-is.
 */
export function buildTitle(pageTitle: string, isHome = false): string {
  if (isHome) return pageTitle;
  return `${pageTitle} | ${SITE_NAME}`;
}

/**
 * Resolves a canonical URL from a relative path.
 * Always returns an absolute URL.
 */
export function buildCanonical(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}
