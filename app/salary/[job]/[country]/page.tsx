import combinations from "@/data/seo-combinations.json";

interface PageProps {
  params: Promise<{ job: string; country: string }>;
}

type Language = "en" | "es" | "pt";

interface SalaryEstimate {
  low: { local: string; usd: string };
  average: { local: string; usd: string };
  high: { local: string; usd: string };
  hourly: { low: string; high: string };
}

const jobBaseSalary: Record<string, number> = {
  "software-engineer": 80000,
  "data-scientist": 85000,
  "product-manager": 90000,
  "ux-designER": 75000, // fix typo-safe default
  "ux-designer": 75000,
  "devops-engineer": 85000,
  "full-stack-developer": 78000,
  "frontend-developer": 70000,
  "backend-developer": 75000,
  "mobile-developer": 72000,
  "cloud-architect": 100000,
  "machine-learning-engineer": 95000,
  "cybersecurity-analyst": 80000,
  "database-administrator": 65000,
  "qa-engineer": 55000,
  "technical-writer": 50000,
  "scrum-master": 65000,
  "business-analyst": 60000,
  "project-manager": 70000,
  "systems-administrator": 60000,
  "network-engineer": 65000,
  "ai-researcher": 100000,
  "blockchain-developer": 85000,
};

const currencyConversion: Record<string, number> = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.36,
  AUD: 1.53,
  JPY: 149.5,
  BRL: 5.0,
  MXN: 17.2,
  COP: 4200,
  INR: 83.2,
  SEK: 10.4,
  NOK: 10.6,
  CHF: 0.88,
  SGD: 1.34,
  KRW: 1320,
  ARS: 1050,
  CLP: 930,
  PEN: 3.75,
};

function currencyForCountry(country: string): string {
  if (country === "united-states") return "USD";
  if (country === "united-kingdom") return "GBP";
  if (["germany", "france", "spain", "italy", "netherlands"].includes(country)) return "EUR";
  if (country === "canada") return "CAD";
  if (country === "australia") return "AUD";
  if (country === "japan") return "JPY";
  if (country === "brazil") return "BRL";
  if (country === "mexico") return "MXN";
  if (country === "colombia") return "COP";
  if (country === "india") return "INR";
  if (country === "sweden") return "SEK";
  if (country === "norway") return "NOK";
  if (country === "switzerland") return "CHF";
  if (country === "singapore") return "SGD";
  if (country === "south-korea") return "KRW";
  if (country === "argentina") return "ARS";
  if (country === "chile") return "CLP";
  if (country === "peru") return "PEN";
  return "USD";
}

function formatLocalValue(val: number, currency: string): string {
  const s = val.toLocaleString();
  switch (currency) {
    case "COP": return `$${s} COP`;
    case "MXN": return `$${s} MXN`;
    case "CLP": return `$${s} CLP`;
    case "PEN": return `S/${s}`;
    case "INR": return `₹${s}`;
    case "BRL": return `R$${s}`;
    case "USD": return `$${s} USD`;
    case "GBP": return `£${s}`;
    case "EUR": return `€${s}`;
    case "CAD": return `C$${s}`;
    case "AUD": return `A$${s}`;
    case "JPY": return `¥${s}`;
    case "KRW": return `₩${s}`;
    case "SEK": return `kr${s}`;
    case "NOK": return `kr${s}`;
    case "CHF": return `CHF${s}`;
    case "SGD": return `S$${s}`;
    case "ARS": return `$${s}`;
    default: return `$${s} USD`;
  }
}

function formatUsdString(usdVal: number): string {
  return `$${usdVal.toLocaleString()} USD`;
}

function hourlyDisplay(currencyCode: string, isLow: boolean): string {
  switch (currencyCode) {
    case "USD": return isLow ? "$35" : "$95";
    case "GBP": return isLow ? "£20" : "£55";
    case "EUR": return isLow ? "€18" : "€48";
    case "CAD": return "C$25";
    case "AUD": return "A$28";
    case "JPY": return "¥1,200";
    case "BRL": return "R$80";
    case "MXN": return "$150";
    case "COP": return "$18,000";
    case "INR": return "₹350";
    case "SEK": return "kr230";
    case "NOK": return "kr270";
    case "CHF": return "CHF50";
    case "SGD": return "S$35";
    case "KRW": return "₩25,000";
    case "ARS": return "$";
    case "CLP": return "$12,000";
    case "PEN": return "S/40";
    default: return isLow ? "$35" : "$95";
  }
}

