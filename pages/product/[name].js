import { server } from "../../config/index";
import GridProducts from "../../components/product_components/GridProducts";
import SingleProduct from "../../components/product_components/SingleProduct";
import Link from "next/link";
import { useGlobalContext } from "../../Contexts/globalContext/context";

export default function id({ product, relateds }) {
  const { translate: t } = useGlobalContext();
  return (
    <>
      <article className="bg-secondary dark:bg-transparent text-secondary">
        {/* single product section */}
        <section style={{ zIndex: 2 }}>
          <SingleProduct product={product} />
        </section>
        {/* related section */}
        <section
          style={{ zIndex: 0 }}
          className="border-t-[1px] border-gray-300 mt-10"
        >
          <h4 className="text-3xl text-primary text-center capitalize py-16">
            {t("other_products")}
          </h4>
          <div className="w-[85%] sm:w-[75%] mx-auto">
            <GridProducts products={relateds} limit="10" />
          </div>
        </section>
        <div className="w-full flex justify-center py-10">
          <button className="py-2 px-5 bg-third text-primary rounded-full hover:scale-105 transition-transform">
            <Link href="/search">
              <a>{t("All_Products")}</a>
            </Link>
          </button>
        </div>
      </article>
    </>
  );
}

export async function getServerSideProps(cnx) {
  const name = cnx.params.name;

  const safeJson = async (response) => {
    try {
      const contentType = response?.headers?.get("content-type") || "";
      if (!response?.ok || !contentType.includes("application/json")) {
        return null;
      }
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  const productRes = await fetch(`${server}/api/product/crud?name=${name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const productData = await safeJson(productRes);
  const product = productData && !Array.isArray(productData) && productData.store ? productData : null;

  var cat = cnx.query?.cat;
  if (
    cat === "hat" ||
    cat === "accessory" ||
    cat === null ||
    cat === undefined
  ) {
    cat = "t-shirt";
  }

  const relatedsRes = await fetch(
    `${server}/api/product/crud?filter=category&value=${cat}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const relatedsData = await safeJson(relatedsRes);
  const relateds = Array.isArray(relatedsData) ? relatedsData : [];

  return {
    props: {
      product: product || {
        name: "product_not_found",
        price: 0,
        description: "Este producto no está disponible.",
        store: [
          {
            color: "default",
            colorCode: "#000000",
            sizeAmnt: [{ size: "", amount: 0 }],
            imgUrls: [""],
          },
        ],
      },
      relateds,
    },
    // revalidate: 900, //every 15 minutes
  };
}

// export async function getStaticPaths() {

//   const allProductRes =  await fetch(`${server}/api/product/crud`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const allProducts = await allProductRes.json();

//   const paths = allProducts.map((item)=>({params:{name: item.name}}))

//   return { paths, fallback: 'blocking' }
// }
