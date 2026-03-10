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

export default function CategoriesPage({ products, allCategories, category }) {
  const router = useRouter();
  const { sorter, sort } = useGlobalContext();
  // to update when category change
  const [currentCat, setCurrentCat] = useState(category);
  // contains products to show
  const safeProducts = Array.isArray(products) ? products : [];
  const [proSt, setProSt] = useState([...safeProducts]);

  //trigger when cat param change
  useEffect(() => {
    if (currentCat !== router.query.cat) {
      setCurrentCat(router.query.cat);
      const resArr = sorter(safeProducts);
      setProSt([...resArr]);
    }
  }, [router.query.cat, safeProducts]);

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
              <EmptyState category={category} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(cnx) {
  const category = cnx.params.cat;
  
  try {
    const productsData = await fetch(
      `${server}/api/product/crud?filter=category&value=${category}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Use new API con conteos
    const catsData = await fetch(`${server}/api/product/categories-with-counts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const products = await productsData.json();
    const allCategories = await catsData.json();

    return {
      props: {
        products: Array.isArray(products) ? products : [],
        allCategories: Array.isArray(allCategories) ? allCategories : [],
        category: category || null,
      },
    };
  } catch (error) {
    console.error("Error feching category data:", error);
    return {
      props: {
        products: [],
        allCategories: [],
        category: category || null,
      },
    };
  }
}
// export async function getStaticPaths() {
//   const catsData = await fetch(`${server}/api/product/categories`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   const cats = await catsData.json();

//   // Get the paths we want to pre-render based on posts
//   const paths = cats.map((cat) => ({
//     params: { cat },
//   }));
//   // We'll pre-render only these paths at build time.
//   // { fallback: blocking } will server-render pages
//   // on-demand if the path doesn't exist.
//   return { paths, fallback: "blocking" };
// }
