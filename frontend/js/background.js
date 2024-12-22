let results = {};
let legitimatePercents = {};
let isPhish = {};
let metrics = {};

async function callBackendAPI(features, url) {
    try {
        console.log("Sending request to backend:", { features, url });
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                features,
                url 
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Backend API response:", data);
        return data;
    } catch (error) {
        console.error("Error in API call:", error);
        return null;
    }
}

async function classify(tabId, result) {
    try {
        // Get the current tab's URL
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = tabs[0]?.url || '';

        const features = {
            'URLSimilarityIndex': Math.min(Math.max(parseFloat(result['URLSimilarityIndex'] || 0.5), 0), 1),
            'NoOfOtherSpecialCharsInURL': parseInt(result['NoOfOtherSpecialCharsInURL'] || 0),
            'SpacialCharRatioInURL': Math.min(Math.max(parseFloat(result['SpacialCharRatioInURL'] || 0.3), 0), 1),
            'IsHTTPS': result['IsHTTPS'] ? 1 : 0,
            'DomainTitleMatchScore': Math.min(Math.max(parseFloat(result['DomainTitleMatchScore'] || 0.5), 0), 1),
            'URLTitleMatchScore': Math.min(Math.max(parseFloat(result['URLTitleMatchScore'] || 0.5), 0), 1),
            'IsResponsive': result['IsResponsive'] ? 1 : 0,
            'HasDescription': result['HasDescription'] ? 1 : 0,
            'HasSocialNet': result['HasSocialNet'] ? 1 : 0,
            'HasSubmitButton': result['HasSubmitButton'] ? 1 : 0,
            'HasCopyrightInfo': result['HasCopyrightInfo'] ? 1 : 0,
            'NoOfImage': parseInt(result['NoOfImage'] || 0),
            'NoOfJS': parseInt(result['NoOfJS'] || 0),
            'NoOfSelfRef': parseInt(result['NoOfSelfRef'] || 0)
        };

        console.log("Extracted features:", features);
        const prediction = await callBackendAPI(features, url);

        if (prediction) {
            isPhish[tabId] = prediction.is_phishing;
            legitimatePercents[tabId] = prediction.legitimate_probability * 100;
            metrics = prediction.metrics || {};

            await chrome.storage.local.set({
                results,
                legitimatePercents,
                isPhish,
                metrics
            });

            console.log("Updated storage with new prediction:", {
                isPhish: isPhish[tabId],
                legitimatePercent: legitimatePercents[tabId],
                metrics
            });

            if (isPhish[tabId]) {
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    if (tabs[0]) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "alert_user" });
                    }
                });
            }
        }
    } catch (error) {
        console.error("Classification error:", error);
    }
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log("Tab updated:", tab.url);
        // Trigger classification for the new URL
        classify(tabId, {});
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!sender.tab?.id) {
        console.error("Invalid sender tab:", sender);
        sendResponse({ error: "invalid_tab" });
        return false;
    }

    console.log("Received request:", request);
    results[sender.tab.id] = request;

    classify(sender.tab.id, request)
        .then(() => sendResponse({ status: "success" }))
        .catch(error => {
            console.error("Classification error:", error);
            sendResponse({ status: "error", message: error.toString() });
        });

    return true;
});