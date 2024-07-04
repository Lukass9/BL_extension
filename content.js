(() => {
  function extractDetails(productString) {
    // Używamy wyrażeń regularnych do wyodrębnienia EAN i SKU
    const eanMatch = productString.match(/\[EAN (\d+)\]/);
    const skuMatch = productString.match(/\[SKU ([^\]]+)\]/);

    // Wyciągamy wartości EAN i SKU, jeśli zostały znalezione
    const ean = eanMatch ? eanMatch[1] : "";
    const sku = skuMatch ? skuMatch[1] : "";

    // Usuwamy EAN i SKU z oryginalnego stringa, aby uzyskać nazwę produktu
    const name = productString
      .replace(/\[EAN \d+\]/, "")
      .replace(/\[SKU [^\]]+\]/, "")
      .trim();

    // Zwracamy obiekt z wartościami
    return { name, sku, ean };
  }

  const getProductData = () => {
    // Pobieranie danych o produktach
    const products = Array.from(
      document.querySelectorAll('[data-tid="saleItems"]')
    ).map((productRow) => {
      const imageElement = productRow.querySelector(".img_thumb");
      const nameElement = productRow.querySelector(".td_product_name");
      const quantityElement = productRow.querySelector(
        '[data-tid="productQuantity"]'
      );
      const grossPriceElement = productRow.querySelector(
        '[data-tid="productPrice"]'
      );
      const details = extractDetails(nameElement.innerText);

      return {
        image: imageElement ? imageElement.src : "",
        name: details.name ? details.name : "",
        sku: details.sku ? details.sku : "",
        quantity: quantityElement ? quantityElement.innerText : "",
        grossPrice: grossPriceElement ? grossPriceElement.innerText : "",
      };
    });

    // Pobieranie danych faktury
    const invoiceDataElements = document.querySelectorAll(
      '[data-tid="editInvoiceData"]'
    );
    const invoiceData = {
      company:
        invoiceDataElements.length > 2 ? invoiceDataElements[2].innerText : "",
      address:
        invoiceDataElements.length > 3 ? invoiceDataElements[3].innerText : "",
      zipCity:
        invoiceDataElements.length > 5
          ? invoiceDataElements[4].innerText +
            " " +
            invoiceDataElements[5].innerText
          : "",
      nip:
        invoiceDataElements.length > 8 ? invoiceDataElements[8].innerText : "",
      shippingCost: document.getElementById("sale_info_price_shipment")
        ? document.getElementById("sale_info_price_shipment").innerText
        : "",
      finalPrice: document.querySelector('[data-tid="saleTotalPrice"]')
        ? document.querySelector('[data-tid="saleTotalPrice"]').innerText
        : "",
    };

    return { products, invoiceData };
  };

  const handleMessage = (request, sender, sendResponse) => {
    if (request.action === "getProductData") {
      sendResponse(getProductData());
    }
  };

  // Dodaj event listener do "load" event
  window.addEventListener("load", () => {
    chrome.runtime.onMessage.addListener(handleMessage);
  });
})();
