import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from './shared/config/db.js';
import User from './features/auth/user.model.js';
import Delivery from './features/deliveries/delivery.model.js';
import Route from './features/routes/route.model.js';
import Client from './features/clients/client.model.js';
import CreditTransaction from './features/fiados/credit-transaction.model.js';

// Aguachica center and surrounding points (within ~2km radius)
const waypoints = [
  { name: 'María García',     phone: '3001110001', address: 'Calle 5 #10-20, Centro',         lat: 8.3095, lng: -73.6148 },
  { name: 'Pedro Hernández',  phone: '3001110002', address: 'Av. Circunvalar #25-40, Ferias', lat: 8.3065, lng: -73.6110 },
  { name: 'Diana López',      phone: '3001110003', address: 'Calle 10 #5-60, Granada',         lat: 8.3075, lng: -73.6090 },
  { name: 'Carlos Mendoza',   phone: '3001110004', address: 'Carrera 12 #15-30, El Carmen',    lat: 8.3055, lng: -73.6185 },
  { name: 'Ana Sofía Torres', phone: '3001110005', address: 'Calle 8 #20-15, La Esperanza',    lat: 8.3125, lng: -73.6125 },
  { name: 'Jorge Díaz',       phone: '3001110006', address: 'Carrera 8 #12-45, El Rosario',    lat: 8.3105, lng: -73.6200 },
  { name: 'Lucía Rincón',     phone: '3001110007', address: 'Calle 3 #8-50, Centro',           lat: 8.3080, lng: -73.6160 },
  { name: 'Roberto Sánchez',  phone: '3001110008', address: 'Carrera 5 #18-30, La Libertad',   lat: 8.3135, lng: -73.6175 },
  { name: 'Sofía Martínez',   phone: '3001110009', address: 'Calle 12 #7-25, Villa Nueva',     lat: 8.3110, lng: -73.6130 },
  { name: 'Andrés Ramírez',   phone: '3001110010', address: 'Av. Los Estudiantes #30-15',      lat: 8.3040, lng: -73.6155 },
];

const seed = async () => {
  await connectDB();

  console.log('Limpiando base de datos...');
  await Promise.all([
    User.deleteMany({}),
    Delivery.deleteMany({}),
    Route.deleteMany({}),
    Client.deleteMany({}),
    CreditTransaction.deleteMany({}),
  ]);
  console.log('✅ Base limpia\n');

  // Admin
  console.log('Creando admin...');
  const admin = await User.create({
    username: 'admin',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin' as const,
  });

  // Create clients from waypoints (waypoints ARE clients)
  console.log('Creando 10 clientes (desde waypoints)...');
  const clientDocs = await Client.insertMany(
    waypoints.map((wp) => ({
      userId: admin._id,
      name: wp.name,
      phone: wp.phone,
      address: wp.address,
      lat: wp.lat,
      lng: wp.lng,
    }))
  );

  // Create deliveries linked to clients
  console.log('Creando 10 entregas (waypoints)...');
  const deliveries = await Delivery.insertMany(
    waypoints.map((wp, i) => ({
      userId: admin._id,
      title: wp.name,
      clientName: wp.name,
      clientPhone: wp.phone,
      clientId: clientDocs[i]._id,
      address: wp.address,
      lat: wp.lat,
      lng: wp.lng,
      status: 'pending' as const,
      type: 'delivery' as const,
    }))
  );

  console.log('\n✅ Seed completado');
  console.log(`   Admin: admin / admin123`);
  console.log(`   Clientes: ${clientDocs.length}`);
  console.log(`   Waypoints: ${deliveries.length}`);
  console.log('   Listo para crear rutas y probar fiados.\n');

  // Print locations for reference
  console.log('📍 Waypoints en Aguachica:');
  waypoints.forEach((wp, i) => {
    console.log(`   ${i + 1}. ${wp.name} — ${wp.address} (${wp.lat}, ${wp.lng})`);
  });

  process.exit(0);
};

seed().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
