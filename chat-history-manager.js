/**
 * Manages the chat history tab within the character profile.
 */
import { TabManager } from './tab-manager.js';

export class ChatHistoryManager {
    constructor(context) {
        this.context = context;
        this.tabManager = new TabManager({
            containerSelector: '#character-profile',
            insertAfterSelector: '#char_info_block', // 탭 버튼이 위치할 기준점
            tabPrefix: 'char-profile-tab',
            activeTabStorageKey: 'char-profile-active-tab',
            defaultTab: 'profile',
            className: 'char-profile-tab',
            tabs: {
                profile: {
                    label: 'Profile',
                    icon: 'fa-solid fa-user',
                    contentSelectors: ['#char_img_container', '#char_info_block'] // 기존 프로필 컨텐츠
                },
                history: {
                    label: 'Chat History',
                    icon: 'fa-solid fa-comments',
                    contentSelectors: [] // 동적으로 컨텐츠 생성
                }
            },
            checkCondition: () => this.context.characterId,
            onTabSwitch: (tabId) => {
                if (tabId === 'history') {
                    this.renderChatHistory();
                }
            }
        });
    }

    update() {
        this.tabManager.refreshTabs();
    }

    async renderChatHistory() {
        const historyContainer = document.getElementById('char-profile-tab-content-history');
        if (!historyContainer) return;

        historyContainer.innerHTML = '<div class="spinner"></div>'; // 로딩 스피너

        // SillyTavern의 채팅 기록 API를 호출해야 합니다. (아래는 예시 코드)
        const chats = await this.getChatHistories(this.context.characterId);

        let html = `
            <div class="chat-history-controls">
                <button id="add-folder-btn"><i class="fa-solid fa-folder-plus"></i> Add Folder</button>
                <button id="delete-selected-btn" class="danger-button"><i class="fa-solid fa-trash"></i> Delete Selected</button>
            </div>
            <ul class="chat-history-list">
        `;

        // 폴더 및 채팅 렌더링 (폴더 구조는 별도 메타데이터 관리 필요)
        chats.forEach(chat => {
            html += `
                <li class="chat-history-item" data-chat-id="${chat.id}">
                    <input type="checkbox" class="chat-select-checkbox">
                    <i class="fa-solid fa-message-text"></i>
                    <span class="chat-name">${chat.name}</span>
                    <span class="chat-message-count">${chat.messageCount} msgs</span>
                </li>
            `;
        });

        html += '</ul>';
        historyContainer.innerHTML = html;

        this.bindHistoryEvents();
    }

    bindHistoryEvents() {
        document.getElementById('delete-selected-btn').addEventListener('click', () => {
            const selectedIds = [];
            document.querySelectorAll('.chat-select-checkbox:checked').forEach(cb => {
                selectedIds.push(cb.closest('.chat-history-item').dataset.chatId);
            });

            if (selectedIds.length > 0 && confirm(`Delete ${selectedIds.length} chat(s)?`)) {
                // SillyTavern 채팅 삭제 API 호출 (예시)
                console.log('Deleting chats:', selectedIds);
                // this.deleteChats(selectedIds).then(() => this.renderChatHistory());
            }
        });
    }

    // 이 함수들은 SillyTavern의 내부 API와 연동되어야 합니다.
    // 아래는 기능 구현을 위한 가상 함수입니다.
    async getChatHistories(characterId) {
        // 실제로는 fetch 등을 사용하여 서버에 요청해야 합니다.
        console.log(`Fetching chats for ${characterId}`);
        return [
            { id: 'chat1', name: 'First Adventure', messageCount: 120 },
            { id: 'chat2', name: 'A Long Discussion', messageCount: 450 },
            { id: 'chat3', name: 'Quick Test', messageCount: 15 }
        ];
    }
}