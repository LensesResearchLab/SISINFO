"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getTutorials } from "@/app/services/support.service";
import { Tutorial } from "@/app/types/tutorial.types";
import { useQuery } from "@tanstack/react-query";
/**
 * VideoPlayer Component
 *
 * Embeds a video using an iframe from a provided source URL.
 *
 * @param {string} src - The URL of the video to be embedded in the iframe.
 * @returns {JSX.Element} An iframe element that displays the video.
 */
function VideoPlayer({ src }: { readonly src: string }) {
  return (
    <iframe
      className="w-full h-96"
      src={src}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}

export default function Tutorials() {
  const { data: tutorials, isLoading, error } = useQuery<Tutorial[]>({
    queryKey: ["tutorials"],
    queryFn: getTutorials,
  });

  if (isLoading) return <div>Cargando tutoriales...</div>;
  if (error || !tutorials) return <div>Error al cargar los tutoriales</div>;

  return (
    <div className="columns-1 min-h-full min-w-full sm:gap-8 sm:columns-2 p-4 space-y-4">
      {tutorials.map((tutorial, index) => (
        <Card key={index} className="p-4 border-none">
          <CardHeader>
            <h2 className="text-xl font-bold text-core-highlight mb-4">
              {tutorial.title}
            </h2>
            <p className="text-lg text-foreground-soft">{tutorial.description}</p>
          </CardHeader>
          <CardContent>
            <VideoPlayer src={tutorial.link} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}