/**
 * 파일 업로드 모달 기능
 */
class FileUploadModal {
  constructor(modalElement) {
    this.modal = modalElement;
    this.uploadZone = this.modal.querySelector('.file-upload-zone');
    this.fileInput = this.modal.querySelector('#fileUploadInput');
    this.fileList = this.modal.querySelector('#uploadedFileList');
    this.filterBtns = this.modal.querySelectorAll('.modal-filter__btn');
    this.registerBtn = this.modal.querySelector('.modal-actions .btn');
    this.uploadedFiles = [];
    
    this.init();
  }
  
  init() {
    // 필터 버튼 클릭
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        const value = btn.getAttribute('data-value');
        
        // 같은 카테고리의 다른 버튼 비활성화
        this.modal.querySelectorAll(`[data-category="${category}"]`).forEach(b => {
          b.classList.remove('active');
        });
        
        // 클릭한 버튼 활성화
        btn.classList.add('active');
      });
    });
    
    // 파일 입력 변경
    if (this.fileInput) {
      this.fileInput.addEventListener('change', (e) => {
        this.handleFiles(e.target.files);
      });
    }
    
    // 드래그 앤 드롭
    if (this.uploadZone) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        this.uploadZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      
      this.uploadZone.addEventListener('dragover', () => {
        this.uploadZone.style.borderColor = '#2196F3';
        this.uploadZone.style.background = '#f0f7ff';
      });
      
      this.uploadZone.addEventListener('dragleave', () => {
        this.uploadZone.style.borderColor = '#d0d7de';
        this.uploadZone.style.background = '#fff';
      });
      
      this.uploadZone.addEventListener('drop', (e) => {
        this.uploadZone.style.borderColor = '#d0d7de';
        this.uploadZone.style.background = '#fff';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          this.handleFiles(files);
        }
      });
      
      // 클릭으로 파일 선택
      this.uploadZone.addEventListener('click', () => {
        if (this.fileInput) {
          this.fileInput.click();
        }
      });
    }
    
    // 등록 버튼 클릭
    if (this.registerBtn) {
      this.registerBtn.addEventListener('click', () => {
        this.handleRegister();
      });
    }
  }
  
  handleFiles(files) {
    Array.from(files).forEach(file => {
      // 파일 크기 체크 (100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert(`${file.name} 파일 크기가 100MB를 초과합니다.`);
        return;
      }
      
      // ZIP 파일 체크
      if (!file.name.toLowerCase().endsWith('.zip')) {
        alert(`${file.name} 파일은 ZIP 형식만 지원됩니다.`);
        return;
      }
      
      // 파일 추가
      this.uploadedFiles.push(file);
      this.addFileToList(file);
    });
  }
  
  addFileToList(file) {
    const listItem = document.createElement('li');
    listItem.className = 'data-list__item';
    
    const fileSize = (file.size / (1024 * 1024)).toFixed(1);
    
    listItem.innerHTML = `
      <div class="data-list__content">
        <i class="ico ico-file"></i>
        <span class="data-list__name">${file.name}</span>
        <div class="data-list__meta">
          <span class="file-tag">ZIP</span>
          <span class="file-size">${fileSize}MB</span>
        </div>
      </div>
      <button class="data-list__delete" type="button" data-file-name="${file.name}">
        <i class="ico ico-trash"></i>
      </button>
    `;
    
    // 삭제 버튼 이벤트
    const deleteBtn = listItem.querySelector('.data-list__delete');
    deleteBtn.addEventListener('click', () => {
      const fileName = deleteBtn.getAttribute('data-file-name');
      this.removeFile(fileName);
      listItem.remove();
    });
    
    this.fileList.appendChild(listItem);
  }
  
  removeFile(fileName) {
    this.uploadedFiles = this.uploadedFiles.filter(file => file.name !== fileName);
  }
  
  handleRegister() {
    if (this.uploadedFiles.length === 0) {
      alert('업로드할 파일을 선택해주세요.');
      return;
    }
    
    // 선택된 필터 값 가져오기
    const selectedSatellite = this.modal.querySelector('[data-category="satellite"].active')?.getAttribute('data-value');
    const selectedLocation = this.modal.querySelector('[data-category="location"].active')?.getAttribute('data-value');
    
    console.log('등록:', {
      files: this.uploadedFiles,
      satellite: selectedSatellite,
      location: selectedLocation
    });
    
    // TODO: 실제 업로드 로직 구현
    alert(`${this.uploadedFiles.length}개의 파일이 등록되었습니다.`);
    
    // 모달 닫기
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // 초기화
    this.uploadedFiles = [];
    this.fileList.innerHTML = '';
    if (this.fileInput) {
      this.fileInput.value = '';
    }
  }
}

// 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
  const fileUploadModal = document.getElementById('fileUploadModal');
  if (fileUploadModal) {
    new FileUploadModal(fileUploadModal);
  }
});

export default FileUploadModal;
