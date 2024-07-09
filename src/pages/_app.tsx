import '../utils/firebase/firebase.ts';
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import Layout from "@/components/layout/Layout";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <Layout>
        <Component {...pageProps} />
        {/* Agrega los scripts aquí */}
        {/* <Script src="/assets/js/core/popper.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/core/bootstrap.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/plugins/perfect-scrollbar.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/material-dashboard.min.js" strategy="lazyOnload" /> */}
      </Layout>
    </>
  );
}

App.getInitialProps = async ({ Component, ctx }) => {
  const { res, pathname } = ctx;

  if (pathname === "/") {
    if (res) {
      res.writeHead(307, { Location: "/sign-in" });
      res.end();
    } else {
      ctx.res.writeHead(307, { Location: "/sign-in" });
      ctx.res.end();
    }
  }

  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};