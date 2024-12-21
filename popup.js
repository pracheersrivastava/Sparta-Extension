document.getElementById("checkButton").addEventListener("click", () => {
    // Display loading status
    const statusElement = document.getElementById("status");
    statusElement.textContent = "Checking...";

    // Get the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const url = currentTab.url;

        // Send the URL to the backend
        fetch("http://127.0.0.1:5000/check?url=" + encodeURIComponent(url))
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    statusElement.textContent = "Error: " + data.error;
                } else {
                    const isPhishing = data.is_phishing;
                    statusElement.textContent = isPhishing ? "This site is phishing!" : "This site is safe.";
                    statusElement.style.color = isPhishing ? "red" : "green";
                }
            })
            .catch((error) => {
                statusElement.textContent = "Failed to connect to the backend.";
                console.error("Error:", error);
            });
    });
});
