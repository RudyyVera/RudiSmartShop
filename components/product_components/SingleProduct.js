import React from "react";
// product images component
import ImageSelectore from "./ImagesSecelctor";
// selece color size and add to cart component
import ColorSizeSelector from "./ColorSizeSolector";

const fallbackImage =
  "https://cdn11.bigcommerce.com/s-qfzerv205w/images/stencil/original/products/115/491/Hat-front-white__31525.1602591510.png";

const fallbackStore = [
  {
    color: "default",
    colorCode: "#000000",
    sizeAmnt: [{ size: "", amount: 0 }],
    imgUrls: [fallbackImage],
  },
];

function SingleProduct({ product }) {
  const { name, price, store, description } = product || {};
  const safeStore = Array.isArray(store) && store.length > 0 ? store : fallbackStore;

  // take out all image urls from store and push into images[]
  var images = [];
  safeStore.forEach((color) => {
    if (Array.isArray(color?.imgUrls)) {
      color.imgUrls
        .filter((url) => typeof url === "string" && url.trim() !== "")
        .forEach((url) => images.push(url));
    }
  });

  const safeImages = images.length > 0 ? images : [fallbackImage];

  return (
    <div className="grid gridy">
      {/* column 1 */}
      <ImageSelectore name={name || "product"} price={price || 0} images={safeImages} />
      {/* column 2 */}
      <ColorSizeSelector
        store={safeStore}
        description={description || ""}
        name={name || "product"}
        price={price || 0}
        img={safeImages[0]}
      />
      <style jsx>{`
        @media screen and (min-width: 1024px) {
          .gridy {
            grid-template-columns: 65vw 35vw;
          }
        }
      `}</style>
    </div>
  );
}

export default SingleProduct;
