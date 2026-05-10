const ids = [
  "curveName", "routeGroup", "curveType", "sectionalSpeed", "radius", "curveLength",
  "chordLength", "versine", "transitionLength", "offsetX", "designSpeed", "goodsSpeed",
  "gauge", "stockType", "turnoutTrack", "outerCrossingLimit", "hasCompoundCurve",
  "compoundRadius1", "compoundSpeed1", "compoundRadius2", "compoundSpeed2", "hasReverseCurve",
  "reverseRadius1", "reverseSpeed1", "reverseRadius2", "reverseSpeed2", "reverseStraight", "turnoutType", "turnoutPlacement",
  "mainCurveDegree", "leadRadius", "interlockingSpeed", "turnoutEqCant", "turnoutCase",
  "reverseAfterTurnout", "hasCrossover", "hasDiamond", "diamondApproachStraight",
  "existingGradient", "rulingGradient", "grade1", "grade2", "verticalGroup"
];

const defaultState = {};

const icons = {
  ok: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  warn: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  bad: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
  step: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  info: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  save: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
  reset: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>`,
  print: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`,
  import: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  geometry: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16.01L21 7.99C21 7.45 20.71 6.96 20.23 6.7L13.23 2.72C12.47 2.3 11.53 2.3 10.77 2.72L3.77 6.7C3.29 6.96 3 7.45 3 7.99L3 16.01C3 16.55 3.29 17.04 3.77 17.3L10.77 21.28C11.53 21.7 12.47 21.7 13.23 21.28L20.23 17.3C20.71 17.04 21 16.55 21 16.01Z"></path></svg>`,
  extended: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  special: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
};

function el(id) {
  return document.getElementById(id);
}

function num(id) {
  const value = parseFloat(el(id).value);
  return Number.isFinite(value) ? value : 0;
}

function txt(id) {
  return el(id).value;
}

function checked(id) {
  return el(id).checked;
}

function round(value, digits = 2) {
  return Number.isFinite(value) ? Number(value.toFixed(digits)) : 0;
}

function roundTo5(value) {
  return Math.round(value / 5) * 5;
}

function ceilTo10(value) {
  return Math.ceil(value / 10) * 10;
}

function fmt(value, unit = "", digits = 2) {
  if (!Number.isFinite(value)) {
    return "Not available";
  }
  return `${value.toFixed(digits)}${unit ? ` ${unit}` : ""}`;
}

function badge(type, text) {
  return `<span class="badge ${type}">${icons[type] || ''} ${text}</span>`;
}

function calcStep(index, title, subtitle, level, formula, units, application, remarks, result) {
  return `
    <div class="step-card">
      <div class="step-head">
        <div class="step-icon-box">${icons.step}</div>
        <div class="step-title">
          <strong>${title}</strong>
          <span>${subtitle}</span>
        </div>
        <span class="result-pill ${level}">${icons[level] || ''} ${result}</span>
      </div>
      <div class="step-body">
        <div class="step-row">
          <strong>Formula</strong>
          <div class="step-code">${formula}</div>
        </div>
        <div class="step-row">
          <strong>Units</strong>
          <span>${units}</span>
        </div>
        <div class="step-row">
          <strong>Application</strong>
          <span>${application}</span>
        </div>
        <div class="step-row">
          <strong>Remarks</strong>
          <span>${remarks}</span>
        </div>
        <div class="step-row">
          <strong>Result</strong>
          <span>${result}</span>
        </div>
      </div>
    </div>
  `;
}

function fraction(top, bottom) {
  return `<span class="fraction"><span class="top">${top}</span><span class="bar"></span><span class="bottom">${bottom}</span></span>`;
}

function equation(left, right) {
  return `<span class="equation"><span>${left}</span><span>=</span><span>${right}</span></span>`;
}

function radical(content) {
  return `<span class="radical"><span class="radical-sign">&radic;</span><span class="radical-content">${content}</span></span>`;
}

function statusFromChecks(checks) {
  if (checks.some((item) => item.level === "bad")) {
    return "bad";
  }
  if (checks.some((item) => item.level === "warn")) {
    return "warn";
  }
  return "ok";
}

function getCantLimit(routeGroup, turnoutTrack) {
  if (turnoutTrack) {
    return 140;
  }
  return routeGroup === "AB" ? 185 : 165;
}

function getCdLimit(stockType, outerCrossingLimit) {
  let limit = parseFloat(stockType);
  if (limit === 150 && outerCrossingLimit) {
    limit = 115;
  }
  return limit;
}

function deriveCurveBalance(radius, speed, gauge, cantLimit, cdLimit) {
  if (!(radius > 0) || !(speed > 0) || !(gauge > 0)) {
    return {
      equilibriumCant: NaN,
      adoptedCant: NaN,
      cantDeficiency: NaN
    };
  }

  const equilibriumCant = (gauge * speed * speed) / (127 * radius);
  const adoptedCant = roundTo5(Math.min(cantLimit, equilibriumCant));
  const cantDeficiency = Math.min(cdLimit, Math.max(0, equilibriumCant - adoptedCant));

  return {
    equilibriumCant,
    adoptedCant,
    cantDeficiency
  };
}

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

function validateInputs() {
  const rules = {
    radius: (v) => v >= 150,
    sectionalSpeed: (v) => v > 0,
    designSpeed: (v) => v > 0 && v <= num("sectionalSpeed"),
    goodsSpeed: (v) => v >= 0 && v <= num("designSpeed"),
    chordLength: (v) => v > 0,
    transitionLength: (v) => v >= 0,
    gauge: (v) => v > 0
  };

  Object.keys(rules).forEach((id) => {
    const node = el(id);
    if (!node) return;
    const isValid = rules[id](num(id));
    node.classList.toggle("invalid", !isValid);
  });
}

function setVisible(id, visible) {
  const node = el(id);
  if (!node) {
    return;
  }
  node.classList.toggle("hidden", !visible);
}

