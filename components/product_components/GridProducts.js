import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "../../shared/utils/imgPlaceholder";

export default function GridProducts({ products, limit }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-2">
      {products?.map((product, i) => {
        if (i >= limit) return;
        return (
          <Link key={i} href={`/product/${product.name}?cat=${product.category}`} passHref>
            <motion.a
              initial={{ zIndex: -100, opacity: 0, y: 0 }}
              whileInView={{ zIndex: 0, opacity: 1, y: -100 }}
              viewport={{ once: true }}
              transition={{
                opacity: { ease: "easeOut", duration: 1 },
                y: { ease: "easeOut", duration: 1 },
              }}
              className="group relative bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 dark:bg-gradient-to-br dark:from-neutral-900/80 dark:to-neutral-800/60 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] hover:from-neutral-800/60 hover:to-neutral-700/40"
            >
              {/* Badges Overlay - TOP RIGHT */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                {product.sale && (
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wider">
                    SALE
                  </span>
                )}
                {product.newArival && (
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wider">
                    NEW
                  </span>
                )}
              </div>

              {/* Image Container with Zoom Effect */}
              <div className="relative h-72 sm:h-96 overflow-hidden bg-gradient-to-b from-neutral-800 to-neutral-900">
                {/* Iluminación sutil para resaltar producto - hace visibles los negros */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
                  }}
                ></div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 group-hover:backdrop-blur-sm transition-all duration-300 ease-in-out"></div>
                <motion.div
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full h-full transform transition-all duration-300 ease-in-out group-hover:scale-[1.02]"
                >
                  <Image
                    alt={product.name}
                    src={product.store[0]?.imgUrls?.[0] || ""}
                    width={300}
                    height={300}
                    className="object-contain w-full h-full mix-blend-screen dark:mix-blend-screen brightness-120 dark:brightness-125 dark:contrast-125"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(300, 300))}`}
                  />
                </motion.div>

                {/* Hover Overlay - Add To Cart */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[calc(100%-2rem)] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out pointer-events-none z-20">
                  <div className="w-full bg-black text-white dark:bg-white dark:text-black rounded-md text-xs uppercase tracking-widest font-bold py-3 text-center pointer-events-auto">
                    ADD TO CART
                  </div>
                </div>
              </div>

              {/* Product Info - ALWAYS VISIBLE */}
              <div className="p-4 bg-transparent dark:bg-transparent">
                <h3 className="text-sm font-medium mb-1 truncate text-left text-gray-900 dark:text-gray-100 tracking-wide">
                  {product.name.replace(/_/g, " ")}
                </h3>
                <p className="text-xs font-bold text-left text-gray-900 dark:text-gray-100">${product.price}</p>
              </div>

            </motion.a>
          </Link>
        );
      })}
    </div>
  );
}
