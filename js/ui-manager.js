// UI Manager for ribbon, sidebar, and theme interactions

class UIManager {
  constructor() {
    this.ribbonTabs = {};
    this.sidebarItems = {};
    this.currentPage = "designPage";
    this.currentTab = "home";
    this.isRibbonMinimized = false;
  }

  /**
   * Initialize all UI components
   */
  initialize() {
    this.initializeTheme();
    this.initializeRibbon();
    this.initializeSidebar();
    this.attachEventListeners();
  }

  /**
   * Initialize theme
   */
  initializeTheme() {
    initializeTheme();

    // Setup theme switcher
    const themeButton = el("themeToggleBtn");
    if (themeButton) {
      themeButton.addEventListener("click", () => {
        toggleTheme();
        this.updateThemeButtonIcon();
      });
      this.updateThemeButtonIcon();
    }
  }

  /**
   * Update theme button icon
   */
  updateThemeButtonIcon() {
    const isDarkMode = document.body.classList.contains("dark-mode");
    const nextModeLabel = isDarkMode ? "Light" : "Dark";
    const quickThemeButton = el("themeToggleBtn");
    const ribbonThemeButton = el("themeRibbonBtn");

    if (quickThemeButton) {
      quickThemeButton.textContent = isDarkMode ? "\u2600\uFE0F" : "\uD83C\uDF19";
      quickThemeButton.title = `Switch to ${nextModeLabel} Mode`;
      quickThemeButton.setAttribute("aria-label", `Switch to ${nextModeLabel} Mode`);
    }

    if (ribbonThemeButton) {
      ribbonThemeButton.title = `Switch to ${nextModeLabel} Mode`;
      ribbonThemeButton.setAttribute("aria-label", `Switch to ${nextModeLabel} Mode`);

      const icon = ribbonThemeButton.querySelector(".ribbon-button-icon");
      if (icon) {
        icon.textContent = isDarkMode ? "\u2600\uFE0F" : "\uD83C\uDF19";
      }

      const label = ribbonThemeButton.querySelector(".ribbon-button-label");
      if (label) {
        label.textContent = `${nextModeLabel} Mode`;
      }
    }
  }

