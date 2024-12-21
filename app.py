from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import os

# Flask app setup
app = Flask(__name__)
CORS(app)

# Dataset path
DATASET_PATH = "dataset.csv"
MODEL_PATH = "phishing_model.pkl"

# Function to train the model
def train_model():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")

    # Load the dataset
    data = pd.read_csv(DATASET_PATH)

    # Feature selection and preprocessing
    if not all(col in data.columns for col in ["label"]):
        raise ValueError("Dataset is missing required columns.")

    X = data.drop(columns=["URL", "Domain", "TLD", "label", "Title"], errors='ignore')
    y = data["label"]

    # Check class distribution
    print("Class distribution:")
    print(y.value_counts())

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Random Forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight="balanced")
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model training complete. Accuracy: {accuracy * 100:.2f}%")

    # Save the model
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    print(f"Model saved to {MODEL_PATH}")

    return accuracy

# Endpoint to train the model
@app.route('/train', methods=['POST'])
def train():
    try:
        accuracy = train_model()
        return jsonify({"message": "Model training successful", "accuracy": f"{accuracy * 100:.2f}%"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to check if a URL is phishing
@app.route('/check', methods=['GET'])
def check_url():
    try:
        # Retrieve the URL from query parameters
        url = request.args.get('url')
        if not url:
            raise ValueError("No URL provided for prediction.")

        # Process URL into features (implement feature extraction logic here)
        features = extract_features_from_url(url)
        features_array = np.array([features]).reshape(1, -1)

        # Load the trained model
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError("Trained model not found. Please train the model first.")

        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)

        # Make prediction
        prediction = model.predict(features_array)[0]
        return jsonify({"is_phishing": bool(prediction)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Feature extraction function
def extract_features_from_url(url):
    # Placeholder for real feature extraction logic
    # Replace with actual feature extraction logic based on the dataset
    return [0] * 15  # Example: return a list of 15 dummy features

if __name__ == '__main__':
    app.run(debug=True)
