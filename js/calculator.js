// Advanced calculation functions for design and check reports

/**
 * Build the full design report
 */
function buildReport() {
  const d = collectData();
  const activePage = document.querySelector(".app-page:not([hidden])");
  const isCompoundPage = activePage && activePage.id === "compoundPage";
  const isReversePage = activePage && activePage.id === "reversePage";
  const useCompoundCase = d.enableCompound || isCompoundPage;
  const useReverseCase = d.enableReverse || isReversePage;
  const checks = [];
  const cantLimit = getDesignCantLimit(d.trackStandard, d.routeGroup, d.turnoutTrack);
  const cdLimit = getDesignCdLimit(d.trackStandard, d.stockType, d.outerCrossingLimit);
  const cantExcessLimit = getCantExcessLimit(d.trackStandard);
  const minimumRadius = getMinimumRadius(d.trackStandard);
  const useRestrictedTransition = d.enableRestrictedTransition || d.problemType === "restrictedTransition";
  const useTrafficMix = d.enableTrafficMix || d.problemType === "trafficWeighted";
  const useMinimumRadius = d.problemType === "minimumRadius";
  const useTurnoutReview = d.problemType === "turnoutCrossover";
  const factor = getTransitionRateFactor(d.curveType === "nonTransitioned");
  const cantDivisor = getFormulaValue("cantDivisor");
  const speedCoefficient = getFormulaValue("speedCoefficient");
  const cantGradientFactor = getFormulaValue("cantGradientFactor");
  const recommendedCantLabel = `${getFormulaValue("adoptedCantRoundTo")}mm rounded`;

  // Basic calculations
  const calculatedVersine = d.radius > 0 ? (d.chordLength * d.chordLength * getFormulaValue("versineMultiplier")) / (getFormulaValue("versineDivisor") * d.radius) : NaN;
  const equilibriumCant = d.radius > 0 ? (d.gauge * d.designSpeed * d.designSpeed) / (cantDivisor * d.radius) : NaN;
  const recommendedCant = roundTo5(Math.min(cantLimit, equilibriumCant || 0));
  const hasUserAdoptedCant = Number.isFinite(d.adoptedCant) && d.adoptedCant > 0;
  const actualCant = hasUserAdoptedCant ? d.adoptedCant : recommendedCant;
  const goodsEquilibriumCant = d.radius > 0 ? (d.gauge * d.goodsSpeed * d.goodsSpeed) / (cantDivisor * d.radius) : NaN;
  const cantExcess = actualCant - goodsEquilibriumCant;
  const transitionedSpeed = d.radius > 0 ? speedCoefficient * Math.sqrt(d.radius * (actualCant + cdLimit)) : NaN;

  // Traffic weighted speed
  const trafficGroups = [
    { n: d.trafficN1, w: d.trafficW1, v: d.trafficV1 },
    { n: d.trafficN2, w: d.trafficW2, v: d.trafficV2 },
    { n: d.trafficN3, w: d.trafficW3, v: d.trafficV3 }
  ];
  const weightedSpeed = useTrafficMix ? trafficWeightedSpeed(trafficGroups) : NaN;
  const weightedCant = useTrafficMix && d.radius > 0 ? roundTo5(Math.min(cantLimit, (d.gauge * weightedSpeed * weightedSpeed) / (cantDivisor * d.radius))) : NaN;

  // Transition calculations
  const desirableL1 = factor * actualCant * transitionedSpeed;
  const desirableL2 = factor * cdLimit * transitionedSpeed;
  const desirableL3 = cantGradientFactor * actualCant;
  const desirableTransition = ceilTo10(Math.max(desirableL1, desirableL2, desirableL3));
  d.transitionLength = useRestrictedTransition ? d.restrictedTransitionLength : desirableTransition;

  const minimumTransition = d.curveType === "nonTransitioned"
    ? Math.max(getFormulaValue("relaxedTransitionNonRateMultiplier") * Math.max(desirableL1, desirableL2), getFormulaValue("relaxedTransitionGradientMultiplier") * desirableL3)
    : Math.max(getFormulaValue("relaxedTransitionRateMultiplier") * Math.max(desirableL1, desirableL2), getFormulaValue("relaxedTransitionGradientMultiplier") * desirableL3);

  // Geometric calculations
  const shift = d.radius > 0 ? (d.transitionLength * d.transitionLength) / (24 * d.radius) : NaN;
  const offset = d.radius > 0 && d.transitionLength > 0 ? Math.pow(d.offsetX, 3) / (6 * d.radius * d.transitionLength) : NaN;

  // Find best speed
  const bestSpeed = solveBestSpeed(
    d.radius,
    d.transitionLength,
    cantLimit,
    cdLimit,
    d.sectionalSpeed,
    d.curveType === "nonTransitioned"
  );

  // Gradient and vertical curve
  const compensation = d.radius > 0 ? getFormulaValue("gradientCompensationFactor") / d.radius : NaN;
  const compensatedGradient = d.existingGradient - compensation;
  const gradeDifference = Math.abs(d.grade1 - d.grade2);
  const minimumVerticalRadius = getMinimumVerticalRadius(d.verticalGroup);

  // Minimum radius calculations
  const minRadiusByGoods = (d.gauge * (d.designSpeed * d.designSpeed - d.goodsSpeed * d.goodsSpeed)) / (cantDivisor * (cantExcessLimit + cdLimit));
  const minRadiusByCantDeficiency = (d.gauge * d.designSpeed * d.designSpeed) / (cantDivisor * (cantLimit + cdLimit));
  const calculatedMinimumRadius = Math.max(minRadiusByGoods, minRadiusByCantDeficiency, minimumRadius);

  // Populate checks
  if (d.radius < minimumRadius) {
    checks.push({ level: "bad", text: `${d.trackStandard} minimum radius is ${minimumRadius} m. Entered design radius ${fmt(d.radius, "m")} is below the minimum.` });
  } else {
    checks.push({ level: "ok", text: `Entered design radius meets the ${d.trackStandard} minimum radius requirement of ${minimumRadius} m.` });
  }

  checks.push({ level: "ok", text: `Design versine is calculated from chord and radius as ${fmt(calculatedVersine, "mm")}.` });

  if (equilibriumCant > cantLimit) {
    checks.push({ level: "warn", text: `Equilibrium cant exceeds the applicable design limit of ${cantLimit} mm, so the provided cant is capped.` });
  } else {
    checks.push({ level: "ok", text: `Calculated cant is within the design cant limit of ${cantLimit} mm.` });
  }

  if (hasUserAdoptedCant) {
    checks.push({
      level: actualCant > cantLimit ? "bad" : "ok",
      text: `User adopted cant ${fmt(actualCant, "mm", 0)} is used for recalculation. Recommended cant was ${fmt(recommendedCant, "mm", 0)}.`
    });
  }

  if (cantExcess > cantExcessLimit) {
    checks.push({ level: "bad", text: `Cant excess for the goods speed is ${round(cantExcess)} mm, which exceeds the ${cantExcessLimit} mm limit.` });
  } else {
    checks.push({ level: "ok", text: `Cant excess for the goods speed is within the ${cantExcessLimit} mm limit.` });
  }

  if (useRestrictedTransition && d.transitionLength < minimumTransition) {
    checks.push({ level: "bad", text: `Restricted transition ${fmt(d.transitionLength, "m")} is below the minimum relaxed value of ${fmt(minimumTransition, "m")}.` });
  } else if (useRestrictedTransition && d.transitionLength < desirableTransition) {
    checks.push({ level: "warn", text: `Restricted transition ${fmt(d.transitionLength, "m")} is below the desirable calculated value of ${fmt(desirableTransition, "m", 0)}.` });
  } else {
    checks.push({ level: "ok", text: `Transition length is ${useRestrictedTransition ? "checked against the restricted available value" : "calculated"} as ${fmt(d.transitionLength, "m", 0)} from the governing transition conditions.` });
  }

  if (useMinimumRadius) {
    checks.push({ level: d.radius >= calculatedMinimumRadius ? "ok" : "warn", text: `Minimum radius problem result is ${fmt(calculatedMinimumRadius, "m")}; compare this with entered radius ${fmt(d.radius, "m")}.` });
  }

  // Compound and reverse curves
  const compoundTransition = Math.max(
    getFormulaValue("transitionedRateFactor") * Math.abs(d.compoundCa1 - d.compoundCa2) * d.sectionalSpeed,
    getFormulaValue("transitionedRateFactor") * Math.abs(d.compoundCd1 - d.compoundCd2) * d.sectionalSpeed
  );
  const reverseTransition = Math.max(
    getFormulaValue("transitionedRateFactor") * (d.reverseCa1 + d.reverseCa2) * d.sectionalSpeed,
    getFormulaValue("transitionedRateFactor") * (d.reverseCd1 + d.reverseCd2) * d.sectionalSpeed
  );

  // Turnout checks
  const turnoutChecks = [];
  const turnoutSpeed = (d.enableTurnout || useTurnoutReview) ? turnoutBaseSpeed(d.turnoutType) : NaN;

  if (d.enableTurnout || useTurnoutReview) {
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
  }

  let turnoutStatus = statusFromChecks(turnoutChecks);

  let mainLineTurnoutCant = NaN;
  if (d.enableTurnout || useTurnoutReview) {
    if (d.turnoutCase === "similar") {
      mainLineTurnoutCant = d.turnoutEqCant + 75;
      if (d.reverseAfterTurnout === "yes") {
        mainLineTurnoutCant = Math.min(mainLineTurnoutCant, 65);
        turnoutChecks.push({ level: "warn", text: "Because the similar-flexure turnout is followed by a reverse curve, cant is limited to 65 mm and run-out begins after the crossing." });
      }
    } else {
      mainLineTurnoutCant = Math.max(0, cdLimit - d.turnoutEqCant);
    }
  }

  const mainLineTurnoutSpeed = (d.enableTurnout || useTurnoutReview) && d.radius > 0
    ? Math.min(d.interlockingSpeed, d.sectionalSpeed, speedCoefficient * Math.sqrt(d.radius * (mainLineTurnoutCant + cdLimit)))
    : NaN;

  turnoutStatus = statusFromChecks(turnoutChecks);
  const overallStatus = statusFromChecks([...checks, ...turnoutChecks]);

  // Generate HTML report
  const report = generateDesignReport({
    d, checks, turnoutChecks, cantLimit, cdLimit, cantExcessLimit, minimumRadius,
    calculatedVersine, equilibriumCant, recommendedCant, hasUserAdoptedCant, recommendedCantLabel, actualCant, goodsEquilibriumCant, cantExcess,
    transitionedSpeed, weightedSpeed, weightedCant, desirableL1, desirableL2, desirableL3,
    desirableTransition, minimumTransition, shift, offset, bestSpeed, compensation,
    compensatedGradient, gradeDifference, minimumVerticalRadius, calculatedMinimumRadius,
    compoundTransition, reverseTransition, turnoutSpeed, mainLineTurnoutCant,
    mainLineTurnoutSpeed, turnoutStatus, overallStatus, useCompoundCase, useReverseCase, useMinimumRadius,
    useRestrictedTransition, useTrafficMix, minRadiusByGoods, minRadiusByCantDeficiency,
    factor, cantDivisor, speedCoefficient, cantGradientFactor
  });

  const reportEl = el("report");
  if (reportEl) {
    reportEl.innerHTML = report;
  }

  // Also write to compound or reverse report if those pages are active
  if (activePage) {
    const pageId = activePage.id;
    if (pageId === "compoundPage") {
      const compoundReportEl = el("compoundReport");
      if (compoundReportEl) compoundReportEl.innerHTML = report;
    } else if (pageId === "reversePage") {
      const reverseReportEl = el("reverseReport");
      if (reverseReportEl) reverseReportEl.innerHTML = report;
    }
  }
}

