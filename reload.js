function listReload() {
    const formElement = document.getElementById("pageForm");
    if (formElement !== null) {
        const formData = new FormData(formElement);

        const params = [];
        for (let [key, value] of formData.entries()) {
            const eucKrValue = encodeURIComponent(value);
            params.push(`${encodeURIComponent(key)}=${eucKrValue}`);
        }
    
        const xhr = new XMLHttpRequest();
        xhr.open(formElement.method, formElement.action, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=EUC-KR');
        xhr.onload = () => {
            if (xhr.status === 200) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(xhr.responseText, 'text/html');
                const incoming = doc.getElementById('txt').innerHTML;

                const total = Number(document.querySelector('#txt .data_tbl tbody tr td').textContent?.trim());
                const newCount = Number(doc.querySelector('#txt .data_tbl tbody tr td').textContent?.trim());

                if (total < newCount) {
                    const existingValue = Array.from(document.querySelectorAll('#txt .bsn_list tbody tr'))
                        .map(tr => tr.querySelector('td')?.textContent?.trim())
                        .filter(Boolean);
                    const existingSet = new Set(existingValue);
                    const incomingRows = Array.from(doc.querySelectorAll('#txt .bsn_list tbody tr'))
                        .map(tr => {
                            const tds = tr.querySelectorAll('td');
                            return {
                                id: tds[0]?.textContent?.trim(),
                                title: tds[3]?.textContent?.trim(),
                            }
                        })
                        .filter(row => row.id && row.title);
                    const newOnly = incomingRows.filter(row => !existingSet.has(row.id));
                    chrome.runtime.sendMessage({
                        type: 'showNotification',
                        message: newOnly.map(v => v.title).join(', '),
                    });
                }

                document.getElementById('txt').innerHTML = incoming;
            } else {
                location.reload();
            }
        }
        xhr.onerror = () => {
            location.reload();
        }
        xhr.send(params.join('&'));
    }
}

let reloader = setInterval(listReload, 10000);
