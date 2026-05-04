import { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import combinations from '@/data/seo-combinations.json';

type Combination = {
  job: string;
  country: string;
  currency: string;
  jobBaseSalary: number; // USD annual
};

type ContentBlock = {
  title: string;
  salaryRange: string;
  overview: string;
  market: string;
  factors: string;
  skills: string;
};

type Content = {
  [lang: string]: ContentBlock;
};

const currencyConversion: Record<string, number> = {
  USD: 1,
  COP: 4200,
  MXN: 17,
  ARS: 880,
  CLP: 910,
  EUR: 0.93,
  BRL: 5.3,
  PEN: 3.75,
};

const countryLanguageMap: Record<string, 'en' | 'es' | 'pt'> = {
  usa: 'en',
  spain: 'es',
  colombia: 'es',
  mexico: 'es',
  peru: 'es',
  argentina: 'es',
  chile: 'es',
  brazil: 'pt',
};

const countryCurrencyMap: Record<string, string> = {
  usa: 'USD',
  spain: 'EUR',
  colombia: 'COP',
  mexico: 'MXN',
  peru: 'PEN',
  argentina: 'ARS',
  chile: 'CLP',
  brazil: 'BRL',
};

// Salary formatting helpers
function formatCurrency(
  value: number,
  currency: string,
  lang: 'en' | 'es' | 'pt'
): string {
  const locales: Record<'en' | 'es' | 'pt', string> = {
    en: 'en-US',
    es: 'es-ES',
    pt: 'pt-BR',
  };
  const currencyNames: Record<string, string> = {
    USD: 'USD',
    COP: 'COP',
    MXN: 'MXN',
    ARS: 'ARS',
    CLP: 'CLP',
    EUR: 'EUR',
    BRL: 'BRL',
    PEN: 'PEN',
  };

  return new Intl.NumberFormat(locales[lang], {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ` ${currencyNames[currency]}`;
}

function formatDualSalaryDisplay(
  local: number,
  currency: string,
  usd: number,
  lang: 'en' | 'es' | 'pt'
) {
  if (currency === 'USD') {
    return `${formatCurrency(local, currency, lang)}`;
  }
  return `${formatCurrency(local, currency, lang)} (${formatCurrency(
    usd,
    'USD',
    lang
  )})`;
}

// Content system
const content: Content = {
  en: {
    title: 'Salary for {job} in {country}',
    salaryRange: 'Salary Range',
    overview: 'Overview',
    market: 'Market Trends',
    factors: 'Salary Influencing Factors',
    skills: 'Key Skills',
  },
  es: {
    title: 'Salario de {job} en {country}',
    salaryRange: 'Rango Salarial',
    overview: 'Descripción general',
    market: 'Tendencias de mercado',
    factors: 'Factores que influyen en el salario',
    skills: 'Habilidades clave',
  },
  pt: {
    title: 'Salário de {job} em {country}',
    salaryRange: 'Faixa Salarial',
    overview: 'Visão Geral',
    market: 'Tendências do Mercado',
    factors: 'Fatores que Influenciam o Salário',
    skills: 'Principais Habilidades',
  },
};

// Helper to resolve language
function getLanguage(country: string): 'en' | 'es' | 'pt' {
  const c = typeof country === 'string' ? country.toLowerCase() : '';
  return countryLanguageMap[c] || 'en';
}

// Helper to resolve currency
function getCurrency(country: string): string {
  const c = typeof country === 'string' ? country.toLowerCase() : '';
  return countryCurrencyMap[c] || 'USD';
}

// Helper to resolve combination by params
// Patch: fallback for missing combination properties (e.g. India, Italy cases)
function findCombination(
  job: string,
  country: string
): Combination {
  const defaultBaseSalary = 85000;
  const defaultCurrency = 'USD';
  if (typeof job !== 'string' || typeof country !== 'string') {
    return {
      job: String(job),
      country: String(country),
      currency: defaultCurrency,
      jobBaseSalary: defaultBaseSalary,
    };
  }
  const normJob = job.toLowerCase();
  const normCountry = country.toLowerCase();

  const found = (combinations as Array<{ job: string; country: string }>).find(
    (c) => {
      const cJob = typeof c?.job === 'string' ? c.job.toLowerCase() : '';
      const cCountry = typeof c?.country === 'string' ? c.country.toLowerCase() : '';
      return cJob === normJob && cCountry === normCountry;
    }
  );

  if (found) {
    return {
      job: found.job,
      country: found.country,
      currency: getCurrency(found.country) || defaultCurrency,
      jobBaseSalary: defaultBaseSalary,
    };
  }

  // Fallback when not found in data
  return {
    job,
    country,
    currency: getCurrency(country) || defaultCurrency,
    jobBaseSalary: defaultBaseSalary,
  };
}


// Helper to replace text in content blocks
function renderBlockTemplate(
  block: string,
  params: { [key: string]: string }
): string {
  let result = block;
  for (const [key, value] of Object.entries(params)) {
    result = result.replaceAll(`{${key}}`, value);
  }
  return result;
}

export async function generateStaticParams() {
  const items = (combinations as Array<any>).filter(
    (c) => c && typeof c.job === 'string' && typeof c.country === 'string' && c.job.length > 0 && c.country.length > 0
  );
  return items.map((c) => ({
    job: c.job,
    country: c.country,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { job: string; country: string };
}): Promise<Metadata> {
  const { job, country } = params;
  const safeCountry = typeof country === 'string' ? country : 'unknown';
  const safeJob = typeof job === 'string' ? job : 'unknown';
  const lang = getLanguage(safeCountry);
  const contentTemplate = content[lang];
  const countryLabel =
    safeCountry.charAt(0).toUpperCase() + safeCountry.slice(1).toLowerCase();
  const jobLabel = safeJob.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: renderBlockTemplate(contentTemplate.title, {
      job: jobLabel,
      country: countryLabel,
    }),
    description: `${countryLabel} ${jobLabel} salaries and compensation information`,
  };
}

export default function SalaryPage({
  params,
}: {
  params: { job: string; country: string };
}) {
  const { job, country } = params;
  const combination = findCombination(job, country);
  if (!combination) {
    return (
      <main>
        <h1>Data not found</h1>
      </main>
    );
  }

  const lang = getLanguage(country) || 'en';
  const contentBlock = content[lang];

  const jobLabel = combination && combination.job
    ? combination.job.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : job.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const countryLabel = combination && combination.country
    ? combination.country[0].toUpperCase() + combination.country.slice(1).toLowerCase()
    : country[0].toUpperCase() + country.slice(1).toLowerCase();

  // Salary logic
  const usdSalary = combination.jobBaseSalary;
  const currency = getCurrency(country) || 'USD';
  const conversion = currencyConversion[currency] || 1;

  const localAverage = Math.round(usdSalary * conversion);
  const localLow = Math.round(localAverage * 0.7);
  const localHigh = Math.round(localAverage * 1.3);

  const displayLow = formatDualSalaryDisplay(
    localLow,
    currency,
    Math.round(localLow / conversion),
    lang
  );
  const displayAvg = formatDualSalaryDisplay(
    localAverage,
    currency,
    usdSalary,
    lang
  );
  const displayHigh = formatDualSalaryDisplay(
    localHigh,
    currency,
    Math.round(localHigh / conversion),
    lang
  );

  // Demo data - should be replaced with real data
  const overviewText: Record<'en' | 'es' | 'pt', string> = {
    en: `Discover the typical salary for a ${jobLabel} in ${countryLabel}, including the most up-to-date compensation information for the region and industry.`,
    es: `Descubra el salario típico para un(a) ${jobLabel} en ${countryLabel}, incluyendo la información de compensación más actualizada para la región y el sector.`,
    pt: `Descubra o salário típico para um(a) ${jobLabel} em ${countryLabel}, incluindo as informações de remuneração mais atualizadas para a região e o setor.`,
  };

  const marketText: Record<'en' | 'es' | 'pt', string> = {
    en: `The job market for ${jobLabel}s in ${countryLabel} is evolving, with salary ranges reflecting demand, skill level, and experience.`,
    es: `El mercado laboral para ${jobLabel}s en ${countryLabel} está en evolución, con rangos salariales que reflejan la demanda, el nivel de habilidad y la experiencia.`,
    pt: `O mercado de trabalho para ${jobLabel}s em ${countryLabel} está evoluindo, com faixas salariais que refletem demanda, nível de habilidade e experiência.`,
  };

  const factorsText: Record<'en' | 'es' | 'pt', string> = {
    en: `Key factors impacting salary include experience, education, company size, and location.`,
    es: `Los principales factores que impactan el salario incluyen experiencia, educación, tamaño de la empresa y ubicación.`,
    pt: `Os principais fatores que impactam o salário incluem experiência, educação, tamanho da empresa e localização.`,
  };

  const skillsText: Record<'en' | 'es' | 'pt', string> = {
    en: `Top skills for success include technical expertise, communication, problem-solving, and adaptability.`,
    es: `Las principales habilidades para el éxito incluyen experiencia técnica, comunicación, resolución de problemas y adaptabilidad.`,
    pt: `As principais habilidades para o sucesso incluem expertise técnica, comunicação, solução de problemas e adaptabilidade.`,
  };

  return (
    <main>
      <h1>
        {renderBlockTemplate(contentBlock.title, {
          job: jobLabel,
          country: countryLabel,
        })}
      </h1>

      <section>
        <h2>{contentBlock.salaryRange}</h2>
        <ul>
          <li>
            <strong>
              {lang === 'es' ? 'Bajo' : lang === 'pt' ? 'Baixo' : 'Low'}:
            </strong>{' '}
            {displayLow}
          </li>
          <li>
            <strong>
              {lang === 'es' ? 'Promedio' : lang === 'pt' ? 'Médio' : 'Average'}:
            </strong>{' '}
            {displayAvg}
          </li>
          <li>
            <strong>
              {lang === 'es' ? 'Alto' : lang === 'pt' ? 'Alto' : 'High'}:
            </strong>{' '}
            {displayHigh}
          </li>
        </ul>
      </section>

      <section>
        <h2>{contentBlock.overview}</h2>
        <p>{overviewText[lang]}</p>
      </section>

      <section>
        <h2>{contentBlock.market}</h2>
        <p>{marketText[lang]}</p>
      </section>

      <section>
        <h2>{contentBlock.factors}</h2>
        <p>{factorsText[lang]}</p>
      </section>

      <section>
        <h2>{contentBlock.skills}</h2>
        <p>{skillsText[lang]}</p>
      </section>
    </main>
  );
}
