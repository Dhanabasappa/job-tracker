// Helper function to build search query from profile preferences
export const buildSearchQuery = (profile = {}) => {
  const { targetRole, skills } = profile;
  // Use top 5 skills for better API results (long queries return 0 results)
  // APIs perform better with focused, concise queries rather than long skill lists
  if (Array.isArray(skills) && skills.length > 0) {
    const topSkills = skills.slice(0, 5); // Top 5 skills for focused search
    return topSkills.join(' ');
  }
  if (targetRole && String(targetRole).trim()) return String(targetRole).trim();
  return '';
};

// Client-side backoff state for Adzuna (avoid repeated CORS/429 retries)
let adzunaBackoffUntil = 0;
const ADZUNA_BACKOFF_MS = 5 * 60 * 1000; // 5 minutes

// Helper: fetch with timeout (used by public providers)
const fetchWithTimeout = async (url, opts = {}, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const resp = await fetch(url, { signal: controller.signal, ...opts });
    return resp;
  } finally {
    clearTimeout(id);
  }
};

// Canonical mapper to app job shape 
const mapToCanonical = (j) => ({
  id: j.id || j.job_id || j.jobId || (j.job_apply_link || j.url || '') + '' ,
  job_title: j.title || j.job_title || j.position || '',
  employer_name: j.company_name || j.employer || j.company || j.employer_name || '',
  job_description: j.description || j.job_description || j.summary || '',
  job_city: j.city || (j.location && j.location.city) || j.location || j.job_city || '',
  job_state: j.region || (j.location && j.location.state) || j.state || j.job_state || '',
  job_country: j.country || (j.location && j.location.country) || j.job_country || '',
  job_type: j.job_type || j.type || '',
  salary_min: j.salary_min || j.min_salary || null,
  salary_max: j.salary_max || j.max_salary || null,
  posted_at: j.posted_at || j.publication_date || j.date_posted || new Date().toISOString(),
  job_apply_link: j.apply_url || j.url || j.job_apply_link || j.redirect_url || '',
  job_apply_quality_score: j.job_apply_quality_score || j.score || j.relevance_score || 70,
});

// Dedupe results by apply link or id
export const dedupeJobs = (jobs) => {
  const seen = new Set();
  const out = [];
  for (const j of jobs) {
    const key = (j.job_apply_link || j.id || j.job_title || '').toString();
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(j);
  }
  return out;
};

export const searchJobsPublic = async (searchParams) => {
  const { query, page = 1 } = searchParams;
  // Use centralized `mapToCanonical` and `dedupeJobs` defined at module scope
    const results = [];
    // 1) Y Combinator Jobs (highest priority)
    try {
      console.log('🌐 [searchJobsPublic] Trying Y Combinator Jobs');

      const ycResp = await fetchWithTimeout(
        'https://free-y-combinator-jobs-api.p.rapidapi.com/active-jb-7d',
        {
          headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'free-y-combinator-jobs-api.p.rapidapi.com',
          },
        },
        8000
      );

      if (ycResp.ok) {
        const ycData = await ycResp.json();

        const ycJobs = (ycData || []).map(j =>
          mapToCanonical({
            id: j.id || `${j.company}-${j.title}`,
            title: j.title,
            company_name: j.company,
            description: j.description,
            location: j.location || 'Remote',
            job_type: j.remote ? 'Remote' : 'On-site',
            url: j.apply_url || j.url,
            date_posted: j.posted_at,
            score: 90, // YC jobs are high quality
          })
        );

        results.push(...ycJobs);
        console.log('✅ [searchJobsPublic] YC returned', ycJobs.length);
      }
    } catch (e) {
      console.warn('⚠️ [searchJobsPublic] YC error:', e.message);
    }
    // 2)remotive
    try {
      console.log('🌐 [searchJobsPublic] Trying Remotive for:', query);
      const remUrl = new URL('https://remotive.com/api/remote-jobs');
      if (query) remUrl.searchParams.append('search', query);
      const remResp = await fetchWithTimeout(remUrl.toString(), {}, 8000);
      if (remResp && remResp.ok) {
        const remData = await remResp.json();
        const remJobs = (remData.jobs || []).map(j => mapToCanonical({
          id: j.id || `${j.company_name}-${j.title}`.replace(/\s+/g, '-'),
          title: j.title,
          company_name: j.company_name,
          description: j.description,
          location: j.candidate_required_location || 'Remote',
          job_type: j.job_type,
          publication_date: j.publication_date,
          url: j.url,
          score: j.salary ? 85 : 75,
        }));
        results.push(...remJobs);
        console.log('✅ [searchJobsPublic] Remotive returned', remJobs.length);
      } else {
        console.warn('⚠️ [searchJobsPublic] Remotive non-ok or timed out');
      }
    } catch (e) {
      console.warn('⚠️ [searchJobsPublic] Remotive error:', e.message);
    }
    // 3) No RapidAPI fallback anymore - we prefer Remotive -> Adzuna -> mock
    const final = dedupeJobs(results);
    if (final.length > 0) {
      console.log('🔚 [searchJobsPublic] Returning', final.length, 'jobs from public providers');
      return final;
    }

    console.warn('⚠️ [searchJobsPublic] No providers returned jobs; falling back to mock');
    return getMockJobs(query);
};

