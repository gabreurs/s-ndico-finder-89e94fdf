import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IntroAnimation } from "@/components/IntroAnimation";
import { ScrollBlur } from "@/components/ScrollBlur";
import Index from "./pages/Index";
import Sindicos from "./pages/Sindicos";
import SindicoPerfil from "./pages/SindicoPerfil";
import Cadastro from "./pages/Cadastro";
import ComoFunciona from "./pages/ComoFunciona";
import QuemSomos from "./pages/QuemSomos";
import Admin from "./pages/Admin";
import MeuPerfil from "./pages/MeuPerfil";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { ScrollToTop } from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return false;

    try {
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const isReload = navEntry?.type === "reload";
      return isReload || !window.sessionStorage.getItem("intro_seen");
    } catch {
      return false;
    }
  });

  const handleIntroComplete = () => {
    try {
      window.sessionStorage.setItem("intro_seen", "1");
    } catch {
      // no-op
    }
    setShowIntro(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
        {!showIntro && <ScrollBlur />}
         <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sindicos" element={<Sindicos />} />
              <Route path="/sindico/:slug" element={<SindicoPerfil />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/como-funciona" element={<ComoFunciona />} />
              <Route path="/quem-somos" element={<QuemSomos />} />
              <Route path="/meu-perfil" element={<MeuPerfil />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
