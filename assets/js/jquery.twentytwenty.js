document.addEventListener('DOMContentLoaded', function() {
  const interactiveContainers = document.querySelectorAll('.interactive-shot-container');

  interactiveContainers.forEach(container => {
      // --- 1. 获取资源路径 ---
      const inputSrc = container.dataset.inputImage;
      const resultSrc = container.dataset.resultImage;
      const videoSrc = container.dataset.videoSrc;

      if (!inputSrc || !resultSrc || !videoSrc) {
          console.warn('Container is missing data attributes:', container);
          return;
      }

      // --- 2. 创建并设置所有元素的样式 ---
      // 样式函数，确保所有媒体元素都重叠并填满容器
      const setElementStyles = (element) => {
          element.style.position = 'absolute';
          element.style.top = '0';
          element.style.left = '0';
          element.style.width = '100%';
          element.style.height = '100%';
          element.style.objectFit = 'cover';
          element.style.transition = 'opacity 0.3s ease-in-out';
          element.style.opacity = '0'; // 默认都隐藏
          element.style.zIndex = '1';  // 默认层级
      };

      // 创建输入图片
      const inputImage = new Image();
      inputImage.src = inputSrc;
      setElementStyles(inputImage);

      // 创建结果图片
      const resultImage = new Image();
      resultImage.src = resultSrc;
      setElementStyles(resultImage);

      // 创建视频
      const video = document.createElement('video');
      video.src = videoSrc;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'auto';
      setElementStyles(video);

      // 创建一个小的状态标签，样式直接在 JS 中定义
      const label = document.createElement('div');
      label.textContent = 'Input Shot';
      // 设置标签的样式
      Object.assign(label.style, {
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: '500',
          fontFamily: "'Google Sans', sans-serif",
          zIndex: '5', // 确保标签在最上层
          pointerEvents: 'none' // 标签不响应点击
      });

      // 将所有创建的元素添加到容器中
      // 注意：后添加的元素会默认覆盖先添加的，但我们会用 zIndex 控制
      container.appendChild(inputImage);
      container.appendChild(resultImage);
      container.appendChild(video);
      container.appendChild(label);

      // --- 3. 管理状态和点击事件 ---
      const elements = [inputImage, resultImage, video];
      const labels = ['Input Shot', 'Cut2Next (Ours)', 'Video Preview'];
      let currentState = 0;

      // 显示当前状态的函数
      const showState = (index) => {
          elements.forEach((el, i) => {
              el.style.opacity = (i === index) ? '1' : '0';
              el.style.zIndex = (i === index) ? '2' : '1'; // 将当前元素层级提高
          });
          label.textContent = labels[index];
          
          // 确保视频处理正确
          if (index === 2) { // 如果是视频
              const playPromise = video.play();
              if (playPromise !== undefined) {
                  playPromise.catch(() => {});
              }
          } else {
              video.pause();
              video.currentTime = 0;
          }
      };
      
      // 设置初始状态（确保图片加载完成后再显示，避免闪烁）
      inputImage.onload = () => {
          showState(0);
      };
      // 如果图片已经从缓存加载，onload 可能不会触发，所以手动检查
      if (inputImage.complete) {
          showState(0);
      }

      // 添加点击事件
      container.addEventListener('click', () => {
          currentState = (currentState + 1) % elements.length;
          showState(currentState);
      });
  });
});
