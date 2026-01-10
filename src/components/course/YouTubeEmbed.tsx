import { Play, ExternalLink } from "lucide-react";
import { useState } from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  if (!isLoaded) {
    return (
      <div 
        className="relative my-3 rounded-lg overflow-hidden cursor-pointer group border border-border bg-secondary/50"
        onClick={() => setIsLoaded(true)}
      >
        <div className="relative aspect-video">
          <img 
            src={thumbnailUrl} 
            alt={title || "YouTube video"} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg group-hover:scale-110 transition-transform">
              <Play className="h-6 w-6 ml-1" fill="white" />
            </div>
          </div>
        </div>
        {title && (
          <div className="p-3 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground line-clamp-1">{title}</span>
            <a 
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-border">
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

// Helper to extract YouTube video ID from URL
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
