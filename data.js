// Data constants and configuration

const TOOLTIPS = {
  curveName: "Use the curve number, location, or worksite name that should appear in the final report.",
  problemType: "Choose the worked-example family: standard design, minimum radius, restricted transition, traffic-weighted cant, or turnout/crossover.",
  trackStandard: "Applies gauge-specific minimum radius and default limit context.",
  routeGroup: "Controls the maximum design cant limit used in the curve checks.",
  curveType: "Select whether the curve has physical transitions or must be checked with virtual transition rules.",
  sectionalSpeed: "Maximum sanctioned speed for the route section in km/h.",
  radius: "Entered design radius of the circular curve in metres.",
  curveLength: "Total curve length used for curve board/report data.",
  chordLength: "Chord length used to calculate design versine from radius. Common field value is 20 m.",
  offsetX: "Distance from the start of transition where offset is checked.",
  designSpeed: "Speed used for equilibrium cant calculation.",
  goodsSpeed: "Slow train or goods speed used for cant excess check.",
  gauge: "Dynamic gauge value in millimetres used in the cant formula.",
  stockType: "Permissible cant deficiency class for the rolling stock.",
  turnoutTrack: "Enable when a turnout lies on the curve and the cant limit must be reduced.",
  outerCrossingLimit: "Use when 150 mm deficiency is restricted by crossing/expansion-device conditions."
};

const TRACK_STANDARDS = {
  BG: "Broad Gauge (BG)",
  MG: "Meter Gauge (MG)"
};

const ROUTE_GROUPS = {
  AB: "Group A / B",
  Other: "Other route"
};

const CURVE_TYPES = {
  transitioned: "Fully transitioned",
  nonTransitioned: "Non-transitioned with virtual transition"
};

const PROBLEM_TYPES = {
  standard: "Standard cant and transition design",
  minimumRadius: "Minimum radius for unrestricted speed",
  restrictedTransition: "Restricted transition / speed optimization",
  trafficWeighted: "Traffic-weighted equilibrium cant",
  turnoutCrossover: "Turnout / crossover design review"
};

const STOCK_TYPES = {
  75: "Other stock - 75 mm",
  100: "Nominated stock - 100 mm",
  115: "Nominated stock - 115 mm",
  150: "Nominated stock - 150 mm"
};

const TURNOUT_TYPES = {
  "1:12": "1 in 12 curved switch",
  "1:8.5": "1 in 8.5 curved switch",
  "1:8.5TWS": "1 in 8.5 thick web curved switch on emergency crossover",
  "1:8.5Sym": "1 in 8.5 symmetrical split",
  "1:12TWS": "1 in 12 TWS"
};

const TURNOUT_PLACEMENTS = {
  straight: "Straight track",
  outside: "Outside of curve",
  inside: "Inside of curve"
};

const TURNOUT_CASES = {
  similar: "Similar flexure",
  contrary: "Contrary flexure"
};

const VERTICAL_GROUPS = {
  A: "Group A",
  B: "Group B",
  CDE: "Group C / D / E"
};

const MINIMUM_RADIUS_BY_STANDARD = {
  BG: 175,
  MG: 100
};

const CASE_TOGGLE_IDS = [
  "enableCompound",
  "enableReverse",
  "enableTurnout",
  "hasDiamond",
  "enableRestrictedTransition",
  "enableTrafficMix"
];

const FIELD_IDS = [
  "curveName", "problemType", "trackStandard", "routeGroup", "curveType", "sectionalSpeed",
  "radius", "curveLength", "chordLength", "offsetX", "designSpeed", "goodsSpeed",
  "gauge", "stockType", "turnoutTrack", "outerCrossingLimit", "enableCompound",
  "enableReverse", "enableTurnout", "enableRestrictedTransition", "enableTrafficMix",
  "restrictedTransitionLength", "trafficN1", "trafficW1", "trafficV1", "trafficN2",
  "trafficW2", "trafficV2", "trafficN3", "trafficW3", "trafficV3", "compoundCa1",
  "compoundCa2", "compoundCd1", "compoundCd2", "reverseCa1", "reverseCa2", "reverseCd1",
  "reverseCd2", "reverseStraight", "turnoutType", "turnoutPlacement", "mainCurveDegree",
  "leadRadius", "interlockingSpeed", "turnoutEqCant", "turnoutCase", "reverseAfterTurnout",
  "hasCrossover", "hasDiamond", "diamondApproachStraight", "existingGradient", "rulingGradient",
  "grade1", "grade2", "verticalGroup"
];

const CHECK_FIELD_IDS = [
  "checkCurveName", "checkRouteGroup", "checkCurveType", "checkSectionalSpeed",
  "checkRadius", "checkChordLength", "checkVersine", "checkTransitionLength",
  "checkCurveLength", "checkMeasuredCant", "checkSpeed", "checkGoodsSpeed",
  "checkGauge", "checkStockType", "checkExistingGradient", "checkRulingGradient",
  "checkGrade1", "checkGrade2", "checkVerticalGroup", "checkTurnoutTrack",
  "checkOuterCrossingLimit"
];

// Default state objects
let defaultState = {};
let checkDefaultState = {};
