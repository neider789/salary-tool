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

const exchangeToUsd = (amount: number, currency: string): string => {
  const rate = currencyConversion[currency] || 1;
  const usd = amount / rate;
  if (usd >= 1000) return `$${(usd / 1000).toFixed(0)}k`;
  return `$${usd.toFixed(0)}`;
};

function generateSalaryEstimate(
  job: string,
  country: string,
  baseSalary: number
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

  const multiplier = countryMultiplier[country] || 0.6;
  const jobVariation = (job.length % 5 + 1) * 0.03;
  const randomFactor = (country.length % 3) * 0.02;

  const adjustedBase = baseSalary * (multiplier + jobVariation - randomFactor);
  const avgLocal = Math.round(adjustedBase);
  const avgUsd = Math.round(adjustedBase * (currencyConversion["USD"] / (currencyConversion[Object.keys(countryMultiplier).find((k) => k === country) || "USD"] || 1)));

  const lowLocal = Math.round(avgLocal * 0.75);
  const highLocal = Math.round(avgLocal * 1.35);
  const lowUsd = Math.round(avgUsd * 0.75);
  const highUsd = Math.round(avgUsd * 1.35);

  const currency = country === "united-states" ? "USD" : country === "united-kingdom" ? "GBP" : country === "germany" || country === "france" || country === "spain" || country === "italy" || country === "netherlands" ? "EUR" : country === "canada" ? "CAD" : country === "australia" ? "AUD" : country === "japan" ? "JPY" : country === "brazil" ? "BRL" : country === "mexico" ? "MXN" : country === "colombia" ? "COP" : country === "india" ? "INR" : country === "sweden" ? "SEK" : country === "norway" ? "NOK" : country === "switzerland" ? "CHF" : country === "singapore" ? "SGD" : country === "south-korea" ? "KRW" : country === "argentina" ? "ARS" : country === "chile" ? "CLP" : country === "peru" ? "PEN" : "USD";

  const formatLocal = (val: number): string => {
    if (currency === "JPY" || currency === "KRW" || currency === "COP" || currency === "CLP" || currency === "ARS") return `${val.toLocaleString()}`;
    if (currency === "INR") return `₹${(val / 100000).toFixed(1)}L`;
    if (currency === "MXN" || currency === "BRL") return `$${(val / 1000).toFixed(0)}k`;
    if (currency === "USD") return `$${val.toLocaleString()}`;
    if (currency === "GBP") return `£${val.toLocaleString()}`;
    if (currency === "EUR") return `€${val.toLocaleString()}`;
    if (currency === "CAD" || currency === "AUD") return `C$${val.toLocaleString()}`;
    return `${val.toLocaleString()}`;
  };

  return {
    low: {
      local: formatLocal(lowLocal),
      usd: `$${lowUsd.toLocaleString()}`,
    },
    average: {
      local: formatLocal(avgLocal),
      usd: `$${avgUsd.toLocaleString()}`,
    },
    high: {
      local: formatLocal(highLocal),
      usd: `$${highUsd.toLocaleString()}`,
    },
    hourly: {
      low: currency === "USD" ? "$35" : currency === "GBP" ? "£20" : currency === "EUR" ? "€18" : currency === "CAD" ? "C$25" : currency === "AUD" ? "A$28" : currency === "JPY" ? "¥1,200" : currency === "BRL" ? "R$80" : currency === "MXN" ? "$150" : currency === "COP" ? "$18,000" : currency === "INR" ? "₹350" : "$25",
      high: currency === "USD" ? "$95" : currency === "GBP" ? "£55" : currency === "EUR" ? "€48" : currency === "CAD" ? "C$70" : currency === "AUD" ? "A$80" : currency === "JPY" ? "¥3,200" : currency === "BRL" ? "R$180" : currency === "MXN" ? "$400" : currency === "COP" ? "$45,000" : currency === "INR" ? "₹900" : "$45",
    },
  };
}

interface CountryData {
  currency: string;
  currencySymbol: string;
  avgSalaryLocal: string;
  avgSalaryUsd: string;
  hourlyRate: string;
  demandLevel: "high" | "medium" | "low";
  remoteWork: string;
  costOfLiving: string;
}

