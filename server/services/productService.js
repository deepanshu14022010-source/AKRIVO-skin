const budgetRanges = {
  low: { label: "Rs 300-500", min: 300, max: 500 },
  medium: { label: "Rs 600-1000", min: 600, max: 1000 },
  high: { label: "Rs 1000-2500", min: 1000, max: 2500 },
  "300-500": { label: "Rs 300-500", min: 300, max: 500 },
  "600-1000": { label: "Rs 600-1000", min: 600, max: 1000 },
  "1000-2500": { label: "Rs 1000-2500", min: 1000, max: 2500 },
  "2500-5000": { label: "Rs 2500-5000", min: 2500, max: 5000 }
};

const unsafeTerms = [
  "mercury",
  "hydroquinone",
  "clobetasol",
  "betamethasone",
  "tretinoin",
  "isotretinoin",
  "skin whitening injection",
  "bleaching cream"
];

const catalog = [
  product("Cleanser", "Simple Kind To Skin Refreshing Facial Wash", "gentle gel cleanser, soap-free, no added fragrance", ["normal", "combination", "sensitive", "oily"], ["300-500", "600-1000"], [], 385),
  product("Cleanser", "Cetaphil Gentle Skin Cleanser", "non-stripping cleanser for dry or sensitive skin", ["dry", "sensitive", "normal"], ["300-500", "600-1000", "1000-2500"], ["dry skin", "redness"], 399),
  product("Cleanser", "Minimalist 2% Salicylic Acid Cleanser", "salicylic-acid cleanser for oily, acne-prone skin", ["oily", "combination"], ["300-500", "600-1000"], ["acne", "pimples", "blackheads", "pores"], 299, 16),
  product("Cleanser", "Mamaearth Ubtan Face Wash", "turmeric and saffron face wash for dullness; patch test if sensitive", ["normal", "combination", "oily"], ["300-500"], ["dullness", "uneven tone"], 259),
  product("Cleanser", "CeraVe Foaming Cleanser", "higher-budget foaming cleanser for normal to oily skin", ["normal", "combination", "oily"], ["1000-2500", "2500-5000"], ["oily skin", "pores"], 1050),
  product("Moisturizer", "Pond's Super Light Gel Oil Free Moisturiser", "light gel moisturizer with hyaluronic acid and vitamin E", ["oily", "combination", "normal"], ["300-500", "600-1000"], [], 299),
  product("Moisturizer", "Simple Hydrating Light Moisturiser", "simple light moisturizer for daily barrier support", ["normal", "combination", "sensitive"], ["300-500", "600-1000"], ["redness", "dry skin"], 465),
  product("Moisturizer", "Re'equil Ceramide & Hyaluronic Acid Moisturiser", "barrier-support moisturizer for dry or sensitive skin", ["dry", "sensitive", "normal"], ["600-1000", "1000-2500"], ["dry skin", "redness"], 395),
  product("Moisturizer", "Bioderma Atoderm Creme Ultra", "richer moisturizer for dry, tight-feeling skin", ["dry", "sensitive"], ["1000-2500", "2500-5000"], ["dry skin"], 799),
  product("Sunscreen", "Fixderma Shadow SPF 50+ Gel", "broad-spectrum gel sunscreen for oily or combination skin", ["oily", "combination", "normal"], ["300-500", "600-1000"], ["pigmentation", "dark spots"], 395),
  product("Sunscreen", "Minimalist SPF 50 PA++++ Sunscreen", "broad-spectrum daily sunscreen with lightweight finish", ["normal", "combination", "oily"], ["300-500", "600-1000"], ["pigmentation", "dark spots", "uneven tone"], 399),
  product("Sunscreen", "Re'equil Ultra Matte Dry Touch Sunscreen Gel SPF 50 PA++++", "matte sunscreen for oily or humid-day use", ["oily", "combination"], ["600-1000", "1000-2500"], ["pigmentation", "dark spots"], 780),
  product("Sunscreen", "Bioderma Photoderm Aquafluide SPF 50+", "higher-budget lightweight sunscreen option", ["normal", "combination", "oily", "sensitive"], ["1000-2500", "2500-5000"], ["pigmentation", "dark spots", "redness"], 1425),
  product("Serum", "Minimalist 5% Niacinamide Serum", "beginner-friendly niacinamide for oil balance and marks", ["oily", "combination", "normal", "sensitive"], ["300-500", "600-1000"], ["pigmentation", "dark spots", "pores", "oily skin"], 599),
  product("Serum", "The Derma Co 10% Niacinamide Serum", "budget-friendly tone and oil-balance support; introduce slowly", ["oily", "combination", "normal"], ["300-500"], ["pigmentation", "dark spots", "pores", "oily skin"], 499, 16),
  product("Serum", "Deconstruct 10% Niacinamide + 0.3% Alpha Arbutin Serum", "tone-support serum for dark spots; introduce slowly", ["normal", "combination", "oily"], ["600-1000", "1000-2500"], ["pigmentation", "dark spots", "uneven tone"], 699, 16),
  product("Serum", "Bioderma Pigmentbio C-Concentrate", "higher-budget tone-support serum; patch test and avoid overuse", ["normal", "combination", "oily"], ["1000-2500", "2500-5000"], ["pigmentation", "dark spots", "uneven tone"], 2200, 16),
  product("Treatment", "Sebogel Salicylic Acid & Nicotinamide Gel", "targeted acne-support gel; use only a few nights weekly", ["oily", "combination"], ["300-500"], ["acne", "pimples", "blackheads"], 220, 16),
  product("Treatment", "Benzac AC 2.5% Gel", "benzoyl peroxide acne spot support; can bleach fabric and irritate", ["oily", "combination"], ["300-500", "600-1000"], ["acne", "pimples"], 160, 16),
  product("Treatment", "Minimalist 2% Salicylic Acid Serum", "leave-on acne and clogged-pore support; start one or two nights weekly", ["oily", "combination"], ["600-1000", "1000-2500"], ["acne", "pimples", "blackheads", "pores"], 549, 16),
  product("Treatment", "Paula's Choice 2% BHA Liquid Exfoliant", "higher-budget BHA option for clogged pores; use cautiously", ["oily", "combination"], ["1000-2500", "2500-5000"], ["blackheads", "pores", "acne"], 1200, 16),
  product("Barrier", "Dot & Key Cica Calming Night Gel", "calming barrier support for redness-prone skin", ["oily", "combination", "sensitive"], ["300-500", "600-1000"], ["redness"], 495),
  product("Barrier", "Minimalist Marula Oil 5% Moisturizer", "barrier-support moisturizer for dry or tight skin", ["dry", "normal", "sensitive"], ["600-1000"], ["dry skin", "redness"], 349),
  product("Barrier", "CeraVe Moisturising Cream", "ceramide-rich moisturizer for dry barrier support", ["dry", "sensitive", "normal"], ["1000-2500", "2500-5000"], ["dry skin", "redness"], 1500)
];

