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
      <body suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
