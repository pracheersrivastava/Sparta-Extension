import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle
import os

# File paths
DATASET_PATH = "dataset.csv"
MODEL_PATH = "phishing_model.pkl"

# Function to train the model
def train_model():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")

    # Load the dataset
    data = pd.read_csv(DATASET_PATH)

    # Feature selection and preprocessing
    # Assuming dataset has required features and a label column
    if not all(col in data.columns for col in ["label"]):
        raise ValueError("Dataset is missing the 'label' column.")

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

# Main script
if __name__ == "__main__":
    try:
        accuracy = train_model()
        print(f"Training completed successfully with accuracy: {accuracy * 100:.2f}%")
    except Exception as e:
        print(f"Error during training: {e}")
