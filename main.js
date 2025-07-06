document.addEventListener('DOMContentLoaded', () => {
    // 检查模态窗口是否已存在。如果不存在，则创建并添加到body中。
    if (!document.getElementById('imageModal')) {
        const modalHTML = `
            <div id="imageModal" class="modal">
                <span class="close">&times;</span>
                <div class="modal-content-container">
                    <img class="modal-content" id="modalImage">
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // 获取模态窗口元素
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalContainer = document.querySelector('.modal-content-container');
    const closeBtn = document.querySelector('.close');

    // 获取所有可点击的图片
    const clickableImages = document.querySelectorAll('img.clickable');

    // --- 用于平移和缩放的状态变量 ---
    let scale = 1;
    let isDragging = false;
    let startPos = { x: 0, y: 0 };
    let translatePos = { x: 0, y: 0 };

    // 更新图片变换的函数
    const updateTransform = () => {
        modalImg.style.transform = `translate(${translatePos.x}px, ${translatePos.y}px) scale(${scale})`;
    };

    // --- 为图片添加事件监听器 ---
    clickableImages.forEach(img => {
        img.onclick = function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            
            // 为新图片重置状态
            scale = 1;
            isDragging = false;
            translatePos = { x: 0, y: 0 };
            updateTransform();
        }
    });

    // --- 关闭模态窗口的事件监听器 ---
    const closeModal = () => {
        modal.style.display = "none";
    }
    closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
        // 仅当点击模态窗口的外部区域时才关闭，而不是图片本身
        if (e.target === modal) {
            closeModal();
        }
    };
    
    // --- 缩放事件监听器 (鼠标滚轮) ---
    modalContainer.addEventListener('wheel', (e) => {
        e.preventDefault(); // 防止页面滚动

        const zoomIntensity = 0.1;
        const delta = e.deltaY > 0 ? -zoomIntensity : zoomIntensity;
        const oldScale = scale;
        
        scale += delta;
        scale = Math.max(0.1, scale); // 设置最小缩放比例

        // --- 朝向鼠标指针位置缩放 ---
        const rect = modalContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const imgX = (mouseX - translatePos.x) / oldScale;
        const imgY = (mouseY - translatePos.y) / oldScale;

        translatePos.x = mouseX - imgX * scale;
        translatePos.y = mouseY - imgY * scale;

        updateTransform();
    });

    // --- 平移事件监听器 (鼠标拖拽) ---
    modalImg.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        startPos.x = e.clientX - translatePos.x;
        startPos.y = e.clientY - translatePos.y;
        modalImg.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translatePos.x = e.clientX - startPos.x;
        translatePos.y = e.clientY - startPos.y;
        updateTransform();
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        modalImg.style.cursor = 'grab';
    });

    // 如果鼠标离开窗口，也停止拖动
    document.addEventListener('mouseleave', () => {
        isDragging = false;
        modalImg.style.cursor = 'grab';
    });
});