function hasAdvancedSelections() {
  return checked("turnoutTrack")
    || checked("hasCompoundCurve")
    || checked("hasReverseCurve")
    || checked("hasCrossover")
    || checked("hasDiamond")
    || txt("turnoutPlacement") !== "straight";
}

function updateVisibility() {
  const showOuterCrossingLimit = txt("stockType") === "150";
  
  // Main Feature Toggles (Sidebar)
  const isCompound = checked("hasCompoundCurve");
  const isReverse = checked("hasReverseCurve");
  const isTurnout = checked("turnoutTrack") || txt("turnoutPlacement") !== "straight";
  const isCrossover = checked("hasCrossover");
  const isDiamond = checked("hasDiamond");

  // Tab Visibility
  setVisible("tab-btn-extended", isCompound || isReverse);
  setVisible("tab-btn-special", isTurnout || isCrossover || isDiamond);

  // Internal Section Visibility
  setVisible("compoundCurveFields", isCompound);
  setVisible("reverseCurveFields", isReverse);
  
  const showMainCurveDegree = txt("turnoutType") === "1:8.5" && txt("turnoutPlacement") === "outside";
  const showReverseAfterTurnout = txt("turnoutCase") === "similar";
  const showDiamondApproachStraight = isDiamond;

  setVisible("outerCrossingLimitRow", showOuterCrossingLimit);
  setVisible("mainCurveDegreeField", showMainCurveDegree);
  setVisible("reverseAfterTurnoutField", showReverseAfterTurnout);
  setVisible("diamondApproachStraightRow", showDiamondApproachStraight);

  if (!showOuterCrossingLimit) {
    el("outerCrossingLimit").checked = false;
  }

  if (!showDiamondApproachStraight) {
    el("diamondApproachStraight").checked = false;
  }

  const advancedCases = el("advancedCases");
  if (advancedCases && hasAdvancedSelections()) {
    advancedCases.open = true;
  }
}

function collectData() {
  return {
    curveName: txt("curveName").trim() || "Curve",
    routeGroup: txt("routeGroup"),
    curveType: txt("curveType"),
    sectionalSpeed: num("sectionalSpeed"),
    radius: num("radius"),
    curveLength: num("curveLength"),
    chordLength: num("chordLength"),
    versine: num("versine"),
    transitionLength: num("transitionLength"),
    offsetX: num("offsetX"),
    designSpeed: num("designSpeed"),
    goodsSpeed: num("goodsSpeed"),
    gauge: num("gauge"),
    stockType: txt("stockType"),
    turnoutTrack: checked("turnoutTrack"),
    outerCrossingLimit: checked("outerCrossingLimit"),
    hasCompoundCurve: checked("hasCompoundCurve"),
    compoundRadius1: num("compoundRadius1"),
    compoundSpeed1: num("compoundSpeed1"),
    compoundRadius2: num("compoundRadius2"),
    compoundSpeed2: num("compoundSpeed2"),
    hasReverseCurve: checked("hasReverseCurve"),
    reverseRadius1: num("reverseRadius1"),
    reverseSpeed1: num("reverseSpeed1"),
    reverseRadius2: num("reverseRadius2"),
    reverseSpeed2: num("reverseSpeed2"),
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
    diamondApproachStraight: checked("diamondApproachStraight"),
    existingGradient: num("existingGradient"),
    rulingGradient: num("rulingGradient"),
    grade1: num("grade1"),
    grade2: num("grade2"),
    verticalGroup: txt("verticalGroup")
  };
}

