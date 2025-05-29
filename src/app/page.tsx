import Header from "~/components/Header";
import ProductLandingPage from "~/components/ProductLandingPage";
import Footer from "~/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <ProductLandingPage />
      <Footer />
    </div>
  );
}