const countryData: Record<string, CountryData> = {
  "united-states": {
    currency: "USD",
    currencySymbol: "$",
    avgSalaryLocal: "$95,000 - $145,000",
    avgSalaryUsd: "$95,000 - $145,000",
    hourlyRate: "$45 - $70",
    demandLevel: "high",
    remoteWork: "Widely available, especially for tech roles",
    costOfLiving: "High in major cities; consider remote or hybrid for better quality of life",
  },
  "united-kingdom": {
    currency: "GBP",
    currencySymbol: "£",
    avgSalaryLocal: "£45,000 - £75,000",
    avgSalaryUsd: "$56,000 - $94,000",
    hourlyRate: "£25 - £45",
    demandLevel: "high",
    remoteWork: "Common; many companies offer hybrid or fully remote",
    costOfLiving: "High in London; more affordable in Manchester, Birmingham, Edinburgh",
  },
  germany: {
    currency: "EUR",
    currencySymbol: "€",
    avgSalaryLocal: "€55,000 - €90,000",
    avgSalaryUsd: "$59,000 - $97,000",
    hourlyRate: "€30 - €50",
    demandLevel: "high",
    remoteWork: "Growing; many startups and large companies offer flexibility",
    costOfLiving: "Moderate; Berlin affordable, Munich expensive",
  },
  france: {
    currency: "EUR",
    currencySymbol: "€",
    avgSalaryLocal: "€45,000 - €80,000",
    avgSalaryUsd: "$48,000 - $86,000",
    hourlyRate: "€25 - €45",
    demandLevel: "medium",
    remoteWork: "Increasing; French tech scene growing in Paris and Lyon",
    costOfLiving: "High in Paris; moderate elsewhere",
  },
  canada: {
    currency: "CAD",
    currencySymbol: "C$",
    avgSalaryLocal: "C$75,000 - C$120,000",
    avgSalaryUsd: "$55,000 - $88,000",
    hourlyRate: "C$35 - C$60",
    demandLevel: "high",
    remoteWork: "Strong remote culture; US companies often hire Canadian remote workers",
    costOfLiving: "High in Vancouver, Toronto; more affordable in Montreal, Calgary",
  },
  australia: {
    currency: "AUD",
    currencySymbol: "A$",
    avgSalaryLocal: "A$85,000 - A$140,000",
    avgSalaryUsd: "$54,000 - $89,000",
    hourlyRate: "A$40 - A$70",
    demandLevel: "high",
    remoteWork: "Common; timezone advantage for Asia-Pacific work",
    costOfLiving: "High in Sydney, Melbourne; moderate in Brisbane, Perth",
  },
  japan: {
    currency: "JPY",
    currencySymbol: "¥",
    avgSalaryLocal: "¥5,500,000 - ¥10,000,000",
    avgSalaryUsd: "$36,000 - $66,000",
    hourlyRate: "¥2,500 - ¥5,000",
    demandLevel: "medium",
    remoteWork: "Growing but traditional; more common in foreign companies",
    costOfLiving: "High in Tokyo; reasonable in Osaka, Fukuoka",
  },
  brazil: {
    currency: "BRL",
    currencySymbol: "R$",
    avgSalaryLocal: "R$84,000 - R$180,000",
    avgSalaryUsd: "$15,000 - $33,000",
    hourlyRate: "R$40 - R$90",
    demandLevel: "high",
    remoteWork: "Very common; strong tech hub in São Paulo, remote-friendly culture",
    costOfLiving: "High in São Paulo; affordable in Belo Horizonte, remote areas",
  },
  mexico: {
    currency: "MXN",
    currencySymbol: "$",
    avgSalaryLocal: "$360,000 - $720,000",
    avgSalaryUsd: "$20,000 - $40,000",
    hourlyRate: "$170 - $350",
    demandLevel: "high",
    remoteWork: "Nearshoring boom; US companies actively hiring Mexican remote talent",
    costOfLiving: "Moderate; Mexico City expensive, Guadalajara, Monterrey affordable",
  },
  colombia: {
    currency: "COP",
    currencySymbol: "$",
    avgSalaryLocal: "$72,000,000 - $144,000,000",
    avgSalaryUsd: "$17,000 - $34,000",
    hourlyRate: "35,000 - 70,000",
    demandLevel: "medium",
    remoteWork: "Growing; Colombian developers increasingly working for US companies",
    costOfLiving: "Moderate; Bogotá expensive, Medellín affordable with great weather",
  },
  india: {
    currency: "INR",
    currencySymbol: "₹",
    avgSalaryLocal: "₹12,00,000 - ₹30,00,000",
    avgSalaryUsd: "$14,000 - $36,000",
    hourlyRate: "₹600 - ₹1,500",
    demandLevel: "high",
    remoteWork: "Massive remote work growth; Indian developers in high demand globally",
    costOfLiving: "Low; Bangalore, Hyderabad expensive but still affordable vs. Western cities",
  },
  spain: {
    currency: "EUR",
    currencySymbol: "€",
    avgSalaryLocal: "€35,000 - €65,000",
    avgSalaryUsd: "$38,000 - $70,000",
    hourlyRate: "€20 - €38",
    demandLevel: "medium",
    remoteWork: "Strong digital nomad culture; Barcelona, Madrid tech hubs",
    costOfLiving: "High in Barcelona; moderate in Madrid, Valencia",
  },
  italy: {
    currency: "EUR",
    currencySymbol: "€",
    avgSalaryLocal: "€40,000 - €70,000",
    avgSalaryUsd: "$43,000 - $75,000",
    hourlyRate: "€22 - €40",
    demandLevel: "medium",
    remoteWork: "Growing; Milan, Rome have tech scenes but more conservative",
    costOfLiving: "High in Milan; moderate in Naples, Bologna",
  },
  netherlands: {
    currency: "EUR",
    currencySymbol: "€",
    avgSalaryLocal: "€55,000 - €90,000",
    avgSalaryUsd: "$59,000 - $97,000",
    hourlyRate: "€30 - €50",
    demandLevel: "high",
    remoteWork: "Excellent; Amsterdam tech hub with many remote-first companies",
    costOfLiving: "High but manageable; Amsterdam expensive, Rotterdam affordable",
  },
  sweden: {
    currency: "SEK",
    currencySymbol: "kr",
    avgSalaryLocal: "kr480,000 - kr800,000",
    avgSalaryUsd: "$44,000 - $73,000",
    hourlyRate: "kr230 - kr400",
    demandLevel: "medium",
    remoteWork: "Good; Stockholm tech scene, many startups",
    costOfLiving: "High in Stockholm; moderate in Gothenburg, Malmö",
  },
  norway: {
    currency: "NOK",
    currencySymbol: "kr",
    avgSalaryLocal: "kr550,000 - kr900,000",
    avgSalaryUsd: "$48,000 - $79,000",
    hourlyRate: "kr270 - kr450",
    demandLevel: "medium",
    remoteWork: "Limited; Oslo based but remote work increasing",
    costOfLiving: "Very high; Oslo expensive, but high salaries offset",
  },
  switzerland: {
    currency: "CHF",
    currencySymbol: "CHF",
    avgSalaryLocal: "CHF90,000 - CHF150,000",
    avgSalaryUsd: "$100,000 - $167,000",
    hourlyRate: "CHF50 - CHF85",
    demandLevel: "high",
    remoteWork: "Limited; Swiss companies prefer on-site but remote possible",
    costOfLiving: "Very high; Zurich, Geneva expensive but salaries compensate",
  },
  singapore: {
    currency: "SGD",
    currencySymbol: "S$",
    avgSalaryLocal: "S$72,000 - S$120,000",
    avgSalaryUsd: "$53,000 - $88,000",
    hourlyRate: "S$35 - S$60",
    demandLevel: "high",
    remoteWork: "Limited; but regional hub for Asia-Pacific roles",
    costOfLiving: "High but efficient; no income tax benefit",
  },
  "south-korea": {
    currency: "KRW",
    currencySymbol: "₩",
    avgSalaryLocal: "₩50,000,000 - ₩100,000,000",
    avgSalaryUsd: "$35,000 - $70,000",
    hourlyRate: "₩25,000 - ₩50,000",
    demandLevel: "medium",
    remoteWork: "Growing; Samsung, LG major employers, startups in Seoul",
    costOfLiving: "High in Seoul; reasonable in Busan, Daegu",
  },
  argentina: {
    currency: "ARS",
    currencySymbol: "$",
    avgSalaryLocal: "$18,000,000 - $40,000,000",
    avgSalaryUsd: "$18,000 - $40,000",
    hourlyRate: "9,000 - 20,000",
    demandLevel: "medium",
    remoteWork: "Strong; Argentine developers highly valued by US companies",
    costOfLiving: "Moderate; Buenos Aires affordable despite inflation",
  },
  chile: {
    currency: "CLP",
    currencySymbol: "$",
    avgSalaryLocal: "$24,000,000 - $48,000,000",
    avgSalaryUsd: "$24,000 - $48,000",
    hourlyRate: "12,000 - 24,000",
    demandLevel: "medium",
    remoteWork: "Growing; Santiago tech scene, many remote opportunities",
    costOfLiving: "Moderate; Santiago expensive but manageable",
  },
  peru: {
    currency: "PEN",
    currencySymbol: "S/",
    avgSalaryLocal: "S/84,000 - S$168,000",
    avgSalaryUsd: "$22,000 - $44,000",
    hourlyRate: "S/40 - S/80",
    demandLevel: "low",
    remoteWork: "Growing; limeños increasingly working remotely for foreign companies",
    costOfLiving: "Low; Lima moderate, provinces affordable",
  },
};

