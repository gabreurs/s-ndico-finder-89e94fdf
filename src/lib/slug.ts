export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildSindicoSlug(nome: string, id: string): string {
  return `${slugify(nome)}-${id.slice(0, 8)}`;
}

export function extractIdFromSlug(slug: string): string | null {
  // The last 8 chars (after final hyphen) are the UUID prefix
  const match = slug.match(/-([a-f0-9]{8})$/);
  return match ? match[1] : null;
}
