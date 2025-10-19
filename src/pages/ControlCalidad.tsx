import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useControlCalidad, InspeccionCalidad } from "@/hooks/useLocalStorage";
import { useProyectos } from "@/hooks/useLocalStorage";
import { initializeData } from "@/utils/seedData";
import { ClipboardCheck, Plus, Search, Edit, Trash2, CheckCircle, AlertTriangle, Printer, FileDown } from "lucide-react";

const ControlCalidad = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResultado, setFilterResultado] = useState("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInspeccion, setEditingInspeccion] = useState<InspeccionCalidad | null>(null);
  const [formData, setFormData] = useState({
    proyectoId: "",
    tipo: "estructural" as const,
    fecha: "",
    inspector: "",
    descripcion: "",
    resultado: "aprobado" as const,
    observaciones: "",
    fechaSeguimiento: "",
  });

  const { inspecciones, agregarInspeccion, actualizarInspeccion, eliminarInspeccion } = useControlCalidad();
  const { proyectos } = useProyectos();
  const { toast } = useToast();

  useEffect(() => {
    initializeData();
  }, []);

  const inspeccionesActivas = inspecciones;

  const proyectosActivos = proyectos.filter(p => p.activo);

  const filtrosResultado = [
    { value: "todos", label: "Todos" },
    { value: "aprobado", label: "Aprobado" },
    { value: "condicional", label: "Condicional" },
    { value: "rechazado", label: "Rechazado" },
  ];

  const inspeccionesFiltradas = inspeccionesActivas.filter(inspeccion => {
    const matchesSearch = 
      inspeccion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspeccion.inspector.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesResultado = filterResultado === "todos" || inspeccion.resultado === filterResultado;

    return matchesSearch && matchesResultado;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.proyectoId || !formData.tipo || !formData.fecha || !formData.inspector || !formData.resultado) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const inspeccionData = {
      ...formData,
    };

    if (editingInspeccion) {
      actualizarInspeccion(editingInspeccion.id, inspeccionData);
      toast({
        title: "Inspección actualizada",
        description: "Los datos de la inspección se han actualizado correctamente",
      });
    } else {
      agregarInspeccion(inspeccionData);
      toast({
        title: "Inspección agregada",
        description: "La inspección se ha registrado correctamente",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (inspeccion: InspeccionCalidad) => {
    setEditingInspeccion(inspeccion);
    setFormData({
      proyectoId: inspeccion.proyectoId,
      tipo: inspeccion.tipo,
      fecha: inspeccion.fecha,
      inspector: inspeccion.inspector,
      descripcion: inspeccion.descripcion,
      resultado: inspeccion.resultado,
      observaciones: inspeccion.observaciones,
      fechaSeguimiento: inspeccion.fechaSeguimiento || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (inspeccion: InspeccionCalidad) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar esta inspección?`)) {
      eliminarInspeccion(inspeccion.id);
      toast({
        title: "Inspección eliminada",
        description: "La inspección ha sido eliminada del sistema",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      proyectoId: "",
      tipo: "estructural",
      fecha: "",
      inspector: "",
      descripcion: "",
      resultado: "aprobado",
      observaciones: "",
      fechaSeguimiento: "",
    });
    setEditingInspeccion(null);
  };

  const resultadoColors = {
    aprobado: "bg-green-100 text-green-800",
    condicional: "bg-yellow-100 text-yellow-800",
    rechazado: "bg-red-100 text-red-800",
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Reporte de Control de Calidad - Constructora CSR SAS</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>Control de Calidad</h2>
          <table>
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Inspector</th>
                <th>Descripción</th>
                <th>Resultado</th>
                <th>Observaciones</th>
                <th>Fecha Seguimiento</th>
              </tr>
            </thead>
            <tbody>
              ${inspeccionesFiltradas.map(ins => `
                <tr>
                  <td>${proyectos.find(p => p.id === ins.proyectoId)?.nombre || 'N/D'}</td>
                  <td>${ins.tipo}</td>
                  <td>${new Date(ins.fecha).toLocaleDateString('es-CO')}</td>
                  <td>${ins.inspector}</td>
                  <td>${ins.descripcion}</td>
                  <td>${ins.resultado}</td>
                  <td>${ins.observaciones}</td>
                  <td>${ins.fechaSeguimiento ? new Date(ins.fechaSeguimiento).toLocaleDateString('es-CO') : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
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
            <h1 className="text-3xl font-bold text-gray-900">Control de Calidad</h1>
            <p className="text-gray-600">Inspecciones y certificaciones de calidad</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Inspección
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{editingInspeccion ? "Editar Inspección" : "Nueva Inspección"}</DialogTitle>
                <DialogDescription>
                  {editingInspeccion ? "Modifica los datos de la inspección" : "Completa la información de la nueva inspección"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Proyecto *</label>
                    <Select value={formData.proyectoId} onValueChange={(value) => setFormData({...formData, proyectoId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        {proyectosActivos.map(proyecto => (
                          <SelectItem key={proyecto.id} value={proyecto.id}>{proyecto.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tipo *</label>
                    <Select value={formData.tipo} onValueChange={(value: any) => setFormData({...formData, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estructural">Estructural</SelectItem>
                        <SelectItem value="acabados">Acabados</SelectItem>
                        <SelectItem value="instalaciones">Instalaciones</SelectItem>
                        <SelectItem value="seguridad">Seguridad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Fecha *</label>
                    <Input
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Inspector *</label>
                    <Input
                      value={formData.inspector}
                      onChange={(e) => setFormData({...formData, inspector: e.target.value})}
                      placeholder="Nombre del inspector"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <Input
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Descripción de la inspección"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Resultado *</label>
                  <Select value={formData.resultado} onValueChange={(value: any) => setFormData({...formData, resultado: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aprobado">Aprobado</SelectItem>
                      <SelectItem value="condicional">Condicional</SelectItem>
                      <SelectItem value="rechazado">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Observaciones</label>
                  <Input
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                    placeholder="Observaciones adicionales"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Fecha Seguimiento</label>
                  <Input
                    type="date"
                    value={formData.fechaSeguimiento}
                    onChange={(e) => setFormData({...formData, fechaSeguimiento: e.target.value})}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingInspeccion ? "Actualizar" : "Guardar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inspecciones</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inspeccionesActivas.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {inspeccionesActivas.filter(i => i.resultado === "aprobado").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Condicionales</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {inspeccionesActivas.filter(i => i.resultado === "condicional").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {inspeccionesActivas.filter(i => i.resultado === "rechazado").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Inspecciones */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Inspecciones</CardTitle>
            <CardDescription>
              Gestiona todas las inspecciones de calidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por descripción o inspector..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterResultado} onValueChange={setFilterResultado}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por resultado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="condicional">Condicional</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
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
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Inspector</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Observaciones</TableHead>
                    <TableHead>Fecha Seguimiento</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspeccionesFiltradas.map((inspeccion) => (
                    <TableRow key={inspeccion.id}>
                      <TableCell>{proyectosActivos.find(p => p.id === inspeccion.proyectoId)?.nombre || 'N/D'}</TableCell>
                      <TableCell>{inspeccion.tipo}</TableCell>
                      <TableCell>{new Date(inspeccion.fecha).toLocaleDateString('es-CO')}</TableCell>
                      <TableCell>{inspeccion.inspector}</TableCell>
                      <TableCell>{inspeccion.descripcion}</TableCell>
                      <TableCell>
                        <Badge className={resultadoColors[inspeccion.resultado]}>
                          {inspeccion.resultado}
                        </Badge>
                      </TableCell>
                      <TableCell>{inspeccion.observaciones}</TableCell>
                      <TableCell>{inspeccion.fechaSeguimiento ? new Date(inspeccion.fechaSeguimiento).toLocaleDateString('es-CO') : ''}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(inspeccion)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(inspeccion)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {inspeccionesFiltradas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ClipboardCheck className="mx-auto h-12 w-12 mb-4" />
                <p>No se encontraron inspecciones</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ControlCalidad;
