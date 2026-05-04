const jobs = [
  "software-engineer",
  "data-scientist",
  "product-manager",
  "ux-designer",
  "devops-engineer",
  "full-stack-developer",
  "frontend-developer",
  "backend-developer",
  "mobile-developer",
  "cloud-architect",
  "machine-learning-engineer",
  " cybersecurity-analyst",
  "database-administrator",
  "qa-engineer",
  "technical-writer",
  "scrum-master",
  "business-analyst",
  "project-manager",
  "systems-administrator",
  "network-engineer",
  "ai-researcher",
  "blockchain-developer",
];

const countries = [
  "united-states",
  "united-kingdom",
  "germany",
  "france",
  "canada",
  "australia",
  "japan",
  "brazil",
  "mexico",
  "colombia",
  "india",
  "spain",
  "italy",
  "netherlands",
  "sweden",
  "norway",
  "switzerland",
  "singapore",
  "south-korea",
  "argentina",
  "chile",
  "peru",
];

const combinations = [];

for (const job of jobs) {
  for (const country of countries) {
    combinations.push({ job, country });
  }
}

console.log(JSON.stringify(combinations, null, 2));