document.addEventListener('DOMContentLoaded', function() {
    const scrollContainer = document.querySelector('.faq-scroll-container');
    const faqContent = document.querySelector('.faq-content');
    
    if (!scrollContainer || !faqContent) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollInterval = null;
    let isAutoScrolling = true;
    const scrollSpeed = 1; // 滚动速度

    // 自动滚动功能
    function startAutoScroll() {
        if (!isAutoScrolling || autoScrollInterval) return;
        
        autoScrollInterval = setInterval(() => {
            if (!isDown) {
                scrollContainer.scrollLeft += scrollSpeed;
                
                // 当滚动到末尾时重置到开始
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

    // 鼠标按下事件
    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        isAutoScrolling = false;
        scrollContainer.style.cursor = 'grabbing';
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
        stopAutoScroll();
    });

    // 鼠标松开事件
    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
        setTimeout(() => {
            isAutoScrolling = true;
            startAutoScroll();
        }, 2000); // 2秒后恢复自动滚动
    });

    // 鼠标移出事件
    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
        setTimeout(() => {
            isAutoScrolling = true;
            startAutoScroll();
        }, 2000);
    });

    // 鼠标移动事件
    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2; // 拖动速度
        scrollContainer.scrollLeft = scrollLeft - walk;
    });

    // 触摸事件支持
    scrollContainer.addEventListener('touchstart', (e) => {
        isAutoScrolling = false;
        stopAutoScroll();
        isDown = true;
        startX = e.touches[0].pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('touchend', () => {
        isDown = false;
        setTimeout(() => {
            isAutoScrolling = true;
            startAutoScroll();
        }, 2000);
    });

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