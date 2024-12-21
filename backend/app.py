from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the trained model
try:
    model = pickle.load(open("/Users/dikshadamahe/Desktop/Sparta Extension/backend/phishing_model.pkl", "rb"))
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")

# Endpoint to check if a URL is phishing
@app.route('/check', methods=['GET'])
def check_url():
    try:
        # Retrieve the URL from the query parameters
        url = request.args.get('url')
        if not url:
            return jsonify({"error": "URL parameter is required"}), 400

        # Extract features for prediction
        features = extract_features(url)

        # Ensure features are in the correct format (list of lists for scikit-learn)
        features = np.array(features).reshape(1, -1)

        # Predict phishing or not
        prediction = model.predict(features)[0]
        return jsonify({"is_phishing": bool(prediction)}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Feature extraction function
def extract_features(url):
    try:
        features = [
            len(url),  # Length of the URL
            url.count('.'),  # Number of dots
            url.count('-'),  # Number of hyphens
            url.count('@'),  # Number of '@' symbols
            url.count('/'),  # Number of slashes
            url.count('?'),  # Number of question marks
            url.count('&'),  # Number of '&' symbols
            url.count('='),  # Number of '=' symbols
            sum(c.isdigit() for c in url) / len(url) if len(url) > 0 else 0,  # Ratio of digits
            int('xn--' in url),  # Punycode detection
            int('https' in url),  # Check if HTTPS is present
        ]

        return features

    except Exception as e:
        raise ValueError(f"Failed to extract features: {e}")

if __name__ == "__main__":
    app.run(debug=False)