"use client";
import Image from "next/image";
import { useState } from "react";

interface AccountImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onError?: () => void;
}

export default function AccountImage({
  src,
  alt,
  className = "",
  priority = false,
  onError,
}: AccountImageProps) {
  const [error, setError] = useState(false);

  // Image SVG de secours encodée en data URL
  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3Cpath d='M20 20 L80 80 M80 20 L20 80' stroke='%23999999' stroke-width='3'/%3E%3C/svg%3E";

  // Ajouter un timestamp à l'URL pour éviter le cache
  const processedSrc = src.includes("?")
    ? `${src}&t=${Date.now()}`
    : `${src}?t=${Date.now()}`;

  const imageSrc = error ? placeholderImage : processedSrc;

  return (
    <div className="relative w-full h-full">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        unoptimized={true}
        priority={priority}
        className={`object-cover ${className}`}
        onError={(e) => {
          console.error(`Erreur de chargement de l'image: ${src}`);
          setError(true);
          // Appeler le callback externe s'il existe
          if (onError) onError();
          e.currentTarget.onerror = null; // Empêche les boucles infinies
        }}
      />
    </div>
  );
}
