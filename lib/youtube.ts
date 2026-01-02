export function extractYouTubeId(url: string | null) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|v=|\/embed\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? null;
}
