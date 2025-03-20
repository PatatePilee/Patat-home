import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Providers } from "./providers";
import type { Metadata } from "next";
import Head from "next/head";

const font = GeistSans;

export const metadata: Metadata = {
  title: "Patate Home",
  description: "Achetez des comptes Clash of clans en toute sécurité",
  metadataBase: new URL("https://clashofpatates.com"),
  icons: {
    icon: [
      { url: "/pdp.png", type: "image/png", sizes: "32x32" },
      { url: "/pdp.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: ["/pdp.png"],
    apple: [{ url: "/pdp.png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/pdp.png",
      },
    ],
  },
  openGraph: {
    title: "Patate Home",
    description: "Achetez des comptes Clash of clans en toute sécurité",
    siteName: "Patate Home",
    images: [
      {
        url: "/pdp.png",
        width: 800,
        height: 800,
        alt: "Logo Patate Home",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Patate Home",
    description: "Achetez des comptes Clash of clans en toute sécurité",
    images: ["/pdp.png"],
  },
  verification: {
    google: "google-site-verification=VOTRE_CODE_VERIFICATION",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={font.className}>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/pdp.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/pdp.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/pdp.png" />
        <link rel="mask-icon" href="/pdp.png" color="#000000" />
        <meta name="msapplication-TileImage" content="/pdp.png" />
        <meta name="msapplication-TileColor" content="#000000" />
      </Head>
      <body
        suppressHydrationWarning
        className="bg-black min-h-screen text-white"
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5ZVSNRSP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Providers>
          <Header />
          <main className="16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
