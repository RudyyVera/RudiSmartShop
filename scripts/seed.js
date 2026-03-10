const mongoose = require("mongoose");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI no está definido en .env.local");
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    sale: { type: Boolean, default: false },
    newArival: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    store: {
      type: [
        {
          color: { type: String, required: true },
          colorCode: { type: String, default: null },
          sizeAmnt: {
            type: [
              {
                size: { type: String, default: "" },
                amount: { type: Number, default: 0 },
              },
            ],
            default: [],
          },
          imgUrls: { type: [String], default: [] },
        },
      ],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const Product = mongoose.models.product || mongoose.model("product", productSchema);

function normalizeProduct(product) {
  return {
    name: product.name,
    category: product.category,
    price: Number(product.price) || 0,
    description: product.description || "",
    sale: Boolean(product.sale),
    newArival: Boolean(product.newArival),
    available: typeof product.available === "boolean" ? product.available : true,
    store: Array.isArray(product.store)
      ? product.store.map((item) => ({
          color: item.color || "unknown",
          colorCode: item.colorCode || null,
          sizeAmnt: Array.isArray(item.sizeAmnt)
            ? item.sizeAmnt.map((sizeItem) => ({
                size: sizeItem.size || "",
                amount: Number(sizeItem.amount) || 0,
              }))
            : [],
          imgUrls: Array.isArray(item.imgUrls)
            ? item.imgUrls.filter((url) => typeof url === "string" && url.trim() !== "")
            : [],
        }))
      : [],
  };
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const response = await fetch("https://nextommerce.vercel.app/api/product/crud");
    if (!response.ok) {
      throw new Error(`No se pudo leer la API origen. Status ${response.status}`);
    }

    const sourceProducts = await response.json();
    if (!Array.isArray(sourceProducts) || sourceProducts.length === 0) {
      throw new Error("La API origen devolvió datos inválidos o vacíos");
    }

    const normalizedProducts = sourceProducts.map(normalizeProduct);

    await Product.deleteMany({});
    await Product.insertMany(normalizedProducts);

    console.log(`✅ Importación real completada: ${normalizedProducts.length} productos insertados.`);
  } catch (error) {
    console.error("❌ Error al importar productos:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();