function buildReport() {
  const d = collectData();
  const checks = [];
  const cantLimit = getCantLimit(d.routeGroup, d.turnoutTrack);
  const cdLimit = getCdLimit(d.stockType, d.outerCrossingLimit);
  const radiusFromVersine = d.versine > 0 ? (125 * d.chordLength * d.chordLength) / d.versine : NaN;
  const versineFromRadius = d.radius > 0 ? (d.chordLength * d.chordLength) / (8 * d.radius) : NaN;
  const equilibriumCant = d.radius > 0 ? (d.gauge * d.designSpeed * d.designSpeed) / (127 * d.radius) : NaN;
  const actualCant = roundTo5(Math.min(cantLimit, equilibriumCant || 0));
  const goodsEquilibriumCant = d.radius > 0 ? (d.gauge * d.goodsSpeed * d.goodsSpeed) / (127 * d.radius) : NaN;
  const cantExcess = actualCant - goodsEquilibriumCant;
  const transitionedSpeed = d.radius > 0 ? 0.27 * Math.sqrt(d.radius * (actualCant + cdLimit)) : NaN;
  const desirableL1 = d.curveType === "nonTransitioned" ? 0.008 * actualCant * transitionedSpeed : 0.0056 * actualCant * transitionedSpeed;
  const desirableL2 = d.curveType === "nonTransitioned" ? 0.008 * cdLimit * transitionedSpeed : 0.0056 * cdLimit * transitionedSpeed;
  const desirableL3 = 0.72 * actualCant;
  const transitionFactor = d.curveType === "nonTransitioned" ? 0.008 : 0.0056;
  const desirableTransition = ceilTo10(Math.max(desirableL1, desirableL2, desirableL3));
  const minimumTransition = d.curveType === "nonTransitioned"
    ? Math.max((2 / 3) * Math.max(desirableL1, desirableL2), 0.5 * desirableL3)
    : Math.max((5 / 6) * Math.max(desirableL1, desirableL2), 0.5 * desirableL3);
  const transitionOptions = [
    { key: "Condition 1", label: `${transitionFactor} x Ca x V`, value: desirableL1 },
    { key: "Condition 2", label: `${transitionFactor} x Cd x V`, value: desirableL2 },
    { key: "Condition 3", label: `0.72 x Ca`, value: desirableL3 }
  ];
  const governingTransition = transitionOptions.reduce((best, item) => item.value > best.value ? item : best, transitionOptions[0]);
  const shift = d.radius > 0 ? (d.transitionLength * d.transitionLength) / (24 * d.radius) : NaN;
  const offset = d.radius > 0 && d.transitionLength > 0 ? Math.pow(d.offsetX, 3) / (6 * d.radius * d.transitionLength) : NaN;
  const bestSpeed = solveBestSpeed(
    d.radius,
    d.transitionLength,
    cantLimit,
    cdLimit,
    d.sectionalSpeed,
    d.curveType === "nonTransitioned"
  );
  const compensation = d.radius > 0 ? 70 / d.radius : NaN;
  const compensatedGradient = d.existingGradient - compensation;
  const gradeDifference = Math.abs(d.grade1 - d.grade2);
  const minimumVerticalRadius = d.verticalGroup === "A" ? 4000 : d.verticalGroup === "B" ? 3000 : 2500;

  if (Math.abs(radiusFromVersine - d.radius) > Math.max(5, d.radius * 0.02)) {
    checks.push({ level: "warn", text: "The input radius and the radius derived from versine differ noticeably. Review geometry before finalizing the report." });
  } else {
    checks.push({ level: "ok", text: "Versine-based radius is broadly consistent with the entered radius." });
  }

  if (equilibriumCant > cantLimit) {
    checks.push({ level: "warn", text: `Equilibrium cant exceeds the applicable design limit of ${cantLimit} mm, so the provided cant is capped.` });
  } else {
    checks.push({ level: "ok", text: `Calculated cant is within the design cant limit of ${cantLimit} mm.` });
  }

  if (cantExcess > 75) {
    checks.push({ level: "bad", text: `Cant excess for the goods speed is ${round(cantExcess)} mm, which exceeds the 75 mm limit of Para 404(3).` });
  } else {
    checks.push({ level: "ok", text: `Cant excess for the goods speed is within the 75 mm limit.` });
  }

  if (d.transitionLength < minimumTransition) {
    checks.push({ level: "bad", text: `The available transition length is below the minimum relaxed value of ${round(minimumTransition)} m.` });
  } else if (d.transitionLength < desirableTransition) {
    checks.push({ level: "warn", text: `The available transition length is below the desirable value of ${desirableTransition} m, so speed is governed by the restricted transition check.` });
  } else {
    checks.push({ level: "ok", text: "The available transition length meets the desirable transition requirement." });
  }

  const compoundCurve1 = deriveCurveBalance(d.compoundRadius1, d.compoundSpeed1, d.gauge, cantLimit, cdLimit);
  const compoundCurve2 = deriveCurveBalance(d.compoundRadius2, d.compoundSpeed2, d.gauge, cantLimit, cdLimit);
  const compoundTransitionCa = d.hasCompoundCurve
    ? 0.0056 * Math.abs((compoundCurve1.adoptedCant || 0) - (compoundCurve2.adoptedCant || 0)) * d.sectionalSpeed
    : NaN;
  const compoundTransitionCd = d.hasCompoundCurve
    ? 0.0056 * Math.abs((compoundCurve1.cantDeficiency || 0) - (compoundCurve2.cantDeficiency || 0)) * d.sectionalSpeed
    : NaN;
  const compoundTransition = d.hasCompoundCurve ? Math.max(compoundTransitionCa, compoundTransitionCd) : NaN;
  const compoundGoverning = compoundTransitionCa >= compoundTransitionCd ? "difference in cant" : "difference in cant deficiency";

  const reverseCurve1 = deriveCurveBalance(d.reverseRadius1, d.reverseSpeed1, d.gauge, cantLimit, cdLimit);
  const reverseCurve2 = deriveCurveBalance(d.reverseRadius2, d.reverseSpeed2, d.gauge, cantLimit, cdLimit);
  const reverseTransitionCa = d.hasReverseCurve
    ? 0.0056 * ((reverseCurve1.adoptedCant || 0) + (reverseCurve2.adoptedCant || 0)) * d.sectionalSpeed
    : NaN;
  const reverseTransitionCd = d.hasReverseCurve
    ? 0.0056 * ((reverseCurve1.cantDeficiency || 0) + (reverseCurve2.cantDeficiency || 0)) * d.sectionalSpeed
    : NaN;
  const reverseTransition = d.hasReverseCurve ? Math.max(reverseTransitionCa, reverseTransitionCd) : NaN;
  const reverseGoverning = reverseTransitionCa >= reverseTransitionCd ? "sum of cant" : "sum of cant deficiency";

  const turnoutChecks = [];
  const turnoutSpeed = turnoutBaseSpeed(d.turnoutType);

  if (d.turnoutPlacement === "inside" && d.turnoutType === "1:8.5") {
    turnoutChecks.push({ level: "bad", text: "1 in 8.5 turnout shall not be laid from the inside of a curved track." });
  }

  if (d.turnoutPlacement !== "straight" && (d.turnoutType === "1:12" || d.turnoutType === "1:12TWS") && (d.leadRadius < 350 || d.radius < 350)) {
    turnoutChecks.push({ level: "bad", text: "For 1 in 12 or flatter turnouts taking off from a curve, both the lead curve radius and the main line curve radius should not be less than 350 m." });
  }

  if (d.turnoutPlacement === "outside" && d.turnoutType === "1:8.5" && d.mainCurveDegree > 5) {
    turnoutChecks.push({ level: "bad", text: "1 in 8.5 turnout with curved switches from the outside of a curve is limited to five degree in exceptional circumstances." });
  }

  if (d.leadRadius < 220) {
    turnoutChecks.push({ level: "bad", text: "Turn-in curve radius is below the absolute minimum of 220 m." });
  } else if (d.leadRadius < 350) {
    turnoutChecks.push({ level: "warn", text: "Turn-in curve radius is below the preferred 350 m and falls in the exceptional allowance band." });
  } else {
    turnoutChecks.push({ level: "ok", text: "Turn-in curve radius meets the general 350 m preference." });
  }

  const turnoutStatus = statusFromChecks(turnoutChecks);
  const showTurnoutReview = d.turnoutTrack || d.turnoutPlacement !== "straight" || d.hasCrossover || d.hasDiamond;
  const showCrossingReview = d.hasCrossover || d.hasDiamond;
  const showSpecialCasesReview = d.hasCompoundCurve || d.hasReverseCurve;

  let mainLineTurnoutCant;
  if (d.turnoutCase === "similar") {
    mainLineTurnoutCant = d.turnoutEqCant + 75;
    if (d.reverseAfterTurnout === "yes") {
      mainLineTurnoutCant = Math.min(mainLineTurnoutCant, 65);
      turnoutChecks.push({ level: "warn", text: "Because the similar-flexure turnout is followed by a reverse curve, cant is limited to 65 mm and run-out begins after the crossing." });
    }
  } else {
    mainLineTurnoutCant = Math.max(0, cdLimit - d.turnoutEqCant);
  }

  const mainLineTurnoutSpeed = d.radius > 0
    ? Math.min(d.interlockingSpeed, d.sectionalSpeed, 0.27 * Math.sqrt(d.radius * (mainLineTurnoutCant + cdLimit)))
    : 0;

  const overallStatus = statusFromChecks([...checks, ...turnoutChecks]);

  const transitionLevel = d.transitionLength < minimumTransition ? "bad" : d.transitionLength < desirableTransition ? "warn" : "ok";
  const gradientLevel = (d.existingGradient + compensation) > d.rulingGradient || gradeDifference >= 0.4 ? "warn" : "ok";
  const speedLevel = bestSpeed ? (bestSpeed.speed < d.sectionalSpeed ? "warn" : "ok") : "bad";
  const calculationSteps = [
    calcStep(
      1,
      "Radius And Versine Geometry Check",
      "Verifies the curve geometry in both directions using Para 401 relations",
      Math.abs(radiusFromVersine - d.radius) > Math.max(5, d.radius * 0.02) ? "warn" : "ok",
      `Radius from versine:<br>${equation("R", fraction("125 x C<sup>2</sup>", "V"))}<br><br>Versine from radius:<br>${equation("V", fraction("C<sup>2</sup>", "8 x R"))}`,
      "R in m, C in m, V in mm",
      `Radius from versine = 125 x ${fmt(d.chordLength, "m")}^2 / ${fmt(d.versine, "mm")} = ${fmt(radiusFromVersine, "m")}\n\nVersine from entered radius = ${fmt(d.chordLength, "m")}^2 / (8 x ${fmt(d.radius, "m")}) = ${fmt(versineFromRadius, "m")} = ${fmt(versineFromRadius * 1000, "mm")}`,
      "This checks whether the input versine and input radius describe the same curve geometry.",
      `Entered radius ${fmt(d.radius, "m")}, derived radius ${fmt(radiusFromVersine, "m")}, calculated versine ${fmt(versineFromRadius * 1000, "mm")}`
    ),
    calcStep(
      2,
      "Cant And Cant Deficiency",
      "Applies the design speed and cant limits",
      cantExcess > 75 ? "bad" : equilibriumCant > cantLimit ? "warn" : "ok",
      `${equation("Cant", fraction("G x V<sup>2</sup>", "127 x R"))}`,
      "Cant in mm, G in mm, V in km/h, R in m",
      `${fmt(d.gauge, "mm", 0)} x ${fmt(d.designSpeed, "km/h")}^2 / (127 x ${fmt(d.radius, "m")}) = ${fmt(equilibriumCant, "mm")}; adopted cant = ${fmt(actualCant, "mm", 0)}`,
      `Cant deficiency limit used is ${fmt(cdLimit, "mm", 0)} and goods-speed cant excess is ${fmt(cantExcess, "mm")}.`,
      `Adopted cant ${fmt(actualCant, "mm", 0)} with deficiency limit ${fmt(cdLimit, "mm", 0)}`
    ),
    calcStep(
      3,
      "Transition Adequacy",
      "Checks desirable and minimum transition requirement",
      transitionLevel,
      `${equation("L", `max(${transitionFactor} x Ca x V, ${transitionFactor} x Cd x V, 0.72 x Ca)`)}<br><br>`
        + `Condition 1:<br>${equation("L1", `${transitionFactor} x Ca x V`)} = ${fmt(desirableL1, "m")}<br><br>`
        + `Condition 2:<br>${equation("L2", `${transitionFactor} x Cd x V`)} = ${fmt(desirableL2, "m")}<br><br>`
        + `Condition 3:<br>${equation("L3", "0.72 x Ca")} = ${fmt(desirableL3, "m")}<br><br>`
        + `Governing condition:<br><strong>${governingTransition.key}</strong> using ${governingTransition.label} = ${fmt(governingTransition.value, "m")}`,
      "L in m, Ca/Cd in mm, V in km/h",
      `Desirable transition before rounding is governed by ${governingTransition.key} at ${fmt(governingTransition.value, "m")}; rounded desirable transition = ${fmt(desirableTransition, "m", 0)}; minimum relaxed transition = ${fmt(minimumTransition, "m")}; available = ${fmt(d.transitionLength, "m")}`,
      `Take the largest of the three conditions. Here the governing value is ${governingTransition.key} using ${governingTransition.label}.`,
      d.transitionLength < minimumTransition
        ? `Below minimum relaxed requirement by ${fmt(minimumTransition - d.transitionLength, "m")}`
        : d.transitionLength < desirableTransition
          ? `Below desirable requirement by ${fmt(desirableTransition - d.transitionLength, "m")}`
          : "Available transition meets desirable requirement"
    ),
    calcStep(
      4,
      "Permissible Speed On Curve",
      "Combines cant, cant deficiency, and actual transition",
      speedLevel,
      `${equation("V", `0.27 x ${radical("R x (Ca + Cd)")}`)}`,
      "V in km/h, R in m, Ca/Cd in mm",
      `Safe speed from cant and deficiency = ${fmt(transitionedSpeed, "km/h")}; governing speed with actual transition = ${bestSpeed ? fmt(bestSpeed.speed, "km/h", 0) : "Not feasible"}`,
      bestSpeed
        ? `Selected operating combination is cant ${fmt(bestSpeed.cant, "mm", 0)} and cant deficiency ${fmt(bestSpeed.cantDeficiency, "mm", 0)}.`
        : "No feasible combination was found under current transition-length and cant limits.",
      bestSpeed ? `Permissible curve speed ${fmt(bestSpeed.speed, "km/h", 0)}` : "No feasible speed under current inputs"
    ),
    calcStep(
      5,
      "Gradient And Vertical Curve",
      "Applies curvature compensation and grade difference review",
      gradientLevel,
      `${equation("Compensation", fraction("70", "R"))}<br><br>Vertical curve required if algebraic grade difference >= 0.4`,
      "Compensation in %, R in m, grades in %",
      `Compensation = ${fmt(compensation, "%")}; compensated gradient = ${fmt(compensatedGradient, "%")}; algebraic difference = ${fmt(gradeDifference, "%")}`,
      `Minimum vertical radius used is ${fmt(minimumVerticalRadius, "m", 0)} for route class ${d.verticalGroup}.`,
      gradeDifference >= 0.4 ? "Vertical curve required" : "Vertical curve not mandatory"
    )
  ].join("");

  const report = `
    <div class="report-card">
      ${badge(overallStatus, overallStatus === "ok" ? "Overall status: acceptable" : overallStatus === "warn" ? "Overall status: review required" : "Overall status: non-compliant items found")}
      <div class="status-row">
        <div class="status-card ${overallStatus}">
          <div class="status-icon">${icons[overallStatus]}</div>
          <div class="status-copy">
            <strong>Overall</strong>
            <span>${overallStatus === "ok" ? "Okay" : overallStatus === "warn" ? "Warning" : "Bad"}</span>
          </div>
        </div>
        <div class="status-card ${transitionLevel}">
          <div class="status-icon">${icons[transitionLevel]}</div>
          <div class="status-copy">
            <strong>Transition</strong>
            <span>${transitionLevel === "ok" ? "Okay" : transitionLevel === "warn" ? "Review" : "Short"}</span>
          </div>
        </div>
        <div class="status-card ${speedLevel}">
          <div class="status-icon">${icons[speedLevel]}</div>
          <div class="status-copy">
            <strong>Speed</strong>
            <span>${bestSpeed ? fmt(bestSpeed.speed, "km/h", 0) : "No Fit"}</span>
          </div>
        </div>
      </div>
      <div class="kpis">
        <div class="kpi">
          <span>Entered radius</span>
          <strong>${fmt(d.radius, "m")}</strong>
        </div>
        <div class="kpi">
          <span>Permissible speed on curve</span>
          <strong>${bestSpeed ? fmt(bestSpeed.speed, "km/h", 0) : "Not feasible"}</strong>
        </div>
        <div class="kpi">
          <span>Provided cant / deficiency</span>
          <strong>${bestSpeed ? `${fmt(bestSpeed.cant, "mm", 0)} / ${fmt(bestSpeed.cantDeficiency, "mm", 0)}` : "Not feasible"}</strong>
        </div>
      </div>
      <h3>${d.curveName} Summary</h3>
      
      ${(() => {
        const isRadiusBad = Math.abs(radiusFromVersine - d.radius) > Math.max(5, d.radius * 0.02);
        const isEqCantBad = equilibriumCant > cantLimit;
        const isExcessBad = cantExcess > 75;
        const isSpeedBad = !bestSpeed || bestSpeed.speed < d.sectionalSpeed;

        return `
      <table class="report-table">
        <tr><th>Item</th><th>Result</th></tr>
        <tr><td>Curve type</td><td>${d.curveType === "transitioned" ? "Fully transitioned" : "Non-transitioned with virtual transition"}</td></tr>
        <tr><td>Route group</td><td>${d.routeGroup === "AB" ? "Group A / B" : "Other route"}</td></tr>
        <tr><td>Radius from versine (Para 401)</td><td class="${isRadiusBad ? 'text-bad' : ''}">${fmt(radiusFromVersine, "m")}</td></tr>
        <tr><td>Calculated versine from input radius</td><td>${fmt(versineFromRadius * 1000, "mm")}</td></tr>
        <tr><td>Equilibrium cant at design speed (Para 404)</td><td class="${isEqCantBad ? 'text-bad' : ''}">${fmt(equilibriumCant, "mm")}</td></tr>
        <tr><td>Adopted cant after cap and 5 mm rounding</td><td>${fmt(actualCant, "mm", 0)}</td></tr>
        <tr><td>Cant excess for slow trains (Para 404)</td><td class="${isExcessBad ? 'text-bad' : ''}">${fmt(cantExcess, "mm")}</td></tr>
        <tr><td>Permissible cant deficiency used</td><td>${fmt(cdLimit, "mm", 0)}</td></tr>
        <tr><td>Governing speed with actual transition length</td><td class="${isSpeedBad ? 'text-bad' : ''}">${bestSpeed ? fmt(bestSpeed.speed, "km/h", 0) : "No feasible speed found"}</td></tr>
      </table>`;
      })()}
    </div>

    <details class="report-card collapsible" open>
      <summary>
        <div class="summary-copy">
          <strong>Step-by-step calculation steps</strong>
          <span>Shows formula, units, application, remarks, and result for the main checks.</span>
        </div>
      </summary>
      <div class="collapsible-body">
        <div class="step-grid">
          ${calculationSteps}
        </div>
      </div>
    </details>

    <details class="report-card collapsible">
      <summary>
        <div class="summary-copy">
          <strong>Compliance notes</strong>
          <span>Hidden by default so only the key outcome stays visible first.</span>
        </div>
      </summary>
      <div class="collapsible-body">
        <ul>
          ${checks.map((item) => `<li><strong>${item.level.toUpperCase()}:</strong> ${item.text}</li>`).join("")}
        </ul>
      </div>
    </details>

    ${showSpecialCasesReview ? `
    <details class="report-card collapsible">
      <summary>
        <div class="summary-copy">
          <strong>Transition and special curve cases</strong>
          <span>Open for compound and reverse curve notes.</span>
        </div>
      </summary>
      <div class="collapsible-body">
        <table class="report-table">
          <tr><th>Case</th><th>Calculated result</th></tr>
          ${d.hasCompoundCurve ? `<tr><td>Compound curve 1 derived values</td><td>Cant = ${fmt(compoundCurve1.adoptedCant, "mm")}, cant deficiency = ${fmt(compoundCurve1.cantDeficiency, "mm")} from radius ${fmt(d.compoundRadius1, "m")} and speed ${fmt(d.compoundSpeed1, "km/h")}.</td></tr>` : ""}
          ${d.hasCompoundCurve ? `<tr><td>Compound curve 2 derived values</td><td>Cant = ${fmt(compoundCurve2.adoptedCant, "mm")}, cant deficiency = ${fmt(compoundCurve2.cantDeficiency, "mm")} from radius ${fmt(d.compoundRadius2, "m")} and speed ${fmt(d.compoundSpeed2, "km/h")}.</td></tr>` : ""}
          ${d.hasCompoundCurve ? `<tr><td>Compound curve common transition</td><td>${fmt(compoundTransition, "m")} at ${fmt(d.sectionalSpeed, "km/h", 0)}. Cant-based check = ${fmt(compoundTransitionCa, "m")}; deficiency-based check = ${fmt(compoundTransitionCd, "m")}. Take the greater value, governed here by ${compoundGoverning}.</td></tr>` : ""}
          ${d.hasReverseCurve ? `<tr><td>Reverse curve 1 derived values</td><td>Cant = ${fmt(reverseCurve1.adoptedCant, "mm")}, cant deficiency = ${fmt(reverseCurve1.cantDeficiency, "mm")} from radius ${fmt(d.reverseRadius1, "m")} and speed ${fmt(d.reverseSpeed1, "km/h")}.</td></tr>` : ""}
          ${d.hasReverseCurve ? `<tr><td>Reverse curve 2 derived values</td><td>Cant = ${fmt(reverseCurve2.adoptedCant, "mm")}, cant deficiency = ${fmt(reverseCurve2.cantDeficiency, "mm")} from radius ${fmt(d.reverseRadius2, "m")} and speed ${fmt(d.reverseSpeed2, "km/h")}.</td></tr>` : ""}
          ${d.hasReverseCurve ? `<tr><td>Reverse curve common transition</td><td>${fmt(reverseTransition, "m")} at ${fmt(d.sectionalSpeed, "km/h", 0)}. Cant-based check = ${fmt(reverseTransitionCa, "m")}; deficiency-based check = ${fmt(reverseTransitionCd, "m")}. Take the greater value, governed here by ${reverseGoverning}.</td></tr>` : ""}
          ${d.hasReverseCurve ? `<tr><td>Reverse transition straight</td><td>${d.reverseStraight >= 50 ? "Meets the 50 m straight recommendation for high-speed Group A/B reverse curves." : "Below 50 m. Speeds above 130 km/h should not be permitted where the straight cannot be removed or increased."}</td></tr>` : ""}
          <tr><td>Running out super-elevation</td><td>${d.curveType === "transitioned" ? "Cant is to be run on the transition, not on the straight or circular curve." : "Cant is to be run on the virtual transition."}</td></tr>
          <tr><td>Reverse curve longitudinal profile</td><td>Case I keeps one rail fixed; Case II keeps the track centre line fixed. Both are noted in Para 406(3).</td></tr>
        </table>
      </div>
    </details>
    ` : ""}

    ${showTurnoutReview ? `
    <details class="report-card collapsible">
      <summary>
        <div class="summary-copy">
          <strong>Turnout and curved main line review</strong>
          <span>Open for turnout-specific speed, cant, and restriction checks.</span>
        </div>
      </summary>
      <div class="collapsible-body">
        ${badge(turnoutStatus, turnoutStatus === "ok" ? "Turnout status: acceptable" : turnoutStatus === "warn" ? "Turnout status: conditional" : "Turnout status: non-compliant")}
        <table class="report-table">
          <tr><th>Item</th><th>Result</th></tr>
          <tr><td>Turnout type</td><td>${d.turnoutType}</td></tr>
          <tr><td>Base permissible turnout speed (Para 408(4))</td><td>${fmt(turnoutSpeed, "km/h", 0)}</td></tr>
          <tr><td>Turn-in / lead radius check</td><td>${fmt(d.leadRadius, "m")}</td></tr>
          <tr><td>Curved main line case</td><td>${d.turnoutCase === "similar" ? "Similar flexure" : "Contrary flexure"}</td></tr>
          <tr><td>Main line cant at turnout (Paras 409, 411, 412)</td><td>${fmt(mainLineTurnoutCant, "mm")}</td></tr>
          <tr><td>Main line permissible speed at turnout</td><td>${fmt(mainLineTurnoutSpeed, "km/h")}</td></tr>
          <tr><td>No change of cant zone</td><td>No cant change should occur from 20 m before the toe of switch to 20 m beyond the nose of crossing.</td></tr>
        </table>
        <ul>
          ${turnoutChecks.map((item) => `<li><strong>${item.level.toUpperCase()}:</strong> ${item.text}</li>`).join("")}
        </ul>
      </div>
    </details>
    ` : ""}

    ${showCrossingReview ? `
    <details class="report-card collapsible">
      <summary>
        <div class="summary-copy">
          <strong>Crossover, diamond, clearance, and boards</strong>
          <span>Open only when these special track features apply.</span>
        </div>
      </summary>
      <div class="collapsible-body">
        <ul>
          <li><strong>Crossover case:</strong> ${d.hasCrossover ? "The same speed and cant are governed by the inner road, with the outer road raised to keep both roads in one inclined plane where possible." : "Not selected for this report."}</li>
          <li><strong>Diamond crossing case:</strong> ${d.hasDiamond ? "Approach curves should be without cant for at least 20 m on either side, with cant run-out beyond that length. Speed on the approach shall not exceed 65 km/h." : "Not selected for this report."}</li>
          <li><strong>Diamond unrestricted straight approach:</strong> ${d.diamondApproachStraight ? "Minimum 50 m straight before the diamond approach is marked available." : "If the diamond is on a straight approach to a curve, keep a minimum 50 m straight before the heel of the acute crossing for unrestricted diamond speed."}</li>
          <li><strong>Curve board data:</strong> Radius ${fmt(d.radius, "m")}, curve length ${fmt(d.curveLength, "m")}, transition length ${fmt(d.transitionLength, "m")}, cant ${fmt(actualCant, "mm", 0)}.</li>
          <li><strong>Rail post guidance:</strong> Show beginning and end of transition, or beginning and end of virtual transition on non-transitioned curves.</li>
          <li><strong>Cant markings:</strong> Show cant values on the inner rail web starting from zero at the transition start and at every versine station.</li>
          <li><strong>Extra clearance:</strong> Additional lateral clearances on curves are required between adjacent tracks and between track and fixed structures as per Schedule of Dimensions.</li>
        </ul>
      </div>
    </details>
    ` : ""}

    <details class="report-card collapsible">
      <summary>
        <div class="summary-copy">
          <strong>Gradient and vertical curve review</strong>
          <span>Open for the detailed vertical alignment result set.</span>
        </div>
      </summary>
      <div class="collapsible-body">
        <table class="report-table">
          <tr><th>Item</th><th>Result</th></tr>
          <tr><td>Existing gradient + compensation compared with ruling gradient</td><td>${(d.existingGradient + compensation) > d.rulingGradient ? "Compensation is required because the combined value exceeds the ruling gradient." : "Compensation may not be required because the combined value does not exceed the ruling gradient."}</td></tr>
          <tr><td>Compensated gradient</td><td>${fmt(compensatedGradient, "%")}</td></tr>
          <tr><td>Algebraic difference between grades</td><td>${fmt(gradeDifference, "%")}</td></tr>
          <tr><td>Vertical curve requirement</td><td>${gradeDifference >= 0.4 ? "Vertical curve required." : "Vertical curve not mandatory under Para 417."}</td></tr>
          <tr><td>Minimum vertical curve radius</td><td>${fmt(minimumVerticalRadius, "m", 0)}</td></tr>
        </table>
      </div>
    </details>
  `;

  el("report").innerHTML = report;
}

