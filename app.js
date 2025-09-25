// =====================
//  MAIN CALCULATION LOGIC
//  To add new calculation logic, add new functions below.
//  To add new input/output field references, update the selectors below.
// =====================

//User Configuration Calculator

// Input, error, and output field references. Only use fields that exist in the HTML.
const inputFields = [
  document.getElementById('input1'), // Line Rate (number)
  document.getElementById('input2'), // Number of Lanes (number)
  document.getElementById('input3'), // Number of Gear (fixed)
  document.getElementById('input4'), // Data Type (select)
  document.getElementById('input5'), // Pixel per Clock (number)

];
const errorFields = [
  document.getElementById('error1'), //Line Rate
  document.getElementById('error2'), //Num of Lanes
  document.getElementById('error3'), //Num of gear
  document.getElementById('error4'), //Data Type
  document.getElementById('error5'), //Pixel per Clock
];
const outputFields = [
  document.getElementById('output1'),
  document.getElementById('output2'),
  document.getElementById('output3'),
  document.getElementById('output4'),
];

const outputsSection = document.getElementById('outputs-section');
const calculateBtn = document.getElementById('calculate-btn');
const clearBtn = document.getElementById('clear-btn');
const container = document.querySelector('.container');
const verticalSeparator = document.getElementById('vertical-separator');

outputsSection.style.display = 'none';
outputsSection.classList.remove('visible');

// Helper: get bits per clock based on data type and pixel per clock
function getBitsPerClock(datatype, pixelPerClock) {
  // datatype values as specified
  const map = {
    RAW8: 8,
    RAW10: 10,
    RAW12: 12,
    RAW14: 14,
    RAW16: 16,
    YUV_420_8: 8,
    YUV_420_10: 10,
    YUV_422_8: 8,
    YUV_422_10: 10,
    RGB888: 24,
  };
  return (map[datatype] || 0) * pixelPerClock;
}

// =====================
//  VALIDATION LOGIC
//  To add new validation rules, update the validateFields function below.
// =====================

// Validate all fields. Adjust validation logic here if you change field ranges or requirements.
function validateFields() {
  let valid = true;
  let firstErrorInput = null;

  // 2. Line Rate (dynamic min/max, integer)
  let val2 = inputFields[0].value.trim();
  let numVal2 = Number(val2); // Convert to number once
  // Get dynamic min/max from input attributes
  let min2 = Number(inputFields[0].min) || 160;
  let max2 = Number(inputFields[0].max) || 861;
  if (!val2 || isNaN(numVal2) || numVal2 < min2 || numVal2 > max2 || !Number.isInteger(numVal2)) {
    inputFields[0].classList.add('error');
    errorFields[0].textContent = `Enter a whole number according to hinted range`;
    errorFields[0].classList.add('active');
    if (!firstErrorInput) firstErrorInput = inputFields[0];
    valid = false;
  } else {
    inputFields[0].classList.remove('error');
    errorFields[0].textContent = '';
    errorFields[0].classList.remove('active');
  }

  // 3. Number of Lanes (1-12, integer)
  let val3 = inputFields[1].value.trim();
  let numVal3 = Number(val3); // Convert to number once
  if (!val3 || isNaN(numVal3) || numVal3 < 1 || numVal3 > 12 || !Number.isInteger(numVal3)) {
    inputFields[1].classList.add('error');
    errorFields[1].textContent = 'Enter a whole number between 1 and 12';
    errorFields[1].classList.add('active');
    if (!firstErrorInput) firstErrorInput = inputFields[2];
    valid = false;
  } else {
    inputFields[1].classList.remove('error');
    errorFields[1].textContent = '';
    errorFields[1].classList.remove('active');
  }

  // 4. Number of Gear (fixed at 8, always valid)
  inputFields[2].classList.remove('error');
  errorFields[2].textContent = '';
  errorFields[2].classList.remove('active');

  // 6. Data Type (dropdown, always valid)
  inputFields[3].classList.remove('error');
  errorFields[3].textContent = '';
  errorFields[3].classList.remove('active');

  // 7. Pixel per Clock (1-10, integer)
  let val7 = inputFields[4].value.trim();
  if (!val7 || isNaN(val7) || !Number.isInteger(Number(val7)) || Number(val7) < 1 || Number(val7) > 10) {
    inputFields[4].classList.add('error');
    errorFields[4].textContent = 'Enter a whole number between 1 and 10';
    errorFields[4].classList.add('active');
    if (!firstErrorInput) firstErrorInput = inputFields[6];
    valid = false;
  } else {
    inputFields[4].classList.remove('error');
    errorFields[4].textContent = '';
    errorFields[4].classList.remove('active');
  }

  // Scroll to first error field and highlight
  if (firstErrorInput) {
    setTimeout(() => {
      firstErrorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorInput.focus();
      firstErrorInput.classList.add('highlight');
      setTimeout(() => {
        firstErrorInput.classList.remove('highlight');
      }, 700);
    }, 50);
  }
  return valid;
}

