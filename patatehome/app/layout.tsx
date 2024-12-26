import { Geist } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { metadata } from "./metadata";
import Footer from "./components/Footer";

const geist = Geist({
  subsets: ["latin"],
  adjustFontFallback: false,
  display: "swap",
});

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={geist.className}>
      <body className="antialiased">
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