export function buildProductPlan(profile = {}) {
  const budgetRange = budgetRanges[profile.budgetLevel] || budgetRanges["600-1000"];
  const budgetKey = budgetKeyForRange(budgetRange);
  const skinType = profile.skinType || "unknown";
  const concerns = new Set(profile.concerns || []);
  const age = minimumAge(profile.ageRange);
  const country = String(profile.country || "India");
  const selected = [];
  const targetCategories = uniqueCategories(["Cleanser", "Moisturizer", "Sunscreen", ...recommendedTreatmentCategories(concerns, profile)]);

  for (const category of targetCategories) {
    const candidates = catalog
      .filter(item => item.category === category)
      .filter(item => item.budgets.includes(budgetKey) || item.budgets.includes(profile.budgetLevel))
      .filter(item => item.price <= budgetRange.max)
      .filter(item => item.minAge <= age)
      .filter(item => item.skinTypes.includes(skinType) || item.skinTypes.includes("normal") || skinType === "unknown")
      .filter(item => item.countries.includes(country) || item.countries.includes("India"))
      .filter(item => isSafeProduct(item))
      .sort((a, b) => scoreProduct(b, skinType, concerns, budgetRange) - scoreProduct(a, skinType, concerns, budgetRange));
    if (candidates[0]) {
      selected.push(candidates[0]);
    }
  }

  const unique = [...new Map(selected.map(item => [item.name, item])).values()];
  const totalEstimatedPrice = unique.reduce((sum, item) => sum + item.price, 0);
  return {
    budgetRange,
    totalEstimatedPrice,
    budgetSummary: `Each pick fits ${budgetRange.label}; full routine total is about Rs ${totalEstimatedPrice} if you buy all at once.`,
    productRecommendations: unique.map(item => ({
      category: item.category,
      name: item.name,
      why: item.why,
      estimatedPrice: `Around Rs ${item.price}`,
      numericPrice: item.price,
      budgetRange: budgetRange.label,
      problemTags: item.concerns,
      buyUrl: duckDuckGoUrl(`${item.name} ${item.category} India price`),
      safetyNote: safetyNote(item, profile)
    })),
    prepChecklist: buildPrepChecklist(unique, budgetRange, totalEstimatedPrice)
  };
}

