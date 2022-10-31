import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "../components/nav/Layout";
import { DataContextProvider } from "../components/context/data-context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DataContextProvider>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </DataContextProvider>
  );

}

export default MyApp;
