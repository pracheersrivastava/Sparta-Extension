// features.js for SPARTA Detection

//---------------------- 1. IP Address Check ----------------------
var result = {};
var url = window.location.href;
var urlDomain = window.location.hostname;

var patt = /(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]?[0-9])(\.|$){4}/;
var patt2 = /(0x([0-9][0-9]|[A-F][A-F]|[A-F][0-9]|[0-9][A-F]))(\.|$){4}/;
var ip = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;

if (ip.test(urlDomain) || patt.test(urlDomain) || patt2.test(urlDomain)) {
    result["IP Address"] = "1";
} else {
    result["IP Address"] = "-1";
}

//---------------------- 2. URL Length ----------------------
if (url.length < 54) {
    result["URL Length"] = "-1";
} else if (url.length >= 54 && url.length <= 75) {
    result["URL Length"] = "0";
} else {
    result["URL Length"] = "1";
}

//---------------------- 3. Tiny URL ----------------------
var onlyDomain = urlDomain.replace('www.', '');
result["Tiny URL"] = onlyDomain.length < 7 ? "1" : "-1";

//---------------------- 4. @ Symbol Check ----------------------
patt = /@/;
result["@ Symbol"] = patt.test(url) ? "1" : "-1";

//---------------------- 5. Redirecting Using // ----------------------
result["Redirecting using //"] = url.lastIndexOf("//") > 7 ? "1" : "-1";

//---------------------- 6. Prefix/Suffix (-) in Domain ----------------------
patt = /-/;
result["(-) Prefix/Suffix in domain"] = patt.test(urlDomain) ? "1" : "-1";

//---------------------- 7. No. of Sub Domains ----------------------
var subDomainCount = (onlyDomain.match(RegExp('\\.', 'g')) || []).length;
if (subDomainCount === 1) {
    result["No. of Sub Domains"] = "-1";
} else if (subDomainCount === 2) {
    result["No. of Sub Domains"] = "0";
} else {
    result["No. of Sub Domains"] = "1";
}

//---------------------- 8. HTTPS Presence ----------------------
patt = /https:\/\//;
result["HTTPS"] = patt.test(url) ? "-1" : "1";

//---------------------- 10. Favicon Check ----------------------
var favicon = undefined;
var nodeList = document.getElementsByTagName("link");
for (var i = 0; i < nodeList.length; i++) {
    if (nodeList[i].getAttribute("rel") === "icon" || nodeList[i].getAttribute("rel") === "shortcut icon") {
        favicon = nodeList[i].getAttribute("href");
    }
}
if (!favicon || favicon.length === 12) {
    result["Favicon"] = "-1";
} else {
    patt = RegExp(urlDomain, 'g');
    result["Favicon"] = patt.test(favicon) ? "-1" : "1";
}

//---------------------- Sending Results ----------------------
chrome.runtime.sendMessage(result, function(response) {
    console.log(result);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "alert_user") {
        alert("⚠️ Warning! SPARTA Detection has flagged this site as potentially phishing.");
    }
    return Promise.resolve("Dummy response to keep the console quiet");
});
