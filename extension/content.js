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