import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "UW Marketplace",
  description: "Buy and sell items with verified @uwaterloo.ca accounts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">
        <Header />
        {children}
      </body>
    </html>
  );
}


