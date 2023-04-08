const tesseract = require("node-tesseract-ocr")
const { Image } = require('image-js')

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
}

var img = "/Users/pranav/Documents/Bitcamp 2023/images/test receipt restaurant.jpeg"

Image.load(img).then(function (image) {
  var grey = image.grey();
  grey.save('grey bill3 receipt.jpg');
})

var gimg = '/Users/pranav/Documents/Bitcamp 2023/images/grey receipt.jpg'

tesseract.recognize(gimg, config)
  .then((text) => {
    let receipt = text.split('\n')
    receipt = receipt.filter(item => item != '')
    console.log(receipt)
  })
  .catch((error) => {
    console.log(error.message)
  })