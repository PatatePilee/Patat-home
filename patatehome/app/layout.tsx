import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Header from "./components/Header";
import { metadata } from "./metadata";
import Footer from "./components/Footer";
import { Providers } from "./providers";

const font = GeistSans;

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={font.className}>
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
          ></iframe>
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
