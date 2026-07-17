import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import { connectDB } from './shared/config/db.js';
import User from './features/auth/user.model.js';
import Delivery from './features/deliveries/delivery.model.js';
import Route from './features/routes/route.model.js';
import Client from './features/clients/client.model.js';
import CreditTransaction from './features/fiados/credit-transaction.model.js';
import Settings from './features/settings/settings.model.js';

const DAYS = 30;
const MS_PER_DAY = 86400000;

type Frequency = 'high' | 'med' | 'low' | 'rare';

const clientDefs: {
  name: string; phone: string; address: string; lat: number; lng: number;
  freq: Frequency; balance: number; notes: string | undefined;
}[] = [
  { name: 'María García',      phone: '3001110001', address: 'Calle 5 #10-20, Centro',              lat: 8.3095, lng: -73.6148, freq: 'high', balance: 15000,  notes: 'Llamar antes de llegar' },
  { name: 'Pedro Hernández',   phone: '3001110002', address: 'Av. Circunvalar #25-40, Las Ferias',   lat: 8.3065, lng: -73.6110, freq: 'high', balance: -5000,  notes: 'Dejar en portería' },
  { name: 'Carlos Mendoza',    phone: '3001110004', address: 'Carrera 12 #15-30, El Carmen',         lat: 8.3055, lng: -73.6185, freq: 'high', balance: 0,      notes: undefined },
  { name: 'Jorge Díaz',        phone: '3001110006', address: 'Carrera 8 #12-45, El Rosario',         lat: 8.3105, lng: -73.6200, freq: 'high', balance: -12000, notes: 'Tocar el timbre 3 veces' },
  { name: 'Lucía Rincón',      phone: '3001110007', address: 'Calle 3 #8-50, Centro',                lat: 8.3080, lng: -73.6160, freq: 'high', balance: 0,      notes: undefined },
  { name: 'Diana López',       phone: '3001110003', address: 'Calle 10 #5-60, Granada',              lat: 8.3075, lng: -73.6090, freq: 'med',  balance: 8000,   notes: 'Entregar en recepción' },
  { name: 'Ana Sofía Torres',  phone: '3001110005', address: 'Calle 8 #20-15, La Esperanza',         lat: 8.3125, lng: -73.6125, freq: 'med',  balance: 0,      notes: undefined },
  { name: 'Roberto Sánchez',   phone: '3001110008', address: 'Carrera 5 #18-30, La Libertad',        lat: 8.3135, lng: -73.6175, freq: 'med',  balance: 25000,  notes: 'Preguntar por el encargado' },
  { name: 'Sofía Martínez',    phone: '3001110009', address: 'Calle 12 #7-25, Villa Nueva',          lat: 8.3110, lng: -73.6130, freq: 'med',  balance: 20000,  notes: undefined },
  { name: 'Andrés Ramírez',    phone: '3001110010', address: 'Av. Los Estudiantes #30-15, El Prado', lat: 8.3040, lng: -73.6155, freq: 'low',  balance: 0,      notes: undefined },
  { name: 'Carmen Rivera',     phone: '3001110011', address: 'Calle 14 #22-10, Las Flores',          lat: 8.3115, lng: -73.6165, freq: 'low',  balance: -3000,  notes: 'Llamar antes de llegar' },
  { name: 'Valentina Ortiz',   phone: '3001110013', address: 'Calle 6 #18-33, La Primavera',         lat: 8.3060, lng: -73.6210, freq: 'low',  balance: -8000,  notes: undefined },
  { name: 'Felipe Navarro',    phone: '3001110012', address: 'Carrera 15 #8-45, El Bosque',          lat: 8.3140, lng: -73.6135, freq: 'rare', balance: 5000,   notes: 'Dejar en portería' },
  { name: 'Gabriel Moreno',    phone: '3001110014', address: 'Carrera 9 #20-55, El Centro',          lat: 8.3070, lng: -73.6150, freq: 'rare', balance: 10000,  notes: undefined },
];

function clientActiveToday(freq: Frequency, dow: number): boolean {
  const roll = Math.random();
  if (freq === 'high') return roll < (dow === 0 ? 0.45 : 0.88);
  if (freq === 'med')  return roll < (dow === 0 ? 0.30 : 0.68);
  if (freq === 'low')  return roll < (dow === 0 ? 0.18 : 0.48);
  return roll < (dow === 0 ? 0.12 : 0.35);
}

