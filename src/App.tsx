import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Proyectos from "./pages/Proyectos";
import RecursosHumanos from "./pages/RecursosHumanos";
import Inventarios from "./pages/Inventarios";
import ClientesProveedores from "./pages/ClientesProveedores";
import ControlCalidad from "./pages/ControlCalidad";
import NotFound from "./pages/NotFound";

const App = () => (
  <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/recursos-humanos" element={<RecursosHumanos />} />
        <Route path="/inventarios" element={<Inventarios />} />
        <Route path="/clientes-proveedores" element={<ClientesProveedores />} />
        <Route path="/control-calidad" element={<ControlCalidad />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
