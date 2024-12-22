// features.js
function extractFeatures() {
    var result = {};
    var url = window.location.href;
    var urlDomain = window.location.hostname;

    // Calculate URL Similarity Index
    var domainName = document.title.toLowerCase();
    var urlLower = url.toLowerCase();
    result["URLSimilarityIndex"] = urlLower.includes(domainName) ? 0.8 : 0.2;

    // Count special characters in URL
    var specialChars = url.match(/[^a-zA-Z0-9]/g) || [];
    result["NoOfOtherSpecialCharsInURL"] = specialChars.length;

    // Calculate special character ratio
    result["SpacialCharRatioInURL"] = specialChars.length / url.length;

    // Check HTTPS
    result["IsHTTPS"] = url.startsWith("https://") ? 1 : 0;

    // Domain-Title Match Score
    var titleWords = document.title.toLowerCase().split(/\W+/);
    var domainWords = urlDomain.toLowerCase().split(/\W+/);
    var matchCount = titleWords.filter(word => domainWords.includes(word)).length;
    result["DomainTitleMatchScore"] = matchCount > 0 ? matchCount / titleWords.length : 0;

    // URL-Title Match Score
    result["URLTitleMatchScore"] = url.toLowerCase().includes(document.title.toLowerCase()) ? 0.8 : 0.2;

    // Check if site is responsive
    result["IsResponsive"] = window.innerWidth === document.documentElement.clientWidth ? 1 : 0;

    // Check for meta description
    result["HasDescription"] = document.querySelector('meta[name="description"]') ? 1 : 0;

    // Check for social network links
    result["HasSocialNet"] = document.querySelector('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="linkedin.com"]') ? 1 : 0;

    // Check for submit buttons
    result["HasSubmitButton"] = document.querySelector('input[type="submit"], button[type="submit"]') ? 1 : 0;

    // Check for copyright info
    result["HasCopyrightInfo"] = document.body.textContent.includes("©") || document.body.textContent.toLowerCase().includes("copyright") ? 1 : 0;

    // Count images
    result["NoOfImage"] = document.getElementsByTagName("img").length;

    // Count JavaScript files
    result["NoOfJS"] = document.getElementsByTagName("script").length;

    // Count internal links
    result["NoOfSelfRef"] = Array.from(document.getElementsByTagName("a"))
        .filter(a => a.host === window.location.host).length;

    // Send features to background script
    chrome.runtime.sendMessage(result);
}

// Run feature extraction when page loads
document.addEventListener('DOMContentLoaded', extractFeatures);

// Listen for phishing alerts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "alert_user") {
        alert("⚠️ Warning! This website has been flagged as potentially dangerous by SPARTA Detection.");
        // Add a visible warning banner at the top of the page
        var banner = document.createElement('div');
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background-color: #ff4444;
            color: white;
            text-align: center;
            padding: 10px;
            font-size: 16px;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        banner.innerHTML = '⚠️ Warning: This website has been identified as potentially dangerous by SPARTA Detection';
        document.body.insertBefore(banner, document.body.firstChild);
    }
    return true;
});