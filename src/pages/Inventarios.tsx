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
import { useInventario, ItemInventario } from "@/hooks/useLocalStorage";
import { initializeData } from "@/utils/seedData";
import { Package, Plus, Search, Edit, Trash2, AlertTriangle, CheckCircle, Printer, FileDown } from "lucide-react";

const Inventarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("todos");
  const [filterStock, setFilterStock] = useState("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemInventario | null>(null);
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    categoria: "",
    stockActual: "",
    stockMinimo: "",
    unidad: "",
    precioUnitario: "",
    ubicacion: "",
  });

  const { inventario, agregarItem, actualizarItem, eliminarItem } = useInventario();
  const { toast } = useToast();

  useEffect(() => {
    initializeData();
  }, []);

  const inventarioActivo = inventario.filter(item => item.activo);
  const categoriasUnicas = [...new Set(inventarioActivo.map(item => item.categoria))];

  const inventarioFiltrado = inventarioActivo.filter(item => {
    const matchesSearch = 
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = filterCategoria === "todos" || item.categoria === filterCategoria;
    
    let matchesStock = true;
    if (filterStock === "bajo") {
      matchesStock = item.stockActual <= item.stockMinimo && item.stockActual > 0;
    } else if (filterStock === "agotado") {
      matchesStock = item.stockActual === 0;
    } else if (filterStock === "normal") {
      matchesStock = item.stockActual > item.stockMinimo;
    }
    
    return matchesSearch && matchesCategoria && matchesStock;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.nombre || !formData.categoria) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const itemData = {
      ...formData,
      stockActual: parseInt(formData.stockActual) || 0,
      stockMinimo: parseInt(formData.stockMinimo) || 0,
      precioUnitario: parseFloat(formData.precioUnitario) || 0,
      activo: true,
    };

    if (editingItem) {
      actualizarItem(editingItem.id, itemData);
      toast({
        title: "Item actualizado",
        description: "Los datos del item se han actualizado correctamente",
      });
    } else {
      agregarItem(itemData);
      toast({
        title: "Item agregado",
        description: "El nuevo item se ha registrado correctamente",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (item: ItemInventario) => {
    setEditingItem(item);
    setFormData({
      codigo: item.codigo,
      nombre: item.nombre,
      descripcion: item.descripcion,
      categoria: item.categoria,
      stockActual: item.stockActual.toString(),
      stockMinimo: item.stockMinimo.toString(),
      unidad: item.unidad,
      precioUnitario: item.precioUnitario.toString(),
      ubicacion: item.ubicacion,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: ItemInventario) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${item.nombre}"?`)) {
      eliminarItem(item.id);
      toast({
        title: "Item eliminado",
        description: "El item ha sido eliminado del inventario",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      codigo: "",
      nombre: "",
      descripcion: "",
      categoria: "",
      stockActual: "",
      stockMinimo: "",
      unidad: "",
      precioUnitario: "",
      ubicacion: "",
    });
    setEditingItem(null);
  };

  const getStockBadge = (item: ItemInventario) => {
    if (item.stockActual === 0) {
      return <Badge variant="destructive">Agotado</Badge>;
    } else if (item.stockActual <= item.stockMinimo) {
      return <Badge className="bg-yellow-100 text-yellow-800">Stock Bajo</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
    }
  };

  const calcularEstadisticas = () => {
    const total = inventarioActivo.length;
    const stockBajo = inventarioActivo.filter(item => item.stockActual <= item.stockMinimo && item.stockActual > 0).length;
    const agotado = inventarioActivo.filter(item => item.stockActual === 0).length;
    const valorTotal = inventarioActivo.reduce((total, item) => total + (item.stockActual * item.precioUnitario), 0);
    
    return { total, stockBajo, agotado, valorTotal };
  };

  const estadisticas = calcularEstadisticas();

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Reporte de Inventario - Constructora CSR SAS</title>
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
            <div class="report-title">Reporte de Inventario</div>
            <div class="date">Generado el: ${new Date().toLocaleDateString('es-CO')}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>Unidad</th>
                <th>Precio Unitario</th>
                <th>Ubicación</th>
              </tr>
            </thead>
            <tbody>
              ${inventarioFiltrado.map(item => `
                <tr>
                  <td>${item.codigo}</td>
                  <td>${item.nombre}</td>
                  <td>${item.categoria}</td>
                  <td>${item.stockActual}</td>
                  <td>${item.stockMinimo}</td>
                  <td>${item.unidad}</td>
                  <td>$${item.precioUnitario.toLocaleString()}</td>
                  <td>${item.ubicacion}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Total de items: ${inventarioFiltrado.length}</div>
          <div class="total">Valor total inventario: $${estadisticas.valorTotal.toLocaleString()}</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Inventarios</h1>
            <p className="text-gray-600">Control de materiales, equipos y herramientas</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Editar Item" : "Nuevo Item"}
                </DialogTitle>
                <DialogDescription>
                  {editingItem 
                    ? "Modifica los datos del item" 
                    : "Completa la información del nuevo item"
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Código *</label>
                    <Input
                      value={formData.codigo}
                      onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                      placeholder="Código del item"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nombre *</label>
                    <Input
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Nombre del item"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <Input
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Descripción del item"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Categoría *</label>
                    <Input
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      placeholder="Categoría"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unidad</label>
                    <Input
                      value={formData.unidad}
                      onChange={(e) => setFormData({...formData, unidad: e.target.value})}
                      placeholder="Unidad (ej: Kg, Unidad, Metro)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Stock Actual</label>
                    <Input
                      type="number"
                      value={formData.stockActual}
                      onChange={(e) => setFormData({...formData, stockActual: e.target.value})}
                      placeholder="Stock actual"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Stock Mínimo</label>
                    <Input
                      type="number"
                      value={formData.stockMinimo}
                      onChange={(e) => setFormData({...formData, stockMinimo: e.target.value})}
                      placeholder="Stock mínimo"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Precio Unitario</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.precioUnitario}
                      onChange={(e) => setFormData({...formData, precioUnitario: e.target.value})}
                      placeholder="Precio unitario"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Ubicación</label>
                  <Input
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    placeholder="Ubicación en almacén"
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingItem ? "Actualizar" : "Guardar"}
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
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{estadisticas.stockBajo}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agotados</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{estadisticas.agotado}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${estadisticas.valorTotal.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Inventario */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Inventario</CardTitle>
            <CardDescription>
              Gestiona todos los materiales, equipos y herramientas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por código, nombre, descripción o ubicación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las categorías</SelectItem>
                  {categoriasUnicas.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStock} onValueChange={setFilterStock}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="normal">Stock Normal</SelectItem>
                  <SelectItem value="bajo">Stock Bajo</SelectItem>
                  <SelectItem value="agotado">Agotado</SelectItem>
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
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Precio Unit.</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventarioFiltrado.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.codigo}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.nombre}</div>
                          <div className="text-sm text-gray-500">{item.descripcion}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.categoria}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{item.stockActual} {item.unidad}</div>
                          <div className="text-sm text-gray-500">Mín: {item.stockMinimo}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStockBadge(item)}</TableCell>
                      <TableCell>${item.precioUnitario.toLocaleString()}</TableCell>
                      <TableCell>${(item.stockActual * item.precioUnitario).toLocaleString()}</TableCell>
                      <TableCell>{item.ubicacion}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item)}
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

            {inventarioFiltrado.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="mx-auto h-12 w-12 mb-4" />
                <p>No se encontraron items en el inventario</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Inventarios;
