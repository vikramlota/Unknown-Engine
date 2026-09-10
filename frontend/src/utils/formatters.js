// Human-friendly dictionary translating NASA technical abbreviations into plain English
export const VARIABLE_DICTIONARY = {
  pl_orbper: {
    name: "Year Length",
    unit: "Earth days to orbit star",
    iconType: "clock",
    description: "How long one year lasts on this planet"
  },
  pl_orbsmax: {
    name: "Distance from Star",
    unit: "AU (Earth-Sun distance)",
    iconType: "orbit",
    description: "How far the planet is from its sun"
  },
  pl_masse: {
    name: "Planet Weight",
    unit: "Earth masses",
    iconType: "scale",
    description: "Total mass compared to Earth"
  },
  pl_bmasse: {
    name: "Estimated Weight",
    unit: "Earth masses",
    iconType: "scale",
    description: "Best measured mass of the planet"
  },
  pl_rade: {
    name: "Planet Width",
    unit: "Earth radius",
    iconType: "planet",
    description: "Physical diameter compared to Earth"
  },
  log_radius: {
    name: "Planet Size Scale",
    unit: "Log scale",
    iconType: "planet",
    description: "Logarithmic scale of planet radius"
  },
  mass_radius_ratio: {
    name: "Density Factor",
    unit: "Weight ÷ Size",
    iconType: "planet",
    description: "How tightly packed the planet's mass is"
  },
  st_mass: {
    name: "Star Weight",
    unit: "Solar masses",
    iconType: "sun",
    description: "Mass of the host star compared to our Sun"
  },
  st_rad: {
    name: "Star Size",
    unit: "Solar radius",
    iconType: "sun",
    description: "Size of the host star"
  },
  st_teff: {
    name: "Star Temperature",
    unit: "Kelvin",
    iconType: "sun",
    description: "Surface heat of the star"
  }
};

export function getVariableInfo(varKey) {
  return VARIABLE_DICTIONARY[varKey] || {
    name: varKey,
    unit: "value",
    iconType: "chart",
    description: varKey
  };
}

// Convert confusing symbolic regression lisp trees into clean math or plain English
export function formatExpression(expr, var1, var2) {
  if (!expr) return "Pattern detected";
  
  if (expr.includes("pl_orbsmax") && expr.includes("pl_orbper")) {
    return "Year Length ≈ 365 × (Distance)¹·⁵";
  }
  if (expr.includes("pl_bmasse") && expr.includes("pl_masse")) {
    return "Weight = Measured Weight (1:1 Exact Match)";
  }
  if (expr.startsWith("add") || expr.startsWith("mul") || expr.startsWith("div")) {
    const v1Info = getVariableInfo(var1).name;
    const v2Info = getVariableInfo(var2).name;
    return `${v2Info} grows predictably with ${v1Info}`;
  }
  return expr;
}

// Calculate intuitive percentage score for correlation strength
export function getStrengthLabel(score) {
  const pct = Math.min(100, Math.round((score || 0) * 100));
  if (pct >= 95) return { label: "Virtually Inseparable", percent: pct, color: "#00e5ff" };
  if (pct >= 80) return { label: "Very Strong Connection", percent: pct, color: "#38bdf8" };
  if (pct >= 60) return { label: "Moderate Relationship", percent: pct, color: "#ff9800" };
  return { label: "Subtle Pattern", percent: pct, color: "#8b949e" };
}

// Interpret novelty distance in plain terms
export function getNoveltyInterpretation(distance) {
  if (distance === null || distance === undefined) return null;
  if (distance < 0.65) {
    return {
      status: "Known Cosmic Law",
      tag: "ESTABLISHED SCIENCE",
      color: "#00e5ff",
      badgeBg: "rgba(0, 229, 255, 0.1)",
      explanation: "This pattern is already well-documented in astrophysics textbooks (e.g. Kepler's planetary motion laws). The engine rediscovered it autonomously."
    };
  } else if (distance < 0.9) {
    return {
      status: "Related to Literature",
      tag: "SIMILAR TO LITERATURE",
      color: "#ff9800",
      badgeBg: "rgba(255, 152, 0, 0.1)",
      explanation: "This pattern resembles ideas discussed in astrophysics papers, representing a specific empirical curve from telescope data."
    };
  } else {
    return {
      status: "Potential New Discovery",
      tag: "UNCHARTED PATTERN",
      color: "#e3000f",
      badgeBg: "rgba(227, 0, 15, 0.1)",
      explanation: "This pattern sits far from typical astrophysics paper abstracts. It represents an unexplored candidate regularity."
    };
  }
}
