function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(value) {
  return String(value || "report")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "report";
}

class ReportExporter {
  getActiveContext() {
    const activePage = document.querySelector(".app-page:not([hidden])");
    const pageId = activePage ? activePage.id : "designPage";
    const config = {
      designPage: {
        type: "design",
        kind: "Design Report",
        reportId: "report",
        build: () => buildReport(),
        data: () => collectData()
      },
      compoundPage: {
        type: "design",
        kind: "Compound Curve Report",
        reportId: "compoundReport",
        build: () => buildReport(),
        data: () => collectData()
      },
      reversePage: {
        type: "design",
        kind: "Reverse Curve Report",
        reportId: "reverseReport",
        build: () => buildReport(),
        data: () => collectData()
      },
      checkPage: {
        type: "check",
        kind: "Curve Check Report",
        reportId: "checkReport",
        build: () => buildCheckReport(),
        data: () => collectCheckData()
      }
    }[pageId] || {
      type: "design",
      kind: "Design Report",
      reportId: "report",
      build: () => buildReport(),
      data: () => collectData()
    };

    config.pageId = pageId;
    return config;
  }

  createProfessionalReportDocument() {
    const context = this.getActiveContext();
    context.build();

    const reportNode = el(context.reportId);
    if (!reportNode) {
      throw new Error("The report section is not available.");
    }

    const data = context.data();
    const reportTitle = data.curveName || "Curve Report";
    const now = new Date();
    const dateLabel = now.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    const summaryMetrics = this.extractSummaryMetrics(reportNode);
    const metadataRows = this.getMetadataRows(context.type, data, dateLabel);
    const reportMarkup = reportNode.innerHTML;
    const summaryMarkup = summaryMetrics.length
      ? `
        <section class="pro-section">
          <div class="section-heading">
            <span class="section-kicker">At a glance</span>
            <h2>Executive Summary</h2>
          </div>
          <div class="metric-grid">
            ${summaryMetrics.map((metric) => `
              <article class="metric-card">
                <div class="metric-label">${escapeHtml(metric.label)}</div>
                <div class="metric-value">${escapeHtml(metric.value)}</div>
              </article>
            `).join("")}
          </div>
        </section>
      `
      : "";

    const metadataMarkup = `
      <section class="pro-section meta-section">
        <div class="section-heading">
          <span class="section-kicker">Report context</span>
          <h2>Project Information</h2>
        </div>
        <table class="meta-table">
          <tbody>
            ${metadataRows.map((row) => `
              <tr>
                <th>${escapeHtml(row.label)}</th>
                <td>${escapeHtml(row.value)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </section>
    `;

    return {
      fileName: `${slugify(reportTitle)}-professional-report.html`,
      title: reportTitle,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(reportTitle)} - Professional Report</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #132033;
      --muted: #556273;
      --line: #d5dde8;
      --panel: #ffffff;
      --panel-soft: #f4f7fb;
      --accent: #124a9c;
      --accent-soft: #eaf1fb;
      --success: #117a46;
      --warning: #a76500;
      --danger: #b42318;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      font-family: "Segoe UI", Arial, sans-serif;
      color: var(--ink);
      background: #eef2f7;
      line-height: 1.5;
    }

    body {
      padding: 24px;
    }

    .report-shell {
      max-width: 1080px;
      margin: 0 auto;
    }

    .hero {
      background: linear-gradient(135deg, #123f87 0%, #1e63c1 58%, #84aee8 100%);
      color: #ffffff;
      border-radius: 18px;
      padding: 32px 36px;
      box-shadow: 0 22px 60px rgba(15, 38, 74, 0.18);
    }

    .hero-kicker {
      margin: 0 0 8px;
      font-size: 12px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      opacity: 0.82;
    }

    .hero h1 {
      margin: 0;
      font-size: 34px;
      line-height: 1.15;
    }

    .hero p {
      margin: 12px 0 0;
      max-width: 760px;
      font-size: 15px;
      opacity: 0.92;
    }

    .document {
      margin-top: 22px;
      background: var(--panel);
      border-radius: 18px;
      box-shadow: 0 18px 45px rgba(12, 25, 43, 0.08);
      overflow: hidden;
    }

    .document-body {
      padding: 28px;
    }

    .pro-section + .pro-section {
      margin-top: 26px;
    }

    .section-heading {
      margin-bottom: 14px;
    }

    .section-kicker {
      display: inline-block;
      margin-bottom: 6px;
      color: var(--accent);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .section-heading h2 {
      margin: 0;
      font-size: 22px;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 14px;
    }

    .metric-card {
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 18px;
      background: linear-gradient(180deg, #ffffff, #f7faff);
    }

    .metric-label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
    }

    .metric-value {
      margin-top: 8px;
      font-size: 24px;
      font-weight: 700;
      color: var(--accent);
    }

    .meta-table,
    table {
      width: 100%;
      border-collapse: collapse;
    }

    .meta-table th,
    .meta-table td,
    th,
    td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--line);
      vertical-align: top;
    }

    .meta-table th,
    th {
      width: 34%;
      text-align: left;
      background: var(--panel-soft);
      color: var(--ink);
      font-weight: 700;
    }

    td {
      color: var(--muted);
    }

    .embedded-report {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .embedded-report .office-panel,
    .embedded-report .report-card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 22px;
      box-shadow: none;
      break-inside: auto;
      page-break-inside: auto;
    }

    .embedded-report .office-panel > h3:first-child,
    .embedded-report .report-card > h3:first-child,
    .embedded-report .office-panel > h4:first-child {
      margin-top: 0;
    }

    .embedded-report .grid,
    .embedded-report .grid-3,
    .embedded-report .grid-responsive {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 14px;
    }

    .embedded-report .badge {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .embedded-report .badge-ok,
    .embedded-report .badge-success {
      color: var(--success);
      background: #e8f6ee;
    }

    .embedded-report .badge-warn,
    .embedded-report .badge-warning {
      color: var(--warning);
      background: #fff4df;
    }

    .embedded-report .badge-bad,
    .embedded-report .badge-error {
      color: var(--danger);
      background: #fdeceb;
    }

    .embedded-report ul {
      margin: 0;
      padding-left: 20px;
    }

    .embedded-report li + li {
      margin-top: 8px;
    }

    .embedded-report .calc-steps {
      border: 1px solid var(--line);
      border-radius: 14px;
      overflow: visible;
    }

    .embedded-report .calc-step {
      display: grid;
      grid-template-columns: 72px 1fr;
      border-bottom: 1px solid var(--line);
      background: #ffffff;
    }

    .embedded-report .calc-step:last-child {
      border-bottom: none;
    }

    .embedded-report .calc-index {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--accent-soft);
      color: var(--accent);
      font-weight: 700;
      border-right: 1px solid var(--line);
      padding: 14px 8px;
    }

    .embedded-report .calc-content {
      padding: 14px 16px;
    }

    .embedded-report .calc-formula,
    .embedded-report .calc-result {
      font-family: "Consolas", "Courier New", monospace;
      font-size: 12px;
      color: var(--muted);
      word-break: break-word;
    }

    .document-footer {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--line);
      font-size: 12px;
      color: var(--muted);
    }

    @page {
      size: A4;
      margin: 14mm;
    }

    @media print {
      * {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      body {
        background: #ffffff;
        padding: 0;
        font-size: 11pt;
      }

      .report-shell {
        max-width: none;
      }

      .hero {
        box-shadow: none;
        border-radius: 0;
        page-break-after: avoid;
      }

      .document {
        margin-top: 0;
        box-shadow: none;
        border-radius: 0;
      }

      .document-body {
        padding: 20px 0 0;
      }

      .pro-section {
        break-inside: auto;
        page-break-inside: auto;
      }

      .section-heading {
        break-after: avoid;
        page-break-after: avoid;
      }

      .embedded-report .office-panel,
      .embedded-report .report-card,
      .embedded-report .calc-steps,
      .embedded-report table,
      .embedded-report tbody,
      .embedded-report tr {
        break-inside: auto !important;
        page-break-inside: auto !important;
      }

      .embedded-report .grid,
      .embedded-report .grid-3,
      .embedded-report .grid-responsive {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .embedded-report .calc-step {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .document-footer {
        margin-top: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="report-shell">
    <header class="hero">
      <div class="hero-kicker">${escapeHtml(context.kind)}</div>
      <h1>${escapeHtml(reportTitle)}</h1>
      <p>Professional railway curve analysis report generated from the current workspace inputs. This layout is optimized for clean printing and browser PDF export.</p>
    </header>

    <main class="document">
      <div class="document-body">
        ${summaryMarkup}
        ${metadataMarkup}

        <section class="pro-section">
          <div class="section-heading">
            <span class="section-kicker">Detailed analysis</span>
            <h2>Technical Report</h2>
          </div>
          <div class="embedded-report">
            ${reportMarkup}
          </div>
        </section>

        <footer class="document-footer">
          <div>${escapeHtml(context.kind)}</div>
          <div>Generated ${escapeHtml(dateLabel)}</div>
        </footer>
      </div>
    </main>
  </div>
</body>
</html>`
    };
  }

