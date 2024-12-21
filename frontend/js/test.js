function test_model() {
    $.getJSON("https://raw.githubusercontent.com/picopalette/phishing-detection-plugin/master/static/classifier.json", function(clfdata) {
        var rf = random_forest(clfdata);
        $.getJSON("https://raw.githubusercontent.com/picopalette/phishing-detection-plugin/master/static/testdata.json", function(testdata) {
            var X = testdata['X_test'];
            var y = testdata['y_test'];
            for (var i in X) {
                for (var j in X[i]) {
                    X[i][j] = parseInt(X[i][j]);
                }
            }
            var pred = rf.predict(X);
            var TP = 0, TN = 0, FP = 0, FN = 0;
            for (var i in pred) {
                if (pred[i][0] === true && y[i] === "1") {
                    TP++;
                } else if (pred[i][0] === false && y[i] === "1") {
                    FN++;
                } else if (pred[i][0] === false && y[i] === "-1") {
                    TN++;
                } else if (pred[i][0] === true && y[i] === "-1") {
                    FP++;
                }
            }
            var precision = TP / (TP + FP);
            var recall = TP / (TP + FN);
            var f1 = 2 * precision * recall / (precision + recall);
            $('#precision').text(precision.toFixed(2));
            $('#recall').text(recall.toFixed(2));
            $('#accuracy').text(f1.toFixed(2));
        });
    });
}

test_model();
