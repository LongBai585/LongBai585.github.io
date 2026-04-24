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
        this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%23ffb347'/%3E%3Ccircle cx='35' cy='40' r='5' fill='white'/%3E%3Ccircle cx='65' cy='40' r='5' fill='white'/%3E%3Ccircle cx='35' cy='40' r='2' fill='%23333'/%3E%3Ccircle cx='65' cy='40' r='2' fill='%23333'/%3E%3Cpath d='M40 65 Q50 75 60 65' stroke='%238b3a5e' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";
        this.onerror = null;
    };
    avatarImg.addEventListener('mouseenter', () => avatarImg.style.animationDuration = '20s');
    avatarImg.addEventListener('mouseleave', () => avatarImg.style.animationDuration = window.themeConfig.avatarSpeed || '8s');
}

// ========== 统计信息 ==========
function fetchStats() {
    const postCards = document.querySelectorAll('.post-item, .post-card');
    const postCount = postCards.length;
    if (postCount > 0) document.getElementById('postCount').innerText = postCount;
    else document.getElementById('postCount').innerText = '2';
    document.getElementById('categoryCount').innerText = '2';
    document.getElementById('tagCount').innerText = '5';
    const startDate = new Date(2024, 3, 5);
    const diffDays = Math.floor((Date.now() - startDate) / (1000 * 60 * 60 * 24));
    document.getElementById('runDays').innerText = diffDays;
    document.getElementById('lastUpdate').innerText = '2026-04-18';
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

// ========== 官方播放器拖拽功能 ==========
(function() {
    const playerWrapper = document.getElementById('officialPlayer');
    if (!playerWrapper) return;
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    const resetPosition = () => {
        playerWrapper.style.left = 'auto';
        playerWrapper.style.right = '20px';
        playerWrapper.style.top = 'auto';
        playerWrapper.style.bottom = '20px';
        localStorage.removeItem('playerLeft');
        localStorage.removeItem('playerTop');
    };

    const onStart = (e) => {
        if (e.target.closest('iframe')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = playerWrapper.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        playerWrapper.style.position = 'fixed';
        playerWrapper.style.left = startLeft + 'px';
        playerWrapper.style.top = startTop + 'px';
        playerWrapper.style.right = 'auto';
        playerWrapper.style.bottom = 'auto';
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
    };

    const onMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newLeft = startLeft + dx;
        let newTop = startTop + dy;
        const maxX = window.innerWidth - playerWrapper.offsetWidth;
        const maxY = window.innerHeight - playerWrapper.offsetHeight;
        newLeft = Math.min(Math.max(0, newLeft), maxX);
        newTop = Math.min(Math.max(0, newTop), maxY);
        playerWrapper.style.left = newLeft + 'px';
        playerWrapper.style.top = newTop + 'px';
    };

    const onEnd = () => {
        isDragging = false;
        localStorage.setItem('playerLeft', playerWrapper.style.left);
        localStorage.setItem('playerTop', playerWrapper.style.top);
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
    };

    const savedLeft = localStorage.getItem('playerLeft');
    const savedTop = localStorage.getItem('playerTop');
    if (savedLeft && savedTop && savedLeft !== 'auto') {
        playerWrapper.style.position = 'fixed';
        playerWrapper.style.left = savedLeft;
        playerWrapper.style.top = savedTop;
        playerWrapper.style.right = 'auto';
        playerWrapper.style.bottom = 'auto';
    } else {
        resetPosition();
    }

    playerWrapper.addEventListener('mousedown', onStart);
    playerWrapper.addEventListener('dblclick', resetPosition);
})();