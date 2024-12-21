// Function to check the current tab's URL
function checkCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];

      if (currentTab.url.startsWith("http")) {
        // Call Flask API to check the URL
        fetch('http://127.0.0.1:5000/check?url=' + encodeURIComponent(currentTab.url))
          .then((response) => response.json())
          .then((data) => {
            const resultDiv = document.getElementById("result");

            if (data.is_phishing) {
              resultDiv.innerHTML = '<strong style="color: red;">⚠️ This site is phishing!</strong>';
            } else {
              resultDiv.innerHTML = '<strong style="color: green;">✔️ This site is safe.</strong>';
            }

            // Send a message to the content script for in-page overlay
            chrome.tabs.sendMessage(currentTab.id, { is_phishing: data.is_phishing });
          })
          .catch(() => {
            document.getElementById("result").textContent =
              "Error checking website. Make sure the backend is running.";
          });
      } else {
        document.getElementById("result").textContent =
          "Not on a valid website. Please enter a URL to check.";
      }
    });
}

// Function to manually check a URL
function checkManualUrl() {
    const manualUrl = document.getElementById("manual-url").value;
    fetch('http://127.0.0.1:5000/check?url=' + encodeURIComponent(manualUrl))
      .then((response) => response.json())
      .then((data) => {
        const manualResult = document.getElementById("manual-result");

        if (data.is_phishing) {
          manualResult.innerHTML = '<strong style="color: red;">⚠️ This site is phishing!</strong>';
        } else {
          manualResult.innerHTML = '<strong style="color: green;">✔️ This site is safe.</strong>';
        }
      })
      .catch(() => {
        document.getElementById("manual-result").textContent =
          "Error checking URL.";
      });
}

// Initialize the popup
document.addEventListener("DOMContentLoaded", () => {
  checkCurrentTab();

  document
    .getElementById("check-url")
    .addEventListener("click", checkManualUrl);
});