chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'showNotification') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: '서비스요청',
            message: `새로운 SR이 등록되었습니다.\n${msg.message}`,
        });
    }
});

async function ensureOffscreenDocument() {
    const exists = await chrome.offscreen.hasDocument();
    if (!exists) {
        await chrome.offscreen.createDocument({
            url: 'offscreen.html',
            reasons: ['DOM_PARSER'],
            justification: 'SR 변경 감지 및 DOM 파싱',
        });
    }
}

ensureOffscreenDocument();
