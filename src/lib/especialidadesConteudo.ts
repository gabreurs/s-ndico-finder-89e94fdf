// Conteúdo editorial por especialidade Q1S — usado em /especialidades/:slug.
// Cada entrada é dissociada das demais: cenário, problemas, necessidades,
// competências, repertórios, como o Q1S procura e o texto de ponte para o diagnóstico.

export interface EspecialidadeConteudo {
  cenario: string;
  problemasTipicos: string[];
  necessidades: string[];
  competencias: string[];
  repertorios: string[];
  comoQ1SProcura: string;
  diagnostico: string;
}

export const ESPECIALIDADES_CONTEUDO: Record<string, EspecialidadeConteudo> = {
  "alto-padrao": {
    cenario:
      "Condomínios de alto padrão combinam serviço impecável, discrição e um conselho exigente e presente. O síndico convive com moradores de agenda cheia, fornecedores premium e um padrão de exigência que não perdoa improviso.",
    problemasTipicos: [
      "Expectativa de atendimento hoteleiro no dia a dia da portaria e da equipe",
      "Conselho atuante que acompanha de perto cada decisão",
      "Fornecedores de nicho, contratos complexos e pouca margem para erro",
      "Necessidade de discrição sobre a vida dos condôminos",
    ],
    necessidades: [
      "Postura executiva e comunicação refinada",
      "Gestão de equipe treinada para padrão elevado",
      "Relacionamento maduro e transparente com o conselho",
    ],
    competencias: [
      "Vivência prévia em condomínios de alto padrão",
      "Gestão de fornecedores especializados",
      "Comunicação formal e discrição comprovada",
    ],
    repertorios: [
      "Já geriu condomínio com concierge ou hotelaria condominial",
      "Histórico de relação estável com conselhos exigentes",
      "Experiência com padrões de segurança e privacidade elevados",
    ],
    comoQ1SProcura:
      "Priorizamos síndicos com passagem comprovada por empreendimentos de alto padrão, checando referências diretamente com conselhos anteriores e avaliando postura em entrevista estruturada.",
    diagnostico:
      "No diagnóstico, perguntas sobre padrão de acabamento, nível de exigência do conselho e serviços de portaria ajudam a confirmar se este é o perfil necessário para o seu condomínio.",
  },
  "condominio-clube": {
    cenario:
      "Condomínios clube têm áreas de lazer extensas — piscinas, quadras, espaço gourmet, academia — e uma equipe ampliada para operar tudo isso. A rotina do síndico se parece mais com gestão de um pequeno empreendimento de serviços.",
    problemasTipicos: [
      "Manutenção constante de equipamentos de lazer",
      "Escala de equipe grande e turnos variados",
      "Reservas de espaços e conflitos de uso entre moradores",
      "Custos operacionais elevados e sazonalidade de uso",
    ],
    necessidades: [
      "Gestão operacional de múltiplas frentes simultâneas",
      "Organização de equipe numerosa e terceirizados",
      "Controle de manutenção preventiva das áreas comuns",
    ],
    competencias: [
      "Experiência com operação de áreas de lazer complexas",
      "Gestão de equipe própria ou terceirizada em escala",
      "Rotina de manutenção preventiva estruturada",
    ],
    repertorios: [
      "Já administrou condomínio com múltiplas áreas de lazer",
      "Lidou com picos de uso e escala de equipe variável",
      "Histórico de contratos com fornecedores de manutenção especializada",
    ],
    comoQ1SProcura:
      "Buscamos profissionais que comprovem rotina de operação de lazer em escala, com referências sobre organização de equipe e manutenção preventiva.",
    diagnostico:
      "O diagnóstico identifica a extensão das áreas de lazer e o tamanho da equipe operacional para indicar se o perfil de condomínio clube se aplica ao seu caso.",
  },
  obras: {
    cenario:
      "Retrofit, reforma de fachada, impermeabilização ou substituição de sistemas prediais exigem um síndico que entenda de cronograma de obra, contrato técnico e fiscalização — não apenas de rotina administrativa.",
    problemasTipicos: [
      "Obras atrasadas ou fora do escopo contratado",
      "Falta de fiscalização técnica qualificada",
      "Divergência entre engenharia, construtora e conselho",
      "Impacto da obra na rotina dos moradores",
    ],
    necessidades: [
      "Leitura técnica de projetos e cronogramas",
      "Gestão de contratos com construtoras e engenharia",
      "Comunicação constante com moradores durante a obra",
    ],
    competencias: [
      "Condução de obras estruturais ou de retrofit",
      "Fiscalização técnica e gestão de contratos de engenharia",
      "Mediação entre construtora, conselho e assembleia",
    ],
    repertorios: [
      "Já liderou obra de fachada, estrutura ou sistemas prediais",
      "Trabalhou junto a engenheiros e arquitetos em obra ativa",
      "Histórico de entrega de obra dentro de prazo e orçamento",
    ],
    comoQ1SProcura:
      "Selecionamos síndicos com obras concluídas e verificáveis, cruzando referências com engenheiros, construtoras e conselhos que acompanharam a execução.",
    diagnostico:
      "Se o diagnóstico aponta obra em andamento ou planejada, o perfil técnico de obras entra como prioridade na shortlist.",
  },
  "perfil-financeiro": {
    cenario:
      "Condomínios com orçamento apertado, contratos a revisar e necessidade de previsibilidade de caixa precisam de um síndico com repertório financeiro sólido, não apenas de bom senso administrativo.",
    problemasTipicos: [
      "Despesas fora de controle ou contratos desatualizados",
      "Pouca previsibilidade de fluxo de caixa",
      "Falta de transparência na prestação de contas",
      "Renegociação de fornecedores necessária",
    ],
    necessidades: [
      "Controle orçamentário rigoroso",
      "Renegociação e revisão periódica de contratos",
      "Prestação de contas clara para o conselho e assembleia",
    ],
    competencias: [
      "Leitura de balancetes e planejamento orçamentário",
      "Negociação com fornecedores",
      "Comunicação financeira transparente",
    ],
    repertorios: [
      "Reduziu despesas fixas em condomínio anterior",
      "Conduziu renegociação de contratos relevantes",
      "Implantou rotina de prestação de contas mensal",
    ],
    comoQ1SProcura:
      "Avaliamos histórico de resultado financeiro declarado e pedimos evidências de renegociações e controle orçamentário em experiências anteriores.",
    diagnostico:
      "Perguntas sobre situação de caixa, contratos vigentes e nível de controle orçamentário no diagnóstico direcionam para este perfil quando aplicável.",
  },
  implantacao: {
    cenario:
      "Um condomínio recém-entregue não tem histórico, regras consolidadas nem equipe formada. O síndico de implantação estrutura tudo do zero: convenção, regimento, equipe, fornecedores e primeira rotina de gestão.",
    problemasTipicos: [
      "Ausência de regras e convenção ainda não amadurecida",
      "Equipe e fornecedores a serem contratados",
      "Pendências da construtora e entrega de obra",
      "Moradores sem cultura condominial formada",
    ],
    necessidades: [
      "Capacidade de estruturar processos do zero",
      "Negociação de pendências com a construtora",
      "Formação da primeira equipe e cultura condominial",
    ],
    competencias: [
      "Experiência em abertura ou primeira gestão de condomínio novo",
      "Elaboração de regimento interno e primeiras políticas",
      "Relação direta com incorporadora/construtora",
    ],
    repertorios: [
      "Já assumiu condomínio na entrega das chaves",
      "Estruturou convenção, regimento e equipe inicial",
      "Negociou pendências técnicas com construtora",
    ],
    comoQ1SProcura:
      "Priorizamos profissionais com casos concretos de implantação, verificando com moradores fundadores e construtoras o que foi entregue.",
    diagnostico:
      "Se o condomínio está em fase de entrega ou primeiros meses de operação, o diagnóstico direciona para este perfil de implantação.",
  },
  "recuperacao-financeira": {
    cenario:
      "Caixa negativo, inadimplência alta e dívidas acumuladas pedem um síndico habituado a cenários de crise, capaz de negociar, cortar custos com critério e recompor a confiança do condomínio.",
    problemasTipicos: [
      "Caixa negativo ou reservas zeradas",
      "Inadimplência acima da média",
      "Dívidas com fornecedores ou ações judiciais",
      "Desconfiança de moradores sobre a gestão anterior",
    ],
    necessidades: [
      "Plano de recuperação de caixa realista",
      "Estratégia de cobrança e redução de inadimplência",
      "Renegociação de dívidas com fornecedores",
    ],
    competencias: [
      "Gestão de crise financeira comprovada",
      "Negociação de dívidas e planos de pagamento",
      "Comunicação de plano de recuperação à assembleia",
    ],
    repertorios: [
      "Assumiu condomínio com caixa negativo e o equilibrou",
      "Reduziu inadimplência em percentual verificável",
      "Renegociou dívidas com fornecedores ou prestadores",
    ],
    comoQ1SProcura:
      "Buscamos evidências concretas de recuperação financeira anterior, com números declarados e confirmados via referências do conselho.",
    diagnostico:
      "Se o diagnóstico revela caixa negativo ou inadimplência elevada, este perfil é priorizado na shortlist de candidatos.",
  },
  "gestao-de-conflitos": {
    cenario:
      "Assembleias tensas, grupos de moradores divididos e desgaste com o conselho pedem um síndico com repertório de mediação, paciência e comunicação institucional — não apenas competência técnica.",
    problemasTipicos: [
      "Assembleias marcadas por embates e baixa produtividade",
      "Grupos de moradores em disputa constante",
      "Desgaste na relação entre síndico e conselho",
      "Processos de mediação ou disputas judiciais internas",
    ],
    necessidades: [
      "Condução de assembleias com neutralidade e método",
      "Escuta ativa e mediação entre grupos divergentes",
      "Reconstrução de confiança com o conselho",
    ],
    competencias: [
      "Mediação de conflitos condominiais",
      "Comunicação institucional e neutra",
      "Condução de assembleias tensas com resultado",
    ],
    repertorios: [
      "Mediou conflito relevante entre grupos de condôminos",
      "Conduziu assembleias historicamente conturbadas com sucesso",
      "Restabeleceu relação de confiança com conselho após crise",
    ],
    comoQ1SProcura:
      "Verificamos com referências como o profissional se comportou em situações de tensão real, priorizando histórico de mediação bem-sucedida.",
    diagnostico:
      "Quando o diagnóstico aponta conflitos entre condôminos ou desgaste com o conselho, este perfil de mediação ganha peso na recomendação.",
  },
  "condominios-comerciais": {
    cenario:
      "Lajes corporativas, salas comerciais e centros empresariais têm lógica própria: horário comercial, exigências de segurança patrimonial e locatários com necessidades distintas dos condôminos residenciais.",
    problemasTipicos: [
      "Rotatividade de locatários e inquilinos",
      "Exigências específicas de segurança patrimonial",
      "Convivência entre proprietários e locatários",
      "Operação em horário comercial estendido",
    ],
    necessidades: [
      "Gestão orientada a locatários e proprietários simultaneamente",
      "Controle de acesso e segurança patrimonial robusta",
      "Relação profissional com administradoras de imóveis",
    ],
    competencias: [
      "Experiência em condomínios comerciais ou mistos",
      "Gestão de segurança patrimonial em escala",
      "Relacionamento com locatários corporativos",
    ],
    repertorios: [
      "Já geriu laje corporativa ou centro empresarial",
      "Lidou com rotatividade de inquilinos comerciais",
      "Implantou controle de acesso robusto",
    ],
    comoQ1SProcura:
      "Damos peso a experiências específicas em ambiente comercial, validando com administradoras e locatários anteriores.",
    diagnostico:
      "Se o condomínio é comercial ou misto, o diagnóstico direciona a busca para profissionais com esse repertório específico.",
  },
  "grandes-condominios": {
    cenario:
      "Empreendimentos com centenas de unidades e múltiplas torres exigem escala de gestão: equipe numerosa, processos padronizados e capacidade de liderar times maiores sem perder controle.",
    problemasTipicos: [
      "Coordenação de múltiplas torres e equipes",
      "Processos administrativos sujeitos a gargalos de escala",
      "Comunicação massificada com muitos moradores",
      "Complexidade de contratos e fornecedores em volume",
    ],
    necessidades: [
      "Liderança de equipe grande e hierarquizada",
      "Processos padronizados e escaláveis",
      "Comunicação eficiente em massa com moradores",
    ],
    competencias: [
      "Gestão de condomínios de grande porte",
      "Liderança de equipes numerosas",
      "Padronização de processos administrativos",
    ],
    repertorios: [
      "Já administrou condomínio com mais de 300 unidades",
      "Liderou equipe própria com múltiplos níveis hierárquicos",
      "Implantou processos padronizados em grande escala",
    ],
    comoQ1SProcura:
      "Priorizamos candidatos com passagem comprovada por grandes empreendimentos, avaliando capacidade de liderança em escala via referências.",
    diagnostico:
      "Quando o diagnóstico indica grande número de unidades ou múltiplas torres, este perfil de escala é priorizado.",
  },
  "condominios-pequenos": {
    cenario:
      "Condomínios pequenos pedem objetividade: estrutura enxuta, poucos funcionários e controle de custo rigoroso, com um síndico presente e prático no dia a dia.",
    problemasTipicos: [
      "Orçamento reduzido para manutenção e serviços",
      "Poucos funcionários ou nenhum funcionário próprio",
      "Dependência de terceirizados para tarefas básicas",
      "Baixa margem para erros de gestão",
    ],
    necessidades: [
      "Controle de custo rigoroso e prático",
      "Gestão direta, sem camadas intermediárias",
      "Relacionamento próximo com poucos condôminos",
    ],
    competencias: [
      "Gestão enxuta e objetiva",
      "Controle de custos em orçamento reduzido",
      "Proximidade com moradores no dia a dia",
    ],
    repertorios: [
      "Já geriu condomínio de pequeno porte com resultado",
      "Reduziu custo operacional mantendo qualidade",
      "Manteve relação próxima e direta com condôminos",
    ],
    comoQ1SProcura:
      "Buscamos síndicos que comprovem resultado em estrutura enxuta, com referências sobre controle de custo e presença constante.",
    diagnostico:
      "O diagnóstico identifica porte reduzido e orçamento ajustado, direcionando a busca para este perfil objetivo.",
  },
  associacoes: {
    cenario:
      "Loteamentos e associações de moradores têm regime jurídico próprio, ruas internas e infraestrutura urbana a manter, além de decisões coletivas que exigem organização jurídica cuidadosa.",
    problemasTipicos: [
      "Regularização jurídica da associação",
      "Manutenção de vias, iluminação e infraestrutura interna",
      "Cobrança de taxas em regime associativo",
      "Decisões coletivas sujeitas a questionamento jurídico",
    ],
    necessidades: [
      "Conhecimento do regime jurídico de associações",
      "Gestão de infraestrutura urbana interna",
      "Organização de assembleias e decisões coletivas formais",
    ],
    competencias: [
      "Experiência em associações de moradores ou loteamentos",
      "Regularização jurídica e documental",
      "Gestão de infraestrutura viária e urbana",
    ],
    repertorios: [
      "Já geriu associação de moradores ou loteamento fechado",
      "Conduziu regularização jurídica de associação",
      "Administrou manutenção de vias e infraestrutura interna",
    ],
    comoQ1SProcura:
      "Priorizamos profissionais com repertório jurídico específico de associações, validado com moradores e advogados envolvidos.",
    diagnostico:
      "Se o empreendimento é um loteamento ou associação, o diagnóstico aponta para este perfil com repertório jurídico próprio.",
  },
  "perfil-operacional": {
    cenario:
      "Condomínios com equipe própria e rotina intensa de manutenção precisam de um síndico presente fisicamente, atento à operação diária de portaria, limpeza, manutenção e equipe.",
    problemasTipicos: [
      "Equipe própria com escalas e turnos a gerenciar",
      "Manutenção predial recorrente e preventiva",
      "Rotina operacional intensa no dia a dia",
      "Necessidade de presença constante no condomínio",
    ],
    necessidades: [
      "Presença física e disponibilidade constante",
      "Gestão de equipe própria no cotidiano",
      "Rotina de manutenção preventiva bem definida",
    ],
    competencias: [
      "Gestão operacional do dia a dia",
      "Liderança direta de equipe própria",
      "Organização de manutenção preventiva",
    ],
    repertorios: [
      "Já liderou equipe própria de portaria, limpeza e manutenção",
      "Implantou rotina de manutenção preventiva eficaz",
      "Mantém presença ativa e constante no condomínio",
    ],
    comoQ1SProcura:
      "Avaliamos rotina declarada de presença e gestão de equipe, confirmando com referências a consistência operacional do candidato.",
    diagnostico:
      "Quando o diagnóstico aponta equipe própria numerosa e necessidade de presença constante, este perfil operacional é priorizado.",
  },
};

export const especialidadeConteudoPorSlug = (slug: string) => ESPECIALIDADES_CONTEUDO[slug];
