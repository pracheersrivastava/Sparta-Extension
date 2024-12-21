import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

def add_labels(dataset, label_column_name):
  """
  Adds a 'label' column to the dataset based on the values in the specified label column.

  Args:
      dataset (pandas.DataFrame): The dataset to add labels to.
      label_column_name (str): The name of the column containing phishing labels.

  Returns:
      pandas.DataFrame: The dataset with the added 'label' column.
  """

  dataset['label'] = dataset[label_column_name].apply(lambda x: 1 if x == 'phishing' else 0)
  return dataset

def train_model(dataset1_path, dataset2_path, label_column_name='status'):
  """
  Loads two datasets, adds labels, splits them into training and testing sets,
  and trains a Random Forest model.

  Args:
      dataset1_path (str): Path to the first dataset file.
      dataset2_path (str): Path to the second dataset file.
      label_column_name (str, optional): The name of the column containing phishing labels.
          Defaults to 'status'.
  """

  try:
    dataset1 = pd.read_csv(dataset1_path)
    dataset2 = pd.read_csv(dataset2_path)
  except FileNotFoundError:
    print(f"Error: Dataset files not found at {dataset1_path} and {dataset2_path}")
    return

  # Check if the specified label column exists in both datasets
  if label_column_name not in dataset1.columns or label_column_name not in dataset2.columns:
    print(f"Error: Column '{label_column_name}' not found in one or both datasets.")
    return

  # Add labels to both datasets
  dataset1 = add_labels(dataset1, label_column_name)
  dataset2 = add_labels(dataset2, label_column_name)

  # Combine datasets (optional, adjust based on your logic)
  combined_dataset = pd.concat([dataset1, dataset2], ignore_index=True)

  # Handle missing values (optional, adjust based on your strategy)
  combined_dataset.fillna(method='ffill', inplace=True)  # Forward-fill missing values

  # Split into training and testing sets
  X = combined_dataset.drop('label', axis=1)  # Features
  y = combined_dataset['label']  # Target labels
  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

  # Train a Random Forest model (replace with your preferred model)
  model = RandomForestClassifier()
  model.fit(X_train, y_train)

  # Save the model (optional)
  # import joblib
  # joblib.dump(model, 'phishing_model.pkl')

  print("Model training complete!")

if __name__ == "__main__":
  dataset1_path = "/Users/dikshadamahe/Desktop/Sparta Extension/backend/dataset1.csv"
  dataset2_path = "/Users/dikshadamahe/Desktop/Sparta Extension/backend/dataset2.csv"

  # Specify the correct label column name for your datasets
  label_column_name = 'status'  # Replace with the actual column name

  train_model(dataset1_path, dataset2_path, label_column_name)