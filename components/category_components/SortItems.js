import { useGlobalContext } from "../../Contexts/globalContext/context";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { langs } from "../../Contexts/values/LangValues";

function SortItems() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { sort, setSort, translate: t, lang } = useGlobalContext();

  const sortOptions = [
    { value: "relevence", label: t("relevence") || "Relevancia" },
    { value: "price_asc", label: t("price_low_to_high") || "Precio: Menor a Mayor" },
    { value: "price_desc", label: t("price_high_to_low") || "Precio: Mayor a Menor" },
    { value: "newArival", label: t("newest") || "Novedades" },
    { value: "on_sales", label: t("on_sales") || "Ofertas" },
  ];

  const getCurrentLabel = () => {
    return sortOptions.find(opt => opt.value === sort)?.label || "Ordenar";
  };

  const handleSort = (value) => {
    setSort(value);
    setShowDropdown(false);
  };

  return (
    <>
      {/* Floating Sort Dropdown */}
      <div className="relative z-50">
        {/* Dropdown Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          <span>{getCurrentLabel()}</span>
          <ChevronDownIcon
            width={16}
            height={16}
            className={`transition-transform ${showDropdown ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSort(option.value)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 ${
                  sort === option.value
                    ? "text-purple-600 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </>
  );
}

export default SortItems;
