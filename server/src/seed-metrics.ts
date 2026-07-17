import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './shared/config/db.js';
import { Types } from 'mongoose';
import User from './features/auth/user.model.js';
import Delivery from './features/deliveries/delivery.model.js';
import Route from './features/routes/route.model.js';

const AGUACHICA_CENTER = { lat: 8.3089, lng: -73.615 };

const users = [
  { username: 'admin', password: 'admin123', name: 'Administrador Daliz', role: 'admin' as const },
  { username: 'repartidor1', password: '123456', name: 'Carlos Mendoza', role: 'user' as const },
];

const deliveryPoints = [
  { title: 'Pedido DAL-1001', clientName: 'Maria Garcia',  clientPhone: '3001234567', address: 'Calle 5 #10-20, Centro',            lat: 8.3095, lng: -73.6148 },
  { title: 'Pedido DAL-1002', clientName: 'Carlos Mendoza', clientPhone: '3002345678', address: 'Carrera 12 #15-30, El Carmen',       lat: 8.3055, lng: -73.6185 },
  { title: 'Pedido DAL-1003', clientName: 'Ana Torres',     clientPhone: '3003456789', address: 'Calle 8 #20-15, La Esperanza',       lat: 8.3125, lng: -73.6125 },
  { title: 'Pedido DAL-1004', clientName: 'Pedro Hernandez',clientPhone: '3004567890', address: 'Av. Circunvalar #25-40, Las Ferias',lat: 8.3065, lng: -73.6110 },
  { title: 'Pedido DAL-1005', clientName: 'Lucia Rincon',   clientPhone: '3005678901', address: 'Calle 3 #8-50, Centro',              lat: 8.3080, lng: -73.6160 },
  { title: 'Pedido DAL-1006', clientName: 'Jorge Diaz',     clientPhone: '3006789012', address: 'Carrera 8 #12-45, El Rosario',       lat: 8.3105, lng: -73.6200 },
  { title: 'Pedido DAL-1007', clientName: 'Diana Lopez',    clientPhone: '3007890123', address: 'Calle 10 #5-60, Granada',            lat: 8.3075, lng: -73.6090 },
  { title: 'Pedido DAL-1008', clientName: 'Roberto Sanchez',clientPhone: '3008901234', address: 'Carrera 5 #18-30, La Libertad',      lat: 8.3135, lng: -73.6175 },
  { title: 'Pedido DAL-1009', clientName: 'Laura Rojas',    clientPhone: '3009012345', address: 'Calle 7 #15-50, Centro',            lat: 8.3100, lng: -73.6155 },
  { title: 'Pedido DAL-1010', clientName: 'Andres Vargas',  clientPhone: '3010123456', address: 'Carrera 15 #10-60, El Prado',       lat: 8.3040, lng: -73.6195 },
  { title: 'Pedido DAL-1011', clientName: 'Carmen Rivera',  clientPhone: '3011234567', address: 'Calle 12 #5-40, Las Flores',        lat: 8.3115, lng: -73.6165 },
  { title: 'Pedido DAL-1012', clientName: 'Felipe Navarro', clientPhone: '3012345678', address: 'Av. Las Palmas #30-50, El Bosque',  lat: 8.3140, lng: -73.6135 },
  { title: 'Pedido DAL-1013', clientName: 'Sofia Medina',   clientPhone: '3013456789', address: 'Calle 4 #12-20, Centro',            lat: 8.3085, lng: -73.6140 },
  { title: 'Pedido DAL-1014', clientName: 'Diego Castillo', clientPhone: '3014567890', address: 'Carrera 10 #8-70, Centro',          lat: 8.3090, lng: -73.6140 },
  { title: 'Pedido DAL-1015', clientName: 'Valentina Ortiz',clientPhone: '3015678901', address: 'Calle 15 #20-10, La Primavera',     lat: 8.3060, lng: -73.6210 },
  { title: 'Pedido DAL-1016', clientName: 'Gabriel Moreno', clientPhone: '3016789012', address: 'Carrera 7 #25-15, El Centro',       lat: 8.3070, lng: -73.6150 },
  { title: 'Pedido DAL-1017', clientName: 'Isabel Ramirez', clientPhone: '3017890123', address: 'Calle 9 #30-25, La Ceiba',          lat: 8.3150, lng: -73.6115 },
  { title: 'Pedido DAL-1018', clientName: 'Oscar Torres',   clientPhone: '3018901234', address: 'Av. 40 #12-50, El Porvenir',       lat: 8.3030, lng: -73.6170 },
  { title: 'Pedido DAL-1019', clientName: 'Bodega Central', clientPhone: '3019012345', address: 'Calle 7 #15-50, Centro',            lat: AGUACHICA_CENTER.lat, lng: AGUACHICA_CENTER.lng },
  { title: 'Pedido DAL-1020', clientName: 'Cliente Corp.',  clientPhone: '3020123456', address: 'Carrera 10 #8-70, Centro',          lat: 8.3090, lng: -73.6140 },
];

