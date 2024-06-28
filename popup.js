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
        <td><img src="${product.image}" alt="Product Image"></td>
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>${product.grossPrice}</td>
        <td>${calculateNetPrice(product.grossPrice)}</td>
      </tr>
    `
    )
    .join("");

  const offerHTML = `
      <h1>Offer for ${data.invoiceData.company}</h1>
      <p>Address: ${data.invoiceData.address}</p>
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
        <td>${product.grossPrice}</td>
        <td>${calculateNetPrice(product.grossPrice)}</td>
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
