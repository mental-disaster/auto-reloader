chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'showNotification') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: '청렴포털 서비스요청',
            message: `새로운 SR이 등록되었습니다.\n${msg.message}`,
        });
    }
});

let creating = null;

async function ensureOffscreen() {
    const offscreenPath = 'offscreen.html';
    
    const url = chrome.runtime.getURL(offscreenPath);
    const ctx = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [url],
    });

    if (ctx.length) return;

    if (!creating) {
        creating = chrome.offscreen.createDocument({
            url: offscreenPath,
            reasons: ['DOM_PARSER'],
            justification: 'SR 변경 감지 및 DOM 파싱',
        }).finally(() => creating = null);
    }

    await creating;
}

ensureOffscreen();

chrome.alarms.create('ensure-offscreen', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((a) => {
    if (a.name !== 'ensure-offscreen') return;
    ensureOffscreen();
});