const ZONE_NAMES = ['Centro', 'Norte', 'Sur', 'Oriente', 'Occidente', 'El Carmen', 'Las Ferias'];

const seed = async () => {
  await connectDB();

  console.log('Limpiando base de datos...');
  await Promise.all([
    User.deleteMany({}),
    Delivery.deleteMany({}),
    Route.deleteMany({}),
  ]);

  console.log('Creando usuarios...');
  for (const u of users) {
    await User.create(u);
  }

  console.log('Creando 20 puntos de entrega en Aguachica...');
  const deliveryDocs = await Delivery.insertMany(
    deliveryPoints.map((d, i) => ({
      ...d,
      status: i >= 18 ? 'pending' : 'delivered',
      type: i === 18 ? 'mayor' : i === 19 ? 'detal' : i % 2 === 0 ? 'detal' : 'mayor',
      notes: i % 3 === 0 ? 'Llamar antes de llegar' : undefined,
    }))
  );

  console.log('Generando rutas completadas (01-jun -> 29-jun 2026)...');
  const allRoutes: any[] = [];
  let totalPackages = 0;
  let totalVisited = 0;
  let totalWaypoints = 0;
  let totalRevenue = 0;

  for (let d = 1; d <= 29; d++) {
    const day = new Date(2026, 5, d);
    const dow = day.getDay();
    const isSunday = dow === 0;
    const isSaturday = dow === 6;

    const routesPerDay = isSunday ? 2 : isSaturday ? 4 : 5;

    for (let r = 0; r < routesPerDay; r++) {
      const numWaypoints = ((d * 3 + r * 7) % 6) + 3;

      const startIdx = (d * 5 + r * 3) % 20;
      const selected: (typeof deliveryDocs)[0][] = [];
      for (let i = 0; i < numWaypoints; i++) {
        selected.push(deliveryDocs[(startIdx + i) % 20]);
      }

      const hour = ((d * 2 + r * 5) % 9) + 7;
      const minute = ((d * 7 + r * 13) % 4) * 15;
      const startedAt = new Date(2026, 5, d, hour, minute, 0, 0);

      const activeDuration = ((d * 11 + r * 17) % 14) * 10 + 25;
      const extraMinutes = ((d * 3 + r * 7) % 6) * 5 + 5;
      const completedAt = new Date(startedAt.getTime() + (activeDuration + extraMinutes) * 60000);

      const visitedCount = Math.max(1, numWaypoints - ((d + r) % 3));
      const minutesPerStop = activeDuration / visitedCount;

      const zoneIdx = (d + r) % ZONE_NAMES.length;
      const dayLabel = day.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });

      const waypoints = selected.map((del, i) => {
        const visited = i < visitedCount;
        const visitedAt = visited
          ? new Date(startedAt.getTime() + (i + 0.5) * minutesPerStop * 60000)
          : undefined;
        const pkgs = visited ? ((d * 13 + r * 7 + i * 11) % 5) + 1 : undefined;
        const price = del.type === 'mayor' ? 3500 : 4500;
        const revenue = pkgs ? pkgs * price : undefined;

        if (visited && pkgs) totalPackages += pkgs;
        if (visited) totalVisited++;
        if (revenue) totalRevenue += revenue;
        totalWaypoints++;

        return {
          deliveryId: del._id,
          lat: del.lat,
          lng: del.lng,
          order: i,
          visited,
          visitedAt,
          packagesDelivered: pkgs,
          revenue,
        };
      });

      allRoutes.push({
        name: `Ruta ${ZONE_NAMES[zoneIdx]} - ${dayLabel}`,
        status: 'completed',
        waypoints,
        totalDistance: ((d * 5 + r * 11) % 13) + 5,
        estimatedTime: activeDuration + extraMinutes,
        startedAt,
        completedAt,
        lastResumeAt: startedAt,
        activeDuration,
      });
    }
  }

  await Route.insertMany(allRoutes);

  console.log(`\n✅ Seed de metricas completado`);
  console.log(`   Usuarios:              ${users.length}`);
  console.log(`   Puntos de entrega:     ${deliveryDocs.length}`);
  console.log(`   Rutas completadas:     ${allRoutes.length}`);
  console.log(`   Waypoints totales:     ${totalWaypoints}`);
  console.log(`   Waypoints visitados:   ${totalVisited}`);
  console.log(`   Paquetes entregados:   ${totalPackages}`);
  console.log(`   Ingreso estimado:      $${totalRevenue.toLocaleString('es-CO')} COP`);
  console.log(`\n   Credenciales:`);
  console.log(`   admin       -> admin / admin123`);
  console.log(`   repartidor  -> repartidor1 / 123456`);

  process.exit(0);
};

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