// Calculate button logic. Change output calculations here if you change the formula.
calculateBtn.onclick = () => {
  if (!validateFields()) {
    outputsSection.style.display = 'none';
    outputsSection.classList.remove('visible', 'hiding');
    return;
  }

  // get values
  const lineRate = Number(inputFields[0].value);
  const numLanes = Number(inputFields[1].value);
  const numGear = Number(inputFields[2].value);
  const datatype = inputFields[3].value;
  const pixelPerClock = Number(inputFields[4].value);

  // Output 1: Number of Bits/Clock
  const bitsPerClock = getBitsPerClock(datatype, pixelPerClock);
  outputFields[0].textContent = bitsPerClock;

  // Output 2: D_PHY Clock (MHz)
  outputFields[1].textContent = (lineRate / 2).toFixed(3);

  // Output 3: Pixel Clock Frequency (MHz)
  let pixClk = bitsPerClock ? (lineRate * numLanes / bitsPerClock) : 0;
  outputFields[2].textContent = pixClk ? pixClk.toFixed(3) : '';

  // Output 4: Byte Clock Frequency
  outputFields[3].textContent = (lineRate / numGear).toFixed(3);

  outputsSection.style.display = '';
  outputsSection.classList.add('visible');
  outputsSection.classList.remove('hiding');
  // Ensure input columns do NOT expand on calculate
  container.classList.remove('expanded');
};

// Clear button logic. Resets all fields and outputs.
clearBtn.onclick = () => {
  inputFields.forEach((input, idx) => {
    if (input.tagName === 'SELECT') {
      input.selectedIndex = 0;
    } else if (input.id === 'input3') {
      input.value = 8;
    } else {
      input.value = '';
    }
    input.classList.remove('error');
    errorFields[idx].textContent = '';
    errorFields[idx].classList.remove('active');
  });
  outputFields.forEach(output => output.textContent = '');
  outputsSection.classList.remove('visible');
  outputsSection.classList.add('hiding');
  outputsSection.style.display = 'none';
  // Shrink container width
  const bgContainer = document.querySelector('.index-bg-container');
  if (bgContainer) {
    bgContainer.classList.remove('expanded');
    bgContainer.style.height = 'auto';
    bgContainer.style.minHeight = '0';
    bgContainer.style.overflow = 'visible';
  }
  if (verticalSeparator)
    container.classList.add('center-fields');
  setTimeout(() => {
    outputsSection.style.display = 'none';
    outputsSection.classList.remove('hiding');
  }, 350);
};

// =====================
//  EVENT HANDLERS
//  To add new event listeners, add them below.
// =====================

