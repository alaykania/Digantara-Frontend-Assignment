var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
// Select DOM elements with TypeScript
var steps = document.querySelectorAll(".form-step");
var nextButtons = document.querySelectorAll(".next-btn");
var backButtons = document.querySelectorAll(".back-btn");
var progressSteps = document.querySelectorAll(".progress-step");
var summary = document.getElementById("summary");
var successModal = document.getElementById("successModal");
var closeModal = document.getElementById("closeModal");
var currentStep = 0;

function showStep(stepIndex) {
    steps.forEach(function (step, index) {
        step.classList.toggle("active", index === stepIndex);
    });
    progressSteps.forEach(function (step, index) {
        step.classList.toggle("active", index <= stepIndex);
    });
}
nextButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (validateStep(currentStep)) {
            saveStepData(currentStep);
            currentStep++;
            showStep(currentStep);
            if (currentStep === 2) {
                updateSummary();
                saveSummaryData();
            }
        }
    });
});
backButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentStep--;
        showStep(currentStep);
    });
});
function validateStep(stepIndex) {
    var inputs = steps[stepIndex].querySelectorAll("input, select, textarea");
    var isValid = true;
    inputs.forEach(function (input) {
        if (!input.checkValidity()) {
            isValid = false;
            input.classList.add("error");
        }
        else {
            input.classList.remove("error");
        }
        if (stepIndex === 1) {
            if (input.name === "email" && !validateEmail(input.value)) {
                isValid = false;
                input.classList.add("error");
                showErrorModal("Please enter a valid email address.");
            }
            if (input.name === "phone" && !validatePhone(input.value)) {
                isValid = false;
                input.classList.add("error");
                showErrorModal("Please enter a valid phone number.");
            }
        }
    });
    return isValid;
}
function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePhone(phone) {
    var phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}
function showErrorModal(message) {
    var _a;
    var modalContent = document.querySelector(".modal-content");
    if (modalContent) {
        modalContent.innerHTML = "<p>".concat(message, "</p><button id=\"closeModal\">Close</button>");
        successModal.style.display = "flex";
        (_a = document.getElementById("closeModal")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            successModal.style.display = "none";
        });
    }
}
// Save the data from the current steps to the localStorage
function saveStepData(stepIndex) {
    var inputs = steps[stepIndex].querySelectorAll("input, select, textarea");
    var stepData = {};
    inputs.forEach(function (input) {
        stepData[input.name] = input.value;
    });
    localStorage.setItem("step".concat(stepIndex + 1, "Data"), JSON.stringify(stepData));
}
function updateSummary() {
    var step1Data = JSON.parse(localStorage.getItem("step1Data") || "{}");
    var step2Data = JSON.parse(localStorage.getItem("step2Data") || "{}");
    var summaryHTML = "<ul>";
    if (step1Data) {
        for (var _i = 0, _a = Object.entries(step1Data); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            summaryHTML += "<li><strong>".concat(key, ":</strong> ").concat(value, "</li>");
        }
    }
    if (step2Data) {
        for (var _c = 0, _d = Object.entries(step2Data); _c < _d.length; _c++) {
            var _e = _d[_c], key = _e[0], value = _e[1];
            summaryHTML += "<li><strong>".concat(key, ":</strong> ").concat(value, "</li>");
        }
    }
    summaryHTML += "</ul>";
    summary.innerHTML = summaryHTML;
}
// Save the summary data to the localStorage
function saveSummaryData() {
    var step1Data = JSON.parse(localStorage.getItem("step1Data") || "{}");
    var step2Data = JSON.parse(localStorage.getItem("step2Data") || "{}");
    var summaryData = __assign(__assign({}, step1Data), step2Data);
    localStorage.setItem("step3Data", JSON.stringify(summaryData));
}
(_a = document.getElementById("step3")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", function (e) {
    e.preventDefault();
    showSuccessModal();
    console.log("Form Data:", JSON.parse(localStorage.getItem("step3Data") || "{}"));
});
function showSuccessModal() {
    successModal.style.display = "flex";
}
closeModal.addEventListener("click", function () {
    successModal.style.display = "none";
});
window.addEventListener("click", function (e) {
    if (e.target === successModal) {
        successModal.style.display = "none";
    }
});
// Load the saved data from the localStorage
function loadFormData() {
    var step1Data = JSON.parse(localStorage.getItem("step1Data") || "{}");
    var step2Data = JSON.parse(localStorage.getItem("step2Data") || "{}");
    if (step1Data) {
        Object.keys(step1Data).forEach(function (key) {
            var input = document.querySelector("[name=\"".concat(key, "\"]"));
            if (input) {
                input.value = step1Data[key];
            }
        });
    }
    if (step2Data) {
        Object.keys(step2Data).forEach(function (key) {
            var input = document.querySelector("[name=\"".concat(key, "\"]"));
            if (input) {
                input.value = step2Data[key];
            }
        });
    }
    var step3Data = JSON.parse(localStorage.getItem("step3Data") || "{}");
    if (step3Data) {
        var summaryHTML = "<ul>";
        for (var _i = 0, _a = Object.entries(step3Data); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            summaryHTML += "<li><strong>".concat(key, ":</strong> ").concat(value, "</li>");
        }
        summaryHTML += "</ul>";
        summary.innerHTML = summaryHTML;
    }
}
showStep(currentStep);
loadFormData();
