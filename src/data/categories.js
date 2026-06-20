export const categoriesTree = [
  {
    id: 1,
    name: 'Công Nghệ Thông Tin',
    slug: 'it',
    icon: 'Laptop',
    color: 'bg-indigo-50 text-indigo-650 border-indigo-100',
    children: [
      { id: 101, name: 'Backend Developer', slug: 'backend-developer', parentId: 1 },
      { id: 102, name: 'Frontend Developer', slug: 'frontend-developer', parentId: 1 },
      { id: 103, name: 'Fullstack Developer', slug: 'fullstack-developer', parentId: 1 },
      { id: 104, name: 'DevOps Engineer', slug: 'devops-engineer', parentId: 1 },
      { id: 105, name: 'QA Engineer', slug: 'qa-engineer', parentId: 1 },
      { id: 106, name: 'Mobile Developer', slug: 'mobile-developer', parentId: 1 },
      { id: 107, name: 'Data Engineer', slug: 'data-engineer', parentId: 1 },
      { id: 108, name: 'AI/ML Engineer', slug: 'ai-ml-engineer', parentId: 1 }
    ]
  },
  {
    id: 2,
    name: 'Marketing & Truyền Thông',
    slug: 'marketing',
    icon: 'Megaphone',
    color: 'bg-rose-50 text-rose-650 border-rose-100',
    children: [
      { id: 201, name: 'Digital Marketing Manager', slug: 'digital-marketing-manager', parentId: 2 },
      { id: 202, name: 'Content Creator', slug: 'content-creator', parentId: 2 },
      { id: 203, name: 'Social Media Manager', slug: 'social-media-manager', parentId: 2 },
      { id: 204, name: 'SEO Specialist', slug: 'seo-specialist', parentId: 2 },
      { id: 205, name: 'Graphic Designer', slug: 'graphic-designer-marketing', parentId: 2 },
      { id: 206, name: 'Brand Manager', slug: 'brand-manager', parentId: 2 }
    ]
  },
  {
    id: 3,
    name: 'Kinh Doanh & Bán Hàng',
    slug: 'sales',
    icon: 'BadgeDollarSign',
    color: 'bg-amber-50 text-amber-650 border-amber-100',
    children: [
      { id: 301, name: 'Sales Executive', slug: 'sales-executive', parentId: 3 },
      { id: 302, name: 'Account Manager', slug: 'account-manager', parentId: 3 },
      { id: 303, name: 'Business Development Manager', slug: 'biz-dev-manager', parentId: 3 },
      { id: 304, name: 'Sales Manager', slug: 'sales-manager', parentId: 3 },
      { id: 305, name: 'Customer Success Manager', slug: 'customer-success-manager', parentId: 3 },
      { id: 306, name: 'Inside Sales', slug: 'inside-sales', parentId: 3 },
      { id: 307, name: 'Sales Support', slug: 'sales-support', parentId: 3 }
    ]
  },
  {
    id: 4,
    name: 'Tài Chính & Kế Toán',
    slug: 'finance',
    icon: 'Calculator',
    color: 'bg-blue-50 text-blue-650 border-blue-100',
    children: [
      { id: 401, name: 'Accountant', slug: 'accountant', parentId: 4 },
      { id: 402, name: 'Finance Manager', slug: 'finance-manager', parentId: 4 },
      { id: 403, name: 'Bookkeeper', slug: 'bookkeeper', parentId: 4 },
      { id: 404, name: 'Tax Consultant', slug: 'tax-consultant', parentId: 4 },
      { id: 405, name: 'Financial Analyst', slug: 'financial-analyst', parentId: 4 },
      { id: 406, name: 'Auditor', slug: 'auditor', parentId: 4 }
    ]
  },
  {
    id: 5,
    name: 'Nhân Sự & Hành Chính',
    slug: 'hr',
    icon: 'Users',
    color: 'bg-emerald-50 text-emerald-650 border-emerald-100',
    children: [
      { id: 501, name: 'HR Manager', slug: 'hr-manager', parentId: 5 },
      { id: 502, name: 'Recruiter', slug: 'recruiter', parentId: 5 },
      { id: 503, name: 'HR Specialist', slug: 'hr-specialist', parentId: 5 },
      { id: 504, name: 'Administrative Assistant', slug: 'admin-assistant', parentId: 5 },
      { id: 505, name: 'Office Manager', slug: 'office-manager', parentId: 5 },
      { id: 506, name: 'Talent Acquisition', slug: 'talent-acquisition', parentId: 5 },
      { id: 507, name: 'Payroll Specialist', slug: 'payroll-specialist', parentId: 5 }
    ]
  },
  {
    id: 6,
    name: 'Thiết Kế & Đồ Họa',
    slug: 'design',
    icon: 'Palette',
    color: 'bg-purple-50 text-purple-650 border-purple-100',
    children: [
      { id: 601, name: 'Graphic Designer', slug: 'graphic-designer', parentId: 6 },
      { id: 602, name: 'UX/UI Designer', slug: 'uxui-designer', parentId: 6 },
      { id: 603, name: 'Web Designer', slug: 'web-designer', parentId: 6 },
      { id: 604, name: '3D Designer', slug: '3d-designer', parentId: 6 },
      { id: 605, name: 'Motion Designer', slug: 'motion-designer', parentId: 6 },
      { id: 606, name: 'Illustrator', slug: 'illustrator', parentId: 6 }
    ]
  },
  {
    id: 7,
    name: 'Sản Xuất & Vận Hành',
    slug: 'manufacturing',
    icon: 'Building2',
    color: 'bg-amber-50 text-amber-650 border-amber-100',
    children: [
      { id: 701, name: 'Production Manager', slug: 'production-manager', parentId: 7 },
      { id: 702, name: 'Quality Assurance', slug: 'qa-manufacturing', parentId: 7 },
      { id: 703, name: 'Supply Chain Manager', slug: 'supply-chain-manager', parentId: 7 },
      { id: 704, name: 'Warehouse Manager', slug: 'warehouse-manager', parentId: 7 },
      { id: 705, name: 'Logistics Coordinator', slug: 'logistics-coordinator', parentId: 7 }
    ]
  },
  {
    id: 8,
    name: 'Giáo Dục & Đào Tạo',
    slug: 'education',
    icon: 'BookOpen',
    color: 'bg-blue-50 text-blue-650 border-blue-100',
    children: [
      { id: 801, name: 'Teacher', slug: 'teacher', parentId: 8 },
      { id: 802, name: 'Trainer', slug: 'trainer', parentId: 8 },
      { id: 803, name: 'Course Developer', slug: 'course-developer', parentId: 8 },
      { id: 804, name: 'Education Manager', slug: 'education-manager', parentId: 8 },
      { id: 805, name: 'Tutor', slug: 'tutor', parentId: 8 }
    ]
  },
  {
    id: 9,
    name: 'Y Tế & Chăm Sóc',
    slug: 'healthcare',
    icon: 'Award',
    color: 'bg-red-50 text-red-650 border-red-100',
    children: [
      { id: 901, name: 'Nurse', slug: 'nurse', parentId: 9 },
      { id: 902, name: 'Healthcare Manager', slug: 'healthcare-manager', parentId: 9 },
      { id: 903, name: 'Counselor', slug: 'counselor', parentId: 9 },
      { id: 904, name: 'Lab Technician', slug: 'lab-technician', parentId: 9 },
      { id: 905, name: 'Health Educator', slug: 'health-educator', parentId: 9 },
      { id: 906, name: 'Medical Assistant', slug: 'medical-assistant', parentId: 9 }
    ]
  },
  {
    id: 10,
    name: 'Pháp Lý & Hành Chính Công',
    slug: 'legal',
    icon: 'CheckCircle2',
    color: 'bg-slate-50 text-slate-650 border-slate-100',
    children: [
      { id: 1001, name: 'Lawyer', slug: 'lawyer', parentId: 10 },
      { id: 1002, name: 'Legal Consultant', slug: 'legal-consultant', parentId: 10 },
      { id: 1003, name: 'Compliance Officer', slug: 'compliance-officer', parentId: 10 },
      { id: 1004, name: 'Government Officer', slug: 'government-officer', parentId: 10 }
    ]
  }
];

export const getAllCategories = () => {
  const allCats = [];
  categoriesTree.forEach(parent => {
    allCats.push(parent);
    if (parent.children) {
      allCats.push(...parent.children);
    }
  });
  return allCats;
};

export const getChildCategories = (parentId) => {
  const parent = categoriesTree.find(cat => cat.id === parentId);
  return parent?.children || [];
};

export const getCategoryById = (id) => {
  for (const parent of categoriesTree) {
    if (parent.id === id) return parent;
    if (parent.children) {
      const found = parent.children.find(child => child.id === id);
      if (found) return found;
    }
  }
  return null;
};

export const getCategoryBySlug = (slug) => {
  for (const parent of categoriesTree) {
    if (parent.slug === slug) return parent;
    if (parent.children) {
      const found = parent.children.find(child => child.slug === slug);
      if (found) return found;
    }
  }
  return null;
};

export const getParentCategory = (childId) => {
  for (const parent of categoriesTree) {
    if (parent.children?.find(child => child.id === childId)) {
      return parent;
    }
  }
  return null;
};
