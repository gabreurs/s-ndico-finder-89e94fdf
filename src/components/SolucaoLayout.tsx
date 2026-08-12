import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { buildRafaelWhatsAppUrl } from "@/lib/whatsapp";
import type { ReactNode } from "react";
import { Seo } from "@/components/Seo";

interface SolucaoLayoutProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  cta: { label: string; href: string; whatsapp?: boolean };
  /** Segunda intenção da página — precisa ser diferente do CTA principal. */
  secondaryCta?: { label: string; href: string };
  /** Mensagem pré-preenchida do WhatsApp, para dar contexto do serviço solicitado. */
  whatsappMessage?: string;
  /** Texto do botão de WhatsApp da barra lateral (dúvida, não contratação). */
  ajudaLabel?: string;
  children?: ReactNode;
  /** SEO da página da solução. */
  seo: { title: string; description: string; path: string };
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export function SolucaoLayout({ icon, title, subtitle, description, benefits, cta, secondaryCta, whatsappMessage, ajudaLabel, children, seo }: SolucaoLayoutProps) {
  const secundario = secondaryCta ?? { label: "Fazer diagnóstico", href: "/diagnostico" };
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo title={seo.title} description={seo.description} path={seo.path} />
      <Header />

      <section className="relative gradient-mesh overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="absolute top-[10%] right-[8%] w-[360px] h-[360px] rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-[15%] w-[280px] h-[280px] rounded-full bg-accent/[0.04] blur-[100px]" />

        <div className="container relative">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={fadeUp} className="text-primary/60 mb-4">{icon}</motion.div>
            <motion.p variants={fadeUp} custom={1} className="text-[11px] text-white/25 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>
              {subtitle}
            </motion.p>
            <motion.h1 variants={fadeUp} custom={2} className="text-3xl md:text-4xl lg:text-5xl text-white/95 leading-[1.08] tracking-[-0.02em] mb-6" style={{ fontWeight: 350 }}>
              {title}
            </motion.h1>
            <motion.p variants={fadeUp} custom={3} className="text-white/35 text-base md:text-lg leading-relaxed max-w-2xl mb-8" style={{ fontWeight: 390 }}>
              {description}
            </motion.p>

            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-3">
              {cta.whatsapp ? (
                <Button asChild size="lg" className="rounded-full px-7 h-12 text-[13px] gap-2 bg-[hsl(var(--green-whatsapp))] hover:bg-[hsl(var(--green-whatsapp))]/90 text-white" style={{ fontWeight: 450 }}>
                  <a href={buildRafaelWhatsAppUrl(whatsappMessage)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={16} />
                    {cta.label}
                  </a>
                </Button>
              ) : (
                <Button asChild size="lg" className="rounded-full px-7 h-12 text-[13px] gap-2" style={{ fontWeight: 450 }}>
                  <Link to={cta.href}>
                    {cta.label}
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="rounded-full px-6 h-12 text-[13px] border-white/10 text-white/60 hover:text-white hover:border-white/20 bg-transparent" style={{ fontWeight: 430 }}>
                <Link to={secundario.href}>{secundario.label}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              {children}
            </div>
            <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
              <div className="rounded-xl border border-border/30 bg-card/60 p-6">
                <h3 className="text-[13px] text-foreground mb-4" style={{ fontWeight: 460 }}>O que está incluído</h3>
                <ul className="space-y-3">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground" style={{ fontWeight: 400 }}>
                      <span className="mt-1 w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border/30 bg-muted/30 p-6">
                <h3 className="text-[13px] text-foreground mb-2" style={{ fontWeight: 460 }}>Precisa de ajuda?</h3>
                <p className="text-[12px] text-muted-foreground mb-4" style={{ fontWeight: 400 }}>
                  Fale com Rafael Bernardes para entender qual serviço faz sentido para o seu condomínio.
                </p>
                <Button asChild variant="outline" className="w-full rounded-full h-10 text-[12px] gap-1.5 border-[hsl(var(--green-whatsapp))]/30 text-[hsl(var(--green-whatsapp))] hover:bg-[hsl(var(--green-whatsapp))]/10" style={{ fontWeight: 430 }}>
                  <a
                    href={buildRafaelWhatsAppUrl(`Olá, Rafael. Tenho uma dúvida sobre o ${title} e quero entender se é o serviço certo para o meu condomínio.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={14} />
                    {ajudaLabel ?? "Tirar dúvida no WhatsApp"}
                  </a>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