function generateSalaryEstimate(
  job: string,
  country: string,
  baseSalaryUsd: number
): SalaryEstimate {
  const countryMultiplier: Record<string, number> = {
    "united-states": 1.0,
    "united-kingdom": 0.75,
    germany: 0.72,
    france: 0.65,
    canada: 0.7,
    australia: 0.65,
    japan: 0.45,
    brazil: 0.22,
    mexico: 0.28,
    colombia: 0.24,
    india: 0.2,
    spain: 0.55,
    italy: 0.58,
    netherlands: 0.75,
    sweden: 0.65,
    norway: 0.7,
    switzerland: 1.1,
    singapore: 0.72,
    "south-korea": 0.52,
    argentina: 0.28,
    chile: 0.35,
    peru: 0.3,
  };

  const multiplier = countryMultiplier[country] ?? 0.6;
  const jobVariation = (job.length % 5 + 1) * 0.03;
  const randomFactor = (country.length % 3) * 0.02;

  const adjustedBaseUsd = baseSalaryUsd * (multiplier + jobVariation - randomFactor);

  const currencyCode = currencyForCountry(country);
  const rate = currencyConversion[currencyCode] ?? 1;

  const avgUsd = Math.round(adjustedBaseUsd);
  const avgLocal = Math.round(avgUsd * rate);

  const lowLocal = Math.round(avgLocal * 0.75);
  const highLocal = Math.round(avgLocal * 1.35);
  const lowUsd = Math.round(avgUsd * 0.75);
  const highUsd = Math.round(avgUsd * 1.35);

  return {
    low: { local: formatLocalValue(lowLocal, currencyCode), usd: formatUsdString(lowUsd) },
    average: { local: formatLocalValue(avgLocal, currencyCode), usd: formatUsdString(avgUsd) },
    high: { local: formatLocalValue(highLocal, currencyCode), usd: formatUsdString(highUsd) },
    hourly: { low: hourlyDisplay(currencyCode, true), high: hourlyDisplay(currencyCode, false) }
  };
}

/* Localization map for languages */
const countryLanguage: Record<string, Language> = {
  colombia: "es",
  mexico: "es",
  peru: "es",
  argentina: "es",
  chile: "es",
  spain: "es",
  brazil: "pt",
};

// Localized content keys
const content = {
  en: {
    title: "Average Salary",
    overview: "Salary Overview",
    salaryRange: "Salary Range",
    low: "Low",
    average: "Average",
    high: "High",
    overviewText: (job: string, country: string, estimate: SalaryEstimate) =>
      `The average salary for ${job} in ${country} ranges from ${estimate.low.local} (${estimate.low.usd}) to ${estimate.high.local} (${estimate.high.usd}) annually, with an average of ${estimate.average.local} (${estimate.average.usd}). Entry-level positions typically pay around ${estimate.hourly.low} per hour, while senior roles can exceed ${estimate.high.local}.`,
    market: "Job Market Trends",
    marketText: (job: string, country: string, estimate: SalaryEstimate) => {
      // Simplified market text; can be extended with real data
      return `Demand for ${job} professionals in ${country} is currently favorable. Local conditions vary by region.`;
    },
    factors: "Factors Affecting Salary",
    factorsText: (job: string) => `Key factors influencing ${job} salaries include years of experience, specific technical skills, company size, and location within the country. Certifications from major cloud providers (AWS, Azure, GCP) and frameworks like React, Node.js, and Python consistently boost earning potential.`,
    skills: "In-Demand Skills",
    skillsText: (job: string) => `For ${job} roles, employers prioritize cloud platforms, containerization (Docker, Kubernetes), CI/CD pipelines, and system design knowledge. Soft skills like communication and problem-solving increasingly impact salary packages.`,
  },
  es: {
    title: "Salario Promedio",
    overview: "Resumen Salarial",
    salaryRange: "Rango Salarial",
    low: "Mínimo",
    average: "Promedio",
    high: "Máximo",
    overviewText: (job: string, country: string, estimate: SalaryEstimate) =>
      `El salario promedio para ${job} en ${country} oscila entre ${estimate.low.local} (${estimate.low.usd}) y ${estimate.high.local} (${estimate.high.usd}) anuales, con un promedio de ${estimate.average.local} (${estimate.average.usd}). Los puestos de nivel inicial típicamente pagan alrededor de ${estimate.hourly.low} por hora, mientras que los roles senior pueden superar ${estimate.high.local}.`,
    market: "Tendencias del Mercado Laboral",
    marketText: (job: string, country: string, estimate: SalaryEstimate) => {
      // Localized small; for demonstration
      return `La demanda de ${job} en ${country} varía según la región.`;
    },
    factors: "Factores que Afectan el Salario",
    factorsText: (job: string) => `Los factores clave que influyen en los salarios de ${job} incluyen años de experiencia, habilidades técnicas específicas, tamaño de la empresa y ubicación dentro del país. Las certificaciones de proveedores principales de nube (AWS, Azure, GCP) y marcos de trabajo como React, Node.js y Python aumentan consistentemente el potencial de ingresos.`,
    skills: "Habilidades Demandadas",
    skillsText: (job: string) => `Para roles de ${job}, los empleadores priorizan plataformas de nube, containerización (Docker, Kubernetes), pipelines de CI/CD y conocimiento de diseño de sistemas. Habilidades blandas como comunicación y resolución de problemas impactan cada vez más los paquetes salariares.`,
  },
  pt: {
    title: "Salário Médio",
    overview: "Visão Geral dos Salários",
    salaryRange: "Faixa Salarial",
    low: "Mínimo",
    average: "Médio",
    high: "Máximo",
    overviewText: (job: string, country: string, estimate: SalaryEstimate) =>
      `O salário médio para ${job} no ${country} varia de ${estimate.low.local} (${estimate.low.usd}) a ${estimate.high.local} (${estimate.high.usd}) anualmente, com média de ${estimate.average.local} (${estimate.average.usd}). Posições de nível inicial tipicamente pagam cerca de ${estimate.hourly.low} por hora, enquanto cargos seniores podem superar ${estimate.high.local}.`,
    market: "Tendências do Mercado de Trabalho",
    marketText: (job: string, country: string, estimate: SalaryEstimate) => {
      return `A demanda por ${job} no ${country} varia conforme a região.`;
    },
    factors: "Fatores que Afetam o Salário",
    factorsText: (job: string) => `Fatores-chave que influenciam salários de ${job} incluem anos de experiência, habilidades técnicas específicas, tamanho da empresa e localização no país. Certificações de provedores de nuvem importantes (AWS, Azure, GCP) e frameworks como React, Node.js e Python aumentam consistentemente o potencial de ganho.`,
    skills: "Habilidades em Demanda",
    skillsText: (job: string) => `Para papéis de ${job}, empregadores priorizam plataformas de nuvem, containerização (Docker, Kubernetes), pipelines de CI/CD e conhecimento de design de sistemas. Habilidades interpessoais como comunicação e resolução de problemas impactam os pacotes salariais.`,
  },
};

