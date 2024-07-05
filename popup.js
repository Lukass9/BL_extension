document
  .getElementById("offer-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const format = document.getElementById("format").value;
    try {
      const data = await getProductData();

      if (format === "html") {
        generateHTML(data);
      } else if (format === "pdf") {
        generatePDF(data);
      }
    } catch (error) {
      console.error("Error generating offer:", error);
      alert(
        "Wystąpił błąd podczas generowania oferty. Sprawdź konsolę dla szczegółów."
      );
    }
  });

async function getProductData() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getProductData" },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else if (response) {
            resolve(response);
          } else {
            reject(new Error("No response received from content script."));
          }
        }
      );
    });
  });
}

function generateHTML(data) {
  let productRows = data.products
    .map(
      (product) => `
      <tr>
        <td class="TdTable"><img class="Product" src="${
          product.image
        }" alt="Product Image"></td>
        <td class="TdTable">${product.quantity}</td>
        <td class="TdTable">${product.name}</td>
        <td class="TdTable">${product.sku}</td>
        <td class="TdTable">${calculateNetPrice(product.grossPrice)} PLN</td>
        <td class="TdTable">${product.grossPrice}</td>
      </tr>
    `
    )
    .join("");

  const offerHTML = `
<body>
<table class="Table">
  <thead>
    <tr>
      <td class="LogoHead TdTable" colspan="6">
        <img class="Logo" src="https://static.oferteo.pl/images/portfolio/2872811/orig/59449_logo-onled.png" />
      </td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="header TdTable"><b>Zdjęcie</b></td>
      <td class="header TdTable"><b>Ilość</b></td>
      <td class="header TdTable"><b>Nazwa przedmiotu</b></td>
      <td class="header TdTable"><b>Symbol</b></td>
      <td class="header TdTable"><b>Cena netto</b></td>
      <td class="header TdTable"><b>Cena brutto</b></td>
    </tr>
    ${productRows}
    <tr>
      <td class="header TdTable" colspan="4"><b>Całkowity koszt zamówienia:</b></td>
      <td class="Sum TdTable"><b>${calculateNetPrice(
        data.invoiceData.finalPrice
      )} PLN</b></td>
      <td class="Sum TdTable"><b>${data.invoiceData.finalPrice}</b></td>
    </tr>
  </tbody>
</table>
<!-- END OF WRAPPER-->
</body>
</html>
  `;
  document.body.innerHTML = offerHTML;

  //   // Copy to clipboard

  // const tempTextArea = document.createElement("textarea");
  // tempTextArea.value = offerHTML;
  // document.body.appendChild(tempTextArea);
  // tempTextArea.select();
  // document.execCommand("copy");
  // document.body.removeChild(tempTextArea);
}

function generatePDF(data) {
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

<div class="extra">
      <h3>Dane dodatkowe:</h3>
<div class="addidional-information">
  <p>Pierwsze dane</p>
  <p>drugie dane</p>
</div>
<p>Sporządził: Łukasz Pisarek</p>
</div>
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

function calculateNetPrice(grossPrice) {
  const vatRate = 0.23; // Przykładowa stawka VAT
  const netPrice = parseFloat(grossPrice.replace(",", ".")) / (1 + vatRate);
  return netPrice.toFixed(2);
}

function curentDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
