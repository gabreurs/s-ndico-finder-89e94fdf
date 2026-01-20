import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Patrocinadores() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-16 flex-1">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
            Patrocinadores
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Esta página está em construção. Em breve você poderá conhecer nossos patrocinadores e parceiros que apoiam o Quero 1 Síndico.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
