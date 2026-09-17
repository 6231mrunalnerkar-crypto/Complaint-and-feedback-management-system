const CATEGORY_STORAGE_KEY = "cfms_complaint_categories";

const defaultCategories = [
  "Infrastructure",
  "Library",
  "Canteen",
  "Academic",
  "Appliances",
  "Hostel",
  "Faculty / Staff",
  "Ragging / Bullying",
  "Harassment / Misconduct",
  "Campus Safety / Crime",
  "IT / Computer",
  "Transport",
  "Cleanliness / Sanitation",
  "Administration / Fees",
  "Other",
];

export const getStoredCategories = () => {
  const stored = localStorage.getItem(CATEGORY_STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      CATEGORY_STORAGE_KEY,
      JSON.stringify(defaultCategories)
    );

    return defaultCategories;
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return defaultCategories;
    }

    const cleaned = parsed
      .map((category) => String(category || "").trim())
      .filter(Boolean);

    return [...new Set(cleaned)];
  } catch (error) {
    console.error("Error reading complaint categories:", error);

    return defaultCategories;
  }
};

export const saveCategory = (categoryName) => {
  const cleanName = String(categoryName || "").trim();

  if (!cleanName) {
    return getStoredCategories();
  }

  const current = getStoredCategories();

  const exists = current.some(
    (category) =>
      category.toLowerCase() === cleanName.toLowerCase()
  );

  if (exists) {
    return current;
  }

  const updated = [...current, cleanName];

  localStorage.setItem(
    CATEGORY_STORAGE_KEY,
    JSON.stringify(updated)
  );

  return updated;
};