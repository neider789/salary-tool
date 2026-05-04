type Params = {
  params: {
    job: string;
    country: string;
  };
};

// Detect language
function getLanguage(country: string) {
  const spanish = ["colombia", "mexico", "peru", "argentina", "chile", "spain"];
  const portuguese = ["brazil"];

  if (spanish.includes(country)) return "es";
  if (portuguese.includes(country)) return "pt";
  return "en";
}

// Salary generator (simple but variable)
function getSalary(country: string) {
  const base: Record<string, number> = {
    "united-states": 7000,
    "canada": 5000,
    "united-kingdom": 4800,
    "germany": 4500,
    "spain": 2500,
    "mexico": 1500,
    "colombia": 1200,
    "peru": 1100,
    "argentina": 1300,
    "brazil": 1600,
  };

  const avg = base[country] || 2000;

  return {
    low: Math.round(avg * 0.7),
    mid: avg,
    high: Math.round(avg * 1.5),
  };
}

// Currency mapping
function getCurrency(country: string) {
  if (country === "colombia") return "COP";
  if (country === "mexico") return "MXN";
  if (country === "peru") return "PEN";
  if (country === "argentina") return "ARS";
  if (country === "brazil") return "BRL";
  return "USD";
}

// Format job/country
function format(text: string) {
  return text.replaceAll("-", " ");
}

export default function Page({ params }: Params) {
  const job = format(params.job);
  const country = format(params.country);

  const lang = getLanguage(params.country);
  const salary = getSalary(params.country);
  const currency = getCurrency(params.country);

  // TEXTS
  let title = "";
  let intro = "";
  let factors = "";

  if (lang === "es") {
    title = `Salario de ${job} en ${country} (2026)`;
    intro = `El salario promedio de un ${job} en ${country} varía según experiencia y demanda.`;
    factors = "Factores clave: experiencia, empresa, habilidades técnicas y trabajo remoto.";
  } else if (lang === "pt") {
    title = `Salário de ${job} em ${country} (2026)`;
    intro = `O salário médio de um ${job} em ${country} varia conforme experiência e mercado.`;
    factors = "Fatores: experiência, empresa, habilidades e trabalho remoto.";
  } else {
    title = `Salary of ${job} in ${country} (2026)`;
    intro = `The average salary for a ${job} in ${country} depends on experience and demand.`;
    factors = "Key factors: experience, company, technical skills, and remote opportunities.";
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      <p className="mb-4">{intro}</p>

      <h2 className="text-xl font-semibold mt-6">Salary Range</h2>
      <p>
        {salary.low} - {salary.high} {currency} / month
      </p>

      <h2 className="text-xl font-semibold mt-6">Details</h2>
      <p>{factors}</p>
    </main>
  );
}