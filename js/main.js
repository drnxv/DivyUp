async function openCamera(video) {
  let media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'user' } } })
  video.srcObject = media
  await video.play()
}

async function closeCamera(video) {
  console.log('aefwa')
  await video.pause()
  video.parentElement.style.display = 'none'
}

async function snapPhoto(video, canvas) {
  let ctx = canvas.getContext('2d')
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.save()
  ctx.drawImage(video, 0, 0)
  ctx.restore()
  let img = document.createElement('img')
  img.currentSrc = canvas.toDataURL('image/png')
  document.body.appendChild(img)
}

window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
  let video = document.querySelector('video.camera')
  try {
    openCamera(video)
  } catch (error) {
    alert(error)
  }

}
