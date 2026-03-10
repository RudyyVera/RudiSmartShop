//hooks
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../Contexts/globalContext/context";
// components
import GridProducts from "../../components/product_components/GridProducts";
import EmptyState from "../../components/product_components/EmptyState";
import SideCategories from "../../components/category_components/SideCategories";
import SortItems from "../../components/category_components/SortItems";
// values, icons, etc...
import { server } from "../../config";

export default function SearchPage({ products, allCategories }) {
  const router = useRouter();
  const { sorter, sort } = useGlobalContext();
  // to update page when search query change
  const [currentQ, setCurrentQ] = useState(router.query.q);
  // contains products to show
  const safeProducts = Array.isArray(products) ? products : [];
  const [proSt, setProSt] = useState([...safeProducts]);

  // trigger when search query change
  useEffect(() => {
    if (currentQ !== router.query.q) {
      setCurrentQ(router.query.q);
      const resArr = sorter(safeProducts);
      setProSt([...resArr]);
    }
  }, [router.query.q, safeProducts]);

  // trigger when sort view change
  useEffect(() => {
    const resArr = sorter(safeProducts);
    setProSt([...resArr]);
  }, [sort, safeProducts]);

  const hasProducts = safeProducts && safeProducts.length > 0;

  return (
    <>
      {/* Navbar cover */}
      <div className="fixed w-full py-10 top-0 bg-white dark:bg-darkBg z-30 border-b border-neutral-200 dark:border-neutral-700"></div>
      
      {/* Main content area */}
      <div className="bg-white dark:bg-transparent text-black dark:text-white min-h-screen">
        <div className="flex flex-row pt-36 sm:pt-5 px-4 sm:px-0 gap-10 max-w-7xl mx-auto">
          {/* selecting categories */}
          <SideCategories categories={allCategories} />
          
          {/* Product grid container */}
          <div className="flex-1">
            {hasProducts ? (
              <>
                {/* Products header - filter and sort in one row */}
                <div className="flex items-center justify-between mb-14 gap-4 relative z-10">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {proSt.length} {proSt.length === 1 ? "producto" : "productos"} encontrados
                  </p>
                  <div className="relative">
                    <SortItems />
                  </div>
                </div>
                <GridProducts
                  key={proSt[0]?._id || "empty"}
                  products={proSt}
                  limit={100}
                />
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(cnx) {
  const query = cnx.query?.q;
  
  try {
    const data = await fetch(
      `${server}/api/product/crud?filter=name&value=${query || ""}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    // Use new API con conteos
    const rewCats = await fetch(`${server}/api/product/categories-with-counts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const products = await data.json();
    const allCategories = await rewCats.json();

    return {
      props: { 
        products: Array.isArray(products) ? products : [],
        allCategories: Array.isArray(allCategories) ? allCategories : []
      },
    };
  } catch (error) {
    console.error("Error fetching search data:", error);
    return {
      props: { 
        products: [],
        allCategories: []
      },
    };
  }
}
