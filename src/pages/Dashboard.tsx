import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEmpleados, useProyectos, useInventario, useClientes, useProveedores, useControlCalidad } from "@/hooks/useLocalStorage";
import { initializeData } from "@/utils/seedData";
import { 
  Building2, 
  Users, 
  Package, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from "lucide-react";

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Hooks para obtener datos reales
  const { empleados } = useEmpleados();
  const { proyectos } = useProyectos();
  const { inventario } = useInventario();
  const { clientes } = useClientes();
  const { proveedores } = useProveedores();
  const { inspecciones } = useControlCalidad();
  const { toast } = useToast();

  // Inicializar datos al cargar el componente
  useEffect(() => {
    initializeData();
  }, []);

  // Forzar actualización automática cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Función para actualizar manualmente
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setLastUpdate(new Date());
    toast({
      title: "Dashboard actualizado",
      description: "Los datos se han actualizado correctamente",
    });
  };

  // Calcular estadísticas reales
  const proyectosActivos = proyectos.filter(p => p.estado === 'en_ejecucion' && p.activo);
  const totalProyectos = proyectos.filter(p => p.activo).length;
  const totalEmpleados = empleados.filter(e => e.activo).length;
  const totalInventario = inventario.filter(i => i.activo).length;
  const totalClientes = clientes.filter(c => c.activo).length;
  const totalProveedores = proveedores.filter(p => p.activo).length;
  const totalInspecciones = inspecciones.length;
  const inspeccionesAprobadas = inspecciones.filter(i => i.resultado === 'aprobado').length;
  const porcentajeAprobacion = totalInspecciones > 0 ? Math.round((inspeccionesAprobadas / totalInspecciones) * 100) : 0;
  
  // Alertas importantes basadas en datos reales
  const stockBajo = inventario.filter(item => item.stockActual <= item.stockMinimo && item.stockActual > 0 && item.activo).length;
  const stockAgotado = inventario.filter(item => item.stockActual === 0 && item.activo).length;
  const inspeccionesPendientes = inspecciones.filter(i => i.resultado === 'condicional' || i.resultado === 'rechazado').length;
  
  // Valor total en obra (suma de presupuestos de proyectos activos)
  const valorTotalObra = proyectosActivos.reduce((total, proyecto) => total + (proyecto.presupuestoActual || 0), 0);
  
  // Generar alertas dinámicas
  const alertas = [];
  if (stockBajo > 0) {
    alertas.push({ tipo: "warning", mensaje: `${stockBajo} items con stock bajo requieren reposición`, fecha: "Hoy" });
  }
  if (stockAgotado > 0) {
    alertas.push({ tipo: "error", mensaje: `${stockAgotado} items agotados necesitan restock urgente`, fecha: "Hoy" });
  }
  if (inspeccionesPendientes > 0) {
    alertas.push({ tipo: "info", mensaje: `${inspeccionesPendientes} inspecciones requieren seguimiento`, fecha: "Pendiente" });
  }
  if (alertas.length === 0) {
    alertas.push({ tipo: "success", mensaje: "Todas las operaciones funcionando correctamente", fecha: "Actualizado" });
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Ejecutivo</h1>
            <p className="text-gray-600">Resumen general de la operación</p>
            <p className="text-xs text-gray-400 mt-2">
              Última actualización: {lastUpdate.toLocaleTimeString('es-CO')}
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proyectosActivos.length}</div>
              <p className="text-xs text-muted-foreground">
                de {totalProyectos} proyectos totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empleados Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmpleados}</div>
              <p className="text-xs text-muted-foreground">
                empleados registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor en Obra</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(valorTotalObra / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">
                valor total proyectos activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calidad</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{porcentajeAprobacion}%</div>
              <p className="text-xs text-muted-foreground">
                inspecciones aprobadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Proyectos en Ejecución */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Proyectos en Ejecución</CardTitle>
            <CardDescription>Estado actual de los proyectos activos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {proyectosActivos.length > 0 ? proyectosActivos.slice(0, 5).map((proyecto) => (
              <div key={proyecto.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{proyecto.nombre}</h4>
                  <Badge variant="outline">
                    {proyecto.estado === 'en_ejecucion' ? 'En Ejecución' : proyecto.estado}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Avance: {proyecto.porcentajeAvance}%</span>
                  <span>Presupuesto: ${proyecto.presupuestoActual?.toLocaleString() || '0'}</span>
                </div>
                <Progress value={proyecto.porcentajeAvance} className="h-2" />
              </div>
            )) : (
              <div className="text-center py-4 text-gray-500">
                <Building2 className="mx-auto h-8 w-8 mb-2" />
                <p>No hay proyectos en ejecución</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alertas y Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Alertas y Notificaciones</CardTitle>
            <CardDescription>Situaciones que requieren atención</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertas.map((alerta, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                {alerta.tipo === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                {alerta.tipo === "info" && <Clock className="h-5 w-5 text-blue-500 mt-0.5" />}
                {alerta.tipo === "error" && <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />}
                {alerta.tipo === "success" && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm font-medium">{alerta.mensaje}</p>
                  <p className="text-xs text-gray-500">{alerta.fecha}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Métricas Adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Items totales</span>
                  <span className="font-medium">{totalInventario}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Stock bajo</span>
                  <span className="font-medium text-yellow-600">{stockBajo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sin stock</span>
                  <span className="font-medium text-red-600">{stockAgotado}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Inspecciones totales</span>
                  <span className="font-medium">{totalInspecciones}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Aprobadas</span>
                  <span className="font-medium text-green-600">{inspeccionesAprobadas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pendientes</span>
                  <span className="font-medium text-yellow-600">{inspeccionesPendientes}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Relaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Clientes activos</span>
                  <span className="font-medium">{totalClientes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Proveedores</span>
                  <span className="font-medium">{totalProveedores}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Empleados</span>
                  <span className="font-medium text-blue-600">{totalEmpleados}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