// Search for jobs from specific companies (enhanced company search)
export const searchCompanyJobs = async (companyName, searchParams = {}) => {
  try {
    console.log('🏢 [searchCompanyJobs] Searching for jobs at company:', companyName);
    
    // Try to search with company name and optional additional parameters
    const searchQuery = `${companyName} ${searchParams.role || 'developer'}`;
    
    const results = await searchJobs({
      query: searchQuery,
      page: searchParams.page || 1,
      num_pages: searchParams.num_pages || 2,
      date_posted: searchParams.date_posted || 'month',
      remote_jobs_only: searchParams.remote_jobs_only || false,
    });

    // Filter results to only include jobs from the specified company
    const companyJobs = results.filter(job => {
      const jobCompany = (job.employer_name || job.company || '').toLowerCase();
      return jobCompany.includes(companyName.toLowerCase());
    });

    console.log(`✅ [searchCompanyJobs] Found ${companyJobs.length} jobs at ${companyName}`);
    return companyJobs;
  } catch (error) {
    console.error('❌ [searchCompanyJobs] Error searching company jobs:', error.message);
    return [];
  }
};

// Primary search entrypoint used by the app. Uses public-priority search path (Remotive -> Adzuna -> mock).
export const searchJobs = async (searchParams) => {
  // Use the public-priority search path: Remotive -> Adzuna -> mock
  return searchJobsPublic(searchParams);
};

// Get enhanced job data with additional technical features
export const enrichJobData = (jobs) => {
  return jobs.map(job => ({
    ...job,
    // Add technical metadata
    technologies: extractTechnologies(job.description || job.job_description || ''),
    seniority: detectSeniority(job.title || job.job_title || ''),
    skillsRequired: extractSkills(job.description || job.job_description || ''),
    difficultyScore: calculateDifficulty(job.description || job.job_description || ''),
    matchScore: 0, // Will be calculated based on user profile
    // Normalize company name for better searching
    normalizedCompany: normalizeCompanyName(job.employer_name || job.company || ''),
  }));
};

// Normalize company names to handle variations (Google, Google Inc, Google LLC, etc.)
const normalizeCompanyName = (companyName) => {
  if (!companyName) return '';
  return companyName
    .toLowerCase()
    .replace(/\s+(inc|inc\.|incorporated|ltd|ltd\.|llc|llc\.|corp|corp\.|corporation|gmbh|sa|ag|ab|oy|as|asa|cv|bv|nv|se|srl|sarl|sp\.|sas|gp|lp|plc|pty|holdings|group|brands|entertainment|technologies|systems|services|partners|ventures|labs|hub|studio|agency|co|co\.|com|net|org|io|ai)(\s|$)/g, ' ')
    .trim();
};

// Extract technologies mentioned in job description
const extractTechnologies = (description) => {
  const techKeywords = [
    'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'C++', 'C#',
    'TypeScript', 'JavaScript', 'GraphQL', 'REST', 'SQL', 'MongoDB',
    'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Microservices',
    'Next.js', 'FastAPI', 'Spring', 'Django', 'Flask', 'Go', 'Rust',
  ];

  const found = [];
  const lowerDesc = description.toLowerCase();

  techKeywords.forEach(tech => {
    if (lowerDesc.includes(tech.toLowerCase())) {
      found.push(tech);
    }
  });

  return found;
};

// Detect seniority level from job title
const detectSeniority = (title) => {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('intern') || titleLower.includes('junior')) {
    return 'Junior';
  } else if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal')) {
    return 'Senior';
  } else if (titleLower.includes('staff') || titleLower.includes('principal') || titleLower.includes('architect')) {
    return 'Staff/Architect';
  }

  return 'Mid-level';
};

// Extract required skills from description
const extractSkills = (description) => {
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular',
    'Node.js', 'Python', 'Java', 'C++', 'C#',
    'GraphQL', 'REST API', 'SQL', 'MongoDB',
    'AWS', 'Docker', 'Kubernetes', 'Git',
    'System Design', 'Microservices', 'OOP',
  ];

  const found = [];
  const lowerDesc = description.toLowerCase();

  skillKeywords.forEach(skill => {
    if (lowerDesc.includes(skill.toLowerCase())) {
      found.push(skill);
    }
  });

  return found;
};

