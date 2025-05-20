// 获取视频元素
const video = document.getElementById('video');
// 获取用于绘制人脸检测框的画布元素
const overlay = document.getElementById('overlay');
// 获取进度条元素
const progressBar = document.getElementById('progressBar');
// 获取扫描状态显示元素
const scanStatus = document.getElementById('scan-status');
// 获取面部扫描进度显示元素
const faceProgress = document.getElementById('face-progress');

// 初始化进度值
let progress = 0;
// 控制扫描循环的标志
let scanning = true;
// 记录上一帧是否检测到人脸
let faceDetectedLast = false;

// 加载人脸检测模型
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'), // 加载轻量级人脸检测模型
]).then(() => {
  console.log('Models loaded successfully'); // 模型加载成功提示
  startVideo(); // 启动视频流
}).catch(err => {
  console.error('Error loading models:', err); // 模型加载失败错误提示
  scanStatus.textContent = '模型加载失败，请检查网络或本地配置'; // 显示错误信息
});

// 启动摄像头视频流
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true }) // 请求摄像头权限
    .then(stream => {
      video.srcObject = stream; // 将视频流赋值给video元素
    })
    .catch(err => {
      scanStatus.textContent = '无法访问摄像头: ' + err; // 显示摄像头访问错误
    });
}

// 视频开始播放时的事件处理
video.addEventListener('play', () => {
  overlay.width = video.videoWidth; // 设置画布宽度与视频相同
  overlay.height = video.videoHeight; // 设置画布高度与视频相同
  scanLoop(); // 开始扫描循环
});

// 人脸扫描主循环函数
async function scanLoop() {
  // 获取视频显示尺寸
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  // 调整画布尺寸以匹配视频
  faceapi.matchDimensions(overlay, displaySize);

  // 持续扫描循环
  while (scanning) {
    // 使用轻量级人脸检测器检测人脸
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    // 获取画布上下文
    const ctx = overlay.getContext('2d');
    // 清除上一帧的绘制内容
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    if (detections.length > 0) {
      // 调整检测结果尺寸以匹配显示尺寸
      const resized = faceapi.resizeResults(detections, displaySize);
      // 在画布上绘制人脸检测框
      faceapi.draw.drawDetections(overlay, resized);

      // 检测到人脸时的处理
      if (!faceDetectedLast) scanStatus.textContent = '检测到人脸，正在扫描...'; // 更新状态文本
      faceDetectedLast = true; // 更新人脸检测状态
      progress = Math.min(progress + Math.random() * 8, 100); // 随机增加进度，最大100
    } else {
      // 未检测到人脸时的处理
      if (faceDetectedLast) scanStatus.textContent = '请将脸对准摄像头'; // 更新状态文本
      faceDetectedLast = false; // 更新人脸检测状态
      progress = Math.max(progress - 2, 0); // 缓慢减少进度，最小0
    }

    // 更新进度条显示
    progressBar.style.width = progress + '%';
    // 更新进度文本显示
    faceProgress.textContent = Math.round(progress) + '%';

    // 进度达到100%时的处理
    if (progress >= 100) {
      scanStatus.textContent = '面部扫描成功！'; // 显示成功信息
      scanning = false; // 停止扫描循环
      setTimeout(() => {
        // 延迟后执行跳转或登录逻辑
        scanStatus.textContent = '正在跳转...';
        // window.location.href = 'main.html'; // 跳转到主页（已注释）
      }, 1200);
      break; // 退出循环
    }

    // 等待100毫秒后继续下一帧
    await new Promise(r => setTimeout(r, 100));
  }
} 