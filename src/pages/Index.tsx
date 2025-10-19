tsx 
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEmpleados, useProyectos, useInventario, useClientes, useProveedores, useControlCalidad } from "@/hooks/useLocalStorage";
import { initializeData } from "@/utils/seedData";
import { 
  Building2, 
  Users, 
  Package, 
  UserCheck, 
  ClipboardCheck, 
  BarChart3,
  RefreshCw,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

const Index = () => {
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

  // Forzar actualización automática cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
      setLastUpdate(new Date());
    }, 2000);

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
  const totalEmpleados = empleados.filter(e => e.activo).length;
  const proyectosActivos = proyectos.filter(p => p.estado === 'en_ejecucion' && p.activo).length;
  const totalProyectos = proyectos.filter(p => p.activo).length;
  const totalInventario = inventario.filter(i => i.activo).length;
  const totalClientes = clientes.filter(c => c.activo).length;
  const totalProveedores = proveedores.filter(p => p.activo).length;
  const totalInspecciones = inspecciones.length;
  const inspeccionesAprobadas = inspecciones.filter(i => i.resultado === 'aprobado').length;
  
  // Alertas importantes
  const stockBajo = inventario.filter(item => item.stockActual <= item.stockMinimo && item.stockActual > 0 && item.activo).length;
  const stockAgotado = inventario.filter(item => item.stockActual === 0 && item.activo).length;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Gestión</h1>
            <p className="text-gray-600">Constructora CSR SAS - NIT: 900391928-0</p>
            <p className="text-xs text-gray-400 mt-2">
              Última actualización: {lastUpdate.toLocaleTimeString('es-CO')}
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>

        {/* Resumen Ejecutivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proyectosActivos}</div>
              <p className="text-xs text-muted-foreground">
                de {totalProyectos} proyectos totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empleados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmpleados}</div>
              <p className="text-xs text-muted-foreground">
                empleados activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventario</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInventario}</div>
              <p className="text-xs text-muted-foreground">
                items registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calidad</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalInspecciones > 0 ? Math.round((inspeccionesAprobadas / totalInspecciones) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                inspecciones aprobadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alertas */}
        {(stockBajo > 0 || stockAgotado > 0) && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                Alertas de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent className="text-yellow-700">
              {stockBajo > 0 && (
                <p>• {stockBajo} items con stock bajo requieren reposición</p>
              )}
              {stockAgotado > 0 && (
                <p>• {stockAgotado} items agotados necesitan restock urgente</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Módulos del Sistema */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Módulos del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Dashboard Ejecutivo
                </CardTitle>
                <CardDescription>
                  Resumen general de la operación y métricas clave
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href="/dashboard">Acceder</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                  Gestión de Proyectos
                </CardTitle>
                <CardDescription>
                  Control de obras, cronogramas y presupuestos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href="/proyectos">Acceder</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Recursos Humanos
                </CardTitle>
                <CardDescription>
                  Gestión de empleados y documentación laboral
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href="/recursos-humanos">Acceder</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-orange-600" />
                  Inventarios
                </CardTitle>
                <CardDescription>
                  Control de materiales, equipos y herramientas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href="/inventarios">Acceder</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-indigo-600" />
                  Clientes y Proveedores
                </CardTitle>
                <CardDescription>
                  Base de datos de clientes y proveedores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href="/clientes-proveedores">Acceder</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-red-600" />
                  Control de Calidad
                </CardTitle>
                <CardDescription>
                  Inspecciones y certificaciones de calidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href="/control-calidad">Acceder</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Estadísticas Adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Relaciones Comerciales</CardTitle>
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estado del Inventario</CardTitle>
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
              <CardTitle className="text-lg">Control de Calidad</CardTitle>
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
                  <span className="text-sm">Tasa de aprobación</span>
                  <span className="font-medium">
                    {totalInspecciones > 0 ? Math.round((inspeccionesAprobadas / totalInspecciones) * 100) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
