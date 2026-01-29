(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
class CustomSelect {
  constructor(selectElement) {
    this.select = selectElement;
    this.options = Array.from(this.select.options);
    this.selectedIndex = this.select.selectedIndex;
    this.isOpen = false;
    this.init();
  }
  init() {
    this.select.style.display = "none";
    this.createCustomSelect();
    this.setupEvents();
  }
  createCustomSelect() {
    var _a;
    const wrapper = document.createElement("div");
    wrapper.className = "custom-select";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "custom-select__button";
    button.textContent = ((_a = this.select.options[this.select.selectedIndex]) == null ? void 0 : _a.text) || "";
    const dropdown = document.createElement("div");
    dropdown.className = "custom-select__dropdown";
    this.options.forEach((option, index) => {
      const item = document.createElement("div");
      item.className = "custom-select__option";
      if (index === this.selectedIndex) {
        item.classList.add("is-selected");
      }
      item.textContent = option.text;
      item.dataset.value = option.value;
      item.dataset.index = index;
      item.addEventListener("mouseenter", () => {
        this.dropdown.querySelectorAll(".custom-select__option").forEach((opt) => {
          if (opt !== item && !opt.classList.contains("is-selected")) {
            opt.style.background = "#fff";
            opt.style.color = "#333";
          }
        });
        if (!item.classList.contains("is-selected")) {
          item.style.background = "#2196F3";
          item.style.color = "#fff";
        }
      });
      item.addEventListener("click", () => {
        this.selectOption(index);
      });
      dropdown.appendChild(item);
    });
    wrapper.appendChild(button);
    wrapper.appendChild(dropdown);
    this.select.parentNode.insertBefore(wrapper, this.select);
    this.wrapper = wrapper;
    this.button = button;
    this.dropdown = dropdown;
  }
  setupEvents() {
    this.button.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });
    document.addEventListener("click", (e) => {
      if (!this.wrapper.contains(e.target)) {
        this.close();
      }
    });
    this.select.addEventListener("change", () => {
      this.updateButton();
    });
  }
  toggle() {
    this.isOpen = !this.isOpen;
    this.wrapper.classList.toggle("is-open", this.isOpen);
  }
  close() {
    this.isOpen = false;
    this.wrapper.classList.remove("is-open");
  }
  selectOption(index) {
    this.select.selectedIndex = index;
    this.selectedIndex = index;
    const event = new Event("change", { bubbles: true });
    this.select.dispatchEvent(event);
    this.updateButton();
    this.updateOptions();
    this.close();
  }
  updateButton() {
    var _a;
    this.button.textContent = ((_a = this.select.options[this.select.selectedIndex]) == null ? void 0 : _a.text) || "";
  }
  updateOptions() {
    this.dropdown.querySelectorAll(".custom-select__option").forEach((item, index) => {
      if (index === this.select.selectedIndex) {
        item.classList.add("is-selected");
      } else {
        item.classList.remove("is-selected");
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("select:not([data-no-custom-select])").forEach((select) => {
    if (!select.closest(".custom-select")) {
      new CustomSelect(select);
    }
  });
});
class Modal {
  constructor(modalElement) {
    this.modal = modalElement;
    this.closeBtn = this.modal.querySelector(".modal-close");
    this.init();
  }
  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => {
        this.close();
      });
    }
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("active")) {
        this.close();
      }
    });
  }
  open() {
    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  close() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "";
  }
  toggle() {
    if (this.modal.classList.contains("active")) {
      this.close();
    } else {
      this.open();
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".modal").forEach((modal) => {
    new Modal(modal);
  });
  document.querySelectorAll("[data-modal-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-modal-open");
      const modal = document.getElementById(modalId);
      if (modal) {
        const modalInstance = new Modal(modal);
        modalInstance.open();
      }
    });
  });
});
class FileUploadModal {
  constructor(modalElement) {
    this.modal = modalElement;
    this.uploadZone = this.modal.querySelector(".file-upload-zone");
    this.fileInput = this.modal.querySelector("#fileUploadInput");
    this.fileList = this.modal.querySelector("#uploadedFileList");
    this.filterBtns = this.modal.querySelectorAll(".modal-filter__btn");
    this.registerBtn = this.modal.querySelector(".modal-actions .btn");
    this.uploadedFiles = [];
    this.init();
  }
  init() {
    this.filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-category");
        btn.getAttribute("data-value");
        this.modal.querySelectorAll(`[data-category="${category}"]`).forEach((b) => {
          b.classList.remove("active");
        });
        btn.classList.add("active");
      });
    });
    if (this.fileInput) {
      this.fileInput.addEventListener("change", (e) => {
        this.handleFiles(e.target.files);
      });
    }
    if (this.uploadZone) {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        this.uploadZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      this.uploadZone.addEventListener("dragover", () => {
        this.uploadZone.style.borderColor = "#2196F3";
        this.uploadZone.style.background = "#f0f7ff";
      });
      this.uploadZone.addEventListener("dragleave", () => {
        this.uploadZone.style.borderColor = "#d0d7de";
        this.uploadZone.style.background = "#fff";
      });
      this.uploadZone.addEventListener("drop", (e) => {
        this.uploadZone.style.borderColor = "#d0d7de";
        this.uploadZone.style.background = "#fff";
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          this.handleFiles(files);
        }
      });
      this.uploadZone.addEventListener("click", () => {
        if (this.fileInput) {
          this.fileInput.click();
        }
      });
    }
    if (this.registerBtn) {
      this.registerBtn.addEventListener("click", () => {
        this.handleRegister();
      });
    }
  }
  handleFiles(files) {
    Array.from(files).forEach((file) => {
      if (file.size > 100 * 1024 * 1024) {
        alert(`${file.name} 파일 크기가 100MB를 초과합니다.`);
        return;
      }
      if (!file.name.toLowerCase().endsWith(".zip")) {
        alert(`${file.name} 파일은 ZIP 형식만 지원됩니다.`);
        return;
      }
      this.uploadedFiles.push(file);
      this.addFileToList(file);
    });
  }
  addFileToList(file) {
    const listItem = document.createElement("li");
    listItem.className = "data-list__item";
    const fileSize = (file.size / (1024 * 1024)).toFixed(1);
    listItem.innerHTML = `
      <div class="data-list__content">
        <i class="ico ico-file"></i>
        <span class="data-list__name">${file.name}</span>
        <div class="data-list__meta">
          <span class="file-tag">ZIP</span>
          <span class="file-size">${fileSize}MB</span>
        </div>
      </div>
      <button class="data-list__delete" type="button" data-file-name="${file.name}">
        <i class="ico ico-trash"></i>
      </button>
    `;
    const deleteBtn = listItem.querySelector(".data-list__delete");
    deleteBtn.addEventListener("click", () => {
      const fileName = deleteBtn.getAttribute("data-file-name");
      this.removeFile(fileName);
      listItem.remove();
    });
    this.fileList.appendChild(listItem);
  }
  removeFile(fileName) {
    this.uploadedFiles = this.uploadedFiles.filter((file) => file.name !== fileName);
  }
  handleRegister() {
    var _a, _b;
    if (this.uploadedFiles.length === 0) {
      alert("업로드할 파일을 선택해주세요.");
      return;
    }
    const selectedSatellite = (_a = this.modal.querySelector('[data-category="satellite"].active')) == null ? void 0 : _a.getAttribute("data-value");
    const selectedLocation = (_b = this.modal.querySelector('[data-category="location"].active')) == null ? void 0 : _b.getAttribute("data-value");
    console.log("등록:", {
      files: this.uploadedFiles,
      satellite: selectedSatellite,
      location: selectedLocation
    });
    alert(`${this.uploadedFiles.length}개의 파일이 등록되었습니다.`);
    this.modal.classList.remove("active");
    document.body.style.overflow = "";
    this.uploadedFiles = [];
    this.fileList.innerHTML = "";
    if (this.fileInput) {
      this.fileInput.value = "";
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const fileUploadModal = document.getElementById("fileUploadModal");
  if (fileUploadModal) {
    new FileUploadModal(fileUploadModal);
  }
});
document.querySelectorAll(".side-nav__toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const item = toggle.closest(".side-nav__item");
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    item.classList.toggle("is-open", !expanded);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const sideNav = document.querySelector(".side-nav");
  const sideNavWrap = document.querySelector(".side-nav_wrap");
  const appHeader = document.querySelector(".app-header");
  if (!sideNav || !sideNavWrap || !appHeader) {
    return;
  }
  let headerInitialBottom = 0;
  const initHeaderPosition = () => {
    const headerRect = appHeader.getBoundingClientRect();
    headerInitialBottom = headerRect.bottom + window.scrollY;
  };
  initHeaderPosition();
  const checkSticky = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const headerRect = appHeader.getBoundingClientRect();
    const headerBottom = headerRect.bottom;
    const isStuck = headerBottom <= 20 || scrollY >= headerInitialBottom - 20;
    sideNav.classList.toggle("is-stuck", isStuck);
    sideNavWrap.classList.toggle("is-stuck", isStuck);
  };
  checkSticky();
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkSticky();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initHeaderPosition();
      checkSticky();
    }, 150);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const handleScrollableWheel = (e) => {
    const element = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;
    const isScrollable = scrollHeight > clientHeight;
    if (!isScrollable) return;
    const deltaY = e.deltaY || e.wheelDeltaY || 0;
    const isScrollingDown = deltaY > 0;
    const isScrollingUp = deltaY < 0;
    if (isScrollingUp && scrollTop === 0) {
      return;
    }
    if (isScrollingDown && scrollTop + clientHeight >= scrollHeight - 1) {
      return;
    }
    e.stopPropagation();
  };
  const scrollableSelectors = [
    ".card__body--scrollable",
    ".table-body",
    ".side-nav__inner",
    "[data-simplebar]",
    ".output-section__body",
    ".analysis-summary"
  ];
  scrollableSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.addEventListener("wheel", handleScrollableWheel, { passive: false });
    });
  });
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          scrollableSelectors.forEach((selector) => {
            if (node.matches && node.matches(selector)) {
              node.addEventListener("wheel", handleScrollableWheel, { passive: false });
            }
            node.querySelectorAll && node.querySelectorAll(selector).forEach((element) => {
              element.addEventListener("wheel", handleScrollableWheel, { passive: false });
            });
          });
        }
      });
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
document.addEventListener("DOMContentLoaded", () => {
  function openModal(id) {
    document.getElementById(id).classList.add("active");
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove("active");
  }
  window.openModal = openModal;
  window.closeModal = closeModal;
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.active").forEach((modal) => {
        modal.classList.remove("active");
      });
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab--btn__nav").forEach((nav) => {
    const tabs = nav.querySelectorAll(".tab--item");
    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = tab.getAttribute("data-tab");
        if (!targetTab) return;
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const targetPanel = document.getElementById(`tab-${targetTab}`);
        if (!targetPanel) {
          console.warn(`탭 패널을 찾을 수 없습니다: tab-${targetTab}`);
          return;
        }
        const container = nav.closest(".page") || nav.parentElement;
        if (container) {
          const panels = container.querySelectorAll(".tab-panel");
          panels.forEach((panel) => {
            panel.classList.remove("active");
          });
        } else {
          document.querySelectorAll(".tab-panel").forEach((panel) => {
            panel.classList.remove("active");
          });
        }
        targetPanel.classList.add("active");
      });
    });
  });
});
document.addEventListener("DOMContentLoaded", function() {
  const toggles = document.querySelectorAll("[data-toggle]");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const group = toggle.dataset.group;
      if (group) {
        document.querySelectorAll(`[data-group="${group}"]`).forEach((el) => {
          el.classList.remove("active");
        });
        toggle.classList.add("active");
      } else {
        toggle.classList.toggle("active");
      }
    });
  });
});
const accItems = document.querySelectorAll(".acc-item");
accItems.forEach((item) => {
  const btn = item.querySelector(".acc-btn");
  const panel = item.querySelector(".acc-panel");
  btn.addEventListener("click", () => {
    const isActive = item.classList.contains("is-active");
    accItems.forEach((other) => {
      if (other !== item) {
        other.classList.remove("is-active");
        const otherPanel = other.querySelector(".acc-panel");
        otherPanel.style.height = 0;
      }
    });
    if (isActive) {
      item.classList.remove("is-active");
      panel.style.height = 0;
    } else {
      item.classList.add("is-active");
      panel.style.height = panel.scrollHeight + "px";
    }
  });
});
const drake = dragula([document.getElementById("dragArea")], {
  mirrorContainer: document.body
});
drake.on("cloned", function(clone, original, type) {
  if (type === "mirror") {
    clone.innerHTML = "";
    clone.innerHTML = `
      <div class="ghost-drag-item">
        이동 중.
      </div>
    `;
    clone.classList.add("ghost-wrapper");
  }
});
const listheads = document.querySelectorAll(".listhead");
const listbodies = document.querySelectorAll(".listbody");
listheads.forEach((head, i) => {
  const body = listbodies[i];
  if (!body) return;
  const headSpans = head.querySelectorAll("span");
  const widths = Array.from(headSpans).map(
    (span) => span.style.width || window.getComputedStyle(span).width
  );
  const gridTemplate = widths.join(" ");
  const rows = body.querySelectorAll(".board li");
  rows.forEach((row) => {
    row.style.display = "grid";
    row.style.gridTemplateColumns = gridTemplate;
  });
});
$(".date-picker").datetimepicker({
  format: "Y-m-d",
  timepicker: false,
  lang: "ko"
});
document.addEventListener("DOMContentLoaded", () => {
  const fileUpload = document.getElementById("file-upload");
  const fileList = document.getElementById("file-list");
  if (fileUpload && fileList) {
    fileUpload.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      fileList.innerHTML = "";
      files.forEach((file, index) => {
        const fileItem = document.createElement("div");
        fileItem.className = "file-item";
        const fileSize = (file.size / 1024 / 1024).toFixed(2) + "MB";
        fileItem.innerHTML = `
          <div class="file-item__info">
            <i class="ico ico-file"></i>
            <span class="file-item__name">${file.name}</span>
            <span class="file-item__size">${fileSize}</span>
          </div>
          <button type="button" class="file-item__remove" data-index="${index}">삭제</button>
        `;
        fileList.appendChild(fileItem);
      });
      fileList.querySelectorAll(".file-item__remove").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = parseInt(btn.getAttribute("data-index"));
          const dt = new DataTransfer();
          const files2 = Array.from(fileUpload.files);
          files2.splice(index, 1);
          files2.forEach((file) => dt.items.add(file));
          fileUpload.files = dt.files;
          fileUpload.dispatchEvent(new Event("change"));
        });
      });
    });
    const uploadLabel = fileUpload.nextElementSibling;
    if (uploadLabel) {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        uploadLabel.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      uploadLabel.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          const dt = new DataTransfer();
          Array.from(files).forEach((file) => dt.items.add(file));
          fileUpload.files = dt.files;
          fileUpload.dispatchEvent(new Event("change"));
        }
      });
    }
  }
});
$(document).ready(function() {
  function syncTableColumnWidths() {
    $(".table-scroll").each(function() {
      var $table = $(this);
      var $headerRow = $table.find(".table-header .table-cell__row");
      var $bodyRows = $table.find(".table-body .table-cell__row");
      if ($headerRow.length === 0 || $bodyRows.length === 0) return;
      var $headerCells = $headerRow.find(".table-cell");
      var columnCount = $headerCells.length;
      if (columnCount === 0) return;
      $table.css("--column-count", columnCount);
      setTimeout(function() {
        var tableWidth = $table.width();
        if (tableWidth === 0) return;
        var columnWidths = [];
        $headerCells.each(function() {
          var cellWidth = this.getBoundingClientRect().width;
          columnWidths.push(cellWidth);
        });
        var totalWidth = columnWidths.reduce(function(sum, width) {
          return sum + width;
        }, 0);
        if (totalWidth > tableWidth * 2 || totalWidth < tableWidth * 0.5) {
          var avgWidth = tableWidth / columnCount;
          columnWidths = [];
          for (var i = 0; i < columnCount; i++) {
            columnWidths.push(avgWidth);
          }
        }
        var gridTemplateColumns = columnWidths.map(function(width) {
          return width + "px";
        }).join(" ");
        $headerRow.css("grid-template-columns", gridTemplateColumns);
        $bodyRows.css("grid-template-columns", gridTemplateColumns);
      }, 50);
    });
  }
  setTimeout(function() {
    syncTableColumnWidths();
  }, 200);
  var resizeTimer;
  $(window).on("resize", function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      syncTableColumnWidths();
    }, 150);
  });
});
