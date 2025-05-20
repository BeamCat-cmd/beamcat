// 当DOM内容加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取FAQ滚动容器和内容元素
    const scrollContainer = document.querySelector('.faq-scroll-container');
    const faqContent = document.querySelector('.faq-content');
    
    // 如果元素不存在则退出
    if (!scrollContainer || !faqContent) return;

    // 初始化变量
    let isDown = false; // 是否正在拖动
    let startX; // 开始拖动的X坐标
    let scrollLeft; // 开始拖动时的滚动位置
    let autoScrollInterval = null; // 自动滚动的定时器
    let isAutoScrolling = true; // 是否启用自动滚动
    const scrollSpeed = 1; // 滚动速度

    // 自动滚动功能
    function startAutoScroll() {
        // 如果不在自动滚动状态或已有定时器则返回
        if (!isAutoScrolling || autoScrollInterval) return;
        
        // 设置定时器实现自动滚动
        autoScrollInterval = setInterval(() => {
            if (!isDown) {
                scrollContainer.scrollLeft += scrollSpeed;
                
                // 当滚动到末尾时重置到开始位置
                if (scrollContainer.scrollLeft >= (faqContent.scrollWidth - scrollContainer.clientWidth)) {
                    scrollContainer.scrollLeft = 0;
                }
            }
        }, 20);
    }

    // 停止自动滚动
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }

    // 鼠标按下事件处理
    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        isAutoScrolling = false;
        scrollContainer.style.cursor = 'grabbing'; // 改变鼠标样式
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
        stopAutoScroll();
    });

    // 鼠标松开事件处理
    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
        // 2秒后恢复自动滚动
        setTimeout(() => {
            isAutoScrolling = true;
            startAutoScroll();
        }, 2000);
    });

    // 鼠标移出事件处理
    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
        // 2秒后恢复自动滚动
        setTimeout(() => {
            isAutoScrolling = true;
            startAutoScroll();
        }, 2000);
    });

    // 鼠标移动事件处理
    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2; // 计算拖动距离
        scrollContainer.scrollLeft = scrollLeft - walk;
    });

    // 触摸事件支持 - 触摸开始
    scrollContainer.addEventListener('touchstart', (e) => {
        isAutoScrolling = false;
        stopAutoScroll();
        isDown = true;
        startX = e.touches[0].pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });

    // 触摸事件支持 - 触摸结束
    scrollContainer.addEventListener('touchend', () => {
        isDown = false;
        // 2秒后恢复自动滚动
        setTimeout(() => {
            isAutoScrolling = true;
            startAutoScroll();
        }, 2000);
    });

    // 触摸事件支持 - 触摸移动
    scrollContainer.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });

    // 启动自动滚动
    startAutoScroll();
});

// 打开视频模态框
function openVideoModal() {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    // 设置视频URL（需要替换成实际的视频URL）
    videoFrame.src = 'https://www.youtube.com/embed/your-video-id';
    modal.style.display = 'block';
    
    // 添加ESC键关闭功能
    document.addEventListener('keydown', handleEscKey);
}

// 关闭视频模态框
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    modal.style.display = 'none';
    // 停止视频播放
    videoFrame.src = '';
    
    // 移除ESC键事件监听
    document.removeEventListener('keydown', handleEscKey);
}

// 处理ESC键关闭模态框
function handleEscKey(event) {
    if (event.key === 'Escape') {
        closeVideoModal();
    }
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('videoModal');
    if (event.target === modal) {
        closeVideoModal();
    }
} 

// 面部识别图标点击事件
document.getElementById('fid-icon').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'face-login.html'; // 跳转到面部登录页面
});