// Calculate difficulty score based on keywords and requirements
const calculateDifficulty = (description) => {
  const lowerDesc = description.toLowerCase();
  let score = 0;

  // Check for advanced concepts
  const advancedKeywords = ['microservices', 'system design', 'distributed', 'scalability', 'ml', 'ai', 'blockchain'];
  advancedKeywords.forEach(keyword => {
    if (lowerDesc.includes(keyword)) score += 2;
  });

  // Check for multiple technologies
  const techCount = [
    'react', 'vue', 'angular', 'node.js', 'python', 'java', 'c++', 'c#',
    'typescript', 'graphql', 'rest', 'sql', 'mongodb', 'aws', 'docker',
  ].filter(tech => lowerDesc.includes(tech)).length;

  score += Math.min(techCount * 0.5, 5);

  // Check for "nice to have" vs "required"
  if (lowerDesc.includes('required')) score += 1;
  if (lowerDesc.includes('nice to have')) score -= 0.5;

  return Math.min(Math.round(score), 10);
};

// Calculate match score between job and user profile
export const calculateMatchScore = (job, userProfile) => {
  if (!userProfile) return 0;

  let score = 0;
  const maxScore = 100;

  // 1. Match technologies (30% weight)
  const jobTechs = job.technologies || [];
  const userSkills = userProfile.skills || [];
  
  let techMatches = 0;
  let techMatchPercentage = 0;
  
  if (jobTechs.length > 0) {
    techMatches = jobTechs.filter(tech => 
      userSkills.some(skill => skill.toLowerCase().includes(tech.toLowerCase()) || tech.toLowerCase().includes(skill.toLowerCase()))
    ).length;
    techMatchPercentage = (techMatches / jobTechs.length) * 100;
  }
  
  score += (techMatchPercentage / 100) * 30;

  // 2. Match target role (25% weight)
  let roleScore = 0;
  if (job.title && userProfile.targetRole) {
    const jobTitle = job.title.toLowerCase();
    const targetRole = userProfile.targetRole.toLowerCase();
    
    // Exact match or high similarity
    if (jobTitle === targetRole || jobTitle.includes(targetRole) || targetRole.includes(jobTitle.split(' ')[0])) {
      roleScore = 25;
    } else {
      // Partial match (e.g., "Engineer" in role)
      const roleKeywords = targetRole.split(' ');
      const matchedKeywords = roleKeywords.filter(keyword => jobTitle.includes(keyword)).length;
      roleScore = (matchedKeywords / roleKeywords.length) * 25;
    }
  }
  score += roleScore;

  // 3. Match location/remote preference (20% weight)
  let locationScore = 0;
  if (userProfile.remotePreference) {
    const jobType = (job.job_type || '').toLowerCase();
    const preference = userProfile.remotePreference.toLowerCase();
    
    if (preference === 'any') {
      locationScore = 20;
    } else if (jobType === 'remote' && preference.includes('remote')) {
      locationScore = 20;
    } else if ((jobType === 'hybrid' || jobType === 'on-site') && !preference.includes('remote')) {
      locationScore = 15;
    } else if (jobType.includes(preference)) {
      locationScore = 20;
    }
  }
  score += locationScore;

  // 4. Match company preference (15% weight)
  let companyScore = 0;
  if (userProfile.targetCompanies && userProfile.targetCompanies.length > 0) {
    const jobCompany = (job.employer_name || '').toLowerCase();
    const companyMatch = userProfile.targetCompanies.some(company => 
      jobCompany.includes(company.toLowerCase()) || company.toLowerCase().includes(jobCompany)
    );
    if (companyMatch) {
      companyScore = 15;
    }
  }
  score += companyScore;

  // 5. Experience level match (10% weight)
  let experienceScore = 0;
  if (userProfile.yearsOfExperience && job.seniority) {
    const userExp = parseInt(userProfile.yearsOfExperience) || 0;
    const jobSeniority = job.seniority.toLowerCase();
    
    if ((userExp < 2 && jobSeniority.includes('junior')) ||
        (userExp >= 2 && userExp < 5 && (jobSeniority.includes('mid') || jobSeniority.includes('junior'))) ||
        (userExp >= 5 && (jobSeniority.includes('senior') || jobSeniority.includes('mid')))) {
      experienceScore = 10;
    } else {
      // Partial match
      experienceScore = 5;
    }
  }
  score += experienceScore;

  // Boost for perfect matches (when all key criteria match)
  if (roleScore === 25 && techMatchPercentage >= 80 && companyScore > 0) {
    score = Math.min(score * 1.1, 100);
  }

  return Math.round(Math.min(score, 100));
};

