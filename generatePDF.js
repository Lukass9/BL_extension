import { calculateNetPrice, curentDate } from "./utils.js";

export function generatePDF(data, additionalInfo) {
  const element = document.createElement("div");

  let productRows = data.products
    .map(
      (product) => `
      <tr>
        <td><img src="${
          product.image
        }" alt="Product Image" crossorigin="anonymous"></td>
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>${product.sku}</td>
        <td>${calculateNetPrice(product.grossPrice)}</td>
        <td>${product.grossPrice}</td>
      </tr>
    `
    )
    .join("");

  let additionalInfoHTML = additionalInfo
    .map((info, index) => `<p>${index + 1}. ${info}</p>`)
    .join("");

  element.innerHTML = `
      <div class="container-col sbtw">
  <h1 class="c-green">Oferta handlowa</h1>
  <img class="img-logo" src= "59449_logo-onled.png"/>
</div>

<div class="container-col sbtw">
  <div>
    <div class="container-col">
      <h3>Data: </h3>
      <p>  ${curentDate()}</p>
    </div>
    <h3>Okres Ważności</h3>
    <p>30 dni </p>
  </div>

  <div class="min-width">
    <h3>Warunki płatności</h3>
    <p>przedpłata</p>
  </div>
</div>

<hr>

<div class="container-col sbtw">
  <div>
    <h3>Dostawca</h3>
    <h3>Onled Sp. z o.o.</h3>
    <p>adres sklepu:</p>
    <p>Kobierzycka 20E</p>
    <p>52-315 Wrocław</p>
    <p>+48 733 155 550</p>
    <p>biuro@onled.pl</p>
  </div>

  <div class="min-width">
    <h3>Odbiorca</h3>
    <p>${data.invoiceData.company}</p>
    <p> ${data.invoiceData.address}</p>
    <p> ${data.invoiceData.zipCity}</p>
    <p>nip: ${data.invoiceData.nip}</p>
    <p> ${data.invoiceData.phone}</p>
    <p> ${data.invoiceData.email}</p>
  </div>
</div>

<hr>

     
<table id="pdfGenerator">
  <tr>
    <th>Zdjęcie</th>
    <th>Naza produktu</th>
    <th>Ilość</th>
    <th>Symbol</th>
    <th>Cena netto</th>
    <th>Cena brutto</th>
  </tr>
        ${productRows}
          <tr>
    <td colspan="4">Koszt transportu</td>
    <td>${calculateNetPrice(data.invoiceData.shippingCost)} PLN</td>
    <td>${data.invoiceData.shippingCost}</td>
  </tr>

  <tr>
    <td colspan="4">Suma</td>
    <td>${calculateNetPrice(data.invoiceData.finalPrice)} PLN</td>
    <td>${data.invoiceData.finalPrice}</td>
  </tr>
      </table>

      ${
        additionalInfo.length > 0
          ? `<div class="extra"> 
            <h3>Dane dodatkowe:</h3>
            <div class="addidional-information">
                ${additionalInfoHTML}
            </div>
        </div>
        `
          : ""
      }

  <p>Sporządził: Łukasz Pisarek</p>
    `;

  const opt = {
    margin: 0.3,
    filename: "oferta.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    pagebreak: {
      mode: ["css", "legacy"],
      avoid: ["tr", ".extra"],
    },
  };

  const loadImages = (element) => {
    const images = element.getElementsByTagName("img");
    const promises = [];

    for (let img of images) {
      promises.push(
        new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        })
      );
    }

    return Promise.all(promises);
  };

  try {
    loadImages(element)
      .then(() => {
        html2pdf().from(element).set(opt).save();
      })
      .catch((error) => {
        console.error("Error loading images:", error);
        alert(
          "Wystąpił błąd podczas ładowania obrazów. Sprawdź konsolę dla szczegółów."
        );
      });
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert(
      "Wystąpił błąd podczas generowania PDF. Sprawdź konsolę dla szczegółów."
    );
  }
}
