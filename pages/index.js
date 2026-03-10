import { server } from "../config";
import Intro from "../components/home_components/Intro";
import { motion } from "framer-motion";
import GridProducts from "../components/product_components/GridProducts";
import Moto1 from "../components/home_components/Moto1";
import Link from "next/link";
import Image from "next/image";
import { useGlobalContext } from "../Contexts/globalContext/context";

export default function Home({ newArivals, sales }) {
  const { translate } = useGlobalContext();
  const safeNewArrivals = Array.isArray(newArivals) ? newArivals : [];
  const safeSales = Array.isArray(sales) ? sales : [];
  return (
    <div className="bg-secondary dark:bg-transparent">
      <Intro />
      {safeNewArrivals.length > 0 ? (
        <div className="w-full bg-gradient-to-b from-transparent via-neutral-950/5 to-transparent">
          <div className="w-[85%] sm:w-[75%] mx-auto mt-36 mb-20">
            <motion.p
              initial={{ y: 0, opacity: 0 }}
              whileInView={{ y: -40, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ease: "easeOut", duration: 1 }}
              className="capitalize text-3xl text-secondary text-center mb-12"
            >
              {translate("latest_arivals")}
            </motion.p>
            <GridProducts products={safeNewArrivals} limit={6} />
          </div>
        </div>
      ) : null}
      <Moto1 />
      {safeSales.length > 0 ? (
        <div className="relative w-full bg-gradient-to-b from-transparent via-neutral-950/10 to-transparent">
          <div className="relative w-[85%] sm:w-[75%] mx-auto mt-40 mb-20 pt-8 pb-16 overflow-visible">
            {/* Subtle grain texture */}
            <div className="absolute inset-x-0 inset-y-0 pointer-events-none opacity-10" style={{ backgroundImage: "repeating-radial-gradient(circle at 0 0, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 4px)", backgroundSize: "4px 4px" }}></div>

            <div className="relative z-10">
              {/* Centered Title with Breathing Space */}
              <motion.h4
                initial={{ y: 0, opacity: 0 }}
                whileInView={{ y: -40, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ ease: "easeOut", duration: 1 }}
                className="capitalize text-4xl sm:text-5xl text-secondary text-center font-bold mb-16"
              >
                {translate("sales")}
              </motion.h4>

              {/* Horizontal Carousel of Products */}
              <GridProducts products={safeSales} limit={6} />
            </div>
          </div>
        </div>
      ) : null}
      <div className="w-full flex justify-center pb-20 pt-10">
        <Link href="/search">
          <a className="bg-white text-black rounded-sm text-xs uppercase tracking-widest font-bold py-4 px-10 text-center transition-all duration-300 ease-in-out hover:bg-neutral-100 hover:shadow-lg shadow-md">
            EXPLORE COLLECTION
          </a>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const newArivals = await getProductsFromDB("newArival", true);
  const sales = await getProductsFromDB("sale", true);
  return {
    props: {
      newArivals,
      sales,
    },
  };
}

async function getProductsFromDB(prop, value) {
  try {
    const response = await fetch(
      `${server}/api/product/crud?filter=${prop}&value=${value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}
