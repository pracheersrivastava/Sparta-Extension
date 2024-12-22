document.addEventListener('DOMContentLoaded', function () {
    const colors = {
        safe: "#58bc8a",
        warning: "#ffeb3c",
        danger: "#ff8b66"
    };

    const featureList = document.getElementById("features");

    // Add metrics display
    const metricsDiv = document.createElement("div");
    metricsDiv.id = "metrics";
    metricsDiv.className = "metrics-container";
    document.body.appendChild(metricsDiv);

    function updateMetrics(metrics) {
        const metricsDiv = document.getElementById("metrics");
        if (metrics && metricsDiv) {
            metricsDiv.innerHTML = `
                <div class="metrics-title">Model Performance Metrics</div>
                <div class="metric">Accuracy: ${(metrics.accuracy * 100).toFixed(2)}%</div>
                <div class="metric">Precision: ${(metrics.precision * 100).toFixed(2)}%</div>
                <div class="metric">Recall: ${(metrics.recall * 100).toFixed(2)}%</div>
                <div class="metric">F1 Score: ${(metrics.f1_score * 100).toFixed(2)}%</div>
            `;
        }
    }

    function getColorForValue(value, feature) {
        const thresholds = {
            'URLSimilarityIndex': { safe: 0.7, warning: 0.4 },
            'SpacialCharRatioInURL': { safe: 0.2, warning: 0.4 },
            'DomainTitleMatchScore': { safe: 0.6, warning: 0.3 },
            'URLTitleMatchScore': { safe: 0.6, warning: 0.3 }
        };

        if (feature in thresholds) {
            if (value >= thresholds[feature].safe) return colors.safe;
            if (value >= thresholds[feature].warning) return colors.warning;
            return colors.danger;
        }

        if (typeof value === 'boolean' || value === 0 || value === 1) {
            return value ? colors.safe : colors.danger;
        }

        return value > 0.5 ? colors.safe : colors.danger;
    }

    function formatFeatureName(name) {
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.storage.local.get(['results', 'legitimatePercents', 'isPhish', 'metrics'], function (items) {
            console.log("Storage items fetched:", items);

            const result = items.results[tabs[0].id];
            const metrics = items.metrics;
            
            updateMetrics(metrics);

            if (result) {
                featureList.innerHTML = ''; // Clear existing features
                for (let key in result) {
                    const newFeature = document.createElement("li");
                    const formattedName = formatFeatureName(key);
                    const value = result[key];

                    newFeature.textContent = `${formattedName}: ${typeof value === 'number' ? value.toFixed(2) : value}`;
                    newFeature.style.backgroundColor = getColorForValue(value, key);
                    featureList.appendChild(newFeature);
                }
            }

            const scoreElement = document.getElementById("site_score");
            const msgElement = document.getElementById("site_msg");
            const circleElement = document.getElementById("res-circle");

            if (scoreElement && msgElement && circleElement) {
                const legitimatePercent = items.legitimatePercents[tabs[0].id];
                const score = Math.round(legitimatePercent || 0);
                scoreElement.textContent = `${score}%`;

                if (items.isPhish[tabs[0].id]) {
                    circleElement.style.background = colors.danger;
                    msgElement.textContent = "⚠️ Warning! This site may be dangerous";
                    msgElement.style.color = "#ff4444";
                } else if (score < 70) {
                    circleElement.style.background = colors.warning;
                    msgElement.textContent = "⚠️ Exercise caution with this site";
                    msgElement.style.color = "#ffa500";
                } else {
                    circleElement.style.background = colors.safe;
                    msgElement.textContent = "✅ This website appears to be safe";
                    msgElement.style.color = "#58bc8a";
                }
            }
        });
    });
});