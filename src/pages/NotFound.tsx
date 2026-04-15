import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-6"
      >
        <p className="text-[80px] text-white/[0.04] leading-none mb-[-20px]" style={{ fontWeight: 200 }}>404</p>
        <h1 className="text-xl text-white/80 mb-2" style={{ fontWeight: 380 }}>Página não encontrada</h1>
        <p className="text-[13px] text-white/30 mb-6" style={{ fontWeight: 350 }}>O endereço que você buscou não existe ou foi movido.</p>
        <Button asChild className="rounded-full px-6 h-10 text-[13px]" style={{ fontWeight: 420 }}>
          <Link to="/">Voltar ao início</Link>
        </Button>
      </motion.div>
    </div>
  );
}
