// Background script to handle phishing detection and warnings

// Listen for tab updates and check the URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        // Send the current URL to the backend for phishing detection
        fetch("http://127.0.0.1:5000/check?url=" + encodeURIComponent(tab.url))
            .then((response) => response.json())
            .then((data) => {
                if (data.is_phishing) {
                    // If the site is phishing, send a message to the content script
                    chrome.tabs.sendMessage(tabId, { action: "warnUser" });
                }
            })
            .catch((error) => {
                console.error("Error checking phishing status:", error);
            });
    }
});
