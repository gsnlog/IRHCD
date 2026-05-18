// Utility and helper functions

/**
 * Get element by ID
 */
function el(id) {
  return document.getElementById(id);
}

/**
 * Parse numeric value from input
 */
function num(id) {
  const node = el(id);
  const value = node ? parseFloat(node.value) : NaN;
  return Number.isFinite(value) ? value : 0;
}

/**
 * Get text value from input
 */
function txt(id) {
  const node = el(id);
  return node ? node.value : "";
}

/**
 * Get checked state of checkbox
 */
function checked(id) {
  const node = el(id);
  return node ? node.checked : false;
}

/**
 * Round number to specified decimals
 */
function round(value, digits = 2) {
  return Number.isFinite(value) ? Number(value.toFixed(digits)) : 0;
}

/**
 * Round to nearest 5
 */
function roundTo5(value) {
  return roundToNearest(value, getFormulaValue("adoptedCantRoundTo"));
}

/**
 * Round up to nearest 10
 */
function ceilTo10(value) {
  return ceilToNearest(value, getFormulaValue("transitionRoundTo"));
}

function roundToNearest(value, interval) {
  const step = Number(interval);
  if (!Number.isFinite(value)) return 0;
  if (!Number.isFinite(step) || step <= 0) return value;
  return Math.round(value / step) * step;
}

function ceilToNearest(value, interval) {
  const step = Number(interval);
  if (!Number.isFinite(value)) return 0;
  if (!Number.isFinite(step) || step <= 0) return value;
  return Math.ceil(value / step) * step;
}

/**
 * Format value with unit
 */
function fmt(value, unit = "", digits = 2) {
  if (!Number.isFinite(value)) {
    return "Not available";
  }
  return `${value.toFixed(digits)}${unit ? ` ${unit}` : ""}`;
}

/**
 * Create badge HTML
 */
function badge(type, text) {
  return `<span class="badge badge-${type}">${text}</span>`;
}

/**
 * Create check item HTML
 */
function checkItem(item) {
  const levelClass = {
    ok: "success",
    warn: "warning",
    bad: "error"
  }[item.level] || item.level;
  
  return `<li><span class="badge badge-${levelClass}">${item.level.toUpperCase()}</span> ${item.text}</li>`;
}

/**
 * Get status from checks
 */
function statusFromChecks(checks) {
  if (checks.some((item) => item.level === "bad")) {
    return "bad";
  }
  if (checks.some((item) => item.level === "warn")) {
    return "warn";
  }
  return "ok";
}

/**
 * Get cant limit by route group
 */
function getCantLimit(routeGroup, turnoutTrack) {
  if (turnoutTrack) {
    return getFormulaValue("bgTurnoutCantLimit");
  }
  return routeGroup === "AB" ? getFormulaValue("bgCantLimitAB") : getFormulaValue("bgCantLimitOther");
}

/**
 * Get design cant limit
 */
function getDesignCantLimit(trackStandard, routeGroup, turnoutTrack) {
  if (trackStandard === "MG") {
    return turnoutTrack ? getFormulaValue("mgTurnoutCantLimit") : getFormulaValue("mgCantLimit");
  }
  return getCantLimit(routeGroup, turnoutTrack);
}

/**
 * Get design Cd limit
 */
function getDesignCdLimit(trackStandard, stockType, outerCrossingLimit) {
  if (trackStandard === "MG") {
    return getFormulaValue("mgCdLimit");
  }
  return getCdLimit(stockType, outerCrossingLimit);
}

/**
 * Get cant excess limit
 */
function getCantExcessLimit(trackStandard) {
  return trackStandard === "MG" ? getFormulaValue("mgCantExcessLimit") : getFormulaValue("bgCantExcessLimit");
}

/**
 * Calculate traffic weighted speed
 */
function trafficWeightedSpeed(groups) {
  const denominator = groups.reduce((sum, group) => sum + group.n * group.w, 0);
  const numerator = groups.reduce((sum, group) => sum + group.n * group.w * group.v * group.v, 0);
  return denominator > 0 ? Math.sqrt(numerator / denominator) : NaN;
}

/**
 * Get cant deficiency limit
 */
function getCdLimit(stockType, outerCrossingLimit) {
  let limit = parseFloat(stockType);
  if (limit === 150 && outerCrossingLimit) {
    limit = 115;
  }
  return limit;
}

/**
 * Solve best speed given constraints
 */
