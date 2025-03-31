// 导航栏平滑滚动
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - document.querySelector('header').offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// 响应式菜单切换
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', function () {
    navMenu.classList.toggle('active');
});  

// 打开登录弹框
function openLoginModal() {
    document.getElementById("loginModal").style.display = "block";
}

// 关闭登录弹框
function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
}

// 点击空白区域关闭弹框
window.onclick = function(event) {
    let modal = document.getElementById("loginModal");
    if (event.target === modal) {
        closeLoginModal();
    }
}


