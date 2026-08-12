import { Suspense, lazy, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IntroAnimation } from "@/components/IntroAnimation";
import { ScrollBlur } from "@/components/ScrollBlur";
import Index from "./pages/Index";
const Sindicos = lazy(() => import("./pages/Sindicos"));
const SindicoPerfil = lazy(() => import("./pages/SindicoPerfil"));
const Cadastro = lazy(() => import("./pages/Cadastro"));
const Diagnostico = lazy(() => import("./pages/Diagnostico"));
const Solucoes = lazy(() => import("./pages/Solucoes"));
const SolucaoMatch = lazy(() => import("./pages/SolucaoMatch"));
const SolucaoExecutiveSearch = lazy(() => import("./pages/SolucaoExecutiveSearch"));
const SolucaoCheck = lazy(() => import("./pages/SolucaoCheck"));
const SolucaoReferencias = lazy(() => import("./pages/SolucaoReferencias"));
const ComoFunciona = lazy(() => import("./pages/ComoFunciona"));
const QuemSomos = lazy(() => import("./pages/QuemSomos"));
const Admin = lazy(() => import("./pages/Admin"));
const MeuPerfil = lazy(() => import("./pages/MeuPerfil"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Conteudo = lazy(() => import("./pages/Conteudo"));
const ConteudoArtigo = lazy(() => import("./pages/ConteudoArtigo"));
const SouSindico = lazy(() => import("./pages/SouSindico"));
const Especialidade = lazy(() => import("./pages/Especialidade"));
const Especialidades = lazy(() => import("./pages/Especialidades"));
const NotFound = lazy(() => import("./pages/NotFound"));
import { ScrollToTop } from "@/components/ScrollToTop";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

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
            <SmoothScroll />
            <Suspense fallback={<div className="min-h-screen bg-background" aria-hidden="true" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sindicos" element={<Sindicos />} />
              <Route path="/sindico/:slug" element={<SindicoPerfil />} />
              <Route path="/cadastro" element={<Cadastro />} />
               <Route path="/diagnostico" element={<Diagnostico />} />
               <Route path="/solucoes" element={<Solucoes />} />
               <Route path="/solucoes/match" element={<SolucaoMatch />} />
               <Route path="/solucoes/executive-search" element={<SolucaoExecutiveSearch />} />
               <Route path="/solucoes/check" element={<SolucaoCheck />} />
               <Route path="/solucoes/referencias" element={<SolucaoReferencias />} />
               <Route path="/como-funciona" element={<ComoFunciona />} />
              <Route path="/quem-somos" element={<QuemSomos />} />
              <Route path="/sou-sindico" element={<SouSindico />} />
              <Route path="/especialidades" element={<Especialidades />} />
              <Route path="/especialidades/:slug" element={<Especialidade />} />
              <Route path="/conteudo" element={<Conteudo />} />
              <Route path="/conteudo/:slug" element={<ConteudoArtigo />} />
              <Route path="/meu-perfil" element={<MeuPerfil />} />

              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