  /**
   * Initialize ribbon tabs
   */
  initializeRibbon() {
    const ribbon = document.querySelector(".office-ribbon");
    const ribbonTabs = document.querySelectorAll(".ribbon-tab");
    const ribbonContents = document.querySelectorAll(".ribbon-content");
    const minimizeButton = el("ribbonMinimizeBtn");

    this.isRibbonMinimized = localStorage.getItem("ribbonMinimized") === "true";

    ribbonTabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const tabName = e.target.getAttribute("data-tab");
        this.setActiveRibbonTab(tabName);

        if (this.isRibbonMinimized) {
          this.setRibbonMinimized(false);
        }
      });
    });

    if (ribbonTabs.length > 0) {
      const initialTab = document.querySelector(`.ribbon-tab[data-tab="${this.currentTab}"]`)
        ? this.currentTab
        : ribbonTabs[0].getAttribute("data-tab");
      this.setActiveRibbonTab(initialTab);
    }

    if (minimizeButton) {
      minimizeButton.addEventListener("click", () => {
        this.setRibbonMinimized(!this.isRibbonMinimized);
      });
    }

    if (ribbon) {
      ribbon.addEventListener("dblclick", (e) => {
        if (e.target.closest(".ribbon-tab")) {
          this.setRibbonMinimized(!this.isRibbonMinimized);
        }
      });
    }

    this.setRibbonMinimized(this.isRibbonMinimized, { persist: false });
  }

  /**
   * Set active ribbon tab/content pair
   */
  setActiveRibbonTab(tabName) {
    const ribbonTabs = document.querySelectorAll(".ribbon-tab");
    const ribbonContents = document.querySelectorAll(".ribbon-content");

    ribbonTabs.forEach((tab) => {
      const isActive = tab.getAttribute("data-tab") === tabName;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      tab.setAttribute("role", "tab");
    });

    ribbonContents.forEach((content) => {
      const isActive = content.getAttribute("data-tab") === tabName;
      content.classList.toggle("active", isActive);
      content.setAttribute("role", "tabpanel");
      content.hidden = this.isRibbonMinimized || !isActive;
    });

    this.currentTab = tabName;
  }

  /**
   * Minimize or expand the ribbon
   */
  setRibbonMinimized(minimized, options = {}) {
    const { persist = true } = options;
    const ribbon = document.querySelector(".office-ribbon");
    const minimizeButton = el("ribbonMinimizeBtn");
    const activeContent = document.querySelector(`.ribbon-content[data-tab="${this.currentTab}"]`);

    this.isRibbonMinimized = minimized;

    if (ribbon) {
      ribbon.classList.toggle("minimized", minimized);
    }

    if (minimizeButton) {
      minimizeButton.setAttribute("aria-pressed", minimized ? "true" : "false");
      minimizeButton.setAttribute("title", minimized ? "Expand Ribbon" : "Minimize Ribbon");
      minimizeButton.setAttribute("aria-label", minimized ? "Expand Ribbon" : "Minimize Ribbon");
      const label = minimizeButton.querySelector(".ribbon-minimize-label");
      if (label) {
        label.textContent = minimized ? "Expand" : "Minimize";
      }
    }

    document.querySelectorAll(".ribbon-content").forEach((content) => {
      const isActive = content === activeContent;
      content.hidden = minimized || !isActive;
    });

    if (persist) {
      localStorage.setItem("ribbonMinimized", minimized ? "true" : "false");
    }
  }

  /**
   * Initialize sidebar navigation
   */
  initializeSidebar() {
    const sidebarItems = document.querySelectorAll(".sidebar-nav-item > button, .sidebar-nav-item > a");

    sidebarItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const target = e.currentTarget.getAttribute("data-target");
        if (!target) return;

        // Handle page switching
        if (target.endsWith("Page")) {
          this.switchPage(target);
        }

        // Handle submenu expansion
        const submenu = e.currentTarget.nextElementSibling;
        if (submenu && submenu.classList.contains("sidebar-nav-submenu")) {
          submenu.classList.toggle("active");
          e.currentTarget.classList.toggle("active");
        }
      });
    });
  }

  /**
   * Switch page/section
   */
  switchPage(pageId) {
    // Hide all app pages
    const appPages = document.querySelectorAll(".app-page");
    appPages.forEach((page) => {
      page.hidden = page.id !== pageId;
    });

    // Update sidebar active item
    this.updateSidebarActive(pageId);

    this.currentPage = pageId;
  }

  /**
   * Update sidebar active item
   */
  updateSidebarActive(pageId) {
    const sidebarItems = document.querySelectorAll(".sidebar-nav-item > button, .sidebar-nav-item > a");

    sidebarItems.forEach((item) => {
      const target = item.getAttribute("data-target");
      if (target === pageId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  /**
   * Attach event listeners to ribbon buttons
   */
  attachEventListeners() {
    const bindClick = (id, handler) => {
      const node = el(id);
      if (node) {
        node.addEventListener("click", handler);
      }
    };

    // Generate Report Buttons
    bindClick("generateBtn", () => {
      buildReport();
    });
    bindClick("generateReportBtn", () => {
      buildReport();
    });

    // Reset Buttons
    bindClick("resetBtn", () => {
      resetDefaults();
    });
    bindClick("resetReportBtn", () => {
      resetDefaults();
    });

    // Print Buttons
    bindClick("printBtn", () => {
      this.printProfessionalReport();
    });
    bindClick("printReportBtn", () => {
      this.printProfessionalReport();
    });

    // Check Buttons
    bindClick("checkGenerateBtn", () => {
      buildCheckReport();
    });
    bindClick("checkGeneratePageBtn", () => {
      buildCheckReport();
    });
    bindClick("checkResetBtn", () => {
      resetCheckDefaults();
    });
    bindClick("checkResetPageBtn", () => {
      resetCheckDefaults();
    });
    bindClick("checkPrintBtn", () => {
      this.printProfessionalReport();
    });
    bindClick("checkPrintPageBtn", () => {
      this.printProfessionalReport();
    });
    bindClick("professionalReportBtn", () => {
      this.openProfessionalReport();
    });
    bindClick("checkProfessionalReportBtn", () => {
      this.openProfessionalReport();
    });
    bindClick("pdfReportBtn", () => {
      this.openPdfReport();
    });
    bindClick("checkPdfReportBtn", () => {
      this.openPdfReport();
    });

    // Export Buttons
    const exportDataBtn = el("exportDataBtn");
    if (exportDataBtn) {
      exportDataBtn.addEventListener("click", () => {
        this.exportData();
      });
    }

    const exportReportBtn = el("exportReportBtn");
    if (exportReportBtn) {
      exportReportBtn.addEventListener("click", () => {
        this.downloadProfessionalReport();
      });
    }

    const pdfRibbonBtn = el("pdfRibbonBtn");
    if (pdfRibbonBtn) {
      pdfRibbonBtn.addEventListener("click", () => {
        this.openPdfReport();
      });
    }

    // Import Button
    const importBtn = el("importBtn");
    if (importBtn) {
      importBtn.addEventListener("click", () => {
        this.importData();
      });
    }

    // Theme Button
    const themeRibbonBtn = el("themeRibbonBtn");
    if (themeRibbonBtn) {
      themeRibbonBtn.addEventListener("click", () => {
        toggleTheme();
        this.updateThemeButtonIcon();
      });
    }

    // Help Buttons
    const guideBtn = el("guideBtn");
    if (guideBtn) {
      guideBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openModal("guideModal");
      });
    }

    const faqBtn = el("faqBtn");
    if (faqBtn) {
      faqBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openModal("faqModal");
      });
    }

    // Compound Curve Buttons
    const compoundGenerateBtn = el("compoundGenerateBtn");
    if (compoundGenerateBtn) {
      compoundGenerateBtn.addEventListener("click", () => {
        buildReport();
      });
    }

    const compoundResetBtn = el("compoundResetBtn");
    if (compoundResetBtn) {
      compoundResetBtn.addEventListener("click", () => {
        resetDefaults();
      });
    }

    // Reverse Curve Buttons
    const reverseGenerateBtn = el("reverseGenerateBtn");
    if (reverseGenerateBtn) {
      reverseGenerateBtn.addEventListener("click", () => {
        buildReport();
      });
    }

    const reverseResetBtn = el("reverseResetBtn");
    if (reverseResetBtn) {
      reverseResetBtn.addEventListener("click", () => {
        resetDefaults();
      });
    }
  }

  /**
   * Open a modal by ID
   */
  openModal(modalId) {
    const modal = el(modalId);
    if (modal) {
      modal.classList.add("active");
      
      // Close on overlay click
      const overlay = modal.querySelector(".modal-overlay");
      if (overlay) {
        overlay.addEventListener("click", () => {
          modal.classList.remove("active");
        });
      }
      
      // Close on close button click
      const closeBtn = modal.querySelector(".modal-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          modal.classList.remove("active");
        });
      }
      
      // Close on Escape key
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          modal.classList.remove("active");
          document.removeEventListener("keydown", handleEscape);
        }
      };
      document.addEventListener("keydown", handleEscape);
    }
  }

  /**
   * Export application data
   */
  exportData() {
    const data = {
      design: this.collectDesignData(),
      check: this.collectCheckData(),
      timestamp: new Date().toISOString()
    };
    exportToJSON(data, "curve-design-export.json");
  }

  /**
   * Import application data
   */
  importData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          this.loadDesignData(data.design);
          this.loadCheckData(data.check);
          alert("Data imported successfully!");
        } catch (error) {
          alert("Error importing file: " + error.message);
        }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  /**
   * Collect design data
   */
  collectDesignData() {
    const data = {};
    FIELD_IDS.forEach((id) => {
      const element = el(id);
      if (element) {
        data[id] = element.type === "checkbox" ? element.checked : element.value;
      }
    });
    return data;
  }

  /**
   * Collect check data
   */
  collectCheckData() {
    const data = {};
    CHECK_FIELD_IDS.forEach((id) => {
      const element = el(id);
      if (element) {
        data[id] = element.type === "checkbox" ? element.checked : element.value;
      }
    });
    return data;
  }

  /**
   * Load design data
   */
  loadDesignData(data) {
    if (!data) return;

    Object.entries(data).forEach(([id, value]) => {
      const element = el(id);
      if (element) {
        if (element.type === "checkbox") {
          element.checked = value;
        } else {
          element.value = value;
        }
      }
    });

    if (typeof syncCaseSections === "function") {
      syncCaseSections();
    } else if (typeof buildReport === "function") {
      buildReport();
    }
  }

  openProfessionalReport() {
    try {
      reportExporter.openPreview();
      this.showToast("Professional report preview opened.", "success");
    } catch (error) {
      this.showToast(error.message, "error", 5000);
    }
  }

  printProfessionalReport() {
    try {
      reportExporter.print();
      this.showToast("Professional print preview opened", "success");
    } catch (error) {
      this.showToast(error.message, "error", 5000);
    }
  }

  downloadProfessionalReport() {
    try {
      reportExporter.download();
      this.showToast("Professional report downloaded", "success");
    } catch (error) {
      this.showToast(error.message, "error", 5000);
    }
  }

  openPdfReport() {
    try {
      reportExporter.openPdfDownloadWindow();
      this.showToast("PDF preview opened and the print dialog was launched for Save as PDF.", "success", 5000);
    } catch (error) {
      this.showToast(error.message, "error", 5000);
    }
  }

  /**
   * Load check data
   */
  loadCheckData(data) {
    if (!data) return;

    Object.entries(data).forEach(([id, value]) => {
      const element = el(id);
      if (element) {
        if (element.type === "checkbox") {
          element.checked = value;
        } else {
          element.value = value;
        }
      }
    });

    if (typeof buildCheckReport === "function") {
      buildCheckReport();
    }
  }

  /**
   * Show toast notification
   */
  showToast(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `alert alert-${type}`;
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.maxWidth = "300px";
    toast.style.zIndex = "9999";

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, duration);
  }

  /**
   * Show loading indicator
   */
  showLoading(message = "Loading...") {
    const loader = document.createElement("div");
    loader.id = "loadingIndicator";
    loader.style.position = "fixed";
    loader.style.top = "50%";
    loader.style.left = "50%";
    loader.style.transform = "translate(-50%, -50%)";
    loader.style.background = "var(--color-surface)";
    loader.style.padding = "20px 40px";
    loader.style.borderRadius = "8px";
    loader.style.boxShadow = "var(--shadow-3)";
    loader.style.zIndex = "10000";
    loader.innerHTML = `<div class="spinner" style="margin-bottom: 10px;"></div><p>${message}</p>`;

    document.body.appendChild(loader);
  }

  /**
   * Hide loading indicator
   */
  hideLoading() {
    const loader = el("loadingIndicator");
    if (loader) {
      loader.remove();
    }
  }
}

// Create global UI manager instance
const uiManager = new UIManager();
