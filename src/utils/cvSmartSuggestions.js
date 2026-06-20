// Rule-based CV smart suggestions (no AI API)

const normalize = (s) => (s || '').toString().toLowerCase().trim();

const uniq = (arr) => {
  const set = new Set(arr);
  return Array.from(set).filter(Boolean);
};

const pushIf = (arr, value) => {
  if (!value) return;
  if (!arr.includes(value)) arr.push(value);
};

// A small keyword-to-sector mapping.
// Note: categories in this project likely use category slugs; we fall back to string values
// when a slug is not available.
const sectorRules = [
  {
    key: 'it',
    keywords: ['it', 'công nghệ thông tin', 'cntt', 'software', 'developer', 'programming', 'lập trình', 'computer', 'science', 'web', 'frontend', 'backend', 'fullstack', 'data', 'ai', 'ml'],
    suggests: {
      positions: [
        { slug: 'web-developer', label: 'Web Developer' },
        { slug: 'frontend-developer', label: 'Frontend Developer' },
        { slug: 'backend-developer', label: 'Backend Developer' },
        { slug: 'fullstack-developer', label: 'Fullstack Developer' },
        { slug: 'data-analyst', label: 'Data Analyst' },
      ],
      skills: [
        { name: 'JavaScript', level: 'intermediate' },
        { name: 'React', level: 'intermediate' },
        { name: 'Node.js', level: 'intermediate' },
        { name: 'SQL', level: 'intermediate' },
        { name: 'Git', level: 'intermediate' },
        { name: 'Problem Solving', level: 'beginner' },
      ],
      certificates: [
        { name: 'Google IT Support', issuer: 'Google', issueDate: '', expiryDate: '', credentialUrl: '' },
        { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: '', expiryDate: '', credentialUrl: '' },
        { name: 'Microsoft Certified: Azure Fundamentals', issuer: 'Microsoft', issueDate: '', expiryDate: '', credentialUrl: '' },
      ],
      languages: [
        { language: 'Tiếng Anh', level: 'intermediate' },
      ],
      projects: [
        { name: 'Web App: Job Matching Platform', description: 'Xây dựng ứng dụng tìm kiếm việc làm có lọc & gợi ý CV theo ngành.', role: 'Developer', startDate: '', endDate: '', technologies: ['React', 'Node.js'], link: '' },
        { name: 'Dashboard: Analytics & Insights', description: 'Xây dựng dashboard hiển thị chỉ số bằng biểu đồ, có CRUD cho dữ liệu.', role: 'Fullstack Developer', startDate: '', endDate: '', technologies: ['React', 'SQL'], link: '' },
      ],
    },
  },
  {
    key: 'marketing',
    keywords: ['marketing', 'truyền thông', 'digital marketing', 'seo', 'sem', 'ads', 'content', 'social', 'branding'],
    suggests: {
      positions: [
        { slug: 'digital-marketing', label: 'Digital Marketing' },
        { slug: 'seo', label: 'SEO Specialist' },
        { slug: 'content-marketer', label: 'Content Marketer' },
      ],
      skills: [
        { name: 'SEO', level: 'intermediate' },
        { name: 'Google Analytics', level: 'beginner' },
        { name: 'Content Writing', level: 'intermediate' },
        { name: 'Communication', level: 'intermediate' },
      ],
      certificates: [
        { name: 'Google Analytics Certification', issuer: 'Google', issueDate: '', expiryDate: '', credentialUrl: '' },
        { name: 'HubSpot Content Marketing Certification', issuer: 'HubSpot', issueDate: '', expiryDate: '', credentialUrl: '' },
      ],
      languages: [
        { language: 'Tiếng Anh', level: 'intermediate' },
      ],
      projects: [
        { name: 'SEO Case Study', description: 'Phân tích từ khóa, tối ưu nội dung và đo hiệu quả bằng GA/ Search Console.', role: 'SEO', startDate: '', endDate: '', technologies: ['SEO', 'Google Analytics'], link: '' },
      ],
    },
  },
];

const detectSector = (text) => {
  const t = normalize(text);
  for (const rule of sectorRules) {
    if (rule.keywords.some((kw) => t.includes(normalize(kw)))) {
      return rule;
    }
  }
  return null;
};