/**
 * Generate design report HTML
 */
function generateDesignReport(params) {
  const {
    d, checks, turnoutChecks, cantLimit, cdLimit, minimumRadius,
    calculatedVersine, equilibriumCant, recommendedCant, hasUserAdoptedCant, recommendedCantLabel, actualCant, goodsEquilibriumCant,
    cantExcess, transitionedSpeed, weightedSpeed, weightedCant, desirableL1,
    desirableL2, desirableL3, desirableTransition, minimumTransition, shift,
    offset, bestSpeed, compensation, compensatedGradient, gradeDifference,
    minimumVerticalRadius, calculatedMinimumRadius, compoundTransition,
    reverseTransition, turnoutSpeed, mainLineTurnoutCant, mainLineTurnoutSpeed,
    turnoutStatus, overallStatus, useCompoundCase, useReverseCase, useMinimumRadius, useRestrictedTransition,
    useTrafficMix, minRadiusByGoods, minRadiusByCantDeficiency,
    factor, cantDivisor, speedCoefficient, cantGradientFactor
  } = params;

  const bestSpeedDetail = bestSpeed
    ? `Trial speeds are checked from ${fmt(d.sectionalSpeed, "km/h", 0)} downward until cant, cant deficiency, cant run-out rate, and gradient length are all feasible. Governing result: speed ${fmt(bestSpeed.speed, "km/h", 0)}, cant ${fmt(bestSpeed.cant, "mm", 0)}, cant deficiency ${fmt(bestSpeed.cantDeficiency, "mm", 0)}.`
    : `No feasible trial speed was found within the entered transition length, cant limit, and cant deficiency limit.`;

  const calcStep = (step, title, formula, result) => `
    <article class="calc-step">
      <div class="calc-index">${step}</div>
      <div class="calc-content">
        <h4>${title}</h4>
        <div class="calc-formula">${formula}</div>
        <div class="calc-result">${result}</div>
      </div>
    </article>
  `;

  const calculationReport = `
    <div class="office-panel">
      <h3>Step-by-Step Calculation</h3>
      <div class="calc-steps">
        ${calcStep("1", "Design Versine", `V = C^2 / (${getFormulaValue("versineDivisor")}R) x ${getFormulaValue("versineMultiplier")}`, `${d.chordLength}^2 / (${getFormulaValue("versineDivisor")} x ${d.radius}) x ${getFormulaValue("versineMultiplier")} = ${fmt(calculatedVersine, "mm")}`)}
        ${calcStep("2", "Equilibrium Cant", `Ca = G x V^2 / (${cantDivisor}R)`, `${d.gauge} x ${d.designSpeed}^2 / (${cantDivisor} x ${d.radius}) = ${fmt(equilibriumCant, "mm")}`)}
        ${calcStep("3", "Adopted Cant", hasUserAdoptedCant ? `Adopted cant entered by user` : `Adopted = min(Ca, cant limit), ${recommendedCantLabel}`, hasUserAdoptedCant ? `User adopted cant = ${fmt(actualCant, "mm", 0)}; calculated recommendation = ${fmt(recommendedCant, "mm", 0)}` : `min(${fmt(equilibriumCant, "mm")}, ${cantLimit} mm) = ${fmt(actualCant, "mm", 0)}`)}
        ${calcStep("4", "Goods Equilibrium Cant", `Ca goods = G x Vgoods^2 / (${cantDivisor}R)`, `${d.gauge} x ${d.goodsSpeed}^2 / (${cantDivisor} x ${d.radius}) = ${fmt(goodsEquilibriumCant, "mm")}`)}
        ${calcStep("5", "Cant Excess", `Cant excess = adopted cant - goods equilibrium cant`, `${fmt(actualCant, "mm", 0)} - ${fmt(goodsEquilibriumCant, "mm")} = ${fmt(cantExcess, "mm")}`)}
        ${calcStep("6", "Speed from Cant and Deficiency", `V = ${speedCoefficient} x sqrt(R x (Ca + Cd))`, `${speedCoefficient} x sqrt(${d.radius} x (${actualCant} + ${cdLimit})) = ${fmt(transitionedSpeed, "km/h")}`)}
        ${calcStep("7", "Transition by Cant Rate", `L1 = ${factor} x Ca x V`, `${factor} x ${actualCant} x ${fmt(transitionedSpeed, "", 2)} = ${fmt(desirableL1, "m")}`)}
        ${calcStep("8", "Transition by Deficiency Rate", `L2 = ${factor} x Cd x V`, `${factor} x ${cdLimit} x ${fmt(transitionedSpeed, "", 2)} = ${fmt(desirableL2, "m")}`)}
        ${calcStep("9", "Transition by Gradient Rate", `L3 = ${cantGradientFactor} x Ca`, `${cantGradientFactor} x ${actualCant} = ${fmt(desirableL3, "m")}`)}
        ${calcStep("10", "Calculated Transition Length", `L = ceil to next ${getFormulaValue("transitionRoundTo")} m of max(L1, L2, L3)`, `max(${fmt(desirableL1, "m")}, ${fmt(desirableL2, "m")}, ${fmt(desirableL3, "m")}) = ${fmt(d.transitionLength, "m", 0)}`)}
        ${calcStep("11", "Minimum Relaxed Transition", `Lmin = rate multiplier x max(L1,L2) or gradient multiplier x L3`, `${fmt(minimumTransition, "m")}`)}
        ${calcStep("12", "Shift at Transition Start", `Shift = L^2 / (24R)`, `${fmt(d.transitionLength, "m", 0)}^2 / (24 x ${d.radius}) = ${fmt(shift, "m")}`)}
        ${calcStep("13", "Offset at X", `Offset = X^3 / (6 R L)`, `${d.offsetX}^3 / (6 x ${d.radius} x ${d.transitionLength}) = ${fmt(offset, "m")}`)}
        ${calcStep("14", "Compensated Gradient", `Compensation = ${getFormulaValue("gradientCompensationFactor")} / R`, `${getFormulaValue("gradientCompensationFactor")} / ${d.radius} = ${fmt(compensation, "%")}`)}
        ${calcStep("15", "Adjusted Gradient", `Existing – Compensation`, `${fmt(d.existingGradient, "%", 3)} - ${fmt(compensation, "%", 3)} = ${fmt(compensatedGradient, "%", 3)}`)}
        ${calcStep("16", "Best Speed Result", `Final permissible speed based on cant, deficiency, and transition`, bestSpeed ? `${bestSpeedDetail} Result: ${fmt(bestSpeed.speed, "km/h", 0)}` : bestSpeedDetail)}
      </div>
    </div>
  `;

  let html = `
    <div class="office-panel">
      ${badge(overallStatus, overallStatus === "ok" ? "Overall: Acceptable" : overallStatus === "warn" ? "Overall: Review Required" : "Overall: Non-Compliant")}
      <div class="grid grid-3 mt-3">
        <div class="office-panel">
          <p class="text-muted">Entered Radius</p>
          <h3>${fmt(d.radius, "m")}</h3>
        </div>
        <div class="office-panel">
          <p class="text-muted">Permissible Speed</p>
          <h3>${bestSpeed ? fmt(bestSpeed.speed, "km/h", 0) : "Not Feasible"}</h3>
        </div>
        <div class="office-panel">
          <p class="text-muted">Cant / Deficiency</p>
          <h3>${bestSpeed ? `${fmt(bestSpeed.cant, "mm", 0)} / ${fmt(bestSpeed.cantDeficiency, "mm", 0)}` : "Not Feasible"}</h3>
        </div>
      </div>
      <h3>${d.curveName} Design Summary</h3>
      <table>
        <tr><th>Item</th><th>Result</th></tr>
        <tr><td>Design Problem Type</td><td>${humanizeProblemType(d.problemType)}</td></tr>
        <tr><td>Track Standard</td><td>${d.trackStandard}</td></tr>
        <tr><td>Curve Type</td><td>${d.curveType === "transitioned" ? "Fully Transitioned" : "Non-transitioned with Virtual Transition"}</td></tr>
        <tr><td>Minimum Radius Constraint</td><td>${fmt(minimumRadius, "m", 0)}</td></tr>
        <tr><td>Calculated Versine (C=${d.chordLength}m)</td><td>${fmt(calculatedVersine, "mm")}</td></tr>
        <tr><td>Equilibrium Cant @ Design Speed</td><td>${fmt(equilibriumCant, "mm")}</td></tr>
        <tr><td>Goods Equilibrium Cant @ Goods Speed</td><td>${fmt(goodsEquilibriumCant, "mm")}</td></tr>
        <tr><td>Recommended Adopted Cant</td><td>${fmt(recommendedCant, "mm", 0)}</td></tr>
        <tr><td>Adopted Cant Used</td><td>${fmt(actualCant, "mm", 0)} (${hasUserAdoptedCant ? "user input" : recommendedCantLabel})</td></tr>
        <tr><td>Cant Deficiency Used</td><td>${fmt(cdLimit, "mm", 0)}</td></tr>
        <tr><td>Cant Excess @ Goods Speed</td><td>${fmt(cantExcess, "mm")}</td></tr>
        <tr><td>Calculated Transition Length</td><td>${fmt(d.transitionLength, "m", 0)}</td></tr>
        <tr><td>Minimum Relaxed Transition</td><td>${fmt(minimumTransition, "m")}</td></tr>
        <tr><td>Shift @ Transition Start</td><td>${fmt(shift, "m")}</td></tr>
        <tr><td>Offset @ X=${d.offsetX}m</td><td>${fmt(offset, "m")}</td></tr>
      </table>
    </div>

    <div class="office-panel">
      <h3>Compliance Notes</h3>
      <ul>
        ${checks.map(checkItem).join("")}
      </ul>
    </div>

    ${calculationReport}
  `;

  if (useCompoundCase || useReverseCase) {
    html += `
      <div class="office-panel">
        <h3>Special Curve Cases</h3>
        <table>
          <tr><th>Case</th><th>Result</th></tr>
          ${useCompoundCase ? `<tr><td>Compound Transition</td><td>${fmt(compoundTransition, "m")}</td></tr>` : ""}
          ${useReverseCase ? `<tr><td>Reverse Transition</td><td>${fmt(reverseTransition, "m")}</td></tr>` : ""}
        </table>
      </div>
    `;
  }

  if (d.enableTurnout || d.problemType === "turnoutCrossover") {
    html += `
      <div class="office-panel">
        ${badge(turnoutStatus, `Turnout Status: ${turnoutStatus.toUpperCase()}`)}
        <h3>Turnout Review</h3>
        <table>
          <tr><th>Item</th><th>Result</th></tr>
          <tr><td>Turnout Type</td><td>${d.turnoutType}</td></tr>
          <tr><td>Turn-in Radius</td><td>${fmt(d.leadRadius, "m")}</td></tr>
          <tr><td>Main Line Cant</td><td>${fmt(mainLineTurnoutCant, "mm")}</td></tr>
          <tr><td>Main Line Speed</td><td>${fmt(mainLineTurnoutSpeed, "km/h")}</td></tr>
        </table>
        <h4>Checks</h4>
        <ul>
          ${turnoutChecks.map(checkItem).join("")}
        </ul>
      </div>
    `;
  }

  return html;
}

