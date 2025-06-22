/**
 * CharacterProfilePlus Extension for SillyTavern
 */

import { ProfileEnhancer } from './profile-enhancer.js';
import { ChatHistoryManager } from './chat-history-manager.js';

(function initExtension() {
    // SillyTavern 컨텍스트를 가져옵니다.
    const context = SillyTavern.getContext();

    // DOM이 완전히 로드된 후 UI 초기화를 진행합니다.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }

    function initUI() {
        // 각 모듈을 초기화합니다.
        const profileEnhancer = new ProfileEnhancer(context);
        const chatHistoryManager = new ChatHistoryManager(context);

        // 캐릭터가 변경될 때마다 UI를 새로고침하기 위한 이벤트 리스너
        // (SillyTavern의 실제 이벤트 시스템에 따라 수정이 필요할 수 있습니다.)
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'char_id') {
                    profileEnhancer.update();
                    chatHistoryManager.update();
                }
            }
        });

        const characterProfile = document.getElementById('character-profile');
        if (characterProfile) {
            observer.observe(characterProfile, { attributes: true });
        }

        // 초기 실행
        profileEnhancer.update();
        chatHistoryManager.update();
    }
})();