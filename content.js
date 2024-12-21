// Content script to warn users on phishing websites
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "warnUser") {
        // Create a warning banner
        const banner = document.createElement("div");
        banner.textContent = "Warning: This site is potentially phishing!";
        banner.style.position = "fixed";
        banner.style.top = "0";
        banner.style.left = "0";
        banner.style.width = "100%";
        banner.style.backgroundColor = "red";
        banner.style.color = "white";
        banner.style.textAlign = "center";
        banner.style.padding = "10px";
        banner.style.zIndex = "9999";
        banner.style.fontSize = "16px";
        document.body.appendChild(banner);
    }
});
