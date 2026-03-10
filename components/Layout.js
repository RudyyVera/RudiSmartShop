import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useGlobalContext } from "../Contexts/globalContext/context";
import Loading from "./Loading";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Cart from "./cart/Cart";
import Profile from "./Profile";
import Footer from "./Footer";
import ChatbotFAB from "./ChatbotFAB";

export default function Layout({ children }) {
  const router = useRouter();
  const { setShowCart, setShowSide, setDisplayProf } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShowSide(false);
    setShowCart(false);
    setDisplayProf(false);

    const handleStart = (url) => setLoading(true);
    const handleComplete = (url) => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
  }, [router]);

  return (
    <div className="content glob-trans relative min-h-screen bg-secondary dark:bg-transparent">
      <Head>
        <title>RudiSmartShop | Modern Smart Commerce</title>
        <meta
          name="description"
          content="RudiSmartShop: tienda online moderna con experiencia bilingüe, panel admin y checkout optimizado."
        />
        <meta
          name="keywords"
          content="RudiSmartShop, ecommerce, Next.js, tienda online, portfolio"
        />
        <meta property="og:title" content="RudiSmartShop" />
        <meta
          property="og:description"
          content="E-commerce moderno con diseño cyberpunk, gestión de productos y órdenes."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Loading loading={loading} />
      <Navbar />
      <Sidebar />
      <Cart />
      <Profile />
      {children}
      <div id="chatbot-fab-root" className="fixed bottom-6 right-6 z-[70]">
        <ChatbotFAB />
      </div>
      <Footer />
    </div>
  );
}
