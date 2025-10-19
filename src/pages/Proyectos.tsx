import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useProyectos, useClientes, useEmpleados, Proyecto } from "@/hooks/useLocalStorage";
import { initializeData } from "@/utils/seedData";
import { Building2, Plus, Search, Edit, Trash2, Printer, FileDown } from "lucide-react";

const Proyectos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState<Proyecto | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    clienteId: "",
    direccion: "",
    ciudad: "",
    estado: "planificacion" as const,
    fechaInicio: "",
    fechaFinEstimada: "",
    presupuestoInicial: "",
    presupuestoActual: "",
    porcentajeAvance: "",
    responsableId: "",
  });

  const { proyectos, agregarProyecto, actualizarProyecto, eliminarProyecto } = useProyectos();
  const { clientes } = useClientes();
  const { empleados } = useEmpleados();
  const { toast } = useToast();

  useEffect(() => {
    initializeData();
  }, []);

  const proyectosActivos = proyectos.filter(proy => proy.activo);
  const clientesActivos = clientes.filter(cli => cli.activo);
  const empleadosActivos = empleados.filter(emp => emp.activo);

  const estadosProyecto = [
    { value: "planificacion", label: "Planificación", color: "bg-gray-100 text-gray-800" },
    { value: "en_ejecucion", label: "En Ejecución", color: "bg-blue-100 text-blue-800" },
    { value: "pausado", label: "Pausado", color: "bg-yellow-100 text-yellow-800" },
    { value: "completado", label: "Completado", color: "bg-green-100 text-green-800" },
    { value: "cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" },
  ];

  const proyectosFiltrados = proyectosActivos.filter(proyecto => {
    const matchesSearch = 
      proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.ciudad.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filterEstado === "todos" || proyecto.estado === filterEstado;
    
    return matchesSearch && matchesEstado;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.clienteId || !formData.responsableId) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const proyectoData = {
      ...formData,
      presupuestoInicial: parseFloat(formData.presupuestoInicial) || 0,
      presupuestoActual: parseFloat(formData.presupuestoActual) || 0,
      porcentajeAvance: parseInt(formData.porcentajeAvance) || 0,
      activo: true,
    };

    if (editingProyecto) {
      actualizarProyecto(editingProyecto.id, proyectoData);
      toast({
        title: "Proyecto actualizado",
        description: "Los datos del proyecto se han actualizado correctamente",
      });
    } else {
      agregarProyecto(proyectoData);
      toast({
        title: "Proyecto agregado",
        description: "El nuevo proyecto se ha registrado correctamente",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (proyecto: Proyecto) => {
    setEditingProyecto(proyecto);
    setFormData({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      clienteId: proyecto.clienteId,
      direccion: proyecto.direccion,
      ciudad: proyecto.ciudad,
      estado: proyecto.estado,
      fechaInicio: proyecto.fechaInicio,
      fechaFinEstimada: proyecto.fechaFinEstimada,
      presupuestoInicial: proyecto.presupuestoInicial.toString(),
      presupuestoActual: proyecto.presupuestoActual.toString(),
      porcentajeAvance: proyecto.porcentajeAvance.toString(),
      responsableId: proyecto.responsableId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (proyecto: Proyecto) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${proyecto.nombre}"?`)) {
      eliminarProyecto(proyecto.id);
      toast({
        title: "Proyecto eliminado",
        description: "El proyecto ha sido eliminado del sistema",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      clienteId: "",
      direccion: "",
      ciudad: "",
      estado: "planificacion",
      fechaInicio: "",
      fechaFinEstimada: "",
      presupuestoInicial: "",
      presupuestoActual: "",
      porcentajeAvance: "",
      responsableId: "",
    });
    setEditingProyecto(null);
  };

  const getEstadoInfo = (estado: string) => {
    return estadosProyecto.find(e => e.value === estado) || estadosProyecto[0];
  };

  const getClienteNombre = (clienteId: string) => {
    const cliente = clientesActivos.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : "Cliente no encontrado";
  };

  const getEmpleadoNombre = (empleadoId: string) => {
    const empleado = empleadosActivos.find(e => e.id === empleadoId);
    return empleado ? `${empleado.nombre} ${empleado.apellido}` : "Empleado no encontrado";
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Reporte de Proyectos - Constructora CSR SAS</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company { font-size: 18px; font-weight: bold; }
            .report-title { font-size: 16px; margin: 10px 0; }
            .date { font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .total { margin-top: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company">Constructora CSR SAS</div>
            <div class="report-title">Reporte de Proyectos</div>
            <div class="date">Generado el: ${new Date().toLocaleDateString('es-CO')}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cliente</th>
                <th>Dirección</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Presupuesto</th>
                <th>Avance</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              ${proyectosFiltrados.map(proy => `
                <tr>
                  <td>${proy.nombre}</td>
                  <td>${getClienteNombre(proy.clienteId)}</td>
                  <td>${proy.direccion}</td>
                  <td>${proy.ciudad}</td>
                  <td>${getEstadoInfo(proy.estado).label}</td>
                  <td>${new Date(proy.fechaInicio).toLocaleDateString('es-CO')}</td>
                  <td>${new Date(proy.fechaFinEstimada).toLocaleDateString('es-CO')}</td>
                  <td>$${proy.presupuestoActual.toLocaleString()}</td>
                  <td>${proy.porcentajeAvance}%</td>
                  <td>${getEmpleadoNombre(proy.responsableId)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Total de proyectos: ${proyectosFiltrados.length}</div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
            <p className="text-gray-600">Control de obras, cronogramas y presupuestos</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProyecto ? "Editar Proyecto" : "Nuevo Proyecto"}
                </DialogTitle>
                <DialogDescription>
                  {editingProyecto 
                    ? "Modifica los datos del proyecto" 
                    : "Completa la información del nuevo proyecto"
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre del Proyecto *</label>
                    <Input
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Nombre del proyecto"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Cliente *</label>
                    <Select value={formData.clienteId} onValueChange={(value) => setFormData({...formData, clienteId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientesActivos.map(cliente => (
                          <SelectItem key={cliente.id} value={cliente.id}>{cliente.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <Input
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Descripción del proyecto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Dirección</label>
                    <Input
                      value={formData.direccion}
                      onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                      placeholder="Dirección"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Ciudad</label>
                    <Input
                      value={formData.ciudad}
                      onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                      placeholder="Ciudad"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Estado</label>
                    <Select value={formData.estado} onValueChange={(value: any) => setFormData({...formData, estado: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {estadosProyecto.map(estado => (
                          <SelectItem key={estado.value} value={estado.value}>{estado.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Responsable *</label>
                    <Select value={formData.responsableId} onValueChange={(value) => setFormData({...formData, responsableId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar responsable" />
                      </SelectTrigger>
                      <SelectContent>
                        {empleadosActivos.map(empleado => (
                          <SelectItem key={empleado.id} value={empleado.id}>
                            {empleado.nombre} {empleado.apellido} - {empleado.cargo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Fecha de Inicio</label>
                    <Input
                      type="date"
                      value={formData.fechaInicio}
                      onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Fecha Fin Estimada</label>
                    <Input
                      type="date"
                      value={formData.fechaFinEstimada}
                      onChange={(e) => setFormData({...formData, fechaFinEstimada: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Presupuesto Inicial</label>
                    <Input
                      type="number"
                      value={formData.presupuestoInicial}
                      onChange={(e) => setFormData({...formData, presupuestoInicial: e.target.value})}
                      placeholder="Presupuesto inicial"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Presupuesto Actual</label>
                    <Input
                      type="number"
                      value={formData.presupuestoActual}
                      onChange={(e) => setFormData({...formData, presupuestoActual: e.target.value})}
                      placeholder="Presupuesto actual"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Porcentaje de Avance (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.porcentajeAvance}
                      onChange={(e) => setFormData({...formData, porcentajeAvance: e.target.value})}
                      placeholder="% Avance"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingProyecto ? "Actualizar" : "Guardar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {estadosProyecto.map(estado => {
            const count = proyectosActivos.filter(p => p.estado === estado.value).length;
            return (
              <Card key={estado.value}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{estado.label}</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Lista de Proyectos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Proyectos</CardTitle>
            <CardDescription>
              Gestiona todos los proyectos de construcción
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre, descripción o ciudad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  {estadosProyecto.map(estado => (
                    <SelectItem key={estado.value} value={estado.value}>{estado.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Imprimir
                </Button>
                <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
                  <FileDown className="h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Avance</TableHead>
                    <TableHead>Presupuesto</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proyectosFiltrados.map((proyecto) => {
                    const estadoInfo = getEstadoInfo(proyecto.estado);
                    return (
                      <TableRow key={proyecto.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{proyecto.nombre}</div>
                            <div className="text-sm text-gray-500">{proyecto.descripcion}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getClienteNombre(proyecto.clienteId)}</TableCell>
                        <TableCell>
                          <div>
                            <div>{proyecto.direccion}</div>
                            <div className="text-sm text-gray-500">{proyecto.ciudad}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={estadoInfo.color}>{estadoInfo.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{proyecto.porcentajeAvance}%</div>
                            <Progress value={proyecto.porcentajeAvance} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>${proyecto.presupuestoActual.toLocaleString()}</TableCell>
                        <TableCell>{getEmpleadoNombre(proyecto.responsableId)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(proyecto)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(proyecto)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {proyectosFiltrados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="mx-auto h-12 w-12 mb-4" />
                <p>No se encontraron proyectos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Proyectos;
