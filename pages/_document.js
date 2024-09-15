import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src="https://docs.opencv.org/4.x/opencv.js"></script>
        <link rel="manifest"  href="/manifest.json"/>
        <link rel="apple-toucj-icon"  href="/icon.png"/>
        <meta name="theme-color"  content="#fff" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