function solveBestSpeed(radius, transitionLength, cantLimit, cdLimit, sectionalSpeed, isNonTransitioned) {
  const factor = getTransitionRateFactor(isNonTransitioned);
  const cantGradientFactor = getFormulaValue("cantGradientFactor");
  const speedCoefficient = getFormulaValue("speedCoefficient");
  let best = null;

  for (let speed = Math.floor(sectionalSpeed); speed >= 1; speed -= 1) {
    const maxCaByGradient = transitionLength > 0 ? transitionLength / cantGradientFactor : 0;
    const maxCaByRate = transitionLength > 0 ? transitionLength / (factor * speed) : 0;
    const feasibleCaMax = Math.floor(Math.min(cantLimit, maxCaByGradient, maxCaByRate));
    
    if (feasibleCaMax < 0) {
      continue;
    }

    for (let ca = feasibleCaMax; ca >= 0; ca -= 1) {
      const maxCdByRate = transitionLength > 0 ? transitionLength / (factor * speed) : 0;
      const cdMax = Math.floor(Math.min(cdLimit, maxCdByRate));
      const neededSum = Math.pow(speed / speedCoefficient, 2) / radius;
      const minCdNeeded = Math.ceil(neededSum - ca);

      if (minCdNeeded <= cdMax) {
        const cd = Math.max(0, minCdNeeded);
        best = {
          speed,
          cant: ca,
          cantDeficiency: cd,
          rateLengthForCant: factor * ca * speed,
          rateLengthForCd: factor * cd * speed,
          gradientLength: cantGradientFactor * ca
        };
        return best;
      }
    }
  }

  return best;
}

/**
 * Get turnout base speed
 */
function turnoutBaseSpeed(turnoutType) {
  const map = {
    "1:8.5": 15,
    "1:8.5TWS": 25,
    "1:8.5Sym": 30,
    "1:12": 30,
    "1:12TWS": 50
  };
  return map[turnoutType] || 15;
}

/**
 * Apply theme state to the document
 */
function setTheme(theme) {
  const body = document.body;
  const nextTheme = theme === "dark" ? "dark" : "light";

  body.classList.toggle("dark-mode", nextTheme === "dark");
  body.classList.toggle("light-mode", nextTheme === "light");
  localStorage.setItem("theme", nextTheme);

  return nextTheme;
}

function loadFormulaSettings() {
  const saved = localStorage.getItem("formulaSettings");
  formulaSettings = { ...DEFAULT_FORMULA_SETTINGS };

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.keys(DEFAULT_FORMULA_SETTINGS).forEach((key) => {
        const value = Number(parsed[key]);
        if (Number.isFinite(value)) {
          formulaSettings[key] = value;
        }
      });
    } catch (error) {
      formulaSettings = { ...DEFAULT_FORMULA_SETTINGS };
    }
  }

  return formulaSettings;
}

function saveFormulaSettings() {
  localStorage.setItem("formulaSettings", JSON.stringify(formulaSettings));
}

function getFormulaValue(key) {
  const value = Number(formulaSettings[key]);
  const fallback = Number(DEFAULT_FORMULA_SETTINGS[key]);
  return Number.isFinite(value) ? value : fallback;
}

function setFormulaValue(key, value) {
  const numeric = Number(value);
  if (Object.prototype.hasOwnProperty.call(DEFAULT_FORMULA_SETTINGS, key) && Number.isFinite(numeric)) {
    formulaSettings[key] = numeric;
  }
}

function getTransitionRateFactor(isNonTransitioned) {
  return isNonTransitioned ? getFormulaValue("nonTransitionedRateFactor") : getFormulaValue("transitionedRateFactor");
}

function getMinimumRadius(trackStandard) {
  return trackStandard === "MG" ? getFormulaValue("mgMinimumRadius") : getFormulaValue("bgMinimumRadius");
}

function getMinimumVerticalRadius(verticalGroup) {
  if (verticalGroup === "A") return getFormulaValue("verticalRadiusA");
  if (verticalGroup === "B") return getFormulaValue("verticalRadiusB");
  return getFormulaValue("verticalRadiusCDE");
}

/**
 * Toggle theme
 */
function toggleTheme() {
  const body = document.body;
  const isDarkMode = body.classList.contains("dark-mode");

  return setTheme(isDarkMode ? "light" : "dark");
}

/**
 * Initialize theme from localStorage
 */
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  return setTheme(savedTheme ? savedTheme : (prefersDark ? "dark" : "light"));
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Export data to JSON
 */
function exportToJSON(data, filename = "data.json") {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log("Text copied to clipboard");
  }).catch(() => {
    console.error("Failed to copy to clipboard");
  });
}
