typescript 
import { useState, useEffect } from 'react';

// Interfaces para los tipos de datos
export interface DocumentoEmpleado {
  id: string;
  tipo: 'arl' | 'eps' | 'caja_compensacion' | 'pensiones' | 'cuenta_bancaria' | 'contrato' | 'cedula' | 'anexos';
  nombre: string;
  archivo: string; // Base64 encoded file
  fechaSubida: string;
  tamaño: number; // en bytes
  tipoArchivo: string; // MIME type
}

export interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: 'cedula' | 'cedula_extranjeria' | 'pasaporte';
  cargo: string;
  telefono: string;
  email: string;
  salario: number;
  fechaIngreso: string;
  activo: boolean;
  documentos: DocumentoEmpleado[];
}

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  clienteId: string;
  direccion: string;
  ciudad: string;
  estado: 'planificacion' | 'en_ejecucion' | 'pausado' | 'completado' | 'cancelado';
  fechaInicio: string;
  fechaFinEstimada: string;
  presupuestoInicial: number;
  presupuestoActual: number;
  porcentajeAvance: number;
  responsableId: string;
  activo: boolean;
}

export interface ItemInventario {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  unidad: string;
  precioUnitario: number;
  ubicacion: string;
  activo: boolean;
}

export interface Cliente {
  id: string;
  nombre: string;
  tipoDocumento: 'cedula' | 'nit' | 'cedula_extranjeria' | 'pasaporte';
  numeroDocumento: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  contactoPrincipal: string;
  activo: boolean;
}

export interface Proveedor {
  id: string;
  nombre: string;
  nit: string;
  tipo: 'materiales' | 'equipos' | 'servicios' | 'transporte';
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  calificacion: number;
  contactoPrincipal: string;
  activo: boolean;
}

export interface InspeccionCalidad {
  id: string;
  proyectoId: string;
  tipo: 'estructural' | 'acabados' | 'instalaciones' | 'seguridad';
  fecha: string;
  inspector: string;
  descripcion: string;
  resultado: 'aprobado' | 'condicional' | 'rechazado';
  observaciones: string;
  fechaSeguimiento?: string;
}

// Hook genérico para localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Disparar evento personalizado para sincronización
      window.dispatchEvent(new CustomEvent('localStorageUpdate', {
        detail: { key, value: valueToStore }
      }));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Escuchar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener('localStorageUpdate', handleStorageChange as EventListener);
    return () => {
      window.removeEventListener('localStorageUpdate', handleStorageChange as EventListener);
    };
  }, [key]);

  return [storedValue, setValue] as const;
}

// Hooks específicos para cada entidad
export function useEmpleados() {
  const [empleados, setEmpleados] = useLocalStorage<Empleado[]>('empleados', []);

  const agregarEmpleado = (empleado: Omit<Empleado, 'id' | 'documentos'>) => {
    const nuevoEmpleado: Empleado = {
      ...empleado,
      id: Date.now().toString(),
      documentos: [],
    };
    setEmpleados(prev => [...prev, nuevoEmpleado]);
    return nuevoEmpleado;
  };

  const actualizarEmpleado = (id: string, empleadoActualizado: Partial<Empleado>) => {
    setEmpleados(prev => 
      prev.map(emp => emp.id === id ? { ...emp, ...empleadoActualizado } : emp)
    );
  };

  const eliminarEmpleado = (id: string) => {
    setEmpleados(prev => 
      prev.map(emp => emp.id === id ? { ...emp, activo: false } : emp)
    );
  };

  const agregarDocumento = (empleadoId: string, documento: Omit<DocumentoEmpleado, 'id'>) => {
    const nuevoDocumento: DocumentoEmpleado = {
      ...documento,
      id: Date.now().toString(),
    };
    
    setEmpleados(prev => 
      prev.map(emp => 
        emp.id === empleadoId 
          ? { ...emp, documentos: [...(emp.documentos || []), nuevoDocumento] }
          : emp
      )
    );
    return nuevoDocumento;
  };

  const eliminarDocumento = (empleadoId: string, documentoId: string) => {
    setEmpleados(prev => 
      prev.map(emp => 
        emp.id === empleadoId 
          ? { ...emp, documentos: (emp.documentos || []).filter(doc => doc.id !== documentoId) }
          : emp
      )
    );
  };

  return {
    empleados,
    agregarEmpleado,
    actualizarEmpleado,
    eliminarEmpleado,
    agregarDocumento,
    eliminarDocumento,
  };
}