function resetDefaults() {
  ids.forEach((id) => {
    if (el(id).type === "checkbox") {
      el(id).checked = defaultState[id];
    } else {
      el(id).value = defaultState[id];
    }
  });
  updateVisibility();
  validateInputs();
  buildReport();
}

ids.forEach((id) => {
  const node = el(id);
  defaultState[id] = node.type === "checkbox" ? node.checked : node.value;
  node.addEventListener("input", () => {
    updateVisibility();
    validateInputs();
    buildReport();
  });
  node.addEventListener("change", () => {
    updateVisibility();
    validateInputs();
    buildReport();
  });
});

/* Wizard Calculations */
window.runSimpleWizard = function() {
  const v = num("wizSimpleSpeed");
  const ca = num("wizSimpleCant");
  const cdLimit = parseFloat(txt("stockType")) || 75;
  
  // R = V^2 / (0.0729 * (Ca + Cd))
  const rMin = Math.pow(v / 0.27, 2) / (ca + cdLimit);
  const rRounded = ceilTo10(rMin);
  
  const l1 = 0.0056 * ca * v;
  const l2 = 0.0056 * cdLimit * v;
  const l3 = 0.72 * ca;
  const lDes = ceilTo10(Math.max(l1, l2, l3));

  const output = el("wizSimpleOutput");
  output.innerHTML = `<strong>Calculated:</strong><br>Min Radius: ${fmt(rRounded, "m", 0)}<br>Des. Transition: ${fmt(lDes, "m", 0)}`;
  output.classList.remove("hidden");
  el("wizSimpleApply").classList.remove("hidden");
  
  window._wizResult = { radius: rRounded, speed: v, l: lDes };
};

