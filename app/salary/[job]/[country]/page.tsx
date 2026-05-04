import combinations from "@/data/seo-combinations.json";

interface PageProps {
  params: Promise<{ job: string; country: string }>;
}

export async function generateStaticParams() {
  return combinations.map((item) => ({
    job: item.job,
    country: item.country,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { job, country } = await params;
  const displayJob = job.replace(/-/g, " ");
  const displayCountry = country.replace(/-/g, " ");
  return {
    title: `Salary of ${displayJob} in ${displayCountry} (2026)`,
    description: `Learn about average salary for ${displayJob} professionals in ${displayCountry}.`,
  };
}

export default async function SalaryPage({ params }: PageProps) {
  const { job, country } = await params;
  const displayJob = job.replace(/-/g, " ");
  const displayCountry = country.replace(/-/g, " ");

  return (
    <main className="min-h-screen py-12 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Salary of {displayJob} in {displayCountry} (2026)
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Average Salary Overview
        </h2>
        <p className="text-gray-600 leading-relaxed">
          The average salary for {displayJob} professionals in {displayCountry} varies
          based on experience, skills, and company size. Entry-level positions start at
          around $45,000 annually, while senior roles can exceed $120,000.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Job Market Trends
        </h2>
        <p className="text-gray-600 leading-relaxed">
          The demand for {displayJob} roles in {displayCountry} has been steady with a
          projected growth of 8% over the next few years. Remote work opportunities have
          expanded, allowing professionals to work with international companies while
          residing locally.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Key Factors Affecting Salary
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Several factors influence earning potential including years of experience,
          educational background, certifications, and specific technical skills.
          Professionals with advanced degrees and specialized certifications typically
          command higher salaries.
        </p>
      </section>
    </main>
  );
}