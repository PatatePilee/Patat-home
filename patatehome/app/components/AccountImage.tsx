"use client";
import Image from "next/image";
import { useState } from "react";

interface AccountImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function AccountImage({
  src,
  alt,
  className,
}: AccountImageProps) {
  const [error, setError] = useState(false);

  const imageSrc = error
    ? "/placeholder-account.jpg"
    : src.startsWith("/")
    ? src
    : `/accounts/${src}`;

  return (
    <div className="relative w-full h-full">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={`object-cover group-hover:scale-110 transition-transform duration-500 ${className}`}
        sizes="(max-width: 768px) 100vw, 50vw"
        onError={() => setError(true)}
      />
    </div>
  );
}
