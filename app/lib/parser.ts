// Comprehensive tech skills dictionary
const KNOWN_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'NestJS', 'Express',
  'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'C++', 'C', 'C#',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase', 'Prisma',
  'HTML', 'CSS', 'Tailwind CSS', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Nginx',
  'Git', 'GitHub', 'GraphQL', 'REST API', 'Linux', 'CI/CD', 'Machine Learning',
  'LangChain', 'LLM', 'PyTorch', 'TensorFlow', 'SQL', 'Zustand', 'TanStack Query',
  'ChromaDB', 'RAG', 'Playwright', 'Vitest', 'Postman'
];

export interface ExtractedResumeData {
  full_name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  skills: string[];
  highest_qualification: string;
  degree: string;
  specialization: string;
  college: string;
  graduation_year: string;
  current_city: string;
}

export function extractEntitiesFromText(text: string): ExtractedResumeData {
  // 1. Email Extraction
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : '';

  // 2. Phone Extraction (Supports +91, Indian 10 digits, spaces, parentheses, dashes)
  const phoneRegex = /(?:(?:\+?91[\s.-]?)?[6-9]\d{9})|(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  // 3. URLs & Profiles (Handles direct URLs, markdown URLs, and text paths)
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|profile)\/([a-zA-Z0-9_-]+)/i;
  const linkedinMatch = text.match(linkedinRegex);
  const linkedin_url = linkedinMatch 
    ? (linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`) 
    : '';

  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i;
  const githubMatch = text.match(githubRegex);
  const github_url = githubMatch 
    ? (githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`) 
    : '';

  const portfolioRegex = /(?:https?:\/\/)?([a-zA-Z0-9_-]+\.)+(?:vercel\.app|netlify\.app|github\.io|me|dev)(?:\/[^\s]*)?/i;
  const portfolioMatch = text.match(portfolioRegex);
  const portfolio_url = portfolioMatch 
    ? (portfolioMatch[0].startsWith('http') ? portfolioMatch[0] : `https://${portfolioMatch[0]}`) 
    : '';

  // 4. Skills Matching (Case-insensitive word boundary matching)
  const detectedSkills = new Set<string>();
  KNOWN_SKILLS.forEach(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
    if (regex.test(text)) {
      detectedSkills.add(skill);
    }
  });

  // 5. Name Extraction (Find the candidate's name from header lines)
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  let full_name = '';
  for (const line of lines.slice(0, 8)) {
    // A clean name has 2 to 4 words, no digits, no @ or http, and isn't a section title like 'SUMMARY' or 'RESUME'
    if (
      line.length >= 3 &&
      line.length <= 40 &&
      !line.includes('@') &&
      !/\d/.test(line) &&
      !/(?:https?|www|\.com|resume|curriculum|vitae|summary|experience|education|skills)/i.test(line)
    ) {
      full_name = line;
      break;
    }
  }

  // 6. Degree & Highest Qualification (Ordered by specificity)
  let degree = '';
  let highest_qualification = 'Graduation';

  if (/\b(M\.?Tech|Master of Technology|M\.?E\.?)\b/i.test(text)) {
    degree = 'M.Tech / M.E.';
    highest_qualification = 'Post Graduation';
  } else if (/\b(MCA|Master of Computer Applications)\b/i.test(text)) {
    degree = 'MCA';
    highest_qualification = 'Post Graduation';
  } else if (/\b(B\.?Tech|Bachelor of Technology|B\.?E\.?|Bachelor of Engineering)\b/i.test(text)) {
    degree = 'B.Tech / B.E.';
    highest_qualification = 'Graduation';
  } else if (/\b(BCA|Bachelor of Computer Applications)\b/i.test(text)) {
    degree = 'BCA';
    highest_qualification = 'Graduation';
  } else if (/\b(B\.?Sc|Bachelor of Science)\b/i.test(text)) {
    degree = 'B.Sc';
    highest_qualification = 'Graduation';
  }

  // 7. Specialization Detection (Precise contextual matching)
  let specialization = '';
  // Check exact specialization keywords in priority order
  if (/\b(Information Technology|IT)\b/i.test(text)) {
    specialization = 'Information Technology';
  } else if (/\b(Artificial Intelligence|Machine Learning|AIML|Data Science)\b/i.test(text)) {
    specialization = 'Artificial Intelligence & Machine Learning';
  } else if (/\b(Computer Science|CSE|Software Engineering)\b/i.test(text)) {
    specialization = 'Computer Science and Engineering';
  } else if (/\b(Electronics & Communication|ECE|Electronics|Electrical)\b/i.test(text)) {
    specialization = 'Electronics & Communication Engineering';
  } else if (/\b(Mechanical)\b/i.test(text)) {
    specialization = 'Mechanical Engineering';
  } else if (/\b(Civil)\b/i.test(text)) {
    specialization = 'Civil Engineering';
  } else {
    specialization = 'Computer Science and Engineering';
  }

  // 8. Graduation Year (Handles formats: 2023 - 2027, 2023-2027, 2023 – 2027, Expected 2027, Class of 2027, 2027)
  let graduation_year = '';
  // Pattern 1: Range like 2023 – 2027 or 2023 - Present -> take end year
  const rangeMatch = text.match(/20\d{2}\s*[-–—to]+\s*(20\d{2}|Present)/i);
  if (rangeMatch) {
    graduation_year = rangeMatch[1].toLowerCase() === 'present' ? '2027' : rangeMatch[1];
  } else {
    // Pattern 2: Look for 4-digit graduation years between 2020 and 2030
    const futureOrRecentYears = text.match(/\b(202[0-9]|2030)\b/g);
    if (futureOrRecentYears && futureOrRecentYears.length > 0) {
      // Pick the latest reasonable year found in education context
      graduation_year = futureOrRecentYears[futureOrRecentYears.length - 1];
    }
  }

  // 9. College / University Detection (Multi-format)
  let college = '';
  // Common keywords identifying educational institutions in India & globally
  const collegeRegex = /([A-Z][a-zA-Z\s&',.-]+(?:Group of Institutions|Institutions|Institute of Technology|Institute of Engineering|Institute|University|College of Engineering|College|NNRG|IIT|NIT|IIIT|BITS|VIT|SRM)[a-zA-Z\s()]*)/;
  const collegeMatch = text.match(collegeRegex);
  if (collegeMatch) {
    college = collegeMatch[0].split('\n')[0].trim();
    // Clean trailing words like 'Hyderabad', 'EDUCATION', etc.
    college = college.replace(/\s+(Education|Work Experience|Projects|Technical Skills).*/i, '').trim();
  }

  // 10. City Detection
  const cities = [
    'Hyderabad', 'Bangalore', 'Bengaluru', 'Jaipur', 'Delhi', 'New Delhi', 
    'Noida', 'Gurgaon', 'Gurugram', 'Pune', 'Mumbai', 'Chennai', 'Kolkata', 
    'Ahmedabad', 'Chandigarh', 'Indore', 'Kochi', 'Coimbatore', 'Bhubaneswar'
  ];
  let current_city = '';
  for (const city of cities) {
    const cityRegex = new RegExp(`\\b${city}\\b`, 'i');
    if (cityRegex.test(text)) {
      current_city = city;
      break;
    }
  }

  return {
    full_name,
    email,
    phone,
    whatsapp_number: phone,
    linkedin_url,
    github_url,
    portfolio_url,
    skills: Array.from(detectedSkills),
    highest_qualification,
    degree,
    specialization,
    college,
    graduation_year,
    current_city
  };
}
