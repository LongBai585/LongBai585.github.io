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

// ========== 头像加载 + 错误处理 ==========
const avatarImg = document.getElementById('profileAvatar');
if (avatarImg && window.themeConfig.avatarDefault) {
    const storedAvatar = localStorage.getItem('blog_avatar_custom');
    const avatarUrl = storedAvatar || window.themeConfig.avatarDefault;
    avatarImg.src = avatarUrl;
    // 如果图片加载失败，替换为默认 SVG 头像
    avatarImg.onerror = function() {
        this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%23b87c4f'/%3E%3Ccircle cx='35' cy='40' r='5' fill='white'/%3E%3Ccircle cx='65' cy='40' r='5' fill='white'/%3E%3Ccircle cx='35' cy='40' r='2' fill='%23333'/%3E%3Ccircle cx='65' cy='40' r='2' fill='%23333'/%3E%3Cpath d='M40 65 Q50 75 60 65' stroke='%238b3a5e' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";
        this.onerror = null;
    };
    // 鼠标悬浮减速
    avatarImg.addEventListener('mouseenter', () => avatarImg.style.animationDuration = '20s');
    avatarImg.addEventListener('mouseleave', () => avatarImg.style.animationDuration = window.themeConfig.avatarSpeed || '8s');
}

// ========== 统计信息 ==========
function fetchStats() {
    const postCards = document.querySelectorAll('.post-card');
    const postCount = postCards.length;
    if (postCount > 0) document.getElementById('postCount').innerText = postCount;
    else document.getElementById('postCount').innerText = '3';
    document.getElementById('categoryCount').innerText = '2';
    document.getElementById('tagCount').innerText = '5';
    const startDate = new Date(2024, 3, 5);
    const diffDays = Math.floor((Date.now() - startDate) / (1000 * 60 * 60 * 24));
    document.getElementById('runDays').innerText = diffDays;
    const lastPostDate = document.querySelector('.post-card:first-child .post-date');
    if (lastPostDate) document.getElementById('lastUpdate').innerText = lastPostDate.innerText.trim();
    else document.getElementById('lastUpdate').innerText = '2026-04-11';
}
fetchStats();

// ========== 背景上传 + SHA-256 验证（修复版） ==========
const bgInput = document.getElementById('bgInput');
const uploadBgBtn = document.getElementById('uploadBgBtn');
const authModal = document.getElementById('authModal');
const closeAuth = document.querySelector('.close-auth');
const submitAuthBtn = document.getElementById('submitAuthBtn');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authMessage = document.getElementById('authMessage');
let pendingFile = null;

// 验证函数：输出调试信息
function verifyCredentials(email, password) {
    if (!window.themeConfig.authEmailHash || !window.themeConfig.authPasswordHash) {
        console.warn('未配置验证哈希，跳过验证');
        return true;
    }
    // 去除首尾空格
    const cleanEmail = email.trim();
    const cleanPwd = password.trim();
    const emailHash = sha256(cleanEmail);
    const pwdHash = sha256(cleanPwd);
    // 控制台输出比对信息（调试用，可删除）
    console.log('输入邮箱:', cleanEmail, '哈希:', emailHash);
    console.log('输入密码:', cleanPwd, '哈希:', pwdHash);
    console.log('预设邮箱哈希:', window.themeConfig.authEmailHash);
    console.log('预设密码哈希:', window.themeConfig.authPasswordHash);
    return (emailHash === window.themeConfig.authEmailHash && pwdHash === window.themeConfig.authPasswordHash);
}

function loadBackground() {
    const stored = localStorage.getItem('blog_background');
    if (stored) document.body.style.backgroundImage = `url(${stored})`;
    else document.body.style.backgroundImage = 'none';
}
function saveBackground(url) {
    localStorage.setItem('blog_background', url);
    document.body.style.backgroundImage = `url(${url})`;
}
function doUpload(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('请选择图片文件'); return; }
    if (file.size > 3 * 1024 * 1024) { alert('图片小于3MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        saveBackground(e.target.result);
        authModal.style.display = 'none';
        if (authEmail) authEmail.value = '';
        if (authPassword) authPassword.value = '';
        pendingFile = null;
        alert('背景更换成功！');
    };
    reader.readAsDataURL(file);
}
uploadBgBtn?.addEventListener('click', () => bgInput.click());
bgInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    pendingFile = file;
    authModal.style.display = 'flex';
    if (authEmail) authEmail.value = '';
    if (authPassword) authPassword.value = '';
    if (authMessage) authMessage.innerText = '';
});
submitAuthBtn?.addEventListener('click', () => {
    const email = authEmail ? authEmail.value : '';
    const pwd = authPassword ? authPassword.value : '';
    if (!email || !pwd) {
        authMessage.innerText = '请输入邮箱和密码';
        return;
    }
    if (verifyCredentials(email, pwd)) {
        if (pendingFile) doUpload(pendingFile);
        else authModal.style.display = 'none';
    } else {
        authMessage.innerText = '邮箱或密码错误，请重试';
    }
});
closeAuth?.addEventListener('click', () => {
    authModal.style.display = 'none';
    pendingFile = null;
});
window.onclick = (e) => { if (e.target === authModal) { authModal.style.display = 'none'; pendingFile = null; } };
loadBackground();

// ========== 音乐播放器 ==========
if (window.themeConfig?.music?.enable) {
    const audio = document.getElementById('bgAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const muteBtn = document.getElementById('muteBtn');
    let isMuted = false, lastVolume = 0.5;
    if (audio && playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().catch(e => console.log);
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audio.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
        audio.addEventListener('ended', () => playPauseBtn.innerHTML = '<i class="fas fa-play"></i>');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const vol = parseFloat(e.target.value);
                audio.volume = vol;
                if (vol === 0) {
                    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    isMuted = true;
                } else {
                    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                    isMuted = false;
                    lastVolume = vol;
                }
            });
        }
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                if (isMuted) {
                    audio.volume = lastVolume;
                    volumeSlider.value = lastVolume;
                    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                    isMuted = false;
                } else {
                    lastVolume = audio.volume;
                    audio.volume = 0;
                    volumeSlider.value = 0;
                    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    isMuted = true;
                }
            });
        }
        if (window.themeConfig.music.autoplay) audio.play().catch(() => {});
    }
}

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