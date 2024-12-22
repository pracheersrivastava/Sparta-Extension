import os
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split
import pandas as pd
import joblib

os.chdir("backend")

# Load your dataset (replace with your actual dataset path)
data = pd.read_csv("/Users/dikshadamahe/Desktop/Sparta Extension/backend/dataset.csv") 

# Prepare data 
X = data[['URLSimilarityIndex', 'NoOfOtherSpecialCharsInURL', 'SpacialCharRatioInURL', 
          'IsHTTPS', 'DomainTitleMatchScore', 'URLTitleMatchScore', 
          'IsResponsive', 'HasDescription', 'HasSocialNet', 'HasSubmitButton', 
          'HasCopyrightInfo', 'NoOfImage', 'NoOfJS', 'NoOfSelfRef']] 
y = data['label'] 

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train the Naive Bayes model
model = GaussianNB()
model.fit(X_train, y_train)

# Save the trained model
joblib.dump(model, "naive_bayes_model.pkl")