export function safetyGuardrails(country = "India") {
  return [
    `For ${country}, avoid products marketed as bleaching/whitening cures or products without a full ingredient label.`,
    "Avoid mercury, hydroquinone, clobetasol/betamethasone steroid mixes, tretinoin/isotretinoin, peels, and injections unless prescribed by a qualified clinician.",
    "Use sunscreen SPF 30+ in the morning. Patch test new products for 24-48 hours."
  ];
}

function product(category, name, why, skinTypes, budgets, concerns = [], price = 500, minAge = 13, countries = ["India"]) {
  return { category, name, why, skinTypes, budgets, concerns, price, minAge, countries };
}

function recommendedTreatmentCategories(concerns, profile = {}) {
  const categories = [];
  if (concerns.has("acne") || concerns.has("pimples") || concerns.has("blackheads")) categories.push("Treatment");
  if (concerns.has("pigmentation") || concerns.has("dark spots") || concerns.has("uneven tone") || concerns.has("pores") || concerns.has("oily skin") || concerns.has("dullness")) categories.push("Serum");
  if (concerns.has("redness") || concerns.has("dry skin") || profile.skinType === "dry" || profile.skinType === "sensitive" || profile.sensitivityLevel === "high") categories.push("Barrier");
  return categories.length ? categories : ["Barrier"];
}

function minimumAge(ageRange = "") {
  const match = String(ageRange).match(/\d+/);
  return match ? Number(match[0]) : 18;
}

function isSafeProduct(item) {
  const text = `${item.name} ${item.why}`.toLowerCase();
  return unsafeTerms.every(term => !text.includes(term));
}

function scoreProduct(item, skinType, concerns, budgetRange) {
  let score = item.skinTypes.includes(skinType) ? 10 : 0;
  for (const concern of item.concerns) if (concerns.has(concern)) score += 4;
  if (item.category === "Sunscreen") score += 2;
  score += Math.max(0, 5 - Math.abs((budgetRange.min + budgetRange.max) / 2 - item.price) / 180);
  return score;
}

function buildPrepChecklist(products, budgetRange, totalEstimatedPrice) {
  return [
    `Each recommended item fits ${budgetRange.label}. Buying all current picks together is about Rs ${totalEstimatedPrice}.`,
    ...products.map(item => `Buy or keep ready: ${item.name} (${item.category}, about Rs ${item.price}).`),
    "Take a clear baseline photo in natural light.",
    "Patch test new leave-on products before full-face use.",
    "Start the full routine tomorrow morning, not tonight, so irritation can be tracked cleanly."
  ];
}

function budgetKeyForRange(budgetRange) {
  if (budgetRange.min === 300 && budgetRange.max === 500) return "300-500";
  if (budgetRange.min === 600 && budgetRange.max === 1000) return "600-1000";
  if (budgetRange.min === 1000 && budgetRange.max === 2500) return "1000-2500";
  if (budgetRange.min === 2500 && budgetRange.max === 5000) return "2500-5000";
  return "600-1000";
}

function uniqueCategories(categories) {
  return [...new Set(categories.filter(Boolean))];
}

function safetyNote(item, profile) {
  if (item.minAge >= 16 && minimumAge(profile.ageRange) < 16) return "Skip for younger teens unless a parent/guardian and clinician agree.";
  if (profile.sensitivityLevel === "high" || profile.skinType === "sensitive") return "Patch test carefully and start every other day if it is a treatment.";
  return "OTC cosmetic-style pick; check the current label before purchase.";
}

function duckDuckGoUrl(query) {
  return `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
}
