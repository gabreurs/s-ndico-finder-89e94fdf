import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: Route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-6xl text-primary mb-4" style={{ fontWeight: 300 }}>404</p>
        <h1 className="text-xl text-foreground mb-2 tracking-tight" style={{ fontWeight: 450 }}>Página não encontrada</h1>
        <p className="text-sm text-muted-foreground mb-6">A página que você procura não existe ou foi movida.</p>
        <Button asChild variant="outline" size="sm" className="rounded-full px-6 gap-1.5 border-border/30">
          <Link to="/">
            <ArrowLeft size={14} />
            Voltar ao início
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
