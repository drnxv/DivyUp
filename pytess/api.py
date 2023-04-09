from flask import Flask, request, send_from_directory, jsonify
import io
import numpy as np
import cv2
import pytesseract
import re

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
   img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
   kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
   # Apply the sharpening kernel to the image using filter2D
   img = cv2.filter2D(img, -1, kernel)
   return jsonify(parse(img))


def parse(img):
   text=(pytesseract.image_to_string(img)).lower()
   vals = text.split('\n')
   pattern = r'^(\d*)\s*([[a-zA-Z+|\s|\d]+)\:? (\$?(\d+\.*\d+))$'
   pattern2 = r'^(\d*)\s*([[a-zA-Z+|\s|\d]+)\:? (\$?(\d+[\.|\:]*\d+))$'
   prices= []
   items= []
   quantity= []
   prices_no_dollar= []

   tax= 0

   done= True
   for line in vals:
      # print( line)
      # print( re.match(pattern, line))
      max1= re.match(pattern, line)
      max2= re.match(pattern2, line)
      if max1:
         if float(max1.group(4)) <= 10000:
               if "amount" in (max1.group(2)).lower() or "total" in (max1.group(2)).lower():
                  amount= float(max1.group(4))
                  done= False
               elif "tax" in (max1.group(2)).lower():
                  tax+= float(max1.group(4))
                  done= False
               else:
                  if done:
                     if max1.group(1) == "":
                           quantity.append(1)
                     else:
                           quantity.append(int(max1.group(1)))
                     items.append(max1.group(2))
                     prices.append(max1.group(3))
                     prices_no_dollar.append(max1.group(4))
      elif max2:
         sum1 = max2.group(4).replace(':','.')
         if float(sum1) <= 10000:
               if "amount" in (max2.group(2)).lower() or "total" in (max2.group(2)).lower():
                  sum1 = max2.group(4).replace(':','.')
                  amount= float(sum1)
                  done= False
               elif "tax" in (max2.group(2)).lower():
                  sum1 = max2.group(4).replace(':','.')
                  tax+= float(sum1)
                  done= False
               else:
                  if done:
                     if max2.group(1) == "":
                           quantity.append(1)
                     else:
                           quantity.append(int(max2.group(1)))
                     items.append(max2.group(2))
                     sum1 = max2.group(3).replace(':','.')
                     prices.append((sum1))
                     sum1 = max2.group(3).replace(':','.')
                     prices_no_dollar.append(float(sum1))
   return {
      "tax" : tax,
      "items": items,
      "prices": prices_no_dollar,
      "qty": quantity
   }
   

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=3298)