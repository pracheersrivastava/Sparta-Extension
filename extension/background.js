chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.startsWith("http")) {
      fetch('http://127.0.0.1:5000/check?url=' + encodeURIComponent(tab.url))
        .then((response) => response.json())
        .then((data) => {
          const message = data.is_phishing
            ? '⚠️ Warning: This website might be phishing!'
            : '✔️ This website is safe.';

          // Show a browser notification
          chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "SPARTA Phishing Detector",
            message: message,
          });

          // Send a message to the content script to show an overlay
          chrome.tabs.sendMessage(tabId, { is_phishing: data.is_phishing });
        })
        .catch(() => {
          console.error("Error checking URL.");
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.is_phishing !== undefined) {
      const existingBanner = document.getElementById("phishing-banner");
      if (existingBanner) {
        existingBanner.remove(); // Remove previous banner if it exists
      }

      // Create a new banner
      const banner = document.createElement("div");
      banner.id = "phishing-banner";
      banner.style.position = "fixed";
      banner.style.top = "0";
      banner.style.left = "0";
      banner.style.width = "100%";
      banner.style.zIndex = "9999";
      banner.style.padding = "10px";
      banner.style.fontSize = "16px";
      banner.style.textAlign = "center";
      banner.style.fontFamily = "Arial, sans-serif";
      banner.style.color = "white";

      if (message.is_phishing) {
        banner.style.backgroundColor = "red";
        banner.textContent = "⚠️ Warning: This website might be phishing!";
      } else {
        banner.style.backgroundColor = "green";
        banner.textContent = "✔️ This website is safe.";
      }

      document.body.prepend(banner);
    }
});