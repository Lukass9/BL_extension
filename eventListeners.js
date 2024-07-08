import { getProductData, getAdditionalInfo } from "./dataFetch.js";
import { generateHTML } from "./generateHTML.js";
import { generatePDF } from "./generatePDF.js";
import { generatePDFNetto } from "./generatePDFNetto.js";

document
  .getElementById("offer-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const format = document.getElementById("format").value;
    try {
      const data = await getProductData();
      const additionalInfo = getAdditionalInfo();

      if (format === "html") {
        generateHTML(data);
      } else if (format === "pdf") {
        generatePDF(data, additionalInfo);
      } else if (format === "pdfNetto") {
        generatePDFNetto(data, additionalInfo);
      }
    } catch (error) {
      console.error("Error generating offer:", error);
      alert(
        "Wystąpił błąd podczas generowania oferty. Sprawdź konsolę dla szczegółów."
      );
    }
  });

import { addAdditionalInfoEventListener } from "./additionalInfo.js";

document
  .getElementById("add-info-btn")
  .addEventListener("click", addAdditionalInfoEventListener);
