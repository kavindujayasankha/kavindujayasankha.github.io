// Project modal handler
const projectModal = {
  init() {
    // Add modal HTML to the document
    const modalHTML = `
      <div id="project-modal" class="project-modal" style="display:none">
        <div class="project-modal-overlay"></div>
        <div class="project-modal-content">
          <div class="project-modal-header">
            <h3 class="project-modal-title"></h3>
            <button class="project-modal-close">
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          <div class="project-modal-body">
            <div class="project-modal-text"></div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add modal styles
    const styles = `
      .project-modal {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .project-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
      }
      .project-modal-content {
        position: relative;
        background: var(--eerie-black-1);
        padding: 20px;
        border-radius: 14px;
        max-width: 90%;
        max-height: 85vh;
        overflow: auto;
        margin: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      .project-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      .project-modal-title {
        color: var(--white-2);
        font-size: var(--fs-2);
        font-weight: var(--fw-500);
        margin: 0;
      }
      .project-modal-close {
        background: none;
        border: none;
        color: var(--white-2);
        font-size: 24px;
        cursor: pointer;
        padding: 5px;
      }
      .project-modal-body {
        color: var(--light-gray);
      }
      .project-modal-text {
        line-height: 1.6;
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Get modal elements
    this.modal = document.getElementById('project-modal');
    this.overlay = this.modal.querySelector('.project-modal-overlay');
    this.closeBtn = this.modal.querySelector('.project-modal-close');
    this.title = this.modal.querySelector('.project-modal-title');
    this.text = this.modal.querySelector('.project-modal-text');

    // Bind event handlers
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());

    // Add click handlers to all project items
    this.attachProjectHandlers();
  },

  attachProjectHandlers() {
    const projectLinks = document.querySelectorAll('.project-item a');
    projectLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const item = link.closest('.project-item');
        const title = item.querySelector('.project-title').textContent;
        const modelPath = item.getAttribute('data-model');
        const description = item.getAttribute('data-description') || `Click the item to view more details.`;
        const relatedImages = item.getAttribute('data-related-images') || '';

        this.show({
          title,
          description,
          modelPath,
          relatedImages
        });
      });
    });
  },

  show({ title, description, modelPath, relatedImages }) {
    this.title.textContent = title;

    const modelPaths = (modelPath || '').split(',').map(s => s.trim()).filter(Boolean);
    const modelContainerId = 'model-viewer-container';
    let topHtml = '';

    if (modelPaths.length > 0) {
      topHtml = `<div id="${modelContainerId}" style="width:100%; height:480px; background:#111; border-radius:8px;"></div>`;
    }

    let galleryHtml = '';
    if (relatedImages || modelPaths.length > 1) {
        const imgs = (relatedImages || '').split(',').map(s => s.trim()).filter(Boolean);
        galleryHtml = '<div class="project-related-images" style="display:flex; flex-direction: column; gap:8px; flex-wrap:wrap; align-items:center;">';

        modelPaths.forEach((path, index) => {
            const thumbTitle = `3D Model ${index + 1}`;
            galleryHtml += `<div class="project-related-thumb project-related-3d" data-model-path="${path}" title="${thumbTitle}" style="width:90px; height:60px; display:flex; align-items:center; justify-content:center; background:#111; color:#fff; border-radius:6px; cursor:pointer; font-weight:600;">3D</div>`;
        });

        imgs.forEach(p => {
            galleryHtml += `<img src="${p}" alt="related" style="width:90px; height:60px; object-fit:cover; border-radius:6px; cursor:pointer;">`;
        });
        galleryHtml += '</div>';
    }

    this.text.innerHTML = `
      <div class="project-modal-details" style="display: flex; flex-wrap: wrap; gap: 16px;">
        <div class="project-media-main" style="flex: 1 1 60%; min-width: 300px;">
          ${topHtml}
          <div class="project-details-content" style="margin-top:12px;">
            <h4>${title}</h4>
            <p>${description}</p>
          </div>
        </div>
        <div class="project-media-sidebar" style="flex: 0 1 100px;">
          ${galleryHtml}
        </div>
      </div>
    `;

    //Clear container
    const container = document.getElementById(modelContainerId);
    if (container) {
      container.innerHTML = '';
    }

    const loadModel = (path) => {
        const container = document.getElementById(modelContainerId);
        if (!container) return;

        if (path) {
            container.innerHTML = '<div style="color:#fff; padding:12px; text-align:center;">Loading 3D model...</div>'; // Loading message
            const modelViewerElement = document.createElement('model-viewer');
            modelViewerElement.setAttribute('src', path);
            modelViewerElement.setAttribute('alt', title);
            modelViewerElement.setAttribute('camera-controls', '');
            modelViewerElement.setAttribute('auto-rotate', '');
            modelViewerElement.setAttribute('exposure', '1');
            modelViewerElement.style.cssText = "width:100%; height:480px; background:#111; border-radius:8px;";
            modelViewerElement.setAttribute('loading', 'eager');
            
            container.innerHTML = ''; // Clear loading message
            container.appendChild(modelViewerElement);
        } else {
            container.innerHTML = '<div style="color:#fff; padding:12px; text-align:center;">3D Model not available.</div>';
        }
    };

    if (modelPaths.length > 0) {
        loadModel(modelPaths[0]);
    }

    const galleryWrapper = this.text.querySelector('.project-related-images');
    if (galleryWrapper) {
        galleryWrapper.addEventListener('click', (ev) => {
            const target = ev.target;
            const modelThumb = target.closest('[data-model-path]');
            const imgThumb = target.closest('img');

            if (modelThumb) {
                const modelToLoad = modelThumb.getAttribute('data-model-path');
                loadModel(modelToLoad);
            } else if (imgThumb) {
                const container = document.getElementById(modelContainerId);
                if(container) {
                    container.innerHTML = `<img src="${imgThumb.src}" alt="preview" style="width:100%; height:480px; object-fit:contain; border-radius:6px;">`;
                }
            }
        });
    }

    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
    this.text.innerHTML = ''; // Clear content to stop any background processes like model-viewer
  }
};

document.addEventListener('DOMContentLoaded', () => {
  try {
    projectModal.init();
  } catch (e) {
    console.warn('Could not initialize project modal', e);
  }
});