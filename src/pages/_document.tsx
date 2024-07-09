import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Fuentes y íconos */}
          <link
            rel="stylesheet"
            type="text/css"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Roboto+Slab:400,700"
          />
          <link href="/assets/css/nucleo-icons.css" rel="stylesheet" />
          <link href="/assets/css/nucleo-svg.css" rel="stylesheet" />
          <script
            src="https://kit.fontawesome.com/42d5adcbca.js"
            crossOrigin="anonymous"
          ></script>
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
            rel="stylesheet"
          />
          <link
            id="pagestyle"
            href="/assets/css/material-dashboard.css?v=3.1.0"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
