import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "სამეფო ხე | Royal Tree — Paulownia Tomentosa",
  description:
    "პავლოვნია ტომენტოზას სანერგე მეურნეობა და სამრეწველო პლანტაციები საქართველოში. კასპის რაიონი, სოფ. ახალქალაქი.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" className="dark" suppressHydrationWarning>
      <body className="antialiased selection:bg-[#d4af37]/30 selection:text-[#f5e7bd]">
        {children}
      </body>
    </html>
  );
}