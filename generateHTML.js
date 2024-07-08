import { calculateNetPrice } from "./utils.js";

export function generateHTML(data) {
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
}