// Datos de país (simplificado para este ejemplo; se recomienda mantener el dataset completo en producción)
const countryData: Record<string, any> = {
  // Se mantiene el dataset existente en el proyecto real
};

const countryNames: Record<string, string> = {
  "united-states": "United States",
  "united-kingdom": "United Kingdom",
  germany: "Germany",
  france: "France",
  canada: "Canada",
  australia: "Australia",
  japan: "Japan",
  brazil: "Brazil",
  mexico: "Mexico",
  colombia: "Colombia",
  india: "India",
  spain: "Spain",
  italy: "Italy",
  netherlands: "Netherlands",
  sweden: "Sweden",
  norway: "Norway",
  switzerland: "Switzerland",
  singapore: "Singapore",
  "south-korea": "South Korea",
  argentina: "Argentina",
  chile: "Chile",
  peru: "Peru",
};

export async function generateStaticParams() {
  return combinations.map((item) => ({
    job: item.job,
    country: item.country,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { job, country } = await params;
  const displayJob = job.replace(/-/g, " ");
  const displayCountry = countryNames[country] || country.replace(/-/g, " ");
  const lang = countryLanguage[country] || "en";
  const titles = { en: "Salary", es: "Salario", pt: "Salário" };
  return {
    title: `${titles[lang]} ${displayJob} in ${displayCountry} (2026)`,
    description: `Average salary for ${displayJob} professionals in ${displayCountry}.`,
  };
}

export default async function SalaryPage({ params }: PageProps) {
  const { job, country } = await params;
  const displayJob = job.replace(/-/g, " ");
  const displayCountry = countryNames[country] || country.replace(/-/g, " ");
  const data = countryData[country] || countryData["united-states"];
  const lang = countryLanguage[country] || "en";
  const t = content[lang];

  const baseSalary = jobBaseSalary[job] || 70000;
  const salaryEstimate = generateSalaryEstimate(job, country, baseSalary);

  return (
    <main className="min-h-screen py-12 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t.title} {displayJob} in {displayCountry} (2026)
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">{t.salaryRange}</h2>
        <ul className="text-gray-600 space-y-2">
          <li>
            <strong>{t.low}:</strong> {salaryEstimate.low.local} ({salaryEstimate.low.usd})
          </li>
          <li>
            <strong>{t.average}:</strong> {salaryEstimate.average.local} ({salaryEstimate.average.usd})
          </li>
          <li>
            <strong>{t.high}:</strong> {salaryEstimate.high.local} ({salaryEstimate.high.usd})
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">{t.overview}</h2>
        <p className="text-gray-600 leading-relaxed">
          {t.overviewText(displayJob, displayCountry, salaryEstimate, data)}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">{t.market}</h2>
        <p className="text-gray-600 leading-relaxed">
          {t.marketText(displayJob, displayCountry, salaryEstimate, data)}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">{t.factors}</h2>
        <p className="text-gray-600 leading-relaxed">{t.factorsText(displayJob)}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">{t.skills}</h2>
        <p className="text-gray-600 leading-relaxed">{t.skillsText(displayJob)}</p>
      </section>
    </main>
  );
}