import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.min.css";
import type { AppProps } from "next/app";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ToastContainer } from "react-toastify";
import { ptBR } from "@clerk/localizations";
import { dark } from "@clerk/themes";
import { Header } from "@/components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "rgb(139 92 246)" },
      }}
      localization={ptBR}
      {...pageProps}
    >
      <QueryClientProvider client={queryClient}>
        <Header />
        <ToastContainer autoClose={3000} limit={3} theme="dark" />
        <div className="pt-14 sm:pt-16">
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