const seed = async () => {
  const NOW = new Date();
  const START = new Date(NOW.getTime() - (DAYS - 1) * MS_PER_DAY);

  await connectDB();

  // ── Clean everything ──
  console.log('🧹 Limpiando TODA la base de datos...');
  const cleanResults = await Promise.all([
    User.deleteMany({}),
    Delivery.deleteMany({}),
    Route.deleteMany({}),
    Client.deleteMany({}),
    CreditTransaction.deleteMany({}),
  ]);
  console.log(`   Users: ${cleanResults[0].deletedCount} | Deliveries: ${cleanResults[1].deletedCount} | Routes: ${cleanResults[2].deletedCount} | Clients: ${cleanResults[3].deletedCount} | CreditTx: ${cleanResults[4].deletedCount}`);

  // ── Phase 1: Admin ──
  console.log('\n👤 Creando admin...');
  const admin = await User.create({
    username: 'admin',
    password: 'alkatrhazxc123.',
    name: 'Administrador Daliz',
    role: 'admin' as const,
  });

  // ── Phase 2: 14 Clients ──
  console.log('📍 Creando 14 clientes...');
  const clientDocs = await Client.insertMany(
    clientDefs.map((c) => ({
      userId: admin._id,
      name: c.name,
      phone: c.phone,
      address: c.address,
      lat: c.lat,
      lng: c.lng,
      balance: c.balance,
    }))
  );

  // ── Phase 3: 14 Deliveries (one per client) ──
  console.log('📦 Creando 14 entregas (1 por cliente)...');

  const deliveriesForInsert: any[] = [];
  const deliveryMeta: { _id: mongoose.Types.ObjectId; lat: number; lng: number }[] = [];

  for (let ci = 0; ci < clientDefs.length; ci++) {
    const cdef = clientDefs[ci];
    const client = clientDocs[ci];

    const deliveryDate = new Date(NOW);
    deliveryDate.setHours(7, 0, 0, 0);

    const _id = new mongoose.Types.ObjectId();

    deliveriesForInsert.push({
      _id,
      userId: admin._id,
      clientId: client._id,
      title: `Entrega - ${cdef.name}`,
      clientName: cdef.name,
      clientPhone: cdef.phone,
      address: cdef.address,
      lat: cdef.lat,
      lng: cdef.lng,
      status: 'pending',
      type: ci % 2 === 0 ? 'detal' : 'mayor' as const,
      notes: cdef.notes,
      packagesCount: 1 + Math.floor(Math.random() * 5),
      paymentStatus: 'pending' as const,
      createdAt: deliveryDate,
      updatedAt: deliveryDate,
    });

    deliveryMeta.push({ _id, lat: cdef.lat, lng: cdef.lng });
  }

  await Delivery.collection.insertMany(deliveriesForInsert);

  // Create Settings document with default prices
  await Settings.findOneAndUpdate(
    {},
    { prices: { mayor: 3500, detal: 4500 } },
    { upsert: true }
  );

  // ── Phase 4: 30 Routes (one per day, referencing the 14 deliveries) ──
  console.log('🛣️  Generando 30 rutas completadas (1 por día)...');

  let totalWaypoints = 0;
  let totalPackages = 0;
  const routeDocs: any[] = [];

  for (let dayOffset = 0; dayOffset < DAYS; dayOffset++) {
    const date = new Date(START.getTime() + dayOffset * MS_PER_DAY);
    const dow = date.getDay();
    const isWeekend = dow === 0 || dow === 6;

    // Which clients are active today
    const activeIndices: number[] = [];
    for (let ci = 0; ci < clientDefs.length; ci++) {
      if (clientActiveToday(clientDefs[ci].freq, dow)) {
        activeIndices.push(ci);
      }
    }

    const minClients = isWeekend ? 5 : 8;
    while (activeIndices.length < minClients) {
      const ci = Math.floor(Math.random() * clientDefs.length);
      if (!activeIndices.includes(ci)) activeIndices.push(ci);
    }
    const finalIndices = activeIndices.slice(0, 14);

    const numStops = finalIndices.length;
    const avgStopMinutes = 8;
    const activeDuration = numStops * avgStopMinutes + numStops * 3;

    const startHour = 7 + Math.floor(Math.random() * 2);
    const startedAt = new Date(date);
    startedAt.setHours(startHour, Math.floor(Math.random() * 4) * 15, 0, 0);
    const completedAt = new Date(startedAt.getTime() + activeDuration * 60000);
    const distance = Math.round((numStops * 1.1 + Math.random() * 2) * 10) / 10;

    const waypoints = finalIndices.map((ci, i) => {
      const del = deliveryMeta[ci];
      const stopTime = new Date(startedAt.getTime() + (i + 1) * avgStopMinutes * 60000);
      const pkgs = isWeekend ? 1 + Math.floor(Math.random() * 3) : 1 + Math.floor(Math.random() * 5);

      totalPackages += pkgs;
      totalWaypoints++;

      return {
        deliveryId: del._id,
        lat: del.lat,
        lng: del.lng,
        order: i,
        visited: true,
        visitedAt: stopTime,
        packagesDelivered: pkgs,
      };
    });

    const dayLabel = date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    const weekdayLabel = date.toLocaleDateString('es-CO', { weekday: 'short' });

    routeDocs.push({
      userId: admin._id,
      name: `Ruta ${weekdayLabel} ${dayLabel}`,
      status: 'completed',
      waypoints,
      totalDistance: distance,
      estimatedTime: activeDuration,
      startedAt,
      completedAt,
      lastResumeAt: startedAt,
      activeDuration,
    });
  }

  await Route.insertMany(routeDocs);

  // ── Credit Transactions ──
  console.log('💰 Creando transacciones de fiados...');

  const creditTxDocs: any[] = [];
  const now = new Date();

  for (const client of clientDocs) {
    if (client.balance === 0) continue;

    const absBalance = Math.abs(client.balance);
    const numTx = 2 + Math.floor(Math.random() * 3);

    if (client.balance > 0) {
      const perTx = Math.floor(absBalance / numTx);
      for (let t = 0; t < numTx; t++) {
        const daysAgo = 3 + Math.floor(Math.random() * (DAYS - 5));
        creditTxDocs.push({
          userId: admin._id,
          clientId: client._id,
          amount: t === numTx - 1 ? absBalance - perTx * (numTx - 1) : perTx,
          type: 'payment',
          description: `Pago parcial ${t + 1}/${numTx}`,
          createdAt: new Date(now.getTime() - daysAgo * MS_PER_DAY),
          updatedAt: new Date(now.getTime() - daysAgo * MS_PER_DAY),
        });
      }
    } else {
      const perTx = Math.floor(absBalance / numTx);
      for (let t = 0; t < numTx; t++) {
        const daysAgo = 3 + Math.floor(Math.random() * (DAYS - 5));
        creditTxDocs.push({
          userId: admin._id,
          clientId: client._id,
          amount: t === numTx - 1 ? absBalance - perTx * (numTx - 1) : perTx,
          type: 'credit',
          description: `Fiado parcial ${t + 1}/${numTx}`,
          createdAt: new Date(now.getTime() - daysAgo * MS_PER_DAY),
          updatedAt: new Date(now.getTime() - daysAgo * MS_PER_DAY),
        });
      }
    }
  }

  if (creditTxDocs.length > 0) {
    await CreditTransaction.collection.insertMany(creditTxDocs);
  }

  // ── Summary ──
  const estRevenue = totalPackages * 4000; // approximate — real revenue depends on per-delivery type
  const freqCounts = { high: 0, med: 0, low: 0, rare: 0 };
  clientDefs.forEach((c) => freqCounts[c.freq]++);

  console.log('\n═══════════════════════════════════════════');
  console.log('  ✅ SEED COMPLETADO — Daliz Logistics');
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('  👤 Usuario');
  console.log('     admin / alkatrhazxc123.');
  console.log('');
  console.log('  📍 Clientes (waypoints)');
  console.log(`     ${clientDocs.length} clientes con ubicación en Aguachica`);
  console.log(`     Alta frecuencia:  ${freqCounts.high}  (≈ diario)`);
  console.log(`     Media frecuencia: ${freqCounts.med}  (4-5×/sem)`);
  console.log(`     Baja frecuencia:  ${freqCounts.low}  (2-3×/sem)`);
  console.log(`     Poco frecuentes:  ${freqCounts.rare}  (1-2×/sem)`);
  console.log('');
  console.log('  📦 Entregas');
  console.log(`     Total:            ${deliveriesForInsert.length}  (1 por cliente)`);
  console.log(`     Al crear ruta:    ${deliveriesForInsert.length} opciones en el panel`);
  console.log('');
  console.log('  🛣️  Rutas completadas');
  console.log(`     Total:            ${routeDocs.length}  (1 por día, 30 días)`);
  console.log(`     Waypoints:        ${totalWaypoints}`);
  console.log(`     Paquetes:         ${totalPackages}`);
  console.log(`     Ingreso est.:     $${estRevenue.toLocaleString('es-CO')} COP`);
  console.log('');
  console.log('  💰 Fiados');
  console.log(`     Transacciones:    ${creditTxDocs.length}`);
  console.log(`     Clientes c/ saldo: ${clientDocs.filter((c) => c.balance !== 0).length}`);
  console.log('');
  console.log(`  📅 Período: ${START.toLocaleDateString('es-CO')} → ${NOW.toLocaleDateString('es-CO')} (30 días)`);
  console.log('');

  process.exit(0);
};

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
