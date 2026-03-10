const mongoose = require("mongoose");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI no está definido en .env.local");
}

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Category = mongoose.models.category || mongoose.model("category", categorySchema);

const categories = [
  { name: "all products" },
  { name: "hat" },
  { name: "t-shirt" },
  { name: "shirt" },
  { name: "jacket" },
  { name: "pants" },
  { name: "accessory" },
];

async function seedCategories() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🗂️ Limpiando categorías existentes...");
    await Category.deleteMany({});

    console.log("📤 Insertando categorías...");
    const result = await Category.insertMany(categories);

    console.log(`✅ ${result.length} categorías insertadas:`);
    result.forEach((cat) => console.log(`   • ${cat.name}`));

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exitCode = 1;
  }
}

seedCategories();
