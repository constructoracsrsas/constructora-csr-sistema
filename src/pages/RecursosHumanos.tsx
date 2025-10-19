tsx 
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
import { useEmpleados, Empleado } from "@/hooks/useLocalStorage";
import { initializeData } from "@/utils/seedData";
import { Users, Plus, Search, Edit, Trash2, Eye, Printer, FileDown } from "lucide-react";

const RecursosHumanos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCargo, setFilterCargo] = useState("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    tipoDocumento: "cedula" as const,
    cargo: "",
    telefono: "",
    email: "",
    salario: "",
    fechaIngreso: "",
  });

  const { empleados, agregarEmpleado, actualizarEmpleado, eliminarEmpleado } = useEmpleados();
  const { toast } = useToast();

  useEffect(() => {
    initializeData();
  }, []);

  const empleadosActivos = empleados.filter(emp => emp.activo);
  const cargosUnicos = [...new Set(empleadosActivos.map(emp => emp.cargo))];

  const empleadosFiltrados = empleadosActivos.filter(empleado => {
    const matchesSearch = 
      empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.documento.includes(searchTerm) ||
      empleado.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCargo = filterCargo === "todos" || empleado.cargo === filterCargo;
    
    return matchesSearch && matchesCargo;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.apellido || !formData.documento || !formData.cargo) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const empleadoData = {
      ...formData,
      salario: parseFloat(formData.salario) || 0,
      activo: true,
    };

    if (editingEmpleado) {
      actualizarEmpleado(editingEmpleado.id, empleadoData);
      toast({
        title: "Empleado actualizado",
        description: "Los datos del empleado se han actualizado correctamente",
      });
    } else {
      agregarEmpleado(empleadoData);
      toast({
        title: "Empleado agregado",
        description: "El nuevo empleado se ha registrado correctamente",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (empleado: Empleado) => {
    setEditingEmpleado(empleado);
    setFormData({
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      documento: empleado.documento,
      tipoDocumento: empleado.tipoDocumento,
      cargo: empleado.cargo,
      telefono: empleado.telefono,
      email: empleado.email,
      salario: empleado.salario.toString(),
      fechaIngreso: empleado.fechaIngreso,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (empleado: Empleado) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${empleado.nombre} ${empleado.apellido}?`)) {
      eliminarEmpleado(empleado.id);
      toast({
        title: "Empleado eliminado",
        description: "El empleado ha sido eliminado del sistema",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      documento: "",
      tipoDocumento: "cedula",
      cargo: "",
      telefono: "",
      email: "",
      salario: "",
      fechaIngreso: "",
    });
    setEditingEmpleado(null);
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Reporte de Empleados - Constructora CSR SAS</title>
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
            <div class="report-title">Reporte de Empleados</div>
            <div class="date">Generado el: ${new Date().toLocaleDateString('es-CO')}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Cargo</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Salario</th>
                <th>Fecha Ingreso</th>
              </tr>
            </thead>
            <tbody>
              ${empleadosFiltrados.map(emp => `
                <tr>
                  <td>${emp.nombre} ${emp.apellido}</td>
                  <td>${emp.documento}</td>
                  <td>${emp.cargo}</td>
                  <td>${emp.telefono}</td>
                  <td>${emp.email}</td>
                  <td>$${emp.salario.toLocaleString()}</td>
                  <td>${new Date(emp.fechaIngreso).toLocaleDateString('es-CO')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Total de empleados: ${empleadosFiltrados.length}</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Recursos Humanos</h1>
            <p className="text-gray-600">Gestión de empleados y documentación laboral</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Empleado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingEmpleado ? "Editar Empleado" : "Nuevo Empleado"}
                </DialogTitle>
                <DialogDescription>
                  {editingEmpleado 
                    ? "Modifica los datos del empleado" 
                    : "Completa la información del nuevo empleado"
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre *</label>
                    <Input
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Apellido *</label>
                    <Input
                      value={formData.apellido}
                      onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                      placeholder="Apellido"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tipo de Documento</label>
                    <Select value={formData.tipoDocumento} onValueChange={(value: any) => setFormData({...formData, tipoDocumento: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cedula">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="cedula_extranjeria">Cédula de Extranjería</SelectItem>
                        <SelectItem value="pasaporte">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Número de Documento *</label>
                    <Input
                      value={formData.documento}
                      onChange={(e) => setFormData({...formData, documento: e.target.value})}
                      placeholder="Número de documento"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Cargo *</label>
                    <Input
                      value={formData.cargo}
                      onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                      placeholder="Cargo"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Teléfono</label>
                    <Input
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      placeholder="Teléfono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Email"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Salario</label>
                    <Input
                      type="number"
                      value={formData.salario}
                      onChange={(e) => setFormData({...formData, salario: e.target.value})}
                      placeholder="Salario"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Fecha de Ingreso</label>
                    <Input
                      type="date"
                      value={formData.fechaIngreso}
                      onChange={(e) => setFormData({...formData, fechaIngreso: e.target.value})}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingEmpleado ? "Actualizar" : "Guardar"}
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
              <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{empleadosActivos.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargos Diferentes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cargosUnicos.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nómina Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${empleadosActivos.reduce((total, emp) => total + emp.salario, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salario Promedio</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${empleadosActivos.length > 0 ? Math.round(empleadosActivos.reduce((total, emp) => total + emp.salario, 0) / empleadosActivos.length).toLocaleString() : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Empleados</CardTitle>
            <CardDescription>
              Gestiona la información de todos los empleados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre, documento o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCargo} onValueChange={setFilterCargo}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los cargos</SelectItem>
                  {cargosUnicos.map(cargo => (
                    <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
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
                    <TableHead>Nombre</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Salario</TableHead>
                    <TableHead>Fecha Ingreso</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empleadosFiltrados.map((empleado) => (
                    <TableRow key={empleado.id}>
                      <TableCell className="font-medium">
                        {empleado.nombre} {empleado.apellido}
                      </TableCell>
                      <TableCell>{empleado.documento}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{empleado.cargo}</Badge>
                      </TableCell>
                      <TableCell>{empleado.telefono}</TableCell>
                      <TableCell>{empleado.email}</TableCell>
                      <TableCell>${empleado.salario.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(empleado.fechaIngreso).toLocaleDateString('es-CO')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(empleado)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(empleado)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {empleadosFiltrados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="mx-auto h-12 w-12 mb-4" />
                <p>No se encontraron empleados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RecursosHumanos;
