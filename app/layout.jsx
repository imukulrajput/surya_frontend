// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "MyWorker - Professional Services",
//   description: "Find the perfect worker for any job.",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f172a] text-white`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }

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