interface Explanation {
  title: string;
  content: string;
}

export const explanations: Record<string, Explanation> = {
  KPI_TOTAL_ESCOLAS: {
    title: 'Total de Escolas',
    content: `Este card mostra o **número total de escolas públicas ativas na Paraíba**.  
Ele oferece uma visão geral da quantidade de escolas no estado, independentemente do risco ou tamanho.`,
  },
  KPI_ESCOLAS_ALTO_RISCO: {
    title: 'Escolas em Alto Risco',
    content: `Este card mostra o número de escolas cujo **Score de Risco de Infraestrutura** é **maior ou igual a 0.75**.  
O score considera fatores como precariedade da estrutura física, falta de equipamentos básicos e segurança.  
Essas escolas podem necessitar de intervenções urgentes.`,
  },
  KPI_MUNICIPIO_MAIOR_RISCO: {
    title: 'Município com Maior Vulnerabilidade',
    content: `Indica o **município com a maior média de risco de infraestrutura** entre suas escolas.  
Ajuda a identificar regiões que podem necessitar de ações emergenciais de manutenção ou reforma.`,
  },
  KPI_MUNICIPIO_OPORTUNIDADE: {
    title: 'Município de Oportunidade',
    content: `Mostra o **município com maior oportunidade de melhoria**, baseado no **INSE (Índice de Necessidade Socioeconômica)**.  
Mesmo que as escolas tenham risco baixo, o município pode ter maiores necessidades sociais e de investimento.`,
  },
  CHART_MAP_RISK: {
    title: 'Mapa de Riscos das Escolas',
    content: `Este mapa exibe todas as escolas da Paraíba com cores que representam seu **nível de risco de infraestrutura**:  
- **Laranja claro:** baixo Risco  
- **Laranja:** risco moderado
- **Laranja acentuado:** alto risco
- **Laranja escuro:** alerta máximo

Permite identificar rapidamente áreas críticas e apoiar decisões de alocação de recursos.  
Clique em uma escola para ver detalhes específicos no painel lateral.`,
  },
  CHART_RISK_DISTRIBUTION: {
    title: 'Distribuição de Risco das Escolas',
    content: `Mostra como os níveis de risco estão distribuídos entre todas as escolas:  
- **Eixo X:** score de risco  
- **Eixo Y:** número de escolas  

Ajuda a entender quantas escolas estão em baixo, médio, alto ou crítico risco, permitindo análises estratégicas.`,
  },
  CHART_TOP_DEFICIENCIES: {
    title: 'Maiores Deficiências das Escolas de Alto Risco',
    content: `Este gráfico analisa **apenas escolas de alto risco** e identifica as carências mais comuns de infraestrutura, como:  
- Falta de biblioteca  
- Falta de laboratório  
- Banheiros inadequados  

**Exemplo:** Se "Falta de Biblioteca" aparece com 100 escolas, significa que 100 escolas de alto risco não possuem biblioteca.  
Isso auxilia no planejamento de melhorias específicas.`,
  },
  CHART_TOP_MUNICIPALITIES: {
    title: 'Top Municípios por Risco',
    content: `Mostra os municípios com **maior risco médio** considerando todas as escolas.  
Permite identificar localidades prioritárias para políticas de infraestrutura escolar.`,
  },
  HIGH_RISK_SCHOOLS_LIST: {
    title: 'Lista de Escolas de Alto Risco',
    content: `Exibe as **escolas com score de risco acima de 0.75**.  
Permite selecionar uma escola para ver detalhes no mapa e analisar problemas específicos de infraestrutura.  
A lista facilita ações direcionadas, priorizando escolas mais críticas.`,
  },
  RISK_LEGEND: {
    title: 'Legenda de Riscos',
    content: `Explica o significado das cores usadas no mapa e gráficos:  
- **Laranja claro:** baixo Risco  
- **Laranja:** risco moderado
- **Laranja acentuado:** alto risco
- **Laranja escuro:** alerta máximo

Ajuda a interpretar rapidamente o nível de risco de cada escola.`,
  },
  CHART_MUNICIPALITIES_BY_RISK_COUNT: {
    title: 'Onde o Risco se Concentra?',
    content: `Este gráfico mostra o **ranking dos 10 municípios** com a maior **quantidade absoluta** de escolas classificadas como de alto risco de infraestrutura. \n\nEle ajuda a responder a pergunta: "Se quisermos intervir onde o **volume** de problemas é maior, por onde devemos começar?"`,
  },
  SCHOOL_DETAILS_RISK_SCORE: {
    title: 'Score de Risco de Infraestrutura',
    content: `Este é um indicador de **0 a 1** que mede a vulnerabilidade da infraestrutura da escola.\n\nQuanto **mais próximo de 1**, maior a quantidade de carências (falta de biblioteca, saneamento, etc.) e maior o "risco" estrutural.`,
  },
  SCHOOL_DETAILS_CONTEXTUALIZED_SCORE: {
    title: 'Score de Risco Contextualizado',
    content: `Este score compara o risco de infraestrutura da escola com a **média de outras escolas em municípios com perfil socioeconômico semelhante**.\n\nEle ajuda a responder: "Esta escola está em uma situação pior ou melhor do que o esperado para a sua realidade?"`,
  },
  SCHOOL_DETAILS_STUDENT_COUNT: {
    title: 'Alunos Impactados',
    content: `Indica o **número total de alunos matriculados** nesta escola, de acordo com o Censo Escolar.\n\nEste dado é crucial para entender a escala do impacto de qualquer intervenção ou carência existente.`,
  },
  SCHOOL_DETAILS_INFRA_XRAY: {
    title: 'Raio-X da Infraestrutura',
    content: `Esta seção detalha os **principais indicadores de infraestrutura** da escola, baseados nos dados do Censo Escolar.\n\nCada item mostra se a escola possui (✔️) ou não possui (❌) o recurso, justificando o cálculo do Score de Risco.`,
  },
  MUNICIPALITY_ANALYSIS_OVERVIEW: {
    title: 'Visão Geral do Município',
    content: `Esta seção oferece uma análise rápida do município selecionado, destacando **indicadores chave** como:
- Composição das escolas por **localização** (urbanas vs. rurais)
- Composição das escolas por **dependência administrativa** (municipais vs. estaduais vs. federais)

Esses dados ajudam a entender o contexto geral do município e a planejar **intervenções mais eficazes**.`,
  },
};
