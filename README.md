# Sparta Phishing Detector Chrome Extension

Sparta Phishing Detector is a Chrome extension designed to detect phishing URLs and help users stay safe online. Using machine learning, the extension analyzes URLs and provides instant feedback on whether a site is potentially harmful.

---

## Features
- **Real-Time Detection**: Checks URLs instantly as you browse.
- **Machine Learning Powered**: Utilizes trained models to assess the likelihood of phishing.
- **User-Friendly Interface**: Simple, intuitive design for seamless integration.
- **Secure & Privacy-First**: No sensitive user data is stored.

---

## Getting Started

### Prerequisites
- **Google Chrome Browser**
- **Python (for the Flask backend)**

---

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/Sparta-Phishing-Detector.git
   cd Sparta-Phishing-Detector
   ```

2. **Set Up the Backend**
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Run the Flask server:
     ```bash
     flask run
     ```

3. **Set Up the Extension**
   - Open Google Chrome and go to `chrome://extensions/`.
   - Enable **Developer Mode**.
   - Click **Load unpacked** and select the `extension` folder.

4. **Start Detecting Phishing!**
   - Use the extension to analyze URLs as you browse.

---

## Usage
- Click on the extension icon in the Chrome toolbar.
- Enter a URL or let the extension analyze the current page.
- Receive feedback: **Phishing** or **Safe**.

---

## File Structure
```
Sparta-Phishing-Detector/
│
├── backend/                # Flask backend for ML model
│   ├── app.py              # Flask app
│   ├── phishing_model.pkl  # Trained ML model
│   └── requirements.txt    # Backend dependencies
│
├── extension/              # Chrome extension files
│   ├── manifest.json       # Extension metadata
│   ├── popup.html          # Popup UI
│   ├── popup.js            # Logic for popup
│   ├── background.js       # Background script
│   ├── content.js          # Script for webpage interaction
│   └── styles.css          # Styling for popup
│
└── README.md               # Project documentation
```

---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with detailed information about your changes.


---

## Acknowledgments
- Inspired by the need to promote online safety.
- Built with ❤️ by Pracheer Srivastava and contributors.

---

## Contact
For questions or support, reach out via [GitHub Issues](https://github.com/<your-username>/Sparta-Phishing-Detector/issues).

