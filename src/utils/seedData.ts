typescript 
import { 
  Empleado, 
  Proyecto, 
  ItemInventario, 
  Cliente, 
  Proveedor, 
  InspeccionCalidad 
} from '@/hooks/useLocalStorage';

// Datos iniciales para empleados
const empleadosIniciales: Empleado[] = [
  {
    id: '1',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    documento: '12345678',
    tipoDocumento: 'cedula',
    cargo: 'Ingeniero Civil',
    telefono: '3001234567',
    email: 'carlos.rodriguez@constructoracsrsas.com',
    salario: 4500000,
    fechaIngreso: '2023-01-15',
    activo: true,
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'González',
    documento: '87654321',
    tipoDocumento: 'cedula',
    cargo: 'Arquitecta',
    telefono: '3009876543',
    email: 'maria.gonzalez@constructoracsrsas.com',
    salario: 4200000,
    fechaIngreso: '2023-02-01',
    activo: true,
  },
  {
    id: '3',
    nombre: 'Luis',
    apellido: 'Martínez',
    documento: '11223344',
    tipoDocumento: 'cedula',
    cargo: 'Maestro de Obra',
    telefono: '3005566778',
    email: 'luis.martinez@constructoracsrsas.com',
    salario: 2800000,
    fechaIngreso: '2022-11-10',
    activo: true,
  },
];

// Datos iniciales para clientes
const clientesIniciales: Cliente[] = [
  {
    id: '1',
    nombre: 'Inmobiliaria Los Pinos S.A.S.',
    tipoDocumento: 'nit',
    numeroDocumento: '900123456-7',
    telefono: '6012345678',
    email: 'contacto@inmobiliarialospinos.com',
    direccion: 'Calle 100 #15-20',
    ciudad: 'Bogotá',
    departamento: 'Cundinamarca',
    contactoPrincipal: 'Ana Pérez',
    activo: true,
  },
  {
    id: '2',
    nombre: 'Constructora Norte Ltda.',
    tipoDocumento: 'nit',
    numeroDocumento: '800987654-3',
    telefono: '6019876543',
    email: 'proyectos@constructoranorte.com',
    direccion: 'Carrera 7 #85-40',
    ciudad: 'Bogotá',
    departamento: 'Cundinamarca',
    contactoPrincipal: 'Roberto Silva',
    activo: true,
  },
];

// Datos iniciales para proyectos
const proyectosIniciales: Proyecto[] = [
  {
    id: '1',
    nombre: 'Edificio Residencial Los Pinos',
    descripcion: 'Construcción de edificio residencial de 8 pisos con 32 apartamentos',
    clienteId: '1',
    direccion: 'Calle 127 #45-30',
    ciudad: 'Bogotá',
    estado: 'en_ejecucion',
    fechaInicio: '2024-01-15',
    fechaFinEstimada: '2024-12-15',
    presupuestoInicial: 2500000000,
    presupuestoActual: 2650000000,
    porcentajeAvance: 75,
    responsableId: '1',
    activo: true,
  },
  {
    id: '2',
    nombre: 'Centro Comercial Plaza Norte',
    descripcion: 'Construcción de centro comercial de 3 niveles',
    clienteId: '2',
    direccion: 'Autopista Norte Km 15',
    ciudad: 'Bogotá',
    estado: 'en_ejecucion',
    fechaInicio: '2024-03-01',
    fechaFinEstimada: '2025-06-30',
    presupuestoInicial: 5200000000,
    presupuestoActual: 5350000000,
    porcentajeAvance: 45,
    responsableId: '2',
    activo: true,
  },
];

// Datos iniciales para inventario
const inventarioInicial: ItemInventario[] = [
  {
    id: '1',
    codigo: 'CEM001',
    nombre: 'Cemento Portland',
    descripcion: 'Cemento Portland tipo I - Bulto 50kg',
    categoria: 'Materiales',
    stockActual: 150,
    stockMinimo: 50,
    unidad: 'Bulto',
    precioUnitario: 25000,
    ubicacion: 'Bodega A - Estante 1',
    activo: true,
  },
  {
    id: '2',
    codigo: 'VAR001',
    nombre: 'Varilla #4',
    descripcion: 'Varilla corrugada #4 - 12 metros',
    categoria: 'Materiales',
    stockActual: 25,
    stockMinimo: 30,
    unidad: 'Unidad',
    precioUnitario: 45000,
    ubicacion: 'Patio de Varillas',
    activo: true,
  },
  {
    id: '3',
    codigo: 'LAD001',
    nombre: 'Ladrillo Tolete',
    descripcion: 'Ladrillo tolete común',
    categoria: 'Materiales',
    stockActual: 0,
    stockMinimo: 1000,
    unidad: 'Unidad',
    precioUnitario: 850,
    ubicacion: 'Patio Principal',
    activo: true,
  },
];

// Datos iniciales para proveedores
const proveedoresIniciales: Proveedor[] = [
  {
    id: '1',
    nombre: 'Cementos Argos S.A.',
    nit: '890900274-5',
    tipo: 'materiales',
    telefono: '6014567890',
    email: 'ventas@argos.com',
    direccion: 'Carrera 15 #93-50',
    ciudad: 'Bogotá',
    calificacion: 5,
    contactoPrincipal: 'Pedro Ramírez',
    activo: true,
  },
  {
    id: '2',
    nombre: 'Ferreterías Unidas S.A.S.',
    nit: '900456789-2',
    tipo: 'materiales',
    telefono: '6017654321',
    email: 'comercial@ferreteriasunidas.com',
    direccion: 'Calle 13 #68-45',
    ciudad: 'Bogotá',
    calificacion: 4,
    contactoPrincipal: 'Sandra López',
    activo: true,
  },
];

// Datos iniciales para inspecciones de calidad
const inspeccionesIniciales: InspeccionCalidad[] = [
  {
    id: '1',
    proyectoId: '1',
    tipo: 'estructural',
    fecha: '2024-10-15',
    inspector: 'Carlos Rodríguez',
    descripcion: 'Inspección de estructura piso 6',
    resultado: 'aprobado',
    observaciones: 'Estructura cumple con especificaciones técnicas',
  },
  {
    id: '2',
    proyectoId: '2',
    tipo: 'seguridad',
    fecha: '2024-10-16',
    inspector: 'María González',
    descripcion: 'Inspección de medidas de seguridad industrial',
    resultado: 'condicional',
    observaciones: 'Falta señalización en zona de excavación',
    fechaSeguimiento: '2024-10-20',
  },
];

// Función para inicializar datos
export function initializeData() {
  // Solo inicializar si no existen datos previos
  if (!localStorage.getItem('empleados')) {
    localStorage.setItem('empleados', JSON.stringify(empleadosIniciales));
  }
  
  if (!localStorage.getItem('clientes')) {
    localStorage.setItem('clientes', JSON.stringify(clientesIniciales));
  }
  
  if (!localStorage.getItem('proyectos')) {
    localStorage.setItem('proyectos', JSON.stringify(proyectosIniciales));
  }
  
  if (!localStorage.getItem('inventario')) {
    localStorage.setItem('inventario', JSON.stringify(inventarioInicial));
  }
  
  if (!localStorage.getItem('proveedores')) {
    localStorage.setItem('proveedores', JSON.stringify(proveedoresIniciales));
  }
  
  if (!localStorage.getItem('inspecciones')) {
    localStorage.setItem('inspecciones', JSON.stringify(inspeccionesIniciales));
  }
}
