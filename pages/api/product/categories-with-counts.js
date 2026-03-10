import connectDB from "../../../middleware/db/mongodb";
import Product from "../../../models/ProductModel";

const reqHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Obtener todas las categorías únicas de los productos
    const categories = await Product.distinct("category");
    
    // Contar productos por categoría
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat });
        return { name: cat, count };
      })
    );

    // Ordenar alfabéticamente
    categoriesWithCounts.sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default connectDB(reqHandler);
