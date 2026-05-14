// Main application initialization and control

// Initialize application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize UI Manager
  uiManager.initialize();

  // Initialize form data
  initializeFormData();

  // Attach form listeners
  attachFormListeners();

  // Load initial report
  buildReport();
  buildCheckReport();

  // Add tooltips
  applyTooltips();
});

/**
 * Initialize form data and default state
 */
function initializeFormData() {
  // Store initial values
  FIELD_IDS.forEach((id) => {
    const node = el(id);
    if (node) {
      defaultState[id] = node.type === "checkbox" ? node.checked : node.value;
    }
  });

  CHECK_FIELD_IDS.forEach((id) => {
    const node = el(id);
    if (node) {
      checkDefaultState[id] = node.type === "checkbox" ? node.checked : node.value;
    }
  });
}

/**
 * Attach listeners to all form fields
 */
function attachFormListeners() {
  FIELD_IDS.forEach((id) => {
    const node = el(id);
    if (!node) return;

    if (CASE_TOGGLE_IDS.includes(id)) {
      node.addEventListener("change", syncCaseSections);
    } else if (id === "problemType") {
      node.addEventListener("input", syncProblemTypeOptions);
      node.addEventListener("change", syncProblemTypeOptions);
    } else {
      node.addEventListener("input", debounce(buildReport, 100));
      node.addEventListener("change", buildReport);
    }
  });

  CHECK_FIELD_IDS.forEach((id) => {
    const node = el(id);
    if (node) {
      node.addEventListener("input", debounce(buildCheckReport, 100));
      node.addEventListener("change", buildCheckReport);
    }
  });
}

/**
 * Apply tooltips to labels
 */
function applyTooltips() {
  Object.entries(TOOLTIPS).forEach(([id, text]) => {
    const label = document.querySelector(`label[for="${id}"]`);
    if (!label || label.querySelector(".tooltip")) {
      return;
    }

    const tip = document.createElement("span");
    tip.className = "tooltip";
    tip.tabIndex = 0;
    tip.setAttribute("role", "tooltip");
    tip.setAttribute("aria-label", text);
    tip.title = text;
    tip.innerHTML = "?";
    tip.style.marginLeft = "4px";
    tip.style.display = "inline-block";
    tip.style.width = "18px";
    tip.style.height = "18px";
    tip.style.borderRadius = "50%";
    tip.style.textAlign = "center";
    tip.style.lineHeight = "18px";
    tip.style.cursor = "help";
    tip.style.border = "1px solid var(--color-border)";
    tip.style.fontSize = "12px";
    tip.style.fontWeight = "bold";

    label.appendChild(tip);
  });
}

/**
 * Sync case sections visibility
 */
function syncCaseSections() {
  document.querySelectorAll("[data-case-section]").forEach((section) => {
    const toggle = el(section.dataset.caseSection);
    const isEnabled = toggle && toggle.checked;
    section.hidden = !isEnabled;
    section.querySelectorAll("input, select, button, textarea").forEach((node) => {
      node.disabled = !isEnabled;
    });
  });
  buildReport();
}

/**
 * Sync problem type options
 */
function syncProblemTypeOptions() {
  const type = txt("problemType");
  const mapping = {
    restrictedTransition: "enableRestrictedTransition",
    trafficWeighted: "enableTrafficMix",
    turnoutCrossover: "enableTurnout"
  };

  Object.entries(mapping).forEach(([problem, toggleId]) => {
    if (type === problem) {
      el(toggleId).checked = true;
    }
  });

  syncCaseSections();
}

/**
 * Collect all design data
 */
