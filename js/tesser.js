const tesseract = require("node-tesseract-ocr")
const { Image } = require('image-js')

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
}

var img = "bill3.jpeg"

// Image.load(img).then(function (image) {
//   var grey = image.grey();
//   grey.save('grey bill3 receipt.jpg');
// })

// var gimg = 'grey bill3 receipt.jpg'

tesseract.recognize(img, config)
  .then((text) => {
    let receipt = text.split('\n')
    receipt = receipt.filter(item => item != '')
    console.log(receipt)
  })
  .catch((error) => {
    console.log(error.message)
  })