window.applySimpleWizard = function() {
  if (!window._wizResult) return;
  el("radius").value = window._wizResult.radius;
  el("designSpeed").value = window._wizResult.speed;
  el("transitionLength").value = window._wizResult.l;
  document.querySelector('[data-target=tab-geometry]').click();
  buildReport();
};

window.runCompoundWizard = function() {
  const v = num("wizCompSpeed");
  const r1 = num("wizCompR1");
  const r2 = num("wizCompR2");
  const g = num("gauge");
  
  const ca1 = (g * v * v) / (127 * r1);
  const ca2 = (g * v * v) / (127 * r2);
  const deltaCa = Math.abs(ca1 - ca2);
  
  const l = ceilTo10(0.0056 * deltaCa * v);
  
  const output = el("wizCompOutput");
  output.innerHTML = `<strong>Common Transition:</strong><br>L = ${fmt(l, "m", 0)}<br>ΔCant: ${fmt(deltaCa, "mm")}`;
  output.classList.remove("hidden");
  el("wizCompApply").classList.remove("hidden");
  
  window._wizCompResult = { r1, r2, v, l };
};

window.applyCompoundWizard = function() {
  if (!window._wizCompResult) return;
  el("hasCompoundCurve").checked = true;
  el("compoundRadius1").value = window._wizCompResult.r1;
  el("compoundRadius2").value = window._wizCompResult.r2;
  el("compoundSpeed1").value = window._wizCompResult.v;
  el("compoundSpeed2").value = window._wizCompResult.v;
  updateVisibility();
  document.querySelector('[data-target=tab-special]').click();
  buildReport();
};

