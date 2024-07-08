export async function getProductData() {
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

export function getAdditionalInfo() {
  const additionalInfoElements = document.querySelectorAll(".additional-info");
  return Array.from(additionalInfoElements).map((el) => el.innerText);
}
