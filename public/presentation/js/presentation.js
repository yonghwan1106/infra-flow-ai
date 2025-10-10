// 프레젠테이션 상태
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let timerInterval = null;
let totalSeconds = 600; // 10분

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 슬라이드 카운터 업데이트
    document.getElementById('total-slides').textContent = totalSlides;

    // 타이머 시작
    startTimer();

    // 첫 슬라이드 애니메이션
    showSlide(0);

    // 키보드 이벤트
    document.addEventListener('keydown', handleKeyPress);

    // 버튼 이벤트
    document.getElementById('prev-btn').addEventListener('click', prevSlide);
    document.getElementById('next-btn').addEventListener('click', nextSlide);

    // 화면 클릭으로 다음 슬라이드
    document.querySelector('.presentation').addEventListener('click', (e) => {
        if (!e.target.closest('.nav-controls') && !e.target.closest('iframe')) {
            nextSlide();
        }
    });
});

// 키보드 제어
function handleKeyPress(e) {
    switch(e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'PageUp':
            e.preventDefault();
            prevSlide();
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(0);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides - 1);
            break;
    }
}

// 슬라이드 표시
function showSlide(index) {
    // 모든 슬라이드 숨기기
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // 현재 슬라이드 표시
    slides[index].classList.add('active');
    currentSlide = index;

    // 슬라이드 카운터 업데이트
    document.getElementById('current-slide').textContent = index + 1;

    // 진행률 바 업데이트
    const progress = ((index + 1) / totalSlides) * 100;
    document.querySelector('.progress-fill').style.width = progress + '%';

    // 버튼 상태 업데이트
    document.getElementById('prev-btn').disabled = (index === 0);
    document.getElementById('next-btn').disabled = (index === totalSlides - 1);

    // 애니메이션 트리거
    triggerAnimations();
}

// 다음 슬라이드
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
    }
}

// 이전 슬라이드
function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

// 특정 슬라이드로 이동
function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
        showSlide(index);
    }
}

// 타이머
function startTimer() {
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateTimerDisplay();

            // 시간이 1분 남았을 때 경고
            if (totalSeconds === 60) {
                document.querySelector('.timer').style.border = '2px solid #ef4444';
                document.querySelector('.timer').style.color = '#ef4444';
            }

            // 시간이 다 되었을 때
            if (totalSeconds === 0) {
                document.querySelector('.timer').textContent = '시간 종료!';
                clearInterval(timerInterval);
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer-display').textContent = display;
}

// 애니메이션 트리거
function triggerAnimations() {
    const currentSlideEl = slides[currentSlide];

    // 카운트업 애니메이션
    const countUpElements = currentSlideEl.querySelectorAll('.count-up');
    countUpElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        animateCountUp(el, 0, target, 2000);
    });

    // TRL 바 애니메이션
    const trlBars = currentSlideEl.querySelectorAll('.trl-fill');
    setTimeout(() => {
        trlBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            if (width) {
                bar.style.width = width + '%';
            }
        });
    }, 500);

    // 페이드인 애니메이션 재적용
    const fadeElements = currentSlideEl.querySelectorAll('.fade-in, .fade-in-delay-1, .fade-in-delay-2, .fade-in-delay-3, .fade-in-delay-4');
    fadeElements.forEach(el => {
        el.style.animation = 'none';
        setTimeout(() => {
            el.style.animation = '';
        }, 10);
    });
}

// 카운트업 애니메이션
function animateCountUp(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out 함수
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (range * easeOut));

        // 숫자 포맷팅
        if (end >= 1000) {
            element.textContent = current.toLocaleString();
        } else {
            element.textContent = current;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (end >= 1000) {
                element.textContent = end.toLocaleString();
            } else {
                element.textContent = end;
            }
        }
    }

    requestAnimationFrame(update);
}

// 슬라이드 자동 전환 (발표 연습용)
function startAutoPlay(intervalSeconds = 30) {
    setInterval(() => {
        if (currentSlide < totalSlides - 1) {
            nextSlide();
        } else {
            // 마지막 슬라이드에서 처음으로
            showSlide(0);
        }
    }, intervalSeconds * 1000);
}

// 전체 화면 토글 (F11 대신 사용)
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// F 키로 전체 화면 전환
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// 타이머 리셋 (R 키)
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        totalSeconds = 600;
        clearInterval(timerInterval);
        document.querySelector('.timer').style.border = '2px solid #3b82f6';
        document.querySelector('.timer').style.color = '#60a5fa';
        startTimer();
    }
});

// 콘솔에 단축키 안내
console.log(`
===== Infra-Flow AI 프레젠테이션 =====
단축키:
→ / Space / PageDown : 다음 슬라이드
← / PageUp : 이전 슬라이드
Home : 첫 슬라이드로
End : 마지막 슬라이드로
F : 전체 화면 전환
R : 타이머 리셋 (10분)
====================================
`);

// 개발용: 슬라이드 번호로 이동 (1-17)
window.gotoSlide = (num) => {
    if (num >= 1 && num <= totalSlides) {
        goToSlide(num - 1);
    }
};

// 개발용: 자동 재생 시작
window.autoplay = (seconds = 30) => {
    startAutoPlay(seconds);
};