// Live validation for each input field. Adjust/add logic for new fields here.
inputFields.forEach((input, idx) => {
  input.addEventListener('input', () => {
    if (input.tagName === 'SELECT' || input.id === 'input3') {
      input.classList.remove('error');
      errorFields[idx].textContent = '';
      errorFields[idx].classList.remove('active');
      return;
    }
    let val = input.value.trim();
    let valid = true;
    if (input.id === 'input1') {
      // Use dynamic min/max for validation
      let min = Number(input.min) || 160;
      let max = Number(input.max) || 861;
      valid = val && !isNaN(val) && Number.isInteger(Number(val)) && Number(val) >= min && Number(val) <= max;
    } else if (input.id === 'input2') {
      valid = val && !isNaN(val) && Number.isInteger(Number(val)) && Number(val) >= 1 && Number(val) <= 12;
    } else if (input.id === 'input5') {
      valid = val && !isNaN(val) && Number.isInteger(Number(val)) && Number(val) >= 1 && Number(val) <= 10;
    }
    if (valid) {
      input.classList.remove('error');
      errorFields[idx].textContent = '';
      errorFields[idx].classList.remove('active');
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const modeSelect = document.getElementById("mode-select");
  const userConfigSection = document.getElementById("user-config-section");
  const pxbSection = document.getElementById("pxb-section");
  const dropdownsContainer = document.getElementById("dropdowns-container");
  const modeRow = document.getElementById("mode-row");
  const deviceRow = document.getElementById("device-row");
  const packageRow = document.getElementById("package-row");
  const speedRow = document.getElementById("speed-row");
  const lineRateReminder = document.getElementById("line-rate-reminder");
  const lineRateRange = document.getElementById("line-rate-range");
  // Hide/show the user config description/instructions row as well
  const indexDescRow = document.querySelector('.index-description-row');
  const importJsonContainer = document.getElementById('config-import-json-container');

   // Hide import JSON button if starting in pxb mode
   if (modeSelect && modeSelect.value === 'pxb' && importJsonContainer) {
    importJsonContainer.style.display = 'none';
  }

  // Set default line rate range on page load
  function getDefaultLineRateRange() {
    // These should match the default dropdown values in index.html
    // Device: CrossLink-NX, Package: WLCSP84, Speed: 7
    // You can expand this logic if you have a lookup table for other combos
    return "160-861";
  }
  if (lineRateRange) {
    lineRateRange.textContent = getDefaultLineRateRange();
  }
  if (modeSelect && userConfigSection && pxbSection) {
    // Store original style properties when page loads
    let originalStyles = {};
    if (indexDescRow) {
      originalStyles = {
        display: indexDescRow.style.display || '',
        flexDirection: indexDescRow.style.flexDirection || 'row',
        flexWrap: indexDescRow.style.flexWrap || 'nowrap',
        justifyContent: indexDescRow.style.justifyContent || 'center',
        gap: indexDescRow.style.gap || '2rem',
        width: indexDescRow.style.width || '100%',
      };
    }
    // Track last mode for auto-reset behavior
    let lastMode = modeSelect.value || 'user-config';
    modeSelect.addEventListener("change", function () {
      const newMode = modeSelect.value;
      const switchingToUserConfigFromPxb = (lastMode === 'pxb' && newMode === 'user-config');

      if (newMode === "user-config") {
        userConfigSection.style.display = "";
        pxbSection.style.display = "none";
        if (importJsonContainer) importJsonContainer.style.display = ''; 
        if (indexDescRow) {
          // Restore original styles
            indexDescRow.style.display = originalStyles.display;
            indexDescRow.style.flexDirection = originalStyles.flexDirection;
            indexDescRow.style.flexWrap = originalStyles.flexWrap;
            indexDescRow.style.justifyContent = originalStyles.justifyContent;
            indexDescRow.style.gap = originalStyles.gap;
            indexDescRow.style.width = originalStyles.width;
            // Force horizontal layout with no wrapping
            indexDescRow.style.flexDirection = 'row';
            indexDescRow.style.flexWrap = 'nowrap';
        }
        if (deviceRow) deviceRow.style.display = '';
        if (packageRow) packageRow.style.display = '';
        if (speedRow) speedRow.style.display = '';

        // If coming back from pxb mode, auto-reset dependent selections & inputs
        if (switchingToUserConfigFromPxb) {
          // Clear device/package/speed selects to placeholders
          const devSel = document.getElementById('device-select');
          const pkgSel = document.getElementById('package-select');
            const spdSel = document.getElementById('speed-select');
          if (devSel) devSel.value = '';
          if (pkgSel) { pkgSel.value = ''; pkgSel.disabled = true; pkgSel.classList.add('disabled-select'); }
          if (spdSel) { spdSel.value = ''; spdSel.disabled = true; spdSel.classList.add('disabled-select'); }
          // Clear line rate and restore default range
          if (lineRateInput) {
            lineRateInput.value = '';
            lineRateInput.min = 160; lineRateInput.max = 861; lineRateInput.placeholder = '160-861';
          }
          const lrRange = document.getElementById('line-rate-range');
          if (lrRange) lrRange.textContent = '160-861';
          // Hide outputs & clear values
          if (outputsSection) {
            outputsSection.style.display = 'none';
            outputsSection.classList.remove('visible');
            outputsSection.classList.add('hiding');
            const outIds = ['output1','output2','output3','output4'];
            outIds.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ''; });
          }
          // Ensure reminder hidden until selections re-made
          const lrReminder = document.getElementById('line-rate-reminder');
          if (lrReminder) lrReminder.style.display = 'none';
          // Scroll to top of configuration area to prompt re-selection
          if (dropdownsContainer) dropdownsContainer.scrollIntoView({behavior:'smooth', block:'start'});
        }
      } else {
        userConfigSection.style.display = "none";
        pxbSection.style.display = "";
        if (importJsonContainer) importJsonContainer.style.display = 'none'; 
        if (indexDescRow) indexDescRow.style.display = 'none';
        if (deviceRow) deviceRow.style.display = 'none';
        if (packageRow) packageRow.style.display = 'none';
        if (speedRow) speedRow.style.display = 'none';
        if (lineRateReminder) lineRateReminder.style.display = 'none';
      }
      // Re-apply initial visibility rules for dropdown dependency & sections
      if (typeof updateVisibilityForDefaults === 'function') {
        updateVisibilityForDefaults();
      }
      lastMode = newMode; // update tracker
    });
  }

  // Make mobile buttons work like desktop ones
  const calcBtn = document.getElementById("calculate-btn");
  const clearBtn = document.getElementById("clear-btn");
  const calcBtnMobile = document.getElementById("calculate-btn-mobile");
  const clearBtnMobile = document.getElementById("clear-btn-mobile");
  if (calcBtn && calcBtnMobile) {
    calcBtnMobile.addEventListener("click", () => calcBtn.click());
  }
  if (clearBtn && clearBtnMobile) {
    clearBtnMobile.addEventListener("click", () => clearBtn.click());
  }
  // Pixel-Byte Frequency Calculator logic
  const calcP2BBtn = document.getElementById("calc-p2b-btn");
  const bandwidthOutput = document.getElementById("bandwidth-output");
  const bandwidthForm = document.getElementById("bandwidth-form");
  const p2bReminder = document.getElementById("p2b-reminder");
  if (calcP2BBtn && bandwidthOutput && bandwidthForm) {
    calcP2BBtn.addEventListener("click", function () {
      const pixelClock = parseFloat(document.getElementById("pixel-clock").value);
      const ppc = parseFloat(document.getElementById("ppc").value);
      const bpc = parseFloat(document.getElementById("bpc").value);
      if (isNaN(pixelClock) || isNaN(ppc) || isNaN(bpc)) {
        bandwidthOutput.textContent = "Please enter valid numbers.";
        if (p2bReminder) p2bReminder.style.display = "none";
        return;
      }
      const bandwidth = pixelClock * ppc * bpc;
      bandwidthOutput.textContent = bandwidth.toLocaleString() + " Mbps";
      // Show the reminder after successful calculation
      if (p2bReminder) p2bReminder.style.display = "block";
    });
    bandwidthForm.addEventListener("reset", function () {
      bandwidthOutput.textContent = "";
      // Hide the reminder when form is reset
      if (p2bReminder) p2bReminder.style.display = "none";
    });
  }
  const byteClockInput = document.getElementById("byte-clock");
  const numLanesInput = document.getElementById("num-lanes");
  const gearInput = document.getElementById("gear");
  const calcB2PBtn = document.getElementById("calc-b2p-btn");
  const b2pBandwidthOutput = document.getElementById("b2p-bandwidth-output");
  const b2pForm = document.getElementById("b2p-form");
  const b2pReminder = document.getElementById("b2p-reminder");
  if (
    byteClockInput &&
    numLanesInput &&
    gearInput &&
    calcB2PBtn &&
    b2pBandwidthOutput &&
    b2pForm
  ) {
    calcB2PBtn.addEventListener("click", function () {
      const byteClock = parseFloat(byteClockInput.value);
      const numLanes = parseFloat(numLanesInput.value);
      const gear = parseFloat(gearInput.value);
      if (
        isNaN(byteClock) ||
        byteClock < 0 ||
        isNaN(numLanes) ||
        numLanes < 1 ||
        isNaN(gear) ||
        (gear !== 8 && gear !== 16)
      ) {
        b2pBandwidthOutput.textContent = "Please enter valid values for all fields.";
        if (b2pReminder) b2pReminder.style.display = "none";
        return;
      }
      const bandwidth = byteClock * numLanes * gear;
      b2pBandwidthOutput.textContent = bandwidth + " Mbps";
      // Show the reminder after successful calculation
      if (b2pReminder) b2pReminder.style.display = "block";
    });
    b2pForm.addEventListener("reset", function () {
      b2pBandwidthOutput.textContent = "";
      // Hide the reminder when form is reset
      if (b2pReminder) b2pReminder.style.display = "none";
    });
  }
  // Enforce line rate bounds for CrossLink-NX, WLCSP84, speed 7
  const deviceSelect = document.getElementById("device-select");
  const packageSelect = document.getElementById("package-select");
  const speedSelect = document.getElementById("speed-select");
  const lineRateInput = document.getElementById("input1");
  const userConfigWrapper = document.getElementById("user-config-section");
  const descRow = document.querySelector('.index-description-row');

  // Device capability map: whether a device exposes package & speed selectors
  const deviceCapabilities = {
    'CrossLink-NX': { hasPackage: true, hasSpeed: true },
    'Avant': { hasPackage: false, hasSpeed: false }, // no package, no speed selection
    'Certus-NX': { hasPackage: false, hasSpeed: true },
    'CertusPro-NX_MachXO5': { hasPackage: false, hasSpeed: true }
  };

  function updateVisibilityForDefaults(){
    // Force hide when in Pixel-Byte Frequency Calculator mode
    const modeSel = document.getElementById('mode-select');
    if(modeSel && modeSel.value === 'pxb') {
      if(userConfigWrapper) userConfigWrapper.style.display = 'none';
      const lr = document.getElementById('line-rate-reminder');
      if(lr) lr.style.display = 'none';
      return; // do not proceed with normal visibility logic
    }

    const deviceVal = deviceSelect ? deviceSelect.value : '';
    const deviceChosen = !!deviceVal;
    const caps = deviceCapabilities[deviceVal] || { hasPackage: true, hasSpeed: true };

    // Determine logical chosen state for package & speed based on capabilities
    let packageChosen = !caps.hasPackage; // if no package for this device treat as chosen
    let speedChosen = !caps.hasSpeed;     // if no speed for this device treat as chosen

    // HANDLE PACKAGE SELECT
    if (!deviceChosen) {
      // Reset & disable dependents when no device selected
      if (packageSelect) {
        packageSelect.disabled = true;
        packageSelect.classList.add('disabled-select');
        packageSelect.value = '';
      }
      if (speedSelect) {
        speedSelect.disabled = true;
        speedSelect.classList.add('disabled-select');
        speedSelect.value = '';
      }
    } else {
      // Device chosen
      if (caps.hasPackage) {
        if (packageSelect) {
          packageSelect.disabled = false;
          packageSelect.classList.remove('disabled-select');
          // Evaluate current selection
          if (packageSelect.value !== '') packageChosen = true; else packageChosen = false;
        }
      } else {
        // No package needed -> ensure select (if present) is disabled & cleared
        if (packageSelect) {
          packageSelect.disabled = true;
          packageSelect.classList.add('disabled-select');
          packageSelect.value = '';
        }
        packageChosen = true;
      }

      // HANDLE SPEED SELECT (depends on both device capabilities & package choice if package exists)
      if (caps.hasSpeed) {
        const canEnableSpeed = packageChosen; // only enable speed after package (if any) is chosen
        if (speedSelect) {
          if (canEnableSpeed) {
            speedSelect.disabled = false;
            speedSelect.classList.remove('disabled-select');
          } else {
            speedSelect.disabled = true;
            speedSelect.classList.add('disabled-select');
            speedSelect.value = '';
          }
          // Update speedChosen only if enabled & a value selected
          speedChosen = speedSelect.disabled ? false : speedSelect.value !== '';
        }
      } else {
        // No speed required
        if (speedSelect) {
          speedSelect.disabled = true;
          speedSelect.classList.add('disabled-select');
          speedSelect.value = '';
        }
        speedChosen = true;
      }
    }

    const ready = deviceChosen && packageChosen && speedChosen;
    if(userConfigWrapper) userConfigWrapper.style.display = ready ? '' : 'none';
    const lineRateReminder = document.getElementById('line-rate-reminder');
    if(lineRateReminder) lineRateReminder.style.display = ready ? '' : 'none';
  }
  if(deviceSelect){ deviceSelect.addEventListener('change', updateVisibilityForDefaults); }
  if(packageSelect){ packageSelect.addEventListener('change', updateVisibilityForDefaults); }
  if(speedSelect){ speedSelect.addEventListener('change', updateVisibilityForDefaults); }
  updateVisibilityForDefaults();

  if (deviceSelect && packageSelect && speedSelect && lineRateInput) {
    deviceSelect.addEventListener("change", function () {
      if (deviceSelect.value === "CertusPro-NX_MachXO5") {
        if (packageRow) packageRow.style.display = "none";
        if (speedRow) speedRow.style.display = "flex";
        enforceLineRateBounds(); // update range immediately
        speedSelect.dispatchEvent(new Event('change'));
      } else if (deviceSelect.value === "Certus-NX") {
        if (packageRow) packageRow.style.display = "none";
        if (speedRow) speedRow.style.display = "flex";
        enforceLineRateBounds(); // update range immediately
        speedSelect.dispatchEvent(new Event('change'));
      } else {
        if (packageRow) packageRow.style.display = "flex";
        if (speedRow) speedRow.style.display = "flex";
        enforceLineRateBounds(); // update range immediately
        speedSelect.dispatchEvent(new Event('change'));
      }
    });
    packageSelect.addEventListener("change", enforceLineRateBounds);
    speedSelect.addEventListener("change", enforceLineRateBounds);
    lineRateInput.addEventListener("blur", enforceLineRateBounds); // Apply self-correcting feature on blur
  }

  function enforceLineRateBounds() {
    if (deviceSelect && packageSelect && speedSelect && lineRateInput) {
      let min = 160;
      let max = 861; // default to 861
      // UI logic for Avant
      if (deviceSelect.value === "Avant") {
        if (packageRow) packageRow.style.display = "none";
        if (speedRow) speedRow.style.display = "none";
        max = 1800;
      } else if (deviceSelect.value === "Certus-NX") {
        if (packageRow) packageRow.style.display = "none";
        if (speedRow) speedRow.style.display = "flex";
        if (speedSelect.value === "speed_7") max = 1034;
        else if (speedSelect.value === "speed_8") max = 1200;
        else if (speedSelect.value === "speed_9") max = 1500;
      } else if (deviceSelect.value === "CertusPro-NX_MachXO5") {
        if (packageRow) packageRow.style.display = "none";
        if (speedRow) speedRow.style.display = "flex";
        if (speedSelect.value === "speed_7") max = 1034;
        else if (speedSelect.value === "speed_8") max = 1200;
        else if (speedSelect.value === "speed_9") max = 1500;
      } else {
        if (packageRow) packageRow.style.display = "flex";
        if (speedRow) speedRow.style.display = "flex";
        if (deviceSelect.value === "CrossLink-NX") {
          if (packageSelect.value === "WLCSP84") {
            if (speedSelect.value === "speed_7") max = 861;
            else if (speedSelect.value === "speed_8") max = 1000;
            else if (speedSelect.value === "speed_9") max = 1250;
          } else if (packageSelect.value === "FCCSP104") {
            if (speedSelect.value === "speed_7") max = 1034;
            else if (speedSelect.value === "speed_8") max = 1200;
            else if (speedSelect.value === "speed_9") max = 1500;
          } else if (
            packageSelect.value === "QFN72" ||
            packageSelect.value === "QFN72/WLCSP72" ||
            packageSelect.value === "WLCSP72"
          ) {
            if (speedSelect.value === "speed_7") max = 861;
            else if (speedSelect.value === "speed_8") max = 1000;
            else if (speedSelect.value === "speed_9") max = 1250;
          } else if (packageSelect.value === "otherLIFCL") {
            if (speedSelect.value === "speed_7") max = 1034;
            else if (speedSelect.value === "speed_8") max = 1200;
            else if (speedSelect.value === "speed_9") max = 1500;
          }
        }
      }
      // Self-correcting feature for all combinations
      let val = parseInt(lineRateInput.value, 10);
      if (!isNaN(val)) {
        if (val > max) lineRateInput.value = max;
        if (val < min) lineRateInput.value = min;
      }
      lineRateInput.min = min;
      lineRateInput.max = max;
      lineRateInput.placeholder = min + "-" + max;
      var rangeSpan = document.getElementById("line-rate-range");
      if (rangeSpan) rangeSpan.textContent = min + "-" + max;
    }
  }

  const gearGroup = document.getElementById("gear-group");
  const gearDropdown = document.getElementById("input3");
  const gearFixed = document.getElementById("input3-fixed");
  function updateGearField() {
    if (deviceSelect.value === "CrossLink-NX") {
      gearDropdown.style.display = "";
      gearFixed.style.display = "none";
    } else {
      gearDropdown.style.display = "";
      gearFixed.style.display = "none";
    }
  }
  if (deviceSelect && gearDropdown && gearFixed) {
    deviceSelect.addEventListener("change", updateGearField);
    updateGearField();
  }
  // Enlarge image on click
  const mipiDiagram = document.getElementById('mipiDiagram');
  const imgModal = document.getElementById('imgModal');
  const imgModalContent = document.getElementById('imgModalContent');
  const imgModalClose = document.getElementById('imgModalClose');
  if (mipiDiagram && imgModal && imgModalContent && imgModalClose) {
    mipiDiagram.onclick = function () {
      imgModal.style.display = 'block';
      imgModalContent.src = this.src;
    };
    imgModalClose.onclick = function () {
      imgModal.style.display = 'none';
    };
    // Close modal when clicking outside the image
    imgModal.onclick = function (e) {
      if (e.target === imgModal) imgModal.style.display = 'none';
    };
  }

  // Export to JSON functionality
  const exportJsonBtn = document.getElementById('export-json-btn');
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      // Collect inputs
      const selectedDevice = document.getElementById('device-select')?.value || '';
      const selectedPackage = document.getElementById('package-select')?.value || '';
      const selectedSpeed = document.getElementById('speed-select')?.value || '';
      const data = {
        selection: {
          device: selectedDevice,
          package: selectedPackage,
          speed: selectedSpeed
        },
        inputs: {
          lineRateMbps: inputFields[0]?.value || '',
          numberOfLanes: inputFields[1]?.value || '',
          numberOfGear: inputFields[2]?.value || '',
          dataType: inputFields[3]?.value || '',
          pixelPerClock: inputFields[4]?.value || '',
        },
        outputs: {
          bitsPerClock: document.getElementById('output1')?.textContent || '',
          dphyClockMHz: document.getElementById('output2')?.textContent || '',
          pixelClockMHz: document.getElementById('output3')?.textContent || '',
          byteClockFrequency: document.getElementById('output4')?.textContent || '',
        }
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `mipi-config-${ts}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    });
  }

  // Import JSON functionality (populate selections & inputs)
  const importBtn = document.getElementById('import-json-btn');
  const importInput = document.getElementById('import-json-input');
  const importStatus = document.getElementById('import-status');
  if(importBtn && importInput){
    importBtn.addEventListener('click', ()=> importInput.click());
    importInput.addEventListener('change', (e)=>{
      const file = e.target.files && e.target.files[0];
      if(!file){ return; }
      const reader = new FileReader();
      reader.onload = (evt)=>{
        try {
          const text = evt.target.result;
          const data = JSON.parse(text);
          // Validate expected top-level keys
          const valid = data && typeof data === 'object' && 'selection' in data && 'inputs' in data && 'outputs' in data;
          const selValid = valid && data.selection && typeof data.selection === 'object' && 'device' in data.selection && 'package' in data.selection && 'speed' in data.selection;
          const inpValid = valid && data.inputs && typeof data.inputs === 'object' && 'lineRateMbps' in data.inputs && 'numberOfLanes' in data.inputs && 'numberOfGear' in data.inputs && 'dataType' in data.inputs && 'pixelPerClock' in data.inputs;
          const outValid = valid && data.outputs && typeof data.outputs === 'object' && 'bitsPerClock' in data.outputs && 'dphyClockMHz' in data.outputs && 'pixelClockMHz' in data.outputs && 'byteClockFrequency' in data.outputs;
          if(!(selValid && inpValid && outValid)) {
            throw new Error('Schema mismatch');
          }
          const sel = data.selection || {}; const inp = data.inputs || {};
          const modeSel = document.getElementById('mode-select');
          if(modeSel && modeSel.value !== 'user-config'){
            modeSel.value = 'user-config';
            modeSel.dispatchEvent(new Event('change'));
          }
          const devSel = document.getElementById('device-select');
          const pkgSel = document.getElementById('package-select');
          const spdSel = document.getElementById('speed-select');
          if(devSel) devSel.value = sel.device;
          if(pkgSel) pkgSel.value = sel.package;
          if(spdSel) spdSel.value = sel.speed;
          if(devSel) devSel.dispatchEvent(new Event('change'));
          if(pkgSel) pkgSel.dispatchEvent(new Event('change'));
          if(spdSel) spdSel.dispatchEvent(new Event('change'));
          const lineRate = document.getElementById('input1');
          const lanes = document.getElementById('input2');
          const gear = document.getElementById('input3');
          const dtype = document.getElementById('input4');
          const ppc = document.getElementById('input5');
          if(lineRate) lineRate.value = inp.lineRateMbps;
          if(lanes) lanes.value = inp.numberOfLanes;
          if(gear) gear.value = inp.numberOfGear;
          if(dtype) dtype.value = inp.dataType;
          if(ppc) ppc.value = inp.pixelPerClock;
          if(typeof enforceLineRateBounds === 'function'){ enforceLineRateBounds(); }
          if(typeof updateVisibilityForDefaults === 'function'){ updateVisibilityForDefaults(); }
          if(importStatus){ importStatus.textContent = 'Imported configuration applied.'; importStatus.style.color = '#50affc'; }
          importInput.value = '';
        } catch(err){
          if(importStatus){ importStatus.textContent = 'Invalid JSON format. Please verify you selected a MIPI Configuration export file.'; importStatus.style.color = '#ff6666'; }
        }
      };
      reader.onerror = ()=>{ if(importStatus){ importStatus.textContent = 'Error reading file.'; importStatus.style.color = '#ff6666'; } };
      reader.readAsText(file);
    });
  }
});