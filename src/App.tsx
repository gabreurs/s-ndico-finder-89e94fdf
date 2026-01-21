import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Sindicos from "./pages/Sindicos";
import SindicoPerfil from "./pages/SindicoPerfil";
import Cadastro from "./pages/Cadastro";
import ComoFunciona from "./pages/ComoFunciona";
import Patrocinadores from "./pages/Patrocinadores";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sindicos" element={<Sindicos />} />
          <Route path="/sindico/:id" element={<SindicoPerfil />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/patrocinadores" element={<Patrocinadores />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
