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

// ========== 头像上传 ==========
const avatarImg = document.getElementById('profileAvatar');
const avatarInput = document.getElementById('avatarInput');
const uploadBtn = document.getElementById('uploadAvatarBtn');
const resetBtn = document.getElementById('resetAvatarBtn');
const SVG_DEFAULT = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%23b87c4f'/%3E%3Ccircle cx='35' cy='40' r='5' fill='white'/%3E%3Ccircle cx='65' cy='40' r='5' fill='white'/%3E%3Ccircle cx='35' cy='40' r='2' fill='%23333'/%3E%3Ccircle cx='65' cy='40' r='2' fill='%23333'/%3E%3Cpath d='M40 65 Q50 75 60 65' stroke='%238b3a5e' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";

function loadStoredAvatar() {
    const stored = localStorage.getItem('blog_avatar_custom');
    if (stored) {
        avatarImg.src = stored;
    } else {
        const defaultUrl = window.themeConfig?.defaultAvatar;
        avatarImg.src = (defaultUrl && defaultUrl !== '/images/default-avatar.svg') ? defaultUrl : SVG_DEFAULT;
    }
}
function saveAvatar(url) {
    localStorage.setItem('blog_avatar_custom', url);
    avatarImg.src = url;
}
function resetAvatar() {
    const defaultUrl = window.themeConfig?.defaultAvatar;
    if (defaultUrl && defaultUrl !== '/images/default-avatar.svg') {
        saveAvatar(defaultUrl);
    } else {
        saveAvatar(SVG_DEFAULT);
    }
}
uploadBtn?.addEventListener('click', () => avatarInput.click());
resetBtn?.addEventListener('click', resetAvatar);
avatarInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        if (file.size > 2 * 1024 * 1024) {
            alert('图片不能超过2MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => saveAvatar(ev.target.result);
        reader.readAsDataURL(file);
    }
});
loadStoredAvatar();
if (avatarImg) {
    avatarImg.addEventListener('mouseenter', () => avatarImg.style.animationDuration = '20s');
    avatarImg.addEventListener('mouseleave', () => avatarImg.style.animationDuration = window.themeConfig?.avatarSpeed || '8s');
}

// ========== 背景图片上传 ==========
const bgInput = document.getElementById('bgInput');
const uploadBgBtn = document.getElementById('uploadBgBtn');
function loadBackground() {
    const storedBg = localStorage.getItem('blog_background');
    if (storedBg) {
        document.body.style.backgroundImage = `url(${storedBg})`;
    } else {
        document.body.style.backgroundImage = 'none';
    }
}
function saveBackground(url) {
    localStorage.setItem('blog_background', url);
    document.body.style.backgroundImage = `url(${url})`;
}
uploadBgBtn?.addEventListener('click', () => bgInput.click());
bgInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        if (file.size > 3 * 1024 * 1024) {
            alert('背景图片请小于3MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => saveBackground(ev.target.result);
        reader.readAsDataURL(file);
    }
});
loadBackground();

// ========== 音乐播放器控制 ==========
if (window.themeConfig?.music?.enable) {
    const audio = document.getElementById('bgAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const muteBtn = document.getElementById('muteBtn');
    let isMuted = false, lastVolume = 0.5;
    if (audio && playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().catch(e => console.log('播放被阻止'));
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
        if (window.themeConfig.music.autoplay) {
            audio.play().catch(() => {
                const enableAutoPlay = () => {
                    audio.play().then(() => {
                        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                        document.removeEventListener('click', enableAutoPlay);
                    }).catch(() => {});
                };
                document.addEventListener('click', enableAutoPlay);
            });
        }
    }
}

// 时间彩蛋
const timeDiv = document.getElementById('liveClock');
if (timeDiv) {
    timeDiv.addEventListener('click', () => {
        const msgs = ['🎋 竹影', '🌸 樱吹雪', '🍵 一盏茶', '📜 诗笺', '🌙 月下'];
        const rand = msgs[Math.floor(Math.random() * msgs.length)];
        const original = timeDiv.innerText;
        timeDiv.innerText = `${rand}  ${original.split(' ')[0]}`;
        setTimeout(() => updateClock(), 1500);
    });
}