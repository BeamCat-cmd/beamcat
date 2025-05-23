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

    // FAQ Modal functionality
    const viewMoreButtons = document.querySelectorAll('.view-more');
    const closeBtn = document.getElementById('closeBtn');
    const overlay = document.getElementById('overlay');
    const modal = document.getElementById('modal');

    // 定义弹窗内容映射表
    const contentMap = {
        FAQ1: {
            title: "What is BeamCat used for?",
            content: `
                <div class="modal-section">
                    <p>BeamCat is an intelligent interaction tool based on gesture or eye control. It allows users to perform actions such as clicking, scrolling, and zooming without touching the mouse. This innovative technology is particularly useful for:</p>
                    <ul>
                        <li>Designers who need precise control while working</li>
                        <li>Remote users who want hands-free operation</li>
                        <li>Accessibility scenarios where traditional input methods are challenging</li>
                        <li>Smart home control and automation</li>
                    </ul>
                </div>
            `
        },
        FAQ2: {
            title: "What devices does BeamCat support?",
            content: `
                <div class="modal-section">
                    <p>Currently, BeamCat only supports use on Windows. In the future, we plan to expand support to:</p>
                    <ul>
                        <li>Smartphones and tablets</li>
                        <li>Smart TVs and displays</li>
                        <li>Air conditioners and climate control systems</li>
                        <li>Washing machines and other home appliances</li>
                        <li>Smart speakers and audio systems</li>
                        <li>Other smart home devices</li>
                    </ul>
                    <p>Our goal is to make BeamCat available across all major platforms and devices.</p>
                </div>
            `
        },
        FAQ3: {
            title: "How do I activate BeamCat's Golden Zone feature?",
            content: `
                <div class="modal-section">
                    <p>Click the 🎯 icon at the center of the circular menu to enable the "Golden Zone" feature. This mode offers:</p>
                    <ul>
                        <li>Lower sensitivity for precise control</li>
                        <li>Ideal for clicking small buttons</li>
                        <li>Perfect for detailed work and fine adjustments</li>
                        <li>Enhanced accuracy for photo editing and design work</li>
                    </ul>
                </div>
            `
        },
        FAQ4: {
            title: "How do I pause BeamCat's tracking feature?",
            content: `
                <div class="modal-section">
                    <p>You can pause BeamCat's tracking in several ways:</p>
                    <ul>
                        <li>Press Ctrl + CapsLock on the keyboard</li>
                        <li>Click the ⏯️ Tracking icon in the circular menu</li>
                        <li>When paused, the system will stop responding to head movements</li>
                        <li>This is useful when you need to take a break or make adjustments</li>
                    </ul>
                </div>
            `
        },
        FAQ5: {
            title: "What should I do if BeamCat feels inaccurate during use?",
            content: `
                <div class="modal-section">
                    <p>If you experience accuracy issues, try these solutions:</p>
                    <ul>
                        <li>Check the lighting conditions in your environment</li>
                        <li>Ensure the camera is unobstructed</li>
                        <li>Maintain a comfortable distance from the screen</li>
                        <li>Adjust the sensitivity settings in the control panel</li>
                        <li>Calibrate the system using the calibration tool</li>
                    </ul>
                </div>
            `
        },
        FAQ6: {
            title: "Can BeamCat be used without an internet connection?",
            content: `
                <div class="modal-section">
                    <p>Yes! BeamCat is designed to work completely offline:</p>
                    <ul>
                        <li>All tracking and gesture recognition are processed locally</li>
                        <li>No internet connection required after installation</li>
                        <li>Your data remains secure on your device</li>
                        <li>Perfect for use in any environment</li>
                    </ul>
                </div>
            `
        },
        FAQ7: {
            title: "Does BeamCat support customizable sensitivity and gesture settings?",
            content: `
                <div class="modal-section">
                    <p>Yes, BeamCat offers extensive customization options:</p>
                    <ul>
                        <li>Adjustable sensitivity settings</li>
                        <li>Customizable gesture configurations (coming soon)</li>
                        <li>Personalized tracking speed and range</li>
                        <li>Save and load different profiles</li>
                    </ul>
                </div>
            `
        }
    };

    // 为每个按钮添加点击事件
    viewMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // 防止默认行为
            console.log('Button clicked'); // 调试日志
            
            const faqId = this.getAttribute('data-faq');
            console.log('FAQ ID:', faqId); // 调试日志
            
            if (!contentMap[faqId]) {
                console.error('No content found for FAQ ID:', faqId);
                return;
            }
            
            const { title, content } = contentMap[faqId];
            console.log('Title:', title); // 调试日志
            
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            
            if (!modalTitle || !modalContent) {
                console.error('Modal elements not found');
                return;
            }
            
            modalTitle.innerText = title;
            modalContent.innerHTML = content;
            
            overlay.style.display = 'block';
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            console.log('Modal should be visible now'); // 调试日志
        });
    });

    // 关闭按钮事件
    closeBtn.addEventListener('click', closeModal);

    // 点击遮罩层关闭
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // 关闭弹窗函数
    function closeModal() {
        overlay.style.display = 'none';
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // 面部识别图标点击事件
    const fidIcon = document.getElementById('fid-icon');
    if (fidIcon) {
        fidIcon.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'face-login.html';
        });
    }
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
    const videoModal = document.getElementById('videoModal');
    const faqModal = document.getElementById('modal');
    if (event.target === videoModal) {
        closeVideoModal();
    } else if (event.target === faqModal) {
        closeModal();
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}