import * as faceapi from 'face-api.js';

const video = document.getElementById('faceVideo');
const statusDiv = document.getElementById('faceStatus');

async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}

async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
}

async function getFaceDescriptor() {
  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!detection) {
    statusDiv.innerText = '未检测到人脸，请调整姿势';
    return null;
  }
  return detection.descriptor;
}

document.getElementById('faceRegisterBtn').onclick = async () => {
  statusDiv.innerText = '采集中...';
  const descriptor = await getFaceDescriptor();
  if (descriptor) {
    const res = await fetch('/api/face_register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descriptor: Array.from(descriptor) })
    });
    const data = await res.json();
    statusDiv.innerText = data.message;
  }
};

document.getElementById('faceLoginBtn').onclick = async () => {
  statusDiv.innerText = '采集中...';
  const descriptor = await getFaceDescriptor();
  if (descriptor) {
    const res = await fetch('/api/face_login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descriptor: Array.from(descriptor) })
    });
    const data = await res.json();
    statusDiv.innerText = data.message;
    if (data.success) {
      window.location.href = '/';
    }
  }
};

window.onload = async () => {
  await loadModels();
  await setupCamera();
}; 