const content = {
  en: {
    title: "Average Salary",
    overview: "Salary Overview",
    overviewText: (job: string, country: string, estimate: SalaryEstimate, data: CountryData) =>
      `The average salary for ${job} in ${country} ranges from ${estimate.low.local} (${estimate.low.usd}) to ${estimate.high.local} (${estimate.high.usd}) annually, with an average of ${estimate.average.local} (${estimate.average.usd}). Entry-level positions typically pay around ${estimate.hourly.low} per hour, while senior roles can exceed ${estimate.high.local}.`,
    market: "Job Market Trends",
  marketText: (job: string, country: string, _estimate: SalaryEstimate, data: CountryData) => {
      let levelText = "";
      if (data.demandLevel === "high") {
        levelText = "high";
      } else if (data.demandLevel === "medium") {
        levelText = "steady";
      } else {
        levelText = "growing";
      }
      return `Demand for ${job} professionals in ${country} is currently ${levelText}. ${data.remoteWork} ${data.costOfLiving}`;
    },
    factors: "Factors Affecting Salary",
    factorsText: (job: string) =>
      `Key factors influencing ${job} salaries include years of experience, specific technical skills, company size, and location within the country. Certifications from major cloud providers (AWS, Azure, GCP) and frameworks like React, Node.js, and Python consistently boost earning potential.`,
    skills: "In-Demand Skills",
    skillsText: (job: string) =>
      `For ${job} roles, employers prioritize cloud platforms, containerization (Docker, Kubernetes), CI/CD pipelines, and system design knowledge. Soft skills like communication and problem-solving increasingly impact salary packages.`,
  },
  es: {
    title: "Salario Promedio",
    overview: "Resumen Salarial",
    overviewText: (job: string, country: string, estimate: SalaryEstimate, data: CountryData) =>
      `El salario promedio para ${job} en ${country} oscila entre ${estimate.low.local} (${estimate.low.usd}) y ${estimate.high.local} (${estimate.high.usd}) anuales, con un promedio de ${estimate.average.local} (${estimate.average.usd}). Los puestos de nivel inicial típicamente pagan alrededor de ${estimate.hourly.low} por hora, mientras que los roles senior pueden superar ${estimate.high.local}.`,
    market: "Tendencias del Mercado Laboral",
  marketText: (job: string, country: string, _estimate: SalaryEstimate, data: CountryData) => {
      let levelText = "";
      if (data.demandLevel === "high") {
        levelText = "alta";
      } else if (data.demandLevel === "medium") {
        levelText = "estable";
      } else {
        levelText = "en crecimiento";
      }
      return `La demanda de profesionales de ${job} en ${country} actualmente es ${levelText}. ${data.remoteWork} ${data.costOfLiving}`;
    },
    factors: "Factores que Afectan el Salario",
    factorsText: (job: string) =>
      `Los factores clave que influyen en los salarios de ${job} incluyen años de experiencia, habilidades técnicas específicas, tamaño de la empresa y ubicación dentro del país. Las certificaciones de proveedores principales de nube (AWS, Azure, GCP) y marcos de trabajo como React, Node.js y Python aumentan consistentemente el potencial de ingresos.`,
    skills: "Habilidades Demandadas",
    skillsText: (job: string) =>
      `Para roles de ${job}, los empleadores priorizan plataformas de nube, containerización (Docker, Kubernetes), pipelines de CI/CD y conocimiento de diseño de sistemas. Las habilidades blandas como comunicación y resolución de problemas impactan cada vez más los paquetes salariales.`,
  },
  pt: {
    title: "Salário Médio",
    overview: "Visão Geral dos Salários",
    overviewText: (job: string, country: string, estimate: SalaryEstimate, data: CountryData) =>
      `O salário médio para ${job} no ${country} varia de ${estimate.low.local} (${estimate.low.usd}) a ${estimate.high.local} (${estimate.high.usd}) anualmente, com média de ${estimate.average.local} (${estimate.average.usd}). Posições de nível inicial tipicamente pagam cerca de ${estimate.hourly.low} por hora, enquanto cargos seniores podem superar ${estimate.high.local}.`,
    market: "Tendências do Mercado de Trabalho",
  marketText: (job: string, country: string, _estimate: SalaryEstimate, data: CountryData) => {
      let levelText = "";
      if (data.demandLevel === "high") {
        levelText = "alta";
      } else if (data.demandLevel === "medium") {
        levelText = "estável";
      } else {
        levelText = "crescente";
      }
      return `A demanda por profissionais de ${job} no ${country} atualmente é ${levelText}. ${data.remoteWork} ${data.costOfLiving}`;
    },
    factors: "Fatores que Afetam o Salário",
    factorsText: (job: string) =>
      `Fatores-chave que influenciam salários de ${job} incluem anos de experiência, habilidades técnicas específicas, tamanho da empresa e localização no país. Certificações de provedores de nuvem importantes (AWS, Azure, GCP) e frameworks como React, Node.js e Python aumentam consistentemente o potencial de ganho.`,
    skills: "Habilidades em Demanda",
    skillsText: (job: string) =>
      `Para papéis de ${job}, empregadores priorizam plataformas de nuvem, containerização (Docker, Kubernetes), pipelines de CI/CD e conhecimento de design de sistemas. Habilidades interpessoais como comunicação e resolução de problemas impactam cada vez mais os pacotes salariais.`,
  },
};

