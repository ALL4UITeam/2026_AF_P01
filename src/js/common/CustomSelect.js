/**
 * 커스텀 Select 드롭다운 컴포넌트
 * 네이티브 select를 커스텀 드롭다운으로 변환
 */
class CustomSelect {
  constructor(selectElement) {
    this.select = selectElement;
    this.options = Array.from(this.select.options);
    this.selectedIndex = this.select.selectedIndex;
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    // 원본 select 숨기기
    this.select.style.display = 'none';
    
    // 커스텀 드롭다운 생성
    this.createCustomSelect();
    
    // 이벤트 리스너
    this.setupEvents();
  }
  
  createCustomSelect() {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';
    
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'custom-select__button';
    button.textContent = this.select.options[this.select.selectedIndex]?.text || '';
    
    const dropdown = document.createElement('div');
    dropdown.className = 'custom-select__dropdown';
    
    this.options.forEach((option, index) => {
      const item = document.createElement('div');
      item.className = 'custom-select__option';
      if (index === this.selectedIndex) {
        item.classList.add('is-selected');
      }
      item.textContent = option.text;
      item.dataset.value = option.value;
      item.dataset.index = index;
      
      item.addEventListener('mouseenter', () => {
        // 호버 시 선택 효과
        this.dropdown.querySelectorAll('.custom-select__option').forEach(opt => {
          if (opt !== item && !opt.classList.contains('is-selected')) {
            opt.style.background = '#fff';
            opt.style.color = '#333';
          }
        });
        if (!item.classList.contains('is-selected')) {
          item.style.background = '#2196F3';
          item.style.color = '#fff';
        }
      });
      
      item.addEventListener('click', () => {
        this.selectOption(index);
      });
      
      dropdown.appendChild(item);
    });
    
    wrapper.appendChild(button);
    wrapper.appendChild(dropdown);
    
    this.select.parentNode.insertBefore(wrapper, this.select);
    this.wrapper = wrapper;
    this.button = button;
    this.dropdown = dropdown;
  }
  
  setupEvents() {
    // 버튼 클릭
    this.button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
    
    // 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (!this.wrapper.contains(e.target)) {
        this.close();
      }
    });
    
    // 원본 select 변경 감지
    this.select.addEventListener('change', () => {
      this.updateButton();
    });
  }
  
  toggle() {
    this.isOpen = !this.isOpen;
    this.wrapper.classList.toggle('is-open', this.isOpen);
  }
  
  close() {
    this.isOpen = false;
    this.wrapper.classList.remove('is-open');
  }
  
  selectOption(index) {
    this.select.selectedIndex = index;
    this.selectedIndex = index;
    
    // change 이벤트 트리거
    const event = new Event('change', { bubbles: true });
    this.select.dispatchEvent(event);
    
    this.updateButton();
    this.updateOptions();
    this.close();
  }
  
  updateButton() {
    this.button.textContent = this.select.options[this.select.selectedIndex]?.text || '';
  }
  
  updateOptions() {
    this.dropdown.querySelectorAll('.custom-select__option').forEach((item, index) => {
      if (index === this.select.selectedIndex) {
        item.classList.add('is-selected');
      } else {
        item.classList.remove('is-selected');
      }
    });
  }
}

// 자동 초기화 - 모든 select에 적용 (제외: data-no-custom-select, .form-tbl--edm-detail 내부)
// .form-tbl--edm-detail 내부 select = 테이블용 네이티브 select (일반 폼 custom-select와 별도)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('select:not([data-no-custom-select])').forEach(select => {
    if (select.closest('.custom-select')) return;
    if (select.closest('.form-tbl--edm-detail')) return;
    new CustomSelect(select);
  });
});

export default CustomSelect;
