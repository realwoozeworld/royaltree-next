import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import {
  Cormorant_Garamond,
  DM_Sans,
  Noto_Sans_Georgian,
} from "next/font/google";
import "./globals.css";

const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-georgian",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteTitle = "სამეფო ხე | Royal Tree — პავლოვნიის ნერგები და პლანტაციები";
const siteDescription =
  "პავლოვნია ტომენტოზას (Paulownia Tomentosa) სერტიფიცირებული ელიტარული ნერგები და სამრეწველო პლანტაციები საქართველოში. მაღალშემოსავლიანი აგრო-ინვესტიცია, ROI კალკულატორი, სწრაფმზარდი ხე-ტყის წარმოება და ეკოლოგიური გადაწყვეტილებები. Certified Paulownia saplings, plantation investment ROI, and eco-agro solutions in Georgia.";

export const metadata: Metadata = {
  metadataBase: new URL("https://royaltree.ge"),
  title: {
    default: siteTitle,
    template: "%s | Royal Tree",
  },
  description: siteDescription,
  applicationName: "Royal Tree — სამეფო ხე",
  authors: [{ name: "Royal Tree Georgia", url: "https://royaltree.ge" }],
  generator: "Next.js",
  keywords: [
    // Georgian Keywords
    "პავლოვნია",
    "პავლოვნიის ნერგები",
    "სამეფო ხე",
    "პავლოვნიის პლანტაცია",
    "პავლოვნია ტომენტოზა",
    "სწრაფმზარდი ხეები",
    "ხე-ტყის ბიზნესი",
    "აგრო ინვესტიცია",
    "ნერგები საქართველოში",
    "კასპი მეფისქალაქი ნერგები",
    "ROI კალკულატორი",
    "მერქნის წარმოება",
    // English Keywords
    "Paulownia",
    "Paulownia saplings",
    "Paulownia Tomentosa",
    "Royal Tree Georgia",
    "fast-growing timber",
    "agro investment Georgia",
    "timber plantation ROI",
    "Paulownia seedlings Georgia",
    "carbon capture trees",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ka_GE",
    alternateLocale: ["en_US"],
    url: "https://royaltree.ge",
    title: siteTitle,
    description: siteDescription,
    siteName: "Royal Tree — სამეფო ხე",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "სამეფო ხე | Royal Tree — Paulownia Plantation in Georgia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/og-cover.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ka"
      className={`dark ${notoSansGeorgian.variable} ${cormorantGaramond.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased selection:bg-[#d4af37]/30 selection:text-[#f5e7bd]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