const countryLanguage: Record<string, Language> = {
  colombia: "es",
  mexico: "es",
  peru: "es",
  argentina: "es",
  chile: "es",
  spain: "es",
  brazil: "pt",
};

const getDemandLevel = (level: "high" | "medium" | "low", lang: Language): string => {
  const levels = {
    en: { high: "high", medium: "steady", low: "growing" },
    es: { high: "alta", medium: "estable", low: "en crecimiento" },
    pt: { high: "alta", medium: "estável", low: "crescente" },
  };
  return levels[lang][level];
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
    <h2 className="text-xl font-semibold text-gray-800 mb-3">
      Salary Range
    </h2>

    <ul className="text-gray-600 space-y-2">
      <li>
        <strong>Low:</strong> {salaryEstimate.low.local} ({salaryEstimate.low.usd})
      </li>
      <li>
        <strong>Average:</strong> {salaryEstimate.average.local} ({salaryEstimate.average.usd})
      </li>
      <li>
        <strong>High:</strong> {salaryEstimate.high.local} ({salaryEstimate.high.usd})
      </li>
    </ul>
  </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Salary Range
        </h2>

        <ul className="text-gray-600 space-y-2">
          <li>
            <strong>Low:</strong> {salaryEstimate.low.local} ({salaryEstimate.low.usd})
          </li>
          <li>
            <strong>Average:</strong> {salaryEstimate.average.local} ({salaryEstimate.average.usd})
          </li>
          <li>
            <strong>High:</strong> {salaryEstimate.high.local} ({salaryEstimate.high.usd})
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
        <p className="text-gray-600 leading-relaxed">
          {t.factorsText(displayJob)}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">{t.skills}</h2>
        <p className="text-gray-600 leading-relaxed">
          {t.skillsText(displayJob)}
        </p>
      </section>
    </main>
  );
}
