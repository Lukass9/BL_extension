(() => {
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

      return {
        image: imageElement ? imageElement.src : "",
        name: nameElement ? nameElement.innerText : "",
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
