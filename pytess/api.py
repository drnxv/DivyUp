from flask import Flask, request
from flask_cors import CORS
import io
import numpy as np
import cv2

app = Flask(__name__)
CORS(app)

@app.route('/ocr', methods=['POST'])
def result():
    photo = request.files['receipt']
    mem = io.BytesIO()
    photo.save(mem)
    img = cv2.imdecode(np.fromstring(mem.getvalue(), dtype=np.uint8), 1)
    cv2.imshow('Receipt', img)
    return 'Received !' # response to your request.