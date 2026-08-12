import { useEffect, useRef } from "react";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";
import { Reveal } from "@/components/motion/Reveal";
import { ClipboardList, Search, Filter, Users, BarChart3, Phone, FileCheck, Handshake, Rocket } from "lucide-react";

const PASSOS = [
  {
    num: "01",
    icon: <ClipboardList size={18} />,
    title: "Briefing do condomínio",
    desc: "Entendemos o perfil do empreendimento, desafios e expectativas do conselho.",
  },
  {
    num: "02",
    icon: <Search size={18} />,
    title: "Mapeamento da base",
    desc: "Cruzamos cidade, região, porte, especialidades e dimensões do diagnóstico.",
  },
  {
    num: "03",
    icon: <Filter size={18} />,
    title: "Triagem curada",
    desc: "Avaliamos aderência real: só apresentamos profissionais com dados que sustentam o match.",
  },
  {
    num: "04",
    icon: <Users size={18} />,
    title: "Shortlist de perfis",
    desc: "Entregamos de 3 a 6 candidatos pré-qualificados, com motivos objetivos de aderência.",
  },
  {
    num: "05",
    icon: <BarChart3 size={18} />,
    title: "Validação de referências",
    desc: "Conferimos histórico, formação e portfólio compatível com a vaga.",
  },
  {
    num: "06",
    icon: <Phone size={18} />,
    title: "Entrevista de alinhamento",
    desc: "Conversamos com o condomínio e os candidatos para garantir fit cultural e técnico.",
  },
  {
    num: "07",
    icon: <FileCheck size={18} />,
    title: "Proposta e contrato",
    desc: "Apoiamos na estrutura de remuneração, escopo e formalização da relação.",
  },
  {
    num: "08",
    icon: <Handshake size={18} />,
    title: "Onboarding do síndico",
    desc: "Acompanhamento inicial para acelerar a integração e primeiras entregas.",
  },
  {
    num: "09",
    icon: <Rocket size={18} />,
    title: "Acompanhamento contínuo",
    desc: "Check-ins periódicos para garantir que a gestão evolua com excelência.",
  },
];

export function Q1SProcesso() {
  const gridRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = ensureGsap();
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-passo]");

      // Cards enter in a controlled editorial stagger.
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.05,
          scrollTrigger: { trigger: grid, start: "top 85%", once: true },
        }
      );

      const mm = gsap.matchMedia();

      // Desktop only: a progress line fills and the active step gains emphasis.
      mm.add("(min-width: 768px)", () => {
        const line = lineRef.current;
        const tweens: gsap.core.Tween[] = [];

        if (line) {
          tweens.push(
            gsap.fromTo(
              line,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "none",
                scrollTrigger: { trigger: grid, start: "top 70%", end: "bottom 70%", scrub: 0.4 },
              }
            )
          );
        }

        const triggers = cards.map((card) =>
          ScrollTrigger.create({
            trigger: card,
            start: "top 72%",
            end: "bottom 40%",
            // Class toggle keeps theming in CSS (design tokens stay the source of truth).
            toggleClass: { targets: card, className: "passo-ativo" },
          })
        );

        return () => {
          tweens.forEach((t) => t.kill());
          triggers.forEach((t) => t.kill());
        };
      });

      return () => mm.revert();
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full ambient-glow" />

      <div className="container relative">
        <Reveal stagger className="max-w-2xl mb-16">
          <p className="text-[11px] text-primary/70 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>
            Metodologia Q1S
          </p>
          <h2 className="text-2xl md:text-3xl text-foreground tracking-[-0.02em] mb-4" style={{ fontWeight: 350 }}>
            Headhunter de síndicos: do briefing à entrega
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontWeight: 400 }}>
            Não somos um diretório. Aplicamos uma metodologia de recrutamento e seleção para encontrar o síndico certo para cada condomínio.
          </p>
        </Reveal>

        <div className="relative">
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-border/25 -ml-6" aria-hidden="true">
            <div ref={lineRef} className="w-full h-full origin-top bg-primary/50 will-change-transform" style={{ transform: "scaleY(0)" }} />
          </div>

          <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PASSOS.map((passo) => (
            <div
              key={passo.num}
              data-passo
              className="group relative rounded-xl border border-border/30 bg-card/50 p-5 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-[3px] hover:border-primary/30 hover:bg-card/80"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-primary/60 group-hover:text-primary/80 transition-colors">
                  {passo.icon}
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground/50 mb-1" style={{ fontWeight: 500 }}>{passo.num}</p>
                  <h3 className="text-[13px] text-foreground mb-1.5" style={{ fontWeight: 460 }}>{passo.title}</h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>{passo.desc}</p>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
