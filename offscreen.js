const targetServer = 'http://masked_url/'

function check() {
    // XHR 설정
    const xhr = new XMLHttpRequest();
    xhr.open(
        'POST',
        targetServer,
        true
    );
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=EUC-KR');
    xhr.onload = () => {
        if (xhr.status === 200) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xhr.responseText, 'text/html');
            const incoming = doc.getElementById('txt').innerHTML;

            // 기존 총 데이터 수
            const total = Number(document.querySelector('#txt .data_tbl tbody tr td')?.textContent?.trim());
            // 서버에서 받은 데이터 수
            const newCount = Number(doc.querySelector('#txt .data_tbl tbody tr td')?.textContent?.trim());

            if (total && total < newCount) {
                // 기존 데이터 목록 추출
                const existingValue = Array.from(document.querySelectorAll('#txt .bsn_list tbody tr'))
                    .map(tr => tr.querySelector('td')?.textContent?.trim())
                    .filter(Boolean);
                const existingSet = new Set(existingValue);
                // 서버에서 받은 데이터 목록 중 새로운 데이터만 필터링
                const newRows = Array.from(doc.querySelectorAll('#txt .bsn_list tbody tr'))
                    .map(tr => {
                        const tds = tr.querySelectorAll('td');
                        return {
                            id: tds[0]?.textContent?.trim(),
                            title: tds[3]?.textContent?.trim(),
                        }
                    })
                    .filter(row => row.id && row.title && !existingSet.has(row.id));
                // 신규 SR 메시지 발송
                chrome.runtime.sendMessage({
                    type: 'showNotification',
                    message: newRows.map(v => v.title).join(', '),
                });
            }

            // 서버에서 받아온 데이터로 교체
            document.getElementById('txt').innerHTML = incoming;
        }
    };
    xhr.onerror = () => {
        console.error("XHR 오류 발생");
    };
    xhr.send();
}

// ms마다 확인 (5000ms = 5s)
// 중복 타이머 방지 (offscreen이 중복 생성되어도 1개만 돌도록)
if (!globalThis.__SR_POLLING__) {
    globalThis.__SR_POLLING__ = setInterval(check, 5000);
}
