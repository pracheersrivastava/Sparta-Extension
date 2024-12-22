import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score
import joblib
import json

# Load dataset
print("Loading dataset...")
file_path = "dataset.csv"
data = pd.read_csv(file_path)

print("Data columns:", data.columns.tolist())
print("Sample of 'label' column:", data['label'].head())
print("Label data type:", data['label'].dtype)

# Convert labels if needed
if data['label'].dtype != 'int64':
    try:
        # Try to convert to numeric directly
        data['label'] = pd.to_numeric(data['label'])
    except:
        # If that fails, try string conversion
        data['label'] = data['label'].astype(str).str.lower()
        valid_labels = {'legitimate': 0, 'phishing': 1}
        data['label'] = data['label'].map(valid_labels).fillna(0)

print("Unique labels after conversion:", data['label'].unique())

# Features list
feature_columns = [
    'URLSimilarityIndex', 
    'NoOfOtherSpecialCharsInURL', 
    'SpacialCharRatioInURL', 
    'IsHTTPS', 
    'DomainTitleMatchScore', 
    'URLTitleMatchScore', 
    'IsResponsive', 
    'HasDescription', 
    'HasSocialNet', 
    'HasSubmitButton', 
    'HasCopyrightInfo', 
    'NoOfImage', 
    'NoOfJS', 
    'NoOfSelfRef'
]

# Verify all features exist in dataset
missing_columns = [col for col in feature_columns if col not in data.columns]
if missing_columns:
    raise ValueError(f"Missing columns in dataset: {missing_columns}")

print("Preparing features...")
features = data[feature_columns]
labels = data['label']

# Split dataset
print("Splitting dataset...")
X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

# Train model
print("Training model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions on test set
print("Calculating metrics...")
y_pred = model.predict(X_test)

# Calculate metrics
metrics = {
    'accuracy': float(accuracy_score(y_test, y_pred)),
    'precision': float(precision_score(y_test, y_pred)),
    'recall': float(recall_score(y_test, y_pred)),
    'f1_score': float(f1_score(y_test, y_pred))
}

# Save model and metrics
print("Saving model and metrics...")
joblib.dump(model, "phishing_model.pkl")
with open('model_metrics.json', 'w') as f:
    json.dump(metrics, f)

print("\nModel trained and saved as phishing_model.pkl")
print("Metrics:", metrics)