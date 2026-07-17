import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB } from './shared/config/db.js';
import Delivery from './features/deliveries/delivery.model.js';
import Settings from './features/settings/settings.model.js';

const OLD_TYPES = ['delivery', 'warehouse', 'client'] as const;

const migrate = async () => {
  await connectDB();

  console.log('🔍 Buscando deliveries con tipo viejo...');
  const oldCount = await Delivery.countDocuments({ type: { $in: OLD_TYPES } });
  console.log(`   Encontradas: ${oldCount}`);

  if (oldCount > 0) {
    const result = await Delivery.updateMany(
      { type: { $in: OLD_TYPES } },
      { $set: { type: 'detal' } }
    );
    console.log(`✅ ${result.modifiedCount} deliveries migradas a 'detal'`);
  } else {
    console.log('✅ No hay deliveries con tipo viejo — nada que migrar');
  }

  console.log('\n⚙️  Creando documento Settings...');
  const settings = await Settings.findOneAndUpdate(
    {},
    { $setOnInsert: { prices: { mayor: 3500, detal: 4500 } } },
    { upsert: true, new: true }
  );
  console.log(`   Precios: Mayor $${settings.prices.mayor} / Detal $${settings.prices.detal}`);
  console.log('✅ Settings listo');

  console.log('\n🎉 Migración completada');
  process.exit(0);
};

migrate().catch((err) => {
  console.error('Error en migración:', err);
  process.exit(1);
});
