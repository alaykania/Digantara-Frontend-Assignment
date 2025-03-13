interface FormStepData {
  [key: string]: string;
}

interface FormData {
  step1Data: FormStepData;
  step2Data: FormStepData;
  step3Data: FormStepData;
}

// Select DOM elements with TypeScript
const steps = document.querySelectorAll<HTMLElement>(".form-step");
const nextButtons = document.querySelectorAll<HTMLButtonElement>(".next-btn");
const backButtons = document.querySelectorAll<HTMLButtonElement>(".back-btn");
const progressSteps = document.querySelectorAll<HTMLElement>(".progress-step");
const summary = document.getElementById("summary") as HTMLElement;
const successModal = document.getElementById("successModal") as HTMLElement;
const closeModal = document.getElementById("closeModal") as HTMLButtonElement;

let currentStep: number = 0;

// to show the current steps and update the progress bar to next form
function showStep(stepIndex: number): void {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === stepIndex);
  });
  progressSteps.forEach((step, index) => {
    step.classList.toggle("active", index <= stepIndex);
  });
}
nextButtons.forEach((button) => {
  button.addEventListener("click", () => {
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
backButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentStep--;
    showStep(currentStep);
  });
});

// Validate inputs in the current steps
function validateStep(stepIndex: number): boolean {
  const inputs = steps[stepIndex].querySelectorAll<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >("input, select, textarea");
  let isValid: boolean = true;

  inputs.forEach((input) => {
    if (!input.checkValidity()) {
      isValid = false;
      input.classList.add("error");
    } else {
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
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function validatePhone(phone: string): boolean {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
}
function showErrorModal(message: string): void {
  const modalContent = document.querySelector<HTMLElement>(".modal-content");
  if (modalContent) {
    modalContent.innerHTML = `<p>${message}</p><button id="closeModal">Close</button>`;
    successModal.style.display = "flex";
    document.getElementById("closeModal")?.addEventListener("click", () => {
      successModal.style.display = "none";
    });
  }
}

// Save the data from the current steps to the localStorage
function saveStepData(stepIndex: number): void {
  const inputs = steps[stepIndex].querySelectorAll<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >("input, select, textarea");
  const stepData: FormStepData = {};

  inputs.forEach((input) => {
    stepData[input.name] = input.value;
  });

  localStorage.setItem(`step${stepIndex + 1}Data`, JSON.stringify(stepData));
}

// Update to next page to the summary
function updateSummary(): void {
  const step1Data: FormStepData = JSON.parse(
    localStorage.getItem("step1Data") || "{}"
  );
  const step2Data: FormStepData = JSON.parse(
    localStorage.getItem("step2Data") || "{}"
  );

  let summaryHTML = "<ul>";

  if (step1Data) {
    for (const [key, value] of Object.entries(step1Data)) {
      summaryHTML += `<li><strong>${key}:</strong> ${value}</li>`;
    }
  }

  if (step2Data) {
    for (const [key, value] of Object.entries(step2Data)) {
      summaryHTML += `<li><strong>${key}:</strong> ${value}</li>`;
    }
  }

  summaryHTML += "</ul>";
  summary.innerHTML = summaryHTML;
}

// Save the summary data to the localStorage
function saveSummaryData(): void {
  const step1Data: FormStepData = JSON.parse(
    localStorage.getItem("step1Data") || "{}"
  );
  const step2Data: FormStepData = JSON.parse(
    localStorage.getItem("step2Data") || "{}"
  );

  const summaryData: FormStepData = { ...step1Data, ...step2Data };
  localStorage.setItem("step3Data", JSON.stringify(summaryData));
}
document.getElementById("step3")?.addEventListener("submit", (e) => {
  e.preventDefault();
  showSuccessModal();
  console.log(
    "Form Data:",
    JSON.parse(localStorage.getItem("step3Data") || "{}")
  );
});
function showSuccessModal(): void {
  successModal.style.display = "flex";
}
closeModal.addEventListener("click", () => {
  successModal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === successModal) {
    successModal.style.display = "none";
  }
});

// Load saved data from the localStorage
function loadFormData(): void {
  const step1Data: FormStepData = JSON.parse(
    localStorage.getItem("step1Data") || "{}"
  );
  const step2Data: FormStepData = JSON.parse(
    localStorage.getItem("step2Data") || "{}"
  );

  if (step1Data) {
    Object.keys(step1Data).forEach((key) => {
      const input = document.querySelector<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >(`[name="${key}"]`);
      if (input) {
        input.value = step1Data[key];
      }
    });
  }

  if (step2Data) {
    Object.keys(step2Data).forEach((key) => {
      const input = document.querySelector<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >(`[name="${key}"]`);
      if (input) {
        input.value = step2Data[key];
      }
    });
  }
  const step3Data: FormStepData = JSON.parse(
    localStorage.getItem("step3Data") || "{}"
  );
  if (step3Data) {
    let summaryHTML = "<ul>";
    for (const [key, value] of Object.entries(step3Data)) {
      summaryHTML += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    summaryHTML += "</ul>";
    summary.innerHTML = summaryHTML;
  }
}
showStep(currentStep);
loadFormData();
