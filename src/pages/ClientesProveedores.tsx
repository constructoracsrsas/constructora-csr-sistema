import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useClientes, Cliente, useProveedores, Proveedor } from "@/hooks/useLocalStorage";
import { initializeData } from "@/utils/seedData";
import { User, UserPlus, Search, Edit, Trash2, Star, Printer, FileDown } from "lucide-react";

const ClientesProveedores = () => {
  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [searchTermProveedor, setSearchTermProveedor] = useState("");
  const [isDialogOpenCliente, setIsDialogOpenCliente] = useState(false);
  const [isDialogOpenProveedor, setIsDialogOpenProveedor] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [formCliente, setFormCliente] = useState({
    nombre: "",
    tipoDocumento: "cedula" as const,
    numeroDocumento: "",
    telefono: "",
    email: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    contactoPrincipal: "",
  });
  const [formProveedor, setFormProveedor] = useState({
    nombre: "",
    nit: "",
    tipo: "materiales" as const,
    telefono: "",
    email: "",
    direccion: "",
    ciudad: "",
    calificacion: 0,
    contactoPrincipal: "",
  });

  const { clientes, agregarCliente, actualizarCliente, eliminarCliente } = useClientes();
  const { proveedores, agregarProveedor, actualizarProveedor, eliminarProveedor } = useProveedores();
  const { toast } = useToast();

  useEffect(() => {
    initializeData();
  }, []);

  const clientesActivos = clientes.filter(cli => cli.activo);
  const proveedoresActivos = proveedores.filter(prov => prov.activo);

  const clientesFiltrados = clientesActivos.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTermCliente.toLowerCase()) ||
    cliente.numeroDocumento.toLowerCase().includes(searchTermCliente.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTermCliente.toLowerCase())
  );

  const proveedoresFiltrados = proveedoresActivos.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTermProveedor.toLowerCase()) ||
    proveedor.nit.toLowerCase().includes(searchTermProveedor.toLowerCase()) ||
    proveedor.email.toLowerCase().includes(searchTermProveedor.toLowerCase())
  );

  const proveedorTipos = [
    { value: "materiales", label: "Materiales" },
    { value: "equipos", label: "Equipos" },
    { value: "servicios", label: "Servicios" },
    { value: "transporte", label: "Transporte" },
  ];

  const calificaciones = [1, 2, 3, 4, 5];

  // CLIENTES
  const handleSubmitCliente = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formCliente.nombre || !formCliente.numeroDocumento) {
      toast({
        title: "Error",
        description: "Por favor llena los campos obligatorios en Cliente",
        variant: "destructive",
      });
      return;
    }

    if (editingCliente) {
      actualizarCliente(editingCliente.id, formCliente);
      toast({
        title: "Cliente actualizado",
        description: "Datos de cliente actualizados correctamente",
      });
    } else {
      agregarCliente(formCliente);
      toast({
        title: "Cliente agregado",
        description: "Cliente agregado correctamente",
      });
    }
    resetFormCliente();
    setIsDialogOpenCliente(false);
  };

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormCliente(cliente);
    setIsDialogOpenCliente(true);
  };

  const handleDeleteCliente = (cliente: Cliente) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar cliente ${cliente.nombre}?`)) {
      eliminarCliente(cliente.id);
      toast({
        title: "Cliente eliminado",
        description: "Cliente eliminado del sistema",
      });
    }
  };

  const resetFormCliente = () => {
    setFormCliente({
      nombre: "",
      tipoDocumento: "cedula",
      numeroDocumento: "",
      telefono: "",
      email: "",
      direccion: "",
      ciudad: "",
      departamento: "",
      contactoPrincipal: "",
    });
    setEditingCliente(null);
  };

  // PROVEEDORES
  const handleSubmitProveedor = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formProveedor.nombre || !formProveedor.nit) {
      toast({
        title: "Error",
        description: "Por favor llena los campos obligatorios en Proveedor",
        variant: "destructive",
      });
      return;
    }

    if (editingProveedor) {
      actualizarProveedor(editingProveedor.id, formProveedor);
      toast({
        title: "Proveedor actualizado",
        description: "Datos de proveedor actualizados correctamente",
      });
    } else {
      agregarProveedor(formProveedor);
      toast({
        title: "Proveedor agregado",
        description: "Proveedor agregado correctamente",
      });
    }
    resetFormProveedor();
    setIsDialogOpenProveedor(false);
  };

  const handleEditProveedor = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    setFormProveedor(proveedor);
    setIsDialogOpenProveedor(true);
  };

  const handleDeleteProveedor = (proveedor: Proveedor) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar proveedor ${proveedor.nombre}?`)) {
      eliminarProveedor(proveedor.id);
      toast({
        title: "Proveedor eliminado",
        description: "Proveedor eliminado del sistema",
      });
    }
  };

  const resetFormProveedor = () => {
    setFormProveedor({
      nombre: "",
      nit: "",
      tipo: "materiales",
      telefono: "",
      email: "",
      direccion: "",
      ciudad: "",
      calificacion: 0,
      contactoPrincipal: "",
    });
    setEditingProveedor(null);
  };

  const calcularEstrellas = (calificacion: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < calificacion ? "text-yellow-400" : "text-gray-300"}`} 
      />
    ));
  };

  const handlePrintClientes = () => {
    const printContent = `
      <html>
        <head>
          <title>Reporte de Clientes - Constructora CSR SAS</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>Clientes</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Ciudad</th>
                <th>Departamento</th>
                <th>Contacto</th>
              </tr>
            </thead>
            <tbody>
              ${clientesFiltrados.map(c => `
                <tr>
                  <td>${c.nombre}</td>
                  <td>${c.tipoDocumento} ${c.numeroDocumento}</td>
                  <td>${c.telefono}</td>
                  <td>${c.email}</td>
                  <td>${c.ciudad}</td>
                  <td>${c.departamento}</td>
                  <td>${c.contactoPrincipal}</td>
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

  const handlePrintProveedores = () => {
    const printContent = `
      <html>
        <head>
          <title>Reporte de Proveedores - Constructora CSR SAS</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>Proveedores</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>NIT</th>
                <th>Tipo</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Ciudad</th>
                <th>Calificación</th>
                <th>Contacto</th>
              </tr>
            </thead>
            <tbody>
              ${proveedoresFiltrados.map(p => `
                <tr>
                  <td>${p.nombre}</td>
                  <td>${p.nit}</td>
                  <td>${p.tipo}</td>
                  <td>${p.telefono}</td>
                  <td>${p.email}</td>
                  <td>${p.ciudad}</td>
                  <td>${p.calificacion} / 5</td>
                  <td>${p.contactoPrincipal}</td>
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
        <h1 className="text-3xl font-bold text-gray-900">Clientes y Proveedores</h1>
        <p className="text-gray-600 mb-4">Gestiona la base de datos de clientes y proveedores</p>
        
        <Tabs defaultValue="clientes" className="w-full">
          <TabsList>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          </TabsList>

          {/* Clientes */}
          <TabsContent value="clientes">
            <Card>
              <CardHeader className="flex justify-between">
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTermCliente}
                  onChange={(e) => setSearchTermCliente(e.target.value)}
                  className="max-w-sm"
                />
                <Dialog open={isDialogOpenCliente} onOpenChange={setIsDialogOpenCliente}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Nuevo Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingCliente ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
                      <DialogDescription>
                        {editingCliente 
                          ? "Modifica los datos del cliente" 
                          : "Completa la información del nuevo cliente"
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitCliente} className="space-y-4">
                      {/* Campos Clientes */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Nombre *</label>
                          <Input
                            value={formCliente.nombre}
                            onChange={(e) => setFormCliente({...formCliente, nombre: e.target.value})}
                            placeholder="Nombre cliente"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Tipo Documento</label>
                          <Select 
                            value={formCliente.tipoDocumento} 
                            onValueChange={(value: any) => setFormCliente({...formCliente, tipoDocumento: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cedula">Cédula de Ciudadanía</SelectItem>
                              <SelectItem value="nit">NIT</SelectItem>
                              <SelectItem value="cedula_extranjeria">Cédula de Extranjería</SelectItem>
                              <SelectItem value="pasaporte">Pasaporte</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Número Documento *</label>
                          <Input
                            value={formCliente.numeroDocumento}
                            onChange={(e) => setFormCliente({...formCliente, numeroDocumento: e.target.value})}
                            placeholder="Número documento"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Teléfono</label>
                          <Input
                            value={formCliente.telefono}
                            onChange={(e) => setFormCliente({...formCliente, telefono: e.target.value})}
                            placeholder="Teléfono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            type="email"
                            value={formCliente.email}
                            onChange={(e) => setFormCliente({...formCliente, email: e.target.value})}
                            placeholder="Email"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Ciudad</label>
                          <Input
                            value={formCliente.ciudad}
                            onChange={(e) => setFormCliente({...formCliente, ciudad: e.target.value})}
                            placeholder="Ciudad"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Departamento</label>
                          <Input
                            value={formCliente.departamento}
                            onChange={(e) => setFormCliente({...formCliente, departamento: e.target.value})}
                            placeholder="Departamento"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Contacto Principal</label>
                          <Input
                            value={formCliente.contactoPrincipal}
                            onChange={(e) => setFormCliente({...formCliente, contactoPrincipal: e.target.value})}
                            placeholder="Contacto principal"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpenCliente(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">{editingCliente ? "Actualizar" : "Guardar"}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ciudad</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesFiltrados.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nombre}</TableCell>
                        <TableCell>{cliente.tipoDocumento} {cliente.numeroDocumento}</TableCell>
                        <TableCell>{cliente.telefono}</TableCell>
                        <TableCell>{cliente.email}</TableCell>
                        <TableCell>{cliente.ciudad}</TableCell>
                        <TableCell>{cliente.departamento}</TableCell>
                        <TableCell>{cliente.contactoPrincipal}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditCliente(cliente)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteCliente(cliente)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROVEEDORES */}
          <TabsContent value="proveedores">
            <Card>
              <CardHeader className="flex justify-between">
                <Input
                  placeholder="Buscar proveedores..."
                  value={searchTermProveedor}
                  onChange={(e) => setSearchTermProveedor(e.target.value)}
                  className="max-w-sm"
                />
                <Dialog open={isDialogOpenProveedor} onOpenChange={setIsDialogOpenProveedor}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Nuevo Proveedor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
                      <DialogDescription>
                        {editingProveedor 
                          ? "Modifica los datos del proveedor" 
                          : "Completa la información del nuevo proveedor"
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitProveedor} className="space-y-4">
                      {/* Campos Proveedores */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Nombre *</label>
                          <Input
                            value={formProveedor.nombre}
                            onChange={(e) => setFormProveedor({...formProveedor, nombre: e.target.value})}
                            placeholder="Nombre proveedor"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">NIT *</label>
                          <Input
                            value={formProveedor.nit}
                            onChange={(e) => setFormProveedor({...formProveedor, nit: e.target.value})}
                            placeholder="NIT"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Tipo</label>
                          <Select 
                            value={formProveedor.tipo} 
                            onValueChange={(value: any) => setFormProveedor({...formProveedor, tipo: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="materiales">Materiales</SelectItem>
                              <SelectItem value="equipos">Equipos</SelectItem>
                              <SelectItem value="servicios">Servicios</SelectItem>
                              <SelectItem value="transporte">Transporte</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Teléfono</label>
                          <Input
                            value={formProveedor.telefono}
                            onChange={(e) => setFormProveedor({...formProveedor, telefono: e.target.value})}
                            placeholder="Teléfono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            type="email"
                            value={formProveedor.email}
                            onChange={(e) => setFormProveedor({...formProveedor, email: e.target.value})}
                            placeholder="Email"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Ciudad</label>
                          <Input
                            value={formProveedor.ciudad}
                            onChange={(e) => setFormProveedor({...formProveedor, ciudad: e.target.value})}
                            placeholder="Ciudad"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Calificación</label>
                          <Select 
                            value={formProveedor.calificacion.toString()} 
                            onValueChange={(value) => setFormProveedor({...formProveedor, calificacion: parseInt(value)})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[0,1,2,3,4,5].map(num => (
                                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Contacto Principal</label>
                          <Input
                            value={formProveedor.contactoPrincipal}
                            onChange={(e) => setFormProveedor({...formProveedor, contactoPrincipal: e.target.value})}
                            placeholder="Contacto principal"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpenProveedor(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">{editingProveedor ? "Actualizar" : "Guardar"}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>NIT</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ciudad</TableHead>
                      <TableHead>Calificación</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proveedoresFiltrados.map((proveedor) => (
                      <TableRow key={proveedor.id}>
                        <TableCell className="font-medium">{proveedor.nombre}</TableCell>
                        <TableCell>{proveedor.nit}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{proveedor.tipo}</Badge>
                        </TableCell>
                        <TableCell>{proveedor.telefono}</TableCell>
                        <TableCell>{proveedor.email}</TableCell>
                        <TableCell>{proveedor.ciudad}</TableCell>
                        <TableCell>{calcularEstrellas(proveedor.calificacion)}</TableCell>
                        <TableCell>{proveedor.contactoPrincipal}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditProveedor(proveedor)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteProveedor(proveedor)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClientesProveedores;
