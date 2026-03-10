import dbConnect from '../../../middleware/db/mongodb';
import Product from '../../../models/ProductModel';
import Category from '../../../models/CategoryModel';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    await dbConnect();

    const categories = await Category.find({}).select('name').lean();
    const categoryNames = categories.map((category) => category.name);

    const totalProducts = await Product.countDocuments({});
    const availableProducts = await Product.countDocuments({ available: true });
    const totalStockResult = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: { $ifNull: ['$stock', 0] } },
        },
      },
    ]);
    const totalStock = totalStockResult[0]?.totalStock || 0;

    const products = await Product.find({ available: true })
      .select('name category price originalPrice discount description sale newArival stock')
      .limit(100)
      .lean();

    const productsByCategory = {};
    categoryNames.forEach((categoryName) => {
      productsByCategory[categoryName] = [];
    });

    products.forEach((product) => {
      if (productsByCategory[product.category]) {
        productsByCategory[product.category].push({
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          stock: product.stock,
          description: product.description,
          sale: product.sale,
          newArival: product.newArival,
        });
      } else {
        productsByCategory[product.category] = [
          {
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
            stock: product.stock,
            description: product.description,
            sale: product.sale,
            newArival: product.newArival,
          },
        ];
      }
    });

    return res.status(200).json({
      categories: categoryNames,
      productsByCategory,
      totalProducts,
      availableProducts,
      totalStock,
    });

  } catch (error) {
    console.error('Error al obtener info de productos:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
