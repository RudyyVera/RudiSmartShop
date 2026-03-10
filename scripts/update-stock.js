const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
  originalPrice: Number,
  discount: Number,
  store: Array,
  description: String,
  sale: Boolean,
  newArival: Boolean,
  available: Boolean,
}, { timestamps: true });

const Product = mongoose.model('product', productSchema);

async function updateStock() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Actualizar productos sin stock
    const result = await Product.updateMany(
      { stock: { $exists: false } },
      { 
        $set: { 
          stock: 10,  // Stock por defecto
          discount: 0
        } 
      }
    );

    console.log(`✅ ${result.modifiedCount} productos actualizados con stock`);

    // Actualizar productos en oferta con descuentos de ejemplo
    const saleProducts = await Product.find({ sale: true, discount: { $in: [null, 0] } });
    
    for (const product of saleProducts) {
      const discount = Math.floor(Math.random() * 30) + 10; // 10-40% descuento
      const originalPrice = Math.round(product.price / (1 - discount / 100));
      
      await Product.updateOne(
        { _id: product._id },
        { 
          $set: { 
            originalPrice,
            discount 
          } 
        }
      );
    }

    console.log(`✅ ${saleProducts.length} productos en oferta actualizados con descuentos`);

    // Mostrar resumen
    const allProducts = await Product.find({}).select('name price stock discount originalPrice sale');
    console.log('\n📦 RESUMEN DE PRODUCTOS:');
    allProducts.forEach(p => {
      const discountInfo = p.discount ? ` (${p.discount}% OFF de $${p.originalPrice})` : '';
      console.log(`- ${p.name}: $${p.price}${discountInfo} | Stock: ${p.stock}`);
    });

    console.log('\n✅ Actualización completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateStock();