window.runReverseWizard = function() {
  const v = num("wizRevSpeed");
  const r1 = num("wizRevR1");
  const r2 = num("wizRevR2");
  const g = num("gauge");
  
  const ca1 = (g * v * v) / (127 * r1);
  const ca2 = (g * v * v) / (127 * r2);
  const sumCa = ca1 + ca2;
  
  const l = ceilTo10(0.0056 * sumCa * v);
  
  const output = el("wizRevOutput");
  output.innerHTML = `<strong>Total Transition length:</strong><br>L = ${fmt(l, "m", 0)}<br>Recommended Straight: 50m`;
  output.classList.remove("hidden");
  el("wizRevApply").classList.remove("hidden");
  
  window._wizRevResult = { r1, r2, v, l };
};

window.applyReverseWizard = function() {
  if (!window._wizRevResult) return;
  el("hasReverseCurve").checked = true;
  el("reverseRadius1").value = window._wizRevResult.r1;
  el("reverseRadius2").value = window._wizRevResult.r2;
  el("reverseSpeed1").value = window._wizRevResult.v;
  el("reverseSpeed2").value = window._wizRevResult.v;
  el("reverseStraight").value = 50;
  updateVisibility();
  document.querySelector('[data-target=tab-special]').click();
  buildReport();
};