  extractSummaryMetrics(reportNode) {
    const metrics = [];
    reportNode.querySelectorAll(".grid p").forEach((labelNode) => {
      const card = labelNode.closest(".office-panel");
      const valueNode = card ? card.querySelector("h3") : null;
      const label = labelNode.textContent.trim();
      const value = valueNode ? valueNode.textContent.trim() : "";
      if (label && value) {
        metrics.push({ label, value });
      }
    });
    return metrics.slice(0, 4);
  }

  getMetadataRows(type, data, dateLabel) {
    if (type === "check") {
      return [
        { label: "Report type", value: "Existing curve verification" },
        { label: "Curve / Location", value: data.curveName || "Existing Curve" },
        { label: "Route group", value: data.routeGroup || "Not provided" },
        { label: "Curve type", value: data.curveType === "transitioned" ? "Fully transitioned" : "Non-transitioned" },
        { label: "Sectional speed", value: fmt(data.sectionalSpeed, "km/h", 0) },
        { label: "Check speed", value: fmt(data.speed, "km/h", 0) },
        { label: "Measured radius", value: fmt(data.radius, "m") },
        { label: "Measured cant", value: fmt(data.measuredCant, "mm") },
        { label: "Generated on", value: dateLabel }
      ];
    }

    return [
      { label: "Report type", value: "New curve design and compliance" },
      { label: "Curve / Location", value: data.curveName || "Curve" },
      { label: "Track standard", value: data.trackStandard || "Not provided" },
      { label: "Route group", value: data.routeGroup || "Not provided" },
      { label: "Design problem", value: this.humanizeProblemType(data.problemType) },
      { label: "Curve type", value: data.curveType === "transitioned" ? "Fully transitioned" : "Non-transitioned with virtual transition" },
      { label: "Sectional speed", value: fmt(data.sectionalSpeed, "km/h", 0) },
      { label: "Design speed", value: fmt(data.designSpeed, "km/h", 0) },
      { label: "Design radius", value: fmt(data.radius, "m") },
      { label: "Generated on", value: dateLabel }
    ];
  }