function collectData() {
  return {
    curveName: txt("curveName").trim() || "Curve",
    problemType: txt("problemType"),
    trackStandard: txt("trackStandard"),
    routeGroup: txt("routeGroup"),
    curveType: txt("curveType"),
    sectionalSpeed: num("sectionalSpeed"),
    radius: num("radius"),
    curveLength: num("curveLength"),
    chordLength: num("chordLength"),
    offsetX: num("offsetX"),
    designSpeed: num("designSpeed"),
    goodsSpeed: num("goodsSpeed"),
    gauge: num("gauge"),
    stockType: txt("stockType"),
    turnoutTrack: checked("turnoutTrack"),
    outerCrossingLimit: checked("outerCrossingLimit"),
    enableCompound: el("enableCompound") ? checked("enableCompound") : false,
    enableReverse: el("enableReverse") ? checked("enableReverse") : false,
    enableTurnout: checked("enableTurnout"),
    enableRestrictedTransition: checked("enableRestrictedTransition"),
    enableTrafficMix: checked("enableTrafficMix"),
    restrictedTransitionLength: num("restrictedTransitionLength"),
    trafficN1: num("trafficN1"),
    trafficW1: num("trafficW1"),
    trafficV1: num("trafficV1"),
    trafficN2: num("trafficN2"),
    trafficW2: num("trafficW2"),
    trafficV2: num("trafficV2"),
    trafficN3: num("trafficN3"),
    trafficW3: num("trafficW3"),
    trafficV3: num("trafficV3"),
    compoundCa1: num("compoundCa1"),
    compoundCa2: num("compoundCa2"),
    compoundCd1: num("compoundCd1"),
    compoundCd2: num("compoundCd2"),
    reverseCa1: num("reverseCa1"),
    reverseCa2: num("reverseCa2"),
    reverseCd1: num("reverseCd1"),
    reverseCd2: num("reverseCd2"),
    reverseStraight: num("reverseStraight"),
    turnoutType: txt("turnoutType"),
    turnoutPlacement: txt("turnoutPlacement"),
    mainCurveDegree: num("mainCurveDegree"),
    leadRadius: num("leadRadius"),
    interlockingSpeed: num("interlockingSpeed"),
    turnoutEqCant: num("turnoutEqCant"),
    turnoutCase: txt("turnoutCase"),
    reverseAfterTurnout: txt("reverseAfterTurnout"),
    hasCrossover: checked("hasCrossover"),
    hasDiamond: checked("hasDiamond"),
    diamondApproachStraight: checked("hasDiamond") && checked("diamondApproachStraight"),
    existingGradient: num("existingGradient"),
    rulingGradient: num("rulingGradient"),
    grade1: num("grade1"),
    grade2: num("grade2"),
    verticalGroup: txt("verticalGroup")
  };
}

/**
 * Collect all check data
 */
function collectCheckData() {
  return {
    curveName: txt("checkCurveName").trim() || "Existing Curve",
    routeGroup: txt("checkRouteGroup"),
    curveType: txt("checkCurveType"),
    sectionalSpeed: num("checkSectionalSpeed"),
    radius: num("checkRadius"),
    chordLength: num("checkChordLength"),
    versine: num("checkVersine"),
    transitionLength: num("checkTransitionLength"),
    curveLength: num("checkCurveLength"),
    measuredCant: num("checkMeasuredCant"),
    speed: num("checkSpeed"),
    goodsSpeed: num("checkGoodsSpeed"),
    gauge: num("checkGauge"),
    stockType: txt("checkStockType"),
    existingGradient: num("checkExistingGradient"),
    rulingGradient: num("checkRulingGradient"),
    grade1: num("checkGrade1"),
    grade2: num("checkGrade2"),
    verticalGroup: txt("checkVerticalGroup"),
    turnoutTrack: checked("checkTurnoutTrack"),
    outerCrossingLimit: checked("checkOuterCrossingLimit")
  };
}

/**
 * Reset to default values
 */
function resetDefaults() {
  FIELD_IDS.forEach((id) => {
    const element = el(id);
    if (!element) return;
    if (element.type === "checkbox") {
      element.checked = defaultState[id];
    } else {
      element.value = defaultState[id];
    }
  });
  syncCaseSections();
  uiManager.showToast("Design data reset to defaults", "info");
}

/**
 * Reset check values to default
 */
function resetCheckDefaults() {
  CHECK_FIELD_IDS.forEach((id) => {
    const element = el(id);
    if (!element) return;
    if (element.type === "checkbox") {
      element.checked = checkDefaultState[id];
    } else {
      element.value = checkDefaultState[id];
    }
  });
  buildCheckReport();
  uiManager.showToast("Check data reset to defaults", "info");
}

// Import calculation reports (these are in a separate file)
// The buildReport() and buildCheckReport() functions are defined in calculator.js
