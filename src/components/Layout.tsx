import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Building2, 
  Users, 
  Package, 
  UserCheck, 
  ClipboardCheck, 
  BarChart3,
  Menu,
  Home
} from "lucide-react";

const navigation = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Proyectos", href: "/proyectos", icon: Building2 },
  { name: "Recursos Humanos", href: "/recursos-humanos", icon: Users },
  { name: "Inventarios", href: "/inventarios", icon: Package },
  { name: "Clientes y Proveedores", href: "/clientes-proveedores", icon: UserCheck },
  { name: "Control de Calidad", href: "/control-calidad", icon: ClipboardCheck },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-40 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Constructora CSR SAS
              </h2>
              <p className="text-sm text-gray-600">NIT: 900391928-0</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Constructora CSR SAS
            </h2>
            <p className="text-sm text-gray-600">NIT: 900391928-0</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
