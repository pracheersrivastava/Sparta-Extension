from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import logging
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
# Configure CORS properly
CORS(app, resources={
    r"/*": {
        "origins": ["chrome-extension://*", "http://localhost:*"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
app.wsgi_app = ProxyFix(app.wsgi_app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load model and metrics
try:
    model = joblib.load("phishing_model.pkl")
    with open('model_metrics.json', 'r') as f:
        metrics = json.load(f)
except Exception as e:
    logger.error(f"Error loading model or metrics: {e}")
    model = None
    metrics = {}

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "API is running"})

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"status": "API is working"})

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        features = data.get('features')
        url = data.get('url', '')
        
        logger.info(f"Processing URL: {url}")
        logger.info(f"Features received: {features}")
        
        if not features:
            return jsonify({"error": "No features provided"}), 400

        feature_list = [
            features.get('URLSimilarityIndex', 0),
            features.get('NoOfOtherSpecialCharsInURL', 0),
            features.get('SpacialCharRatioInURL', 0),
            features.get('IsHTTPS', 0),
            features.get('DomainTitleMatchScore', 0),
            features.get('URLTitleMatchScore', 0),
            features.get('IsResponsive', 0),
            features.get('HasDescription', 0),
            features.get('HasSocialNet', 0),
            features.get('HasSubmitButton', 0),
            features.get('HasCopyrightInfo', 0),
            features.get('NoOfImage', 0),
            features.get('NoOfJS', 0),
            features.get('NoOfSelfRef', 0)
        ]
        
        if model is not None:
            prediction = model.predict_proba([feature_list])
            is_phish = bool(prediction[0][1] > 0.5)
            legitimate_probability = float(prediction[0][0])
            
            logger.info(f"Prediction made: is_phish={is_phish}, prob={legitimate_probability}")
            
            return jsonify({
                'is_phishing': is_phish,
                'legitimate_probability': legitimate_probability,
                'metrics': metrics,
                'url': url
            })
        else:
            return jsonify({"error": "Model not loaded"}), 500

    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)