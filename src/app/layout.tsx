import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Her Beautiful Universe",
  description: "A romantic 3D universe where your relationship memories float as interactive photo nodes. Explore special moments, discover secret messages, and celebrate your love story.",
  keywords: ["love", "relationship", "memories", "3D", "romantic", "universe", "couple"],
  authors: [{ name: "Made with Love" }],
  openGraph: {
    title: "Her Beautiful Universe",
    description: "A romantic 3D universe of our memories",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Her Beautiful Universe",
    description: "A romantic 3D universe of our memories",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
