import Link from "next/link";
import { useGlobalContext } from "../../Contexts/globalContext/context";

export default function EmptyState({ category }) {
  const { translate: t } = useGlobalContext();

  return (
    <div className="flex flex-col items-center justify-center min-h-96 text-center">
      <div className="mb-6">
        {/* Icono minimalista */}
        <svg
          className="w-20 h-20 mx-auto mb-4 text-neutral-400 dark:text-neutral-600 opacity-75"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>

      <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
        {t("no_products_found") || "No se encontraron productos"}
      </h3>

      <p className="text-gray-700 dark:text-gray-400 mb-8 max-w-md">
        {category
          ? `No hay productos disponibles en la categoría "${category}". Prueba con otra categoría o continúa explorando.`
          : "No hay productos disponibles en este momento. Continúa explorando otras categorías."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/search">
          <a className="px-6 py-2 bg-violet-600 dark:bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 dark:hover:bg-violet-700 transition">
            {t("back_to_shop") || "Volver a la tienda"}
          </a>
        </Link>
        <Link href="/search?sort=newArival">
          <a className="px-6 py-2 border border-violet-600 dark:border-violet-500 text-violet-600 dark:text-violet-400 rounded-lg font-medium hover:bg-violet-100 dark:hover:bg-violet-950/30 transition">
            {t("see_new_arrivals") || "Ver novedades"}
          </a>
        </Link>
      </div>
    </div>
  );
}
