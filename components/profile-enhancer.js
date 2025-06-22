/**
 *  Manages enhancements to the character profile section.
 */
export class ProfileEnhancer {
    constructor(context) {
        this.context = context;
        this.charImg = document.getElementById('char_img');
        this.charInfoBlock = document.getElementById('char_info_block');
    }

    update() {
        if (!this.charImg || !this.charInfoBlock) return;

        this.addHeaderImage();
        this.addBio();
        this.addImageSizeSlider();
    }

    addHeaderImage() {
        // 기존 헤더 제거
        const existingHeader = document.getElementById('cpp-header-image');
        if (existingHeader) existingHeader.remove();

        // 캐릭터 데이터에서 헤더 이미지 URL 가져오기 (캐릭터 노트 등 활용)
        const headerUrl = this.context.character.getData('header_image_url'); // 이 부분은 SillyTavern 데이터 구조에 따라 달라질 수 있습니다.
        if (!headerUrl) return;

        const header = document.createElement('img');
        header.id = 'cpp-header-image';
        header.src = headerUrl;
        this.charImg.parentElement.insertBefore(header, this.charImg);
    }

    addBio() {
        // 기존 바이오 제거
        const existingBio = document.getElementById('cpp-bio');
        if (existingBio) existingBio.remove();

        // 캐릭터 설명(description) 필드에서 바이오 텍스트 가져오기
        const bioText = this.context.character.description;
        if (!bioText) return;

        const bio = document.createElement('div');
        bio.id = 'cpp-bio';
        bio.innerHTML = bioText.replace(/\n/g, '<br>'); // 줄바꿈 처리
        this.charInfoBlock.appendChild(bio);
    }

    addImageSizeSlider() {
        // 기존 슬라이더 제거
        const existingSlider = document.getElementById('cpp-image-sizer-container');
        if (existingSlider) return; // 이미 있으면 다시 만들지 않음

        const container = document.createElement('div');
        container.id = 'cpp-image-sizer-container';

        const label = document.createElement('label');
        label.for = 'cpp-image-sizer';
        label.textContent = 'Image Size:';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = 'cpp-image-sizer';
        slider.min = '50';
        slider.max = '200';
        slider.value = '100'; // 기본값

        slider.addEventListener('input', (e) => {
            this.charImg.style.width = `${e.target.value}%`;
            this.charImg.style.height = 'auto';
        });

        container.append(label, slider);
        this.charImg.parentElement.appendChild(container);
    }
}