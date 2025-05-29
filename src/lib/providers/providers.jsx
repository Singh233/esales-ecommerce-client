import ReduxProvider from "../redux/provider";
import ReactQueryProvider from "./react-query";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

// Wrapper component to provide all providers to the app
function Providers({ children }) {
  return (
    <>
      <ReactQueryProvider>
        <Toaster
          richColors
          toastOptions={{
            className: "rounded-lg shadow-lg",
          }}
          position="top-right"
          closeButton
        />
        <NextTopLoader color="#000000" showSpinner={false} height={4} />
        <ReduxProvider>
          <Header />
          {children}
          <Footer />
        </ReduxProvider>
      </ReactQueryProvider>
    </>
  );
}

export default Providers;
