// Main application initialization and control

// Project Setup State Management
const projectSetupState = {
  isSetup: false,
  data: {}
};

// Initialize application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize UI Manager
  uiManager.initialize();

  // Initialize formula controls
  initializeFormulaSettings();

  // Initialize project setup
  initializeProjectSetup();

  // Initialize form data
  initializeFormData();

  // Attach form listeners
  attachFormListeners();
  attachFormulaListeners();

  // Load initial report
  buildReport();
  buildCheckReport();

  // Add tooltips
  applyTooltips();
});

/**
 * Initialize Project Setup
 */
function initializeProjectSetup() {
  // Load project setup from localStorage
  const savedSetup = localStorage.getItem("projectSetup");
  if (savedSetup) {
    try {
      projectSetupState.data = JSON.parse(savedSetup);
      projectSetupState.isSetup = true;
      syncProjectSetupFields();
      enableAllButtons();
    } catch (e) {
      projectSetupState.isSetup = false;
    }
  }

  // If not setup, show modal and disable buttons
  if (!projectSetupState.isSetup) {
    disableAllButtons();
    showProjectSetupModal();
  }

  // Attach project setup event listeners
  attachProjectSetupListeners();
}

/**
 * Show Project Setup Modal
 */
function showProjectSetupModal() {
  const modal = el("projectSetupModal");
  if (modal) {
    modal.classList.add("active");
    const overlay = modal.querySelector(".modal-overlay");
    const closeBtn = modal.querySelector(".modal-close");

    // Make modal non-dismissible by clicking overlay or X when project is not setup.
    if (!projectSetupState.isSetup) {
      if (overlay) overlay.style.pointerEvents = "none";
      if (closeBtn) closeBtn.style.display = "none";
    } else {
      if (overlay) overlay.style.pointerEvents = "";
      if (closeBtn) closeBtn.style.display = "";
    }
  }
}

/**
 * Hide Project Setup Modal
 */
function hideProjectSetupModal() {
  const modal = el("projectSetupModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

/**
 * Initialize configurable formula values.
 */
function initializeFormulaSettings() {
  loadFormulaSettings();
  syncFormulaFields();
}

/**
 * Attach Project Setup Event Listeners
 */
function attachProjectSetupListeners() {
  const openBtn = el("openProjectSetupBtn");
  const saveBtn = el("saveProjectSetupBtn");
  const cancelBtn = el("cancelProjectSetupBtn");
  const closeBtn = document.querySelector("#projectSetupModal .modal-close");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      loadProjectSetupModal();
      showProjectSetupModal();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", saveProjectSetup);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      if (projectSetupState.isSetup) {
        hideProjectSetupModal();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (projectSetupState.isSetup) {
        hideProjectSetupModal();
      }
    });
  }
}

/**
 * Load Project Setup Modal with Current Data
 */
function loadProjectSetupModal() {
  if (projectSetupState.isSetup && projectSetupState.data) {
    el("setupCurveName").value = projectSetupState.data.curveName || "Curve A";
    el("setupTrackStandard").value = projectSetupState.data.trackStandard || "BG";
    el("setupRouteGroup").value = projectSetupState.data.routeGroup || "AB";
    el("setupVerticalGroup").value = projectSetupState.data.verticalGroup || "A";
    el("setupCurveType").value = projectSetupState.data.curveType || "transitioned";
    el("setupSectionalSpeed").value = projectSetupState.data.sectionalSpeed || 110;
  }
}

/**
 * Save Project Setup
 */
function saveProjectSetup() {
  projectSetupState.data = {
    curveName: el("setupCurveName").value.trim() || "Curve A",
    trackStandard: el("setupTrackStandard").value,
    routeGroup: el("setupRouteGroup").value,
    verticalGroup: el("setupVerticalGroup").value,
    curveType: el("setupCurveType").value,
    sectionalSpeed: parseFloat(el("setupSectionalSpeed").value) || 110
  };

  projectSetupState.isSetup = true;

  // Save to localStorage
  localStorage.setItem("projectSetup", JSON.stringify(projectSetupState.data));

  // Sync fields in all forms
  syncProjectSetupFields();

  // Enable all buttons
  enableAllButtons();

  // Hide modal
  hideProjectSetupModal();

  // Show confirmation
  showNotification("Project setup completed successfully!");
}

/**
 * Sync Project Setup Fields to All Forms
 */
