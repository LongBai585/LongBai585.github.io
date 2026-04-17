// ========== 实时时钟 ==========
function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[now.getDay()];
    const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${weekday}`;
    const clockEl = document.getElementById('liveClock');
    if (clockEl) clockEl.innerText = timeString;
}
updateClock();
setInterval(updateClock, 1000);

// ========== 打字机效果 ==========
const typeText = "我是泷白，一个才疏学浅的开发小白";
const typeContainer = document.getElementById('scrollText');
if (typeContainer) {
    let index = 0, isDeleting = false, currentText = '', timer = null;
    function typeEffect() {
        if (!isDeleting) {
            if (index < typeText.length) {
                currentText = typeText.substring(0, index + 1);
                typeContainer.innerText = currentText;
                index++;
                timer = setTimeout(typeEffect, 120);
            } else {
                isDeleting = true;
                timer = setTimeout(typeEffect, 2000);
            }
        } else {
            if (index > 0) {
                currentText = typeText.substring(0, index - 1);
                typeContainer.innerText = currentText;
                index--;
                timer = setTimeout(typeEffect, 80);
            } else {
                isDeleting = false;
                timer = setTimeout(typeEffect, 500);
            }
        }
    }
    typeEffect();
}

// ========== 头像加载 ==========
const avatarImg = document.getElementById('profileAvatar');
if (avatarImg && window.themeConfig.avatarDefault) {
    const storedAvatar = localStorage.getItem('blog_avatar_custom');
    const avatarUrl = storedAvatar || window.themeConfig.avatarDefault;
    avatarImg.src = avatarUrl;
    avatarImg.onerror = function() {
        this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%23ff6ec7'/%3E%3Ccircle cx='35' cy='40' r='5' fill='white'/%3E%3Ccircle cx='65' cy='40' r='5' fill='white'/%3E%3Ccircle cx='35' cy='40' r='2' fill='%23333'/%3E%3Ccircle cx='65' cy='40' r='2' fill='%23333'/%3E%3Cpath d='M40 65 Q50 75 60 65' stroke='%238b3a5e' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";
        this.onerror = null;
    };
    avatarImg.addEventListener('mouseenter', () => avatarImg.style.animationDuration = '20s');
    avatarImg.addEventListener('mouseleave', () => avatarImg.style.animationDuration = window.themeConfig.avatarSpeed || '8s');
}

// ========== 统计信息 ==========
function fetchStats() {
    const postCards = document.querySelectorAll('.post-item');
    const postCount = postCards.length;
    if (postCount > 0) document.getElementById('postCount').innerText = postCount;
    else document.getElementById('postCount').innerText = '2';
    document.getElementById('categoryCount').innerText = '2';
    document.getElementById('tagCount').innerText = '5';
    const startDate = new Date(2024, 3, 5);
    const diffDays = Math.floor((Date.now() - startDate) / (1000 * 60 * 60 * 24));
    document.getElementById('runDays').innerText = diffDays;
    document.getElementById('lastUpdate').innerText = '2026-04-17';
}
fetchStats();

// 时间彩蛋
const timeDiv = document.getElementById('liveClock');
if (timeDiv) {
    timeDiv.addEventListener('click', () => {
        const msgs = ['🎋 竹影', '🌸 花见', '🍵 茶香', '📖 静读'];
        const rand = msgs[Math.floor(Math.random() * msgs.length)];
        const original = timeDiv.innerText;
        timeDiv.innerText = `${rand}  ${original.split(' ')[0]}`;
        setTimeout(() => updateClock(), 1500);
    });
}

// ========== 音乐播放器拖拽功能 ==========
(function() {
    // 等待播放器元素加载
    const playerElement = document.querySelector('.aplayer-fixed');
    if (!playerElement) {
        console.warn('未找到播放器元素，拖拽功能暂不生效');
        return;
    }

    let isDragging = false;
    let startX, startY, startLeft, startTop;

    // 重置位置到右下角
    const resetPosition = () => {
        playerElement.style.left = 'auto';
        playerElement.style.right = '20px';
        playerElement.style.top = 'auto';
        playerElement.style.bottom = '20px';
        playerElement.style.transform = 'none';
        // 清除保存的位置
        localStorage.removeItem('playerLeft');
        localStorage.removeItem('playerTop');
    };

    // 鼠标按下
    const onMouseDown = (e) => {
        // 防止点击播放器内部按钮时触发拖拽（例如播放/暂停、音量、切歌等）
        if (e.target.closest('.aplayer-pic, .aplayer-info, .aplayer-list, .aplayer-icon')) {
            return;
        }
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        // 获取当前播放器的位置（相对于视口）
        const rect = playerElement.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;

        // 临时改为绝对定位（相对于视口），方便拖拽
        playerElement.style.position = 'fixed';
        playerElement.style.left = startLeft + 'px';
        playerElement.style.top = startTop + 'px';
        playerElement.style.right = 'auto';
        playerElement.style.bottom = 'auto';

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newLeft = startLeft + dx;
        let newTop = startTop + dy;

        // 边界限制（防止拖出可视窗口）
        const maxX = window.innerWidth - playerElement.offsetWidth;
        const maxY = window.innerHeight - playerElement.offsetHeight;
        newLeft = Math.min(Math.max(0, newLeft), maxX);
        newTop = Math.min(Math.max(0, newTop), maxY);

        playerElement.style.left = newLeft + 'px';
        playerElement.style.top = newTop + 'px';
    };

    const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        // 保存位置
        localStorage.setItem('playerLeft', playerElement.style.left);
        localStorage.setItem('playerTop', playerElement.style.top);
    };

    // 双击重置到右下角
    const onDoubleClick = (e) => {
        // 避免双击按钮时误触发
        if (e.target.closest('.aplayer-pic, .aplayer-info, .aplayer-list, .aplayer-icon')) {
            return;
        }
        resetPosition();
    };

    // 触摸事件支持（移动端）
    const onTouchStart = (e) => {
        const touch = e.touches[0];
        if (e.target.closest('.aplayer-pic, .aplayer-info, .aplayer-list, .aplayer-icon')) {
            return;
        }
        isDragging = true;
        startX = touch.clientX;
        startY = touch.clientY;
        const rect = playerElement.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        playerElement.style.position = 'fixed';
        playerElement.style.left = startLeft + 'px';
        playerElement.style.top = startTop + 'px';
        playerElement.style.right = 'auto';
        playerElement.style.bottom = 'auto';
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
    };

    const onTouchMove = (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        let newLeft = startLeft + dx;
        let newTop = startTop + dy;
        const maxX = window.innerWidth - playerElement.offsetWidth;
        const maxY = window.innerHeight - playerElement.offsetHeight;
        newLeft = Math.min(Math.max(0, newLeft), maxX);
        newTop = Math.min(Math.max(0, newTop), maxY);
        playerElement.style.left = newLeft + 'px';
        playerElement.style.top = newTop + 'px';
    };

    const onTouchEnd = () => {
        isDragging = false;
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        localStorage.setItem('playerLeft', playerElement.style.left);
        localStorage.setItem('playerTop', playerElement.style.top);
    };

    // 恢复之前保存的位置
    const savedLeft = localStorage.getItem('playerLeft');
    const savedTop = localStorage.getItem('playerTop');
    if (savedLeft && savedTop && savedLeft !== 'auto' && savedTop !== 'auto') {
        playerElement.style.position = 'fixed';
        playerElement.style.left = savedLeft;
        playerElement.style.top = savedTop;
        playerElement.style.right = 'auto';
        playerElement.style.bottom = 'auto';
    } else {
        resetPosition();
    }

    // 添加事件监听
    playerElement.addEventListener('mousedown', onMouseDown);
    playerElement.addEventListener('dblclick', onDoubleClick);
    playerElement.addEventListener('touchstart', onTouchStart);
})();