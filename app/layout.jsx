
import { Roboto } from "next/font/google";
import "./globals.css";


const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto', // This defines a CSS variable we'll use in globals.css
  display: 'swap',
});


export const metadata = {
  title: "MyWorker - Earn Money Online",
  description: "Complete tasks and earn rewards instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"> 
      <body className={`${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}    