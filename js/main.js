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

// ========== 打字机效果（循环显示一句话） ==========
const typeText = "我是泷白，一个才疏学浅的开发小白";
const typeContainer = document.getElementById('scrollText');
if (typeContainer) {
    let index = 0;
    let isDeleting = false;
    let currentText = '';
    let timer = null;

    function typeEffect() {
        if (!isDeleting) {
            // 正在打字
            if (index < typeText.length) {
                currentText = typeText.substring(0, index + 1);
                typeContainer.innerText = currentText;
                index++;
                timer = setTimeout(typeEffect, 120); // 打字速度
            } else {
                // 打字完成，等待2秒后开始删除
                isDeleting = true;
                timer = setTimeout(typeEffect, 2000);
            }
        } else {
            // 正在删除
            if (index > 0) {
                currentText = typeText.substring(0, index - 1);
                typeContainer.innerText = currentText;
                index--;
                timer = setTimeout(typeEffect, 80); // 删除速度稍快
            } else {
                // 删除完成，等待0.5秒后重新打字
                isDeleting = false;
                timer = setTimeout(typeEffect, 500);
            }
        }
    }

    // 启动打字机
    typeEffect();

    // 可选：添加光标闪烁效果（在CSS中定义）
    typeContainer.style.borderRight = '2px solid var(--primary)';
    typeContainer.style.paddingRight = '8px';
    typeContainer.style.display = 'inline-block';
    typeContainer.style.whiteSpace = 'nowrap';
}

// ========== 头像自定义上传 + 旋转 & 本地存储 ==========
const avatarImg = document.getElementById('profileAvatar');
const avatarInput = document.getElementById('avatarInput');
const uploadBtn = document.getElementById('uploadAvatarBtn');
const resetBtn = document.getElementById('resetAvatarBtn');

// 内置二次元默认SVG (fallback)
const SVG_DEFAULT = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%23FFB7C5'/%3E%3Ccircle cx='35' cy='40' r='5' fill='white'/%3E%3Ccircle cx='65' cy='40' r='5' fill='white'/%3E%3Ccircle cx='35' cy='40' r='2' fill='%23333'/%3E%3Ccircle cx='65' cy='40' r='2' fill='%23333'/%3E%3Cpath d='M40 65 Q50 75 60 65' stroke='%238b3a5e' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3Crect x='44' y='58' width='12' height='8' fill='%23FF90B5' rx='4' /%3E%3C/svg%3E";

function loadStoredAvatar() {
    const stored = localStorage.getItem('blog_avatar_custom');
    if (stored && stored !== '') {
        avatarImg.src = stored;
    } else {
        // 使用主题配置的默认头像，若无则使用SVG备用
        let defaultUrl = window.themeConfig?.defaultAvatar;
        if (!defaultUrl || defaultUrl === '/images/default-avatar.svg') {
            // 如果没有有效路径，使用SVG
            avatarImg.src = SVG_DEFAULT;
        } else {
            avatarImg.src = defaultUrl;
        }
    }
}

function saveAvatar(url) {
    localStorage.setItem('blog_avatar_custom', url);
}

function resetAvatar() {
    const defaultUrl = window.themeConfig?.defaultAvatar;
    if (defaultUrl && defaultUrl !== '/images/default-avatar.svg') {
        avatarImg.src = defaultUrl;
        saveAvatar(defaultUrl);
    } else {
        avatarImg.src = SVG_DEFAULT;
        saveAvatar(SVG_DEFAULT);
    }
}

function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件哟 (◕ᴗ◕✿)');
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        alert('图片太大啦，请小于2MB～');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(ev) {
        const dataUrl = ev.target.result;
        avatarImg.src = dataUrl;
        saveAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
    avatarInput.value = '';
}

uploadBtn?.addEventListener('click', () => avatarInput.click());
resetBtn?.addEventListener('click', resetAvatar);
avatarInput?.addEventListener('change', handleUpload);
loadStoredAvatar();

// 鼠标悬浮减速旋转，离开恢复
if (avatarImg) {
    avatarImg.addEventListener('mouseenter', () => avatarImg.style.animationDuration = '20s');
    avatarImg.addEventListener('mouseleave', () => avatarImg.style.animationDuration = '12s');
}

// 时间区域点击彩蛋
const timeDiv = document.getElementById('liveClock');
if (timeDiv) {
    timeDiv.addEventListener('click', () => {
        const msgs = ['🎀 喵~', '🌸 二次元时间', '✨ 今すぐコードを書く', '🍭 ドキドキ', '⭐ 好心情+1'];
        const rand = msgs[Math.floor(Math.random() * msgs.length)];
        const original = timeDiv.innerText;
        timeDiv.innerText = `${rand}  ${original.split(' ')[0]}`;
        setTimeout(() => updateClock(), 1500);
    });
}
// ========== 音乐播放器控制 ==========
if (window.themeConfig && window.themeConfig.music && window.themeConfig.music.enable) {
    const audio = document.getElementById('bgAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const muteBtn = document.getElementById('muteBtn');
    let isMuted = false;
    let lastVolume = 0.5;

    if (audio && playPauseBtn) {
        // 播放/暂停
        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().catch(e => console.log('播放被阻止:', e));
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audio.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        // 监听音频结束，重置按钮图标
        audio.addEventListener('ended', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });

        // 音量控制
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

        // 静音切换
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

        // 尝试自动播放（需要用户交互，但可先尝试）
        if (window.themeConfig.music.autoplay) {
            audio.play().catch(() => {
                console.log('浏览器阻止自动播放，需用户手动点击');
                // 在页面任意点击时尝试播放
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