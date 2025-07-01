import { Inter } from "next/font/google";
import "./globals.css";
import Providers from '@/components/providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TrendWise - Latest Insights & Trends",
  description: "Stay ahead of the curve with our curated collection of articles on technology, design, and innovation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}