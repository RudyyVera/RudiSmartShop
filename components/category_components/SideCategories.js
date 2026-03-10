import { useRouter } from "next/router";
import { useGlobalContext } from "../../Contexts/globalContext/context";
import Link from "next/link";
import styles from "../../shared/styles/flyout_menu.module.css";
import { TemplateIcon } from "@heroicons/react/outline";
import {
  GiWinterHat,
  GiShirt,
  GiSleevelessJacket,
  GiTrousers,
} from "react-icons/gi";
import { MdMasks } from "react-icons/md";
import { FaTshirt } from "react-icons/fa";
import { langs } from "../../Contexts/values/LangValues";

export default function SideCategories({ categories }) {
  const { setSort, translate:t, lang } = useGlobalContext();
  const router = useRouter();
  const safeCategories = Array.isArray(categories) ? categories : [];
  
  return (
    <>
      {/* Desktop sidebar */}
      <div className={`hidden sm:block w-64 flex-shrink-0 border-r border-neutral-300 dark:border-neutral-700 ${lang===langs['fa']?"text-right":"text-left"}`}>
        {/* Sticky container */}
        <div className="sticky top-24 pl-12 pr-4">
          <h4 className="text-xl font-bold capitalize mb-4 text-black dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-3">
            {t("Categories") || "Categorías"}
          </h4>
          <nav className="flex flex-col gap-2.5">
            {/* All Products */}
            <Link href="/search">
              <a
                className={`group py-2 px-3 rounded transition-all border-l-3 ${
                  router.query.cat === undefined
                    ? "border-l-purple-600 text-white font-bold"
                    : "border-l-transparent text-neutral-500 dark:text-neutral-500 hover:text-white dark:hover:text-white"
                }`}
                onClick={() => setSort("relevence")}
              >
                <span className="flex items-center gap-2 capitalize">
                  <span className="transition-all duration-300 ease-in-out group-hover:translate-x-[5px] group-hover:text-white">{t("all_products") || "Todos"}</span>
                </span>
              </a>
            </Link>

            {/* Category items */}
            {safeCategories.map((item, i) => {
              const catName = item.name || item;
              const catCount = item.count || 0;
              return (
                <Link key={i} href={`/search/${catName}`}>
                  <a
                    className={`group py-2 px-3 rounded transition-all border-l-3 ${
                      router.query.cat === catName
                        ? "border-l-purple-600 text-white font-bold"
                        : "border-l-transparent text-neutral-500 dark:text-neutral-500 hover:text-white dark:hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2 capitalize">
                      <span className="transition-all duration-300 ease-in-out group-hover:translate-x-[5px] group-hover:text-white">{t(catName) || catName}</span>
                    </span>
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      {/* for mobile view port */}
      <div className="sm:hidden absolute top-0 mt-14 left-0 right-0 text-center">
        <div
          onClick={() => setSort("relevence")}
          className="w-max text-sm px-4 py-2 mx-auto bg-forth text-forth rounded-full z-10"
        >
          <Link href="/search" className={`cursor-pointer hover:text-primary`}>
            <a>All Products</a>
          </Link>
        </div>
      </div>

      <div className="absolute top-20 left-0  block sm:hidden mx-6">
        <aside className="menu relative">
          <label htmlFor="mune-toggler" className={styles.menuLabel}>
            <TemplateIcon width={25} height={25} />
          </label>
          <input
            type="checkbox"
            id="menu-toggler"
            className={styles.menuToggler}
            onClick={(e) => e.target.checked}
          />
          <ul>
            {safeCategories.map((item, i) => {
              return (
                <li className={styles.menuItem} key={i}>
                  <Link href={`/search/${item}`}>
                    <a
                      className={`${
                        router.query.cat === item
                          ? "underline text-accent"
                          : null
                      } text-lg`}
                    >
                      {iconer(item)}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </>
  );
}

function iconer(cat) {
  switch (cat) {
    case "hat":
      return <GiWinterHat />;
    case "t-shirt":
      return <FaTshirt />;
    case "shirt":
      return <GiShirt />;
    case "jacket":
      return <GiSleevelessJacket />;
    case "pants":
      return <GiTrousers />;
    case "accessory":
      return <MdMasks />;
    default:
      return null;
  }
}
