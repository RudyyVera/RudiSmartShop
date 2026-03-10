const mongoose = require("mongoose");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const MONGODB_URI = process.env.MONGODB_URI;

async function checkDatabase() {
  try {
    console.log("🔍 Conectando a MongoDB...");
    console.log("URI:", MONGODB_URI ? "✅ Definido" : "❌ No definido");
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Conectado a MongoDB");

    // Obtener todas las bases de datos
    const admin = mongoose.connection.db.admin();
    const databases = await admin.listDatabases();
    console.log("\n📁 Bases de datos disponibles:");
    databases.databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });

    // Obtener colecciones de RudiSmartShop
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("\n📚 Colecciones en RudiSmartShop:");
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });

    // Contar documentos en products
    const productsCollection = db.collection("products");
    const count = await productsCollection.countDocuments();
    console.log(`\n📦 Documentos en 'products': ${count}`);

    if (count > 0) {
      const sample = await productsCollection.findOne();
      console.log("\n📄 Primer documento:");
      console.log(JSON.stringify(sample, null, 2).substring(0, 500) + "...");
    }

    await mongoose.disconnect();
    console.log("\n✅ Desconectado");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exitCode = 1;
  }
}

checkDatabase();