function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      let targetId = btn.getAttribute("data-target");
      
      // Direct mapping for requested buttons if attributes are missing
      if (!targetId) {
        const text = btn.innerText.trim();
        if (text.includes("Geometry")) targetId = "tab-geometry";
        else if (text.includes("Extended")) targetId = "tab-extended";
        else if (text.includes("Track Features")) targetId = "tab-special";
      }

      if (!targetId) return;

      tabBtns.forEach((b) => b.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));
      
      btn.classList.add("active");
      const targetEl = el(targetId);
      if (targetEl) targetEl.classList.add("active");
    });
  });
}

/**
 * Injects icons into static buttons that aren't generated by JavaScript
 */
function injectStaticIcons() {
  const iconMap = {
    "saveBtn": "save",
    "resetBtn": "reset",
    "printBtn": "print",
    "importBtn": "import",
    "generateBtn": "ok",
    "tab-btn-basis": "geometry",
    "tab-btn-extended": "extended",
    "tab-btn-special": "special"
  };

  Object.entries(iconMap).forEach(([id, iconKey]) => {
    const button = el(id);
    if (button && icons[iconKey]) {
      // Remove existing icon spans or emojis
      const existingIcon = button.querySelector('.tab-icon, .btn-icon');
      if (existingIcon) existingIcon.remove();
      button.insertAdjacentHTML('afterbegin', icons[iconKey]);
    }
  });
}

