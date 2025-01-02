"use client";
import Image from "next/image";
import { useState } from "react";

export default function AccountImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [error, setError] = useState(false);

  const imageSrc = error
    ? "/placeholder-account.jpg"
    : src.startsWith("/")
    ? src
    : `/accounts/${src}`;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      className="object-cover group-hover:scale-110 transition-transform duration-500"
      onError={() => setError(true)}
    />
  );
}
