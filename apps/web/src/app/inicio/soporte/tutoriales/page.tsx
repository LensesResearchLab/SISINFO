"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getTutorials } from "@/app/services/support.service";
import { Tutorial } from "@/app/types/support.types";
/**
 * VideoPlayer Component
 *
 * Embeds a video using an iframe from a provided source URL.
 *
 * @param {string} src - The URL of the video to be embedded in the iframe.
 * @returns {JSX.Element} An iframe element that displays the video.
 */
function VideoPlayer({ src }: { src: string }) {
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
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches tutorials from the backend service.
   *
   * This hook runs when the component mounts, fetching the list of tutorials
   * and updating the state once the data is received.
   */
  useEffect(() => {
    getTutorials().then((data) => {
      setTutorials(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="columns-1 min-h-full min-w-full sm:gap-8 sm:columns-2 p-4 space-y-4">
      {tutorials.map((tutorial, index) => (
        <Card key={index} className="p-4 border-none">
          <CardHeader>
            <h2 className="text-xl font-bold text-core-highlight mb-4">
              {tutorial.title}
            </h2>
            <p className="text-lg text-foreground-soft">
              {tutorial.description}
            </p>
          </CardHeader>
          <CardContent>
            <VideoPlayer src={tutorial.link} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
