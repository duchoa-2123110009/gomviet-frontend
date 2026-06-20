import { categoriesTree } from '../data/categories';
import {
  Laptop, Megaphone, BadgeDollarSign, Calculator, Users, Palette,
  Building2, BookOpen, Award, CheckCircle2, Briefcase
} from 'lucide-react';

const iconMap = {
  'Laptop': Laptop,
  'Megaphone': Megaphone,
  'BadgeDollarSign': BadgeDollarSign,
  'Calculator': Calculator,
  'Users': Users,
  'Palette': Palette,
  'Building2': Building2,
  'BookOpen': BookOpen,
  'Award': Award,
  'CheckCircle2': CheckCircle2
};

// Get icon component by name
export const getCategoryIcon = (iconName) => {
  return iconMap[iconName] || Briefcase;
};

// Get full category tree
export const getCategoryTree = () => {
  return categoriesTree;
};

// Get all parent categories
export const getParentCategories = () => {
  return categoriesTree;
};

// Get child categories by parent ID
export const getChildCategories = (parentId) => {
  const parent = categoriesTree.find(cat => cat.id === parentId);
  return parent?.children || [];
};

// Get category by ID (including children)
export const getCategoryById = (id) => {
  for (const parent of categoriesTree) {
    if (parent.id === id) return parent;
    if (parent.children) {
      const found = parent.children.find(child => child.id === id);
      if (found) {
        return {
          ...found,
          parent: parent
        };
      }
    }
  }
  return null;
};

// Get category by slug
export const getCategoryBySlug = (slug) => {
  for (const parent of categoriesTree) {
    if (parent.slug === slug) return parent;
    if (parent.children) {
      const found = parent.children.find(child => child.slug === slug);
      if (found) {
        return {
          ...found,
          parent: parent
        };
      }
    }
  }
  return null;
};

// Get parent category of a child
export const getParentCategory = (childId) => {
  for (const parent of categoriesTree) {
    if (parent.children?.find(child => child.id === childId)) {
      return parent;
    }
  }
  return null;
};

// Search categories (for autocomplete)
export const searchCategories = (query) => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const q = query.toLowerCase();
  const results = [];

  categoriesTree.forEach(parent => {
    // Search in parent categories
    if (parent.name.toLowerCase().includes(q)) {
      results.push({
        ...parent,
        type: 'parent',
        displayText: parent.name
      });
    }

    // Search in child categories
    if (parent.children) {
      parent.children.forEach(child => {
        if (child.name.toLowerCase().includes(q)) {
          results.push({
            ...child,
            type: 'child',
            parent: parent,
            displayText: `${child.name} (${parent.name})`
          });
        }
      });
    }
  });

  // Sort by relevance (exact match first, then starts with query, then contains)
  results.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    if (aName === q) return -1;
    if (bName === q) return 1;

    if (aName.startsWith(q) && !bName.startsWith(q)) return -1;
    if (!aName.startsWith(q) && bName.startsWith(q)) return 1;

    return 0;
  });

  return results;
};

// Get flat list of all categories (parent + child)
export const getAllCategories = () => {
  const allCats = [];
  categoriesTree.forEach(parent => {
    allCats.push({
      ...parent,
      type: 'parent'
    });
    if (parent.children) {
      parent.children.forEach(child => {
        allCats.push({
          ...child,
          type: 'child',
          parent: parent
        });
      });
    }
  });
  return allCats;
};

// Get category display text with parent (for child categories)
export const getCategoryDisplayText = (category) => {
  if (category.type === 'parent') {
    return category.name;
  }

  if (category.type === 'child' && category.parent) {
    return `${category.name} (${category.parent.name})`;
  }

  // Fallback: if child without parent info
  const parent = getParentCategory(category.id);
  if (parent) {
    return `${category.name} (${parent.name})`;
  }

  return category.name;
};

// Debounced search function
export const createDebouncedSearch = (searchFn, delay = 300) => {
  let timeoutId;
  return (query) => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        resolve(searchFn(query));
      }, delay);
    });
  };
};

// Get categories for filter (used in dropdowns)
export const getCategoriesForFilter = () => {
  return categoriesTree.map(cat => ({
    value: cat.id.toString(),
    label: cat.name,
    icon: getCategoryIcon(cat.icon)
  }));
};

// Check if category exists
export const categoryExists = (id) => {
  return getCategoryById(id) !== null;
};

// Get category color
export const getCategoryColor = (id) => {
  const category = getCategoryById(id);
  return category?.color || 'bg-slate-50 text-slate-650 border-slate-100';
};

// Get category display name (handles both parent and child)
export const getCategoryName = (id) => {
  const category = getCategoryById(id);
  if (!category) return null;

  if (category.type === 'parent') {
    return category.name;
  }

  if (category.parent) {
    return `${category.name} (${category.parent.name})`;
  }

  return category.name;
};