/**
 * Build the existing curve check report
 */
function buildCheckReport() {
  const d = collectCheckData();
  const checks = [];
  const cantLimit = getCantLimit(d.routeGroup, d.turnoutTrack);
  const cdLimit = getCdLimit(d.stockType, d.outerCrossingLimit);
  const bgMinimumRadius = getMinimumRadius("BG");
  const cantDivisor = getFormulaValue("cantDivisor");
  const speedCoefficient = getFormulaValue("speedCoefficient");
  const factor = getTransitionRateFactor(d.curveType === "nonTransitioned");
  const cantGradientFactor = getFormulaValue("cantGradientFactor");

  // Calculations
  const radiusFromVersine = d.versine > 0 ? (getFormulaValue("radiusFromVersineFactor") * d.chordLength * d.chordLength) / d.versine : NaN;
  const equilibriumCant = d.radius > 0 ? (d.gauge * d.speed * d.speed) / (cantDivisor * d.radius) : NaN;
  const cantDeficiency = Math.max(0, equilibriumCant - d.measuredCant);
  const goodsEquilibriumCant = d.radius > 0 ? (d.gauge * d.goodsSpeed * d.goodsSpeed) / (cantDivisor * d.radius) : NaN;
  const cantExcess = d.measuredCant - goodsEquilibriumCant;
  const speedByCant = d.radius > 0 ? speedCoefficient * Math.sqrt(d.radius * (d.measuredCant + cdLimit)) : NaN;

  const requiredByCantRate = factor * d.measuredCant * d.speed;
  const requiredByDeficiencyRate = factor * cantDeficiency * d.speed;
  const requiredByGradient = cantGradientFactor * d.measuredCant;
  const requiredTransition = ceilTo10(Math.max(requiredByCantRate, requiredByDeficiencyRate, requiredByGradient));

  const minimumTransition = d.curveType === "nonTransitioned"
    ? Math.max(getFormulaValue("relaxedTransitionNonRateMultiplier") * Math.max(requiredByCantRate, requiredByDeficiencyRate), getFormulaValue("relaxedTransitionGradientMultiplier") * requiredByGradient)
    : Math.max(getFormulaValue("relaxedTransitionRateMultiplier") * Math.max(requiredByCantRate, requiredByDeficiencyRate), getFormulaValue("relaxedTransitionGradientMultiplier") * requiredByGradient);

  const compensation = d.radius > 0 ? getFormulaValue("gradientCompensationFactor") / d.radius : NaN;
  const compensatedGradient = d.existingGradient - compensation;
  const gradeDifference = Math.abs(d.grade1 - d.grade2);
  const minimumVerticalRadius = getMinimumVerticalRadius(d.verticalGroup);

  // Check compliance
  if (d.radius < bgMinimumRadius) {
    checks.push({ level: "bad", text: `BG minimum radius is ${bgMinimumRadius} m. Existing radius ${fmt(d.radius, "m")} is below.` });
  } else {
    checks.push({ level: "ok", text: `Radius meets BG minimum of ${bgMinimumRadius} m.` });
  }

  if (d.measuredCant > cantLimit) {
    checks.push({ level: "bad", text: `Measured cant exceeds limit of ${cantLimit} mm.` });
  } else {
    checks.push({ level: "ok", text: `Measured cant is within limit of ${cantLimit} mm.` });
  }

  if (cantDeficiency > cdLimit) {
    checks.push({ level: "bad", text: `Cant deficiency ${round(cantDeficiency)} mm exceeds limit of ${cdLimit} mm.` });
  } else {
    checks.push({ level: "ok", text: `Cant deficiency is within limit of ${cdLimit} mm.` });
  }

  if (d.speed > speedByCant) {
    checks.push({ level: "bad", text: `Speed ${fmt(d.speed, "km/h", 0)} exceeds cant-supported speed.` });
  } else {
    checks.push({ level: "ok", text: `Speed is within cant-supported limits.` });
  }

  const overallStatus = statusFromChecks(checks);

  const checkReport = `
    <div class="office-panel">
      ${badge(overallStatus, overallStatus === "ok" ? "Status: Acceptable" : overallStatus === "warn" ? "Status: Review Required" : "Status: Non-Compliant")}
      <div class="grid grid-3 mt-3">
        <div class="office-panel">
          <p class="text-muted">Checked Speed</p>
          <h3>${fmt(d.speed, "km/h", 0)}</h3>
        </div>
        <div class="office-panel">
          <p class="text-muted">Cant Deficiency</p>
          <h3>${fmt(cantDeficiency, "mm")}</h3>
        </div>
        <div class="office-panel">
          <p class="text-muted">Transition Required</p>
          <h3>${fmt(requiredTransition, "m", 0)}</h3>
        </div>
      </div>
      <h3>${d.curveName} Check Summary</h3>
      <table>
        <tr><th>Item</th><th>Result</th></tr>
        <tr><td>Radius</td><td>${fmt(d.radius, "m")}</td></tr>
        <tr><td>Measured Cant</td><td>${fmt(d.measuredCant, "mm")}</td></tr>
        <tr><td>Cant Deficiency</td><td>${fmt(cantDeficiency, "mm")}</td></tr>
        <tr><td>Available Transition</td><td>${fmt(d.transitionLength, "m")}</td></tr>
        <tr><td>Required Transition</td><td>${fmt(requiredTransition, "m", 0)}</td></tr>
      </table>
    </div>

    <div class="office-panel">
      <h3>Check Compliance</h3>
      <ul>
        ${checks.map(checkItem).join("")}
      </ul>
    </div>
  `;

  const checkReportEl = el("checkReport");
  if (checkReportEl) {
    checkReportEl.innerHTML = checkReport;
  }
}

function humanizeProblemType(problemType) {
  return PROBLEM_TYPES[problemType] || "Standard cant and transition design";
}