export const getCvSmartSuggestions = (formData) => {
  const educationFieldTexts = (formData?.education || [])
    .map((e) => [e.schoolName, e.field, e.degree].filter(Boolean).join(' '))
    .join(' ');

  const expText = (formData?.experience || [])
    .map((x) => [x.companyName, x.position, x.description].filter(Boolean).join(' '))
    .join(' ');

  const skillsText = (formData?.skills || [])
    .map((s) => [s.name].filter(Boolean).join(' '))
    .join(' ');

  const allText = [educationFieldTexts, expText, skillsText].join(' | ');
  const sector = detectSector(allText);

  if (!sector) {
    return {
      detectedKey: null,
      suggestions: [],
      appliedPreview: null,
    };
  }

  const s = sector.suggests;

  const existingPositions = new Set(formData?.careerPreferences?.targetPositions || []);
  const existingSkills = new Set((formData?.skills || []).map((x) => x.name));
  const existingCerts = new Set((formData?.certificates || []).map((c) => c.name));
  const existingProjects = new Set((formData?.projects || []).map((p) => p.name));
  const existingLanguages = new Set((formData?.languages || []).map((l) => l.language));

  const candidatePositions = s.positions
    .filter((p) => !existingPositions.has(p.slug))
    .map((p) => ({ ...p }));

  const candidateSkills = s.skills
    .filter((sk) => !existingSkills.has(sk.name))
    .map((sk) => ({ ...sk }));

  const candidateCertificates = s.certificates
    .filter((c) => !existingCerts.has(c.name))
    .map((c) => ({ ...c }));

  const candidateProjects = s.projects
    .filter((p) => !existingProjects.has(p.name))
    .map((p) => ({ ...p }));

  const candidateLanguages = s.languages
    .filter((l) => !existingLanguages.has(l.language))
    .map((l) => ({ ...l }));

  return {
    detectedKey: sector.key,
    suggestions: [
      {
        type: 'positions',
        title: 'Vị trí phù hợp',
        items: candidatePositions,
      },
      {
        type: 'skills',
        title: 'Kỹ năng nên bổ sung',
        items: candidateSkills,
      },
      {
        type: 'certificates',
        title: 'Chứng chỉ gợi ý',
        items: candidateCertificates,
      },
      {
        type: 'projects',
        title: 'Dự án gợi ý',
        items: candidateProjects,
      },
      {
        type: 'languages',
        title: 'Ngôn ngữ nên có',
        items: candidateLanguages,
      },
    ].filter((block) => block.items.length > 0),
  };
};

export const applyCvSmartSuggestions = (formData, suggestionsPayload) => {
  if (!suggestionsPayload?.detectedKey) return formData;

  const next = structuredClone(formData);

  const byType = new Map((suggestionsPayload?.suggestions || []).map((x) => [x.type, x.items]));

  const positionsItems = byType.get('positions') || [];
  if (positionsItems.length > 0) {
    for (const p of positionsItems) {
      if (!next.careerPreferences.targetPositions.includes(p.slug)) {
        next.careerPreferences.targetPositions.push(p.slug);
      }
    }
  }

  const skillsItems = byType.get('skills') || [];
  if (skillsItems.length > 0) {
    for (const sk of skillsItems) {
      next.skills.push({ name: sk.name, level: sk.level });
    }
  }

  const certItems = byType.get('certificates') || [];
  if (certItems.length > 0) {
    for (const c of certItems) {
      next.certificates.push({
        name: c.name,
        issuer: c.issuer,
        issueDate: c.issueDate,
        expiryDate: c.expiryDate,
        credentialUrl: c.credentialUrl,
      });
    }
  }

  const projItems = byType.get('projects') || [];
  if (projItems.length > 0) {
    for (const p of projItems) {
      next.projects.push({
        name: p.name,
        description: p.description,
        role: p.role,
        startDate: p.startDate,
        endDate: p.endDate,
        technologies: p.technologies || [],
        link: p.link,
      });
    }
  }

  const langItems = byType.get('languages') || [];
  if (langItems.length > 0) {
    for (const l of langItems) {
      next.languages.push({ language: l.language, level: l.level });
    }
  }

  return next;
};

export const getQuickCvSmartSuggestions = ({ title, education, skillsText }) => {
  const educationField = education || '';
  const inferred = detectSector([title, educationField, skillsText].join(' '));
  if (!inferred) return null;

  return inferred.suggests;
};

