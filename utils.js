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
  const value = parseFloat(el(id).value);
  return Number.isFinite(value) ? value : 0;
}

/**
 * Get text value from input
 */
function txt(id) {
  return el(id).value;
}

/**
 * Get checked state of checkbox
 */
function checked(id) {
  return el(id).checked;
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
  return Math.round(value / 5) * 5;
}

/**
 * Round up to nearest 10
 */
function ceilTo10(value) {
  return Math.ceil(value / 10) * 10;
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
    return 140;
  }
  return routeGroup === "AB" ? 185 : 165;
}

/**
 * Get design cant limit
 */
function getDesignCantLimit(trackStandard, routeGroup, turnoutTrack) {
  if (trackStandard === "MG") {
    return turnoutTrack ? 90 : 100;
  }
  return getCantLimit(routeGroup, turnoutTrack);
}

/**
 * Get design Cd limit
 */
function getDesignCdLimit(trackStandard, stockType, outerCrossingLimit) {
  if (trackStandard === "MG") {
    return 50;
  }
  return getCdLimit(stockType, outerCrossingLimit);
}

/**
 * Get cant excess limit
 */
function getCantExcessLimit(trackStandard) {
  return trackStandard === "MG" ? 50 : 75;
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
  const factor = isNonTransitioned ? 0.008 : 0.0056;
  let best = null;

  for (let speed = Math.floor(sectionalSpeed); speed >= 1; speed -= 1) {
    const maxCaByGradient = transitionLength > 0 ? transitionLength / 0.72 : 0;
    const maxCaByRate = transitionLength > 0 ? transitionLength / (factor * speed) : 0;
    const feasibleCaMax = Math.floor(Math.min(cantLimit, maxCaByGradient, maxCaByRate));
    
    if (feasibleCaMax < 0) {
      continue;
    }

    for (let ca = feasibleCaMax; ca >= 0; ca -= 1) {
      const maxCdByRate = transitionLength > 0 ? transitionLength / (factor * speed) : 0;
      const cdMax = Math.floor(Math.min(cdLimit, maxCdByRate));
      const neededSum = Math.pow(speed / 0.27, 2) / radius;
      const minCdNeeded = Math.ceil(neededSum - ca);

      if (minCdNeeded <= cdMax) {
        const cd = Math.max(0, minCdNeeded);
        best = {
          speed,
          cant: ca,
          cantDeficiency: cd,
          rateLengthForCant: factor * ca * speed,
          rateLengthForCd: factor * cd * speed,
          gradientLength: 0.72 * ca
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