function syncProjectSetupFields() {
  if (projectSetupState.data) {
    const verticalGroup = projectSetupState.data.verticalGroup || "A";
    const verticalGroupLabels = {
      A: "Group A",
      B: "Group B",
      CDE: "Group C / D / E"
    };
    const verticalGroupLabel = verticalGroupLabels[verticalGroup] || verticalGroup;

    // Sync main design page
    if (el("curveName")) el("curveName").value = projectSetupState.data.curveName;
    if (el("trackStandard")) el("trackStandard").value = projectSetupState.data.trackStandard;
    if (el("routeGroup")) el("routeGroup").value = projectSetupState.data.routeGroup;
    if (el("verticalGroup")) el("verticalGroup").value = verticalGroup;
    if (el("verticalGroupDisplay")) el("verticalGroupDisplay").textContent = verticalGroupLabel;
    if (el("curveType")) el("curveType").value = projectSetupState.data.curveType;
    if (el("sectionalSpeed")) el("sectionalSpeed").value = projectSetupState.data.sectionalSpeed;

    // Sync compound page
    if (el("compoundCurveName")) el("compoundCurveName").value = projectSetupState.data.curveName;

    // Sync reverse page
    if (el("reverseCurveName")) el("reverseCurveName").value = projectSetupState.data.curveName;

    // Sync check page
    if (el("checkCurveName")) el("checkCurveName").value = projectSetupState.data.curveName;
    if (el("checkRouteGroup")) el("checkRouteGroup").value = projectSetupState.data.routeGroup;
    if (el("checkVerticalGroup")) el("checkVerticalGroup").value = verticalGroup;
    if (el("checkVerticalGroupDisplay")) el("checkVerticalGroupDisplay").textContent = verticalGroupLabel;
    if (el("checkCurveType")) el("checkCurveType").value = projectSetupState.data.curveType;
    if (el("checkSectionalSpeed")) el("checkSectionalSpeed").value = projectSetupState.data.sectionalSpeed;
  }
}

/**
 * Disable All Buttons
 */
function disableAllButtons() {
  // Disable navigation buttons
  document.querySelectorAll(".nav-button").forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";
  });

  // Disable ribbon buttons
  document.querySelectorAll(".ribbon-button").forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";
  });

  // Disable form buttons
  document.querySelectorAll(".btn-primary, .btn-secondary").forEach(btn => {
    if (btn.id !== "saveProjectSetupBtn" && btn.id !== "cancelProjectSetupBtn") {
      btn.disabled = true;
      btn.style.opacity = "0.5";
      btn.style.cursor = "not-allowed";
    }
  });
}

/**
 * Enable All Buttons
 */
function enableAllButtons() {
  // Enable navigation buttons
  document.querySelectorAll(".nav-button").forEach(btn => {
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });

  // Enable ribbon buttons
  document.querySelectorAll(".ribbon-button").forEach(btn => {
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });

  // Enable form buttons
  document.querySelectorAll(".btn-primary, .btn-secondary").forEach(btn => {
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  });
}

/**
 * Show Notification
 */
function showNotification(message) {
  alert(message); // Simple notification, can be enhanced with toast
}

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
 * Attach listeners to master formula controls.
 */
function attachFormulaListeners() {
  FORMULA_FIELD_IDS.forEach((id) => {
    const node = el(id);
    if (!node) return;

    node.addEventListener("input", debounce(() => {
      saveFormulaFieldValue(node);
      rebuildVisibleReports();
    }, 100));

    node.addEventListener("change", () => {
      saveFormulaFieldValue(node);
      rebuildVisibleReports();
    });
  });

  const resetBtn = el("resetFormulaSettingsBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetFormulaSettings);
  }
}

function syncFormulaFields() {
  Object.entries(formulaSettings).forEach(([key, value]) => {
    const node = el(`formula-${key}`);
    if (node) {
      node.value = value;
    }
  });
}

function saveFormulaFieldValue(node) {
  const key = node.id.replace("formula-", "");
  setFormulaValue(key, node.value);
  saveFormulaSettings();
}

function resetFormulaSettings() {
  formulaSettings = { ...DEFAULT_FORMULA_SETTINGS };
  saveFormulaSettings();
  syncFormulaFields();
  rebuildVisibleReports();
  uiManager.showToast("Formula settings reset to defaults", "info");
}

function loadFormulaData(data) {
  if (!data) return;

  Object.entries(data).forEach(([key, value]) => {
    setFormulaValue(key, value);
  });
  saveFormulaSettings();
  syncFormulaFields();
  rebuildVisibleReports();
}

function rebuildVisibleReports() {
  buildReport();
  buildCheckReport();
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
  // Use project setup values as fallback if specific inputs are not present
  const curveName = el("curveName") ? txt("curveName").trim() : (projectSetupState.data.curveName || "Curve");
  const problemType = el("problemType") ? txt("problemType") : (projectSetupState.data.problemType || "standard");
  const trackStandard = el("trackStandard") ? txt("trackStandard") : (projectSetupState.data.trackStandard || "BG");
  const routeGroup = el("routeGroup") ? txt("routeGroup") : (projectSetupState.data.routeGroup || "AB");
  const curveType = el("curveType") ? txt("curveType") : (projectSetupState.data.curveType || "transitioned");
  const sectionalSpeed = el("sectionalSpeed") ? num("sectionalSpeed") : (projectSetupState.data.sectionalSpeed || 110);

  return {
    curveName,
    problemType,
    trackStandard,
    routeGroup,
    curveType,
    sectionalSpeed,
    radius: num("radius"),
    curveLength: num("curveLength"),
    chordLength: num("chordLength"),
    offsetX: num("offsetX"),
    designSpeed: num("designSpeed"),
    goodsSpeed: num("goodsSpeed"),
    gauge: num("gauge"),
    stockType: txt("stockType"),
    adoptedCant: num("adoptedCant"),
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
  syncProjectSetupFields();
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
  syncProjectSetupFields();
  buildCheckReport();
  uiManager.showToast("Check data reset to defaults", "info");
}

// Import calculation reports (these are in a separate file)
// The buildReport() and buildCheckReport() functions are defined in calculator.js