export function useProyectos() {
  const [proyectos, setProyectos] = useLocalStorage<Proyecto[]>('proyectos', []);

  const agregarProyecto = (proyecto: Omit<Proyecto, 'id'>) => {
    const nuevoProyecto: Proyecto = {
      ...proyecto,
      id: Date.now().toString(),
    };
    setProyectos(prev => [...prev, nuevoProyecto]);
    return nuevoProyecto;
  };

  const actualizarProyecto = (id: string, proyectoActualizado: Partial<Proyecto>) => {
    setProyectos(prev => 
      prev.map(proy => proy.id === id ? { ...proy, ...proyectoActualizado } : proy)
    );
  };

  const eliminarProyecto = (id: string) => {
    setProyectos(prev => 
      prev.map(proy => proy.id === id ? { ...proy, activo: false } : proy)
    );
  };

  return {
    proyectos,
    agregarProyecto,
    actualizarProyecto,
    eliminarProyecto,
  };
}

export function useInventario() {
  const [inventario, setInventario] = useLocalStorage<ItemInventario[]>('inventario', []);

  const agregarItem = (item: Omit<ItemInventario, 'id'>) => {
    const nuevoItem: ItemInventario = {
      ...item,
      id: Date.now().toString(),
    };
    setInventario(prev => [...prev, nuevoItem]);
    return nuevoItem;
  };

  const actualizarItem = (id: string, itemActualizado: Partial<ItemInventario>) => {
    setInventario(prev => 
      prev.map(item => item.id === id ? { ...item, ...itemActualizado } : item)
    );
  };

  const eliminarItem = (id: string) => {
    setInventario(prev => 
      prev.map(item => item.id === id ? { ...item, activo: false } : item)
    );
  };

  return {
    inventario,
    agregarItem,
    actualizarItem,
    eliminarItem,
  };
}

export function useClientes() {
  const [clientes, setClientes] = useLocalStorage<Cliente[]>('clientes', []);

  const agregarCliente = (cliente: Omit<Cliente, 'id'>) => {
    const nuevoCliente: Cliente = {
      ...cliente,
      id: Date.now().toString(),
    };
    setClientes(prev => [...prev, nuevoCliente]);
    return nuevoCliente;
  };

  const actualizarCliente = (id: string, clienteActualizado: Partial<Cliente>) => {
    setClientes(prev => 
      prev.map(cli => cli.id === id ? { ...cli, ...clienteActualizado } : cli)
    );
  };

  const eliminarCliente = (id: string) => {
    setClientes(prev => 
      prev.map(cli => cli.id === id ? { ...cli, activo: false } : cli)
    );
  };

  return {
    clientes,
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
  };
}

export function useProveedores() {
  const [proveedores, setProveedores] = useLocalStorage<Proveedor[]>('proveedores', []);

  const agregarProveedor = (proveedor: Omit<Proveedor, 'id'>) => {
    const nuevoProveedor: Proveedor = {
      ...proveedor,
      id: Date.now().toString(),
    };
    setProveedores(prev => [...prev, nuevoProveedor]);
    return nuevoProveedor;
  };

  const actualizarProveedor = (id: string, proveedorActualizado: Partial<Proveedor>) => {
    setProveedores(prev => 
      prev.map(prov => prov.id === id ? { ...prov, ...proveedorActualizado } : prov)
    );
  };

  const eliminarProveedor = (id: string) => {
    setProveedores(prev => 
      prev.map(prov => prov.id === id ? { ...prov, activo: false } : prov)
    );
  };

  return {
    proveedores,
    agregarProveedor,
    actualizarProveedor,
    eliminarProveedor,
  };
}

export function useControlCalidad() {
  const [inspecciones, setInspecciones] = useLocalStorage<InspeccionCalidad[]>('inspecciones', []);

  const agregarInspeccion = (inspeccion: Omit<InspeccionCalidad, 'id'>) => {
    const nuevaInspeccion: InspeccionCalidad = {
      ...inspeccion,
      id: Date.now().toString(),
    };
    setInspecciones(prev => [...prev, nuevaInspeccion]);
    return nuevaInspeccion;
  };

  const actualizarInspeccion = (id: string, inspeccionActualizada: Partial<InspeccionCalidad>) => {
    setInspecciones(prev => 
      prev.map(insp => insp.id === id ? { ...insp, ...inspeccionActualizada } : insp)
    );
  };

  const eliminarInspeccion = (id: string) => {
    setInspecciones(prev => prev.filter(insp => insp.id !== id));
  };

  return {
    inspecciones,
    agregarInspeccion,
    actualizarInspeccion,
    eliminarInspeccion,
  };
}
