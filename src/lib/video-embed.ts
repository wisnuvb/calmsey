export type VideoEmbedType = "youtube" | "vimeo" | "direct";

export interface VideoEmbedInfo {
  type: VideoEmbedType;
  embedUrl?: string;
  videoId?: string;
}

export type VideoEmbedOptions = {
  /**
   * Browser policy: autoplay usually requires mute for embeds.
   * Gunakan true untuk hero/promo otomatis; false untuk pemutaran setelah klik (mis. artikel).
   */
  mutedAutoplay?: boolean;
};

/**
 * Mendeteksi YouTube, Vimeo, atau URL file video langsung (mp4/webm/ogg, dll.).
 */
export function getVideoEmbedInfo(
  url: string,
  options?: VideoEmbedOptions,
): VideoEmbedInfo {
  const mutedAutoplay = options?.mutedAutoplay ?? false;

  if (!url?.trim()) {
    return { type: "direct" };
  }

  const youtubeRegex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch?.[1]) {
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      playsinline: "1",
    });
    if (mutedAutoplay) {
      params.set("mute", "1");
    }
    return {
      type: "youtube",
      videoId: youtubeMatch[1],
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?${params.toString()}`,
    };
  }

  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch?.[1]) {
    const params = new URLSearchParams({ autoplay: "1" });
    if (mutedAutoplay) {
      params.set("muted", "1");
    }
    return {
      type: "vimeo",
      videoId: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?${params.toString()}`,
    };
  }

  return { type: "direct" };
}
