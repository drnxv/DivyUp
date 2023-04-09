from flask import Flask, request, send_from_directory
import io
import numpy as np
import cv2

app = Flask(__name__)

@app.route('/<path:name>')
def home(name):
   return send_from_directory('../', name)

@app.route('/ocr', methods=['POST'])
def result():
    photo = request.files['receipt']
    mem = io.BytesIO()
    photo.save(mem)
    img = cv2.imdecode(np.frombuffer(mem.getvalue(), dtype=np.uint8), 1)
    cv2.imwrite('Receipt.png', img)
    return 'Received !' # response to your request.

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=3298)