// Mock jobs data for development/fallback
export const getMockJobs = (query) => {
  // Rich mock jobs that include popular tech companies
  return [
    {
      id: 'mock-google-1',
      job_title: 'Senior Software Engineer - Frontend',
      employer_name: 'Google Inc',
      job_description: 'Google is hiring Senior Software Engineers with expertise in React, TypeScript, and modern web technologies. Work on products used by billions. Competitive salary and benefits.',
      job_city: 'Mountain View',
      job_state: 'CA',
      job_country: 'USA',
      job_type: 'Hybrid',
      salary_min: 200000,
      salary_max: 300000,
      posted_at: new Date().toISOString(),
      job_apply_link: 'https://careers.google.com',
      job_apply_quality_score: 98,
    },
    {
      id: 'mock-netflix-1',
      job_title: 'Full Stack Engineer',
      employer_name: 'Netflix Inc',
      job_description: 'Netflix is looking for talented full-stack engineers to build amazing entertainment experiences. Experience with React, Node.js, AWS, and microservices a plus.',
      job_city: 'Los Gatos',
      job_state: 'CA',
      job_country: 'USA',
      job_type: 'Hybrid',
      salary_min: 180000,
      salary_max: 280000,
      posted_at: new Date(Date.now() - 86400000).toISOString(),
      job_apply_link: 'https://jobs.netflix.com',
      job_apply_quality_score: 96,
    },
    {
      id: '1',
      job_title: 'Senior React Developer',
      employer_name: 'Tech Company A',
      job_description: 'Looking for a senior React developer with 5+ years of experience. Must know TypeScript, GraphQL, AWS, and system design.',
      job_city: 'San Francisco',
      job_state: 'CA',
      job_country: 'USA',
      job_type: 'Remote',
      salary_min: 150000,
      salary_max: 200000,
      posted_at: new Date(Date.now() - 172800000).toISOString(),
      job_apply_link: '#',
      job_apply_quality_score: 95,
    },
    {
      id: '2',
      job_title: 'Full Stack Developer (Node.js + React)',
      employer_name: 'StartUp Inc',
      job_description: 'Join our team as a Full Stack Developer. Experience with Node.js, React, PostgreSQL, Docker, and Kubernetes required.',
      job_city: 'New York',
      job_state: 'NY',
      job_country: 'USA',
      job_type: 'Hybrid',
      salary_min: 120000,
      salary_max: 160000,
      posted_at: new Date(Date.now() - 259200000).toISOString(),
      job_apply_link: '#',
      job_apply_quality_score: 88,
    },
    {
      id: '3',
      job_title: 'Python Backend Engineer',
      employer_name: 'DataTech Solutions',
      job_description: 'Seeking a Python backend engineer with expertise in FastAPI, microservices, and distributed systems.',
      job_city: 'Remote',
      job_state: 'Remote',
      job_country: 'USA',
      job_type: 'Remote',
      salary_min: 130000,
      salary_max: 180000,
      posted_at: new Date(Date.now() - 172800000).toISOString(),
      job_apply_link: '#',
      job_apply_quality_score: 92,
    },
    {
      id: '4',
      job_title: 'Frontend Engineer - Vue.js',
      employer_name: 'Design Studio',
      job_description: 'We are looking for a frontend engineer with Vue.js experience. TypeScript, Tailwind CSS, and responsive design skills required.',
      job_city: 'Austin',
      job_state: 'TX',
      job_country: 'USA',
      job_type: 'On-site',
      salary_min: 100000,
      salary_max: 140000,
      posted_at: new Date(Date.now() - 259200000).toISOString(),
      job_apply_link: '#',
      job_apply_quality_score: 85,
    },
    {
      id: '5',
      job_title: 'DevOps Engineer',
      employer_name: 'Cloud Infrastructure Co',
      job_description: 'Experienced DevOps engineer needed. Must have AWS, Docker, Kubernetes, and CI/CD pipeline experience.',
      job_city: 'Seattle',
      job_state: 'WA',
      job_country: 'USA',
      job_type: 'Hybrid',
      salary_min: 140000,
      salary_max: 190000,
      posted_at: new Date(Date.now() - 345600000).toISOString(),
      job_apply_link: '#',
      job_apply_quality_score: 90,
    },
  ];
};

export default {
  buildSearchQuery,
  searchJobs,
  searchJobsPublic,
  enrichJobData,
  calculateMatchScore,
  getMockJobs,
};
