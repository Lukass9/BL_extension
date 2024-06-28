document
  .getElementById("offer-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const format = document.getElementById("format").value;
    const data = await getProductData();

    if (format === "html") {
      generateHTML(data);
    } else if (format === "pdf") {
      generatePDF(data);
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
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
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
      <td class="header TdTable" colspan="5"><b>Całkowity koszt zamówienia:</b></td>
      <td class="Sum TdTable"><b>${data.invoiceData.finalPrice}</b></td>
    </tr>
  </tbody>
</table>
<!-- END OF WRAPPER-->
</body>
</html>
  `;
  document.body.innerHTML = offerHTML;
}

function generatePDF(data) {
  const element = document.createElement("div");

  let productRows = data.products
    .map(
      (product) => `
      <tr>
        <td><img src="${product.image}" alt="Product Image"></td>
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>${calculateNetPrice(product.grossPrice)}</td>
        <td>${product.grossPrice}</td>
      </tr>
    `
    )
    .join("");

  element.innerHTML = `
      <h1>Offer for ${data.invoiceData.company}</h1>
      <p class="company">Address: ${data.invoiceData.address}</p>
      <p>City: ${data.invoiceData.zipCity}</p>
      <p>NIP: ${data.invoiceData.nip}</p>
      <table>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Gross Price</th>
          <th>Net Price</th>
        </tr>
        ${productRows}
      </table>
      <p>Shipping Cost: ${data.invoiceData.shippingCost}</p>
      <p>Final Price: ${data.invoiceData.finalPrice}</p>
    `;
  html2pdf().from(element).save("offer.pdf");
}

function calculateNetPrice(grossPrice) {
  const vatRate = 0.23; // Przykładowa stawka VAT
  const netPrice = parseFloat(grossPrice.replace(",", ".")) / (1 + vatRate);
  return netPrice.toFixed(2);
}