// Initialize all tab functionality
document.addEventListener("DOMContentLoaded", function() {
  initTabs();
  injectStaticIcons();
  
  // Analyze/Generate button
  const generateBtn = el("generateBtn");
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      buildReport();
      console.log("Report generated successfully");
    });
  }
  
  // Print button
  const printBtn = el("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
  
  // Reset button
  const resetBtn = el("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset all values to defaults?")) {
        resetDefaults();
        alert("All values reset to defaults");
      }
    });
  }
  
  // Initial report build
  buildReport();
});

function initViewSwitcher() {
  const navEditor = el("nav-editor");
  const navAbout = el("nav-about");
  const editorView = el("editor-view");
  const aboutView = el("about-view");
  const sidePanel = document.querySelector(".ms-side-panel");
  const navItems = document.querySelectorAll(".ms-side-rail .ms-nav-item");

  function switchView(viewId) {
    navItems.forEach(item => item.classList.remove("active"));
    if (viewId === "about") {
      editorView.classList.add("hidden");
      aboutView.classList.remove("hidden");
      if (sidePanel) sidePanel.classList.add("hidden");
      navAbout.classList.add("active");
    } else {
      aboutView.classList.add("hidden");
      editorView.classList.remove("hidden");
      if (sidePanel) sidePanel.classList.remove("hidden");
      navEditor.classList.add("active");
    }
  }
  if (navEditor) navEditor.addEventListener("click", () => switchView("editor"));
  if (navAbout) navAbout.addEventListener("click", () => switchView("about"));
}

function saveData() {
  const data = collectData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.curveName.replace(/\s+/g, '_') || 'curve'}_design.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      ids.forEach((id) => {
        if (data.hasOwnProperty(id)) {
          const node = el(id);
          if (node.type === "checkbox") {
            node.checked = data[id];
          } else {
            node.value = data[id];
          }
        }
      });
      updateVisibility();
      validateInputs();
      buildReport();
    } catch (err) {
      alert("Error parsing design file. Please ensure it is a valid JSON exported from this tool.");
    }
    event.target.value = ''; // Reset for same file re-import
  };
  reader.readAsText(file);
}

el("generateBtn").addEventListener("click", buildReport);
el("resetBtn").addEventListener("click", resetDefaults);
el("printBtn").addEventListener("click", () => window.print());
el("saveBtn").addEventListener("click", saveData);
el("importBtn").addEventListener("click", () => el("importFile").click());
el("importFile").addEventListener("change", importData);

initViewSwitcher();
initTabs();
injectStaticIcons();
updateVisibility();
validateInputs();
buildReport();
