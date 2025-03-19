import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Providers } from "./providers";
import type { Metadata } from "next";

const font = GeistSans;

const metadata: Metadata = {
  title: "Patate Home",
  description: "Achetez des comtpes Clash of clans en toute sécurité",
  icons: {
    icon: "/pdp.png", // favicon
    apple: "/pdp.png", // pour iOS
  },
  openGraph: {
    title: "Patate Home",
    description: "Achetez des comtpes Clash of clans en toute sécurité",
    images: [
      {
        url: "/pdp.png",
        width: 1200,
        height: 630,
        alt: "Patate Home",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/pdp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={font.className}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5ZVSNRSP');
            `,
          }}
        />
      </head>
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
