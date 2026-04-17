export type VideoEmbedType = "youtube" | "vimeo" | "direct";

export interface VideoEmbedInfo {
  type: VideoEmbedType;
  embedUrl?: string;
  videoId?: string;
}

/**
 * Mendeteksi YouTube, Vimeo, atau URL file video langsung (mp4/webm/ogg, dll.).
 */
export function getVideoEmbedInfo(url: string): VideoEmbedInfo {
  if (!url?.trim()) {
    return { type: "direct" };
  }

  const youtubeRegex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch?.[1]) {
    return {
      type: "youtube",
      videoId: youtubeMatch[1],
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`,
    };
  }

  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch?.[1]) {
    return {
      type: "vimeo",
      videoId: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  return { type: "direct" };
}
