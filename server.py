import os
import numpy as np
import tensorflow as tf
import cv2 
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

MODEL_PATH = "my_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(file_path):
    """
    Load and preprocess the image file.
    Converts it into a format suitable for ML model prediction.
    """
    img = cv2.imread(file_path)  # Read image
    img = cv2.resize(img, (224, 224))  # Resize to match model input
    img = img / 255.0  # Normalize pixel values
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img

@app.route("/")
def home():
    return render_template("index.html")

def serve_assets(filename):
    return send_from_directory('assets', filename)

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"})

    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"error": "No selected file"})

    if file and allowed_file(file.filename):
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        input_data = preprocess_image(file_path)
        prediction = model.predict(input_data)

        categories = ['belly pain', 'burping', 'discomfort', 'hungry', 'tired']
        predicted_class = categories[np.argmax(prediction)]

        return jsonify({"prediction": predicted_class})

    return jsonify({"error": "Invalid file type"})

if __name__ == "__main__":
    app.run(debug=True)