  humanizeProblemType(problemType) {
    const label = {
      standard: "Standard cant and transition design",
      minimumRadius: "Minimum radius for unrestricted speed",
      restrictedTransition: "Restricted transition / speed optimization",
      trafficWeighted: "Traffic-weighted equilibrium cant",
      turnoutCrossover: "Turnout / crossover design review"
    }[problemType];
    return label || "Standard report";
  }

  openHtmlInPreviewTab(html, options = {}) {
    const { fallbackTarget = "_self" } = options;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const revokeUrl = () => {
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    };

    const previewWindow = window.open(url, "_blank");
    if (previewWindow) {
      revokeUrl();
      return previewWindow;
    }

    if (fallbackTarget === "_self") {
      window.location.assign(url);
      revokeUrl();
      return window;
    }

    throw new Error("Your browser blocked the report preview window.");
  }

  openPreview() {
    const documentData = this.createProfessionalReportDocument();
    this.openHtmlInPreviewTab(documentData.html);
  }

  openPdfDownloadWindow() {
    const documentData = this.createProfessionalReportDocument();
    const pdfReadyHtml = documentData.html.replace(
      "<body>",
      `<body>
  <div class="pdf-toolbar">
    <button type="button" class="pdf-toolbar-button" onclick="window.print()">Save / Print PDF</button>
    <span class="pdf-toolbar-note">Choose your browser's "Save as PDF" destination in the print dialog.</span>
  </div>`
    ).replace(
      "</body>",
      `  <script>
    window.addEventListener("load", function () {
      setTimeout(function () {
        window.focus();
        window.print();
      }, 300);
    });
  </script>
</body>`
    ).replace(
      "@media print {",
      `.pdf-toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 0 auto 18px;
      max-width: 1080px;
      padding: 14px 18px;
      border-radius: 14px;
      background: #132033;
      color: #ffffff;
      box-shadow: 0 14px 34px rgba(12, 25, 43, 0.2);
    }

    .pdf-toolbar-button {
      appearance: none;
      border: none;
      border-radius: 999px;
      padding: 10px 18px;
      background: #ffffff;
      color: #124a9c;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .pdf-toolbar-button:hover {
      background: #eaf1fb;
    }

    .pdf-toolbar-note {
      font-size: 13px;
      opacity: 0.9;
    }

    @media (max-width: 720px) {
      .pdf-toolbar {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media print {`
    ).replace(
      "body {",
      `body {
        background: #ffffff;
        padding: 0;
      }

      .pdf-toolbar {
        display: none !important;
      }

      body {`
    );
    this.openHtmlInPreviewTab(pdfReadyHtml);
  }

  print() {
    const documentData = this.createProfessionalReportDocument();
    const printWindow = window.open("", "_blank", "noopener,noreferrer");

    if (!printWindow) {
      throw new Error("Popup blocked while opening the print preview.");
    }

    printWindow.document.open();
    printWindow.document.write(documentData.html);
    printWindow.document.close();
    printWindow.addEventListener("load", () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 250);
    });
  }

  download() {
    const documentData = this.createProfessionalReportDocument();
    const blob = new Blob([documentData.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = documentData.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

const reportExporter = new ReportExporter();
