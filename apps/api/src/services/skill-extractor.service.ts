export interface ExtractedSkills {
  technical: string[];
  languages: string[];
  tools: string[];
  soft: string[];
  frameworks: string[];
}

const SKILLS_DB = {
  languages: [
    "javascript", "typescript", "python", "java", "c++", "c#", "go", "golang",
    "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab",
    "dart", "elixir", "haskell", "perl", "bash", "shell", "sql"
  ],

  frameworks: [
    "react", "next.js", "nextjs", "vue", "angular", "svelte", "nuxt",
    "express", "fastapi", "django", "flask", "spring", "laravel", "rails",
    "nestjs", "nest.js", "graphql", "tailwind", "bootstrap", "redux",
    "trpc", "prisma", "mongoose", "sequelize", "socket.io"
  ],

  tools: [
    "git", "github", "gitlab", "docker", "kubernetes", "aws", "gcp",
    "azure", "linux", "nginx", "jenkins", "ci/cd", "figma", "postman",
    "jira", "notion", "vercel", "netlify", "firebase", "supabase",
    "redis", "kafka", "rabbitmq", "terraform", "ansible", "webpack",
    "vite", "babel", "eslint", "jest", "vitest", "cypress", "playwright"
  ],

  technical: [
    "rest api", "restful", "microservices", "system design", "data structures",
    "algorithms", "machine learning", "deep learning", "nlp", "computer vision",
    "blockchain", "devops", "agile", "scrum", "tdd", "oop", "mvc",
    "websockets", "oauth", "jwt", "rbac", "crud", "orm", "api design",
    "database design", "cloud computing", "serverless", "ci/cd pipeline",
    "unit testing", "integration testing", "data modeling", "caching",
    "load balancing", "message queues", "event driven", "mongodb",
    "postgresql", "mysql", "sqlite", "nosql", "redis"
  ],

  soft: [
    "leadership", "communication", "teamwork", "problem solving",
    "critical thinking", "time management", "collaboration", "adaptability",
    "creativity", "mentoring", "project management", "analytical",
    "attention to detail", "self motivated", "quick learner", "multitasking"
  ]
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s./+#-]/g, " ").replace(/\s+/g, " ").trim();
}

function matchSkill(resumeText: string, skill: string): boolean {
  const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(^|\\s|,|/|\\()${escaped}(\\s|,|/|\\)|$)`, "i");
  return regex.test(resumeText);
}

function deduplicate(skills: string[]): string[] {
  const seen = new Set<string>();
  return skills.filter(skill => {
    const key = skill.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function toDisplayName(skill: string): string {
  return skill
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/Api/g, "API")
    .replace(/Jwt/g, "JWT")
    .replace(/Rbac/g, "RBAC")
    .replace(/Tdd/g, "TDD")
    .replace(/Oop/g, "OOP")
    .replace(/Mvc/g, "MVC")
    .replace(/Aws/g, "AWS")
    .replace(/Gcp/g, "GCP")
    .replace(/Nlp/g, "NLP")
    .replace(/Sql/g, "SQL")
    .replace(/Nosql/g, "NoSQL")
    .replace(/Ci\/Cd/g, "CI/CD")
    .replace(/Orm/g, "ORM");
}

export const skillExtractorService = {
  extractSkills(text: string): ExtractedSkills {
    const normalized = normalize(text);
    const result: ExtractedSkills = {
      languages: [],
      frameworks: [],
      tools: [],
      technical: [],
      soft: []
    };

    for (const category in SKILLS_DB) {
      const key = category as keyof typeof SKILLS_DB;
      const matched = SKILLS_DB[key].filter(skill => matchSkill(normalized, skill));
      result[key] = deduplicate(matched.map(s => toDisplayName(s)));
    }

    return result;
  }
};
