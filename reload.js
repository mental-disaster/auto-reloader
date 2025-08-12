function listReload() {
    const pageFormElement = document.getElementById("pageForm");
    // 데이터 테이블이 없는 화면에서는 화면을 업데이트 하지 않음
    if (pageFormElement && document.querySelector('#txt .data_tbl')) {
        const formData = new FormData(pageFormElement);

        const params = [];
        for (let [key, value] of formData.entries()) {
            const eucKrValue = encodeURIComponent(value);
            params.push(`${encodeURIComponent(key)}=${eucKrValue}`);
        }
    
        // xhr 설정
        const xhr = new XMLHttpRequest();
        xhr.open(pageFormElement.method, pageFormElement.action, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=EUC-KR');
        xhr.onload = () => {
            if (xhr.status === 200) {
                // form을 제외한 데이터 영역 새로운 데이터로 교체
                const parser = new DOMParser();
                const doc = parser.parseFromString(xhr.responseText, 'text/html');
                const summary = doc.querySelector('#txt .data_tbl').innerHTML;
                const boardInfo = doc.querySelector('#txt .board_infoTop').innerHTML;
                const table = doc.querySelector('#txt .bsn_list tbody').innerHTML;
                const pagination = doc.querySelector('#txt .b_paging').innerHTML;

                document.querySelector('#txt .data_tbl').innerHTML = summary;
                document.querySelector('#txt .board_infoTop').innerHTML = boardInfo;
                document.querySelector('#txt .bsn_list tbody').innerHTML = table;
                document.querySelector('#txt .b_paging').innerHTML = pagination;
            }
        }
        xhr.onerror = () => {
            console.error('화면 새로고침 중 오류가 발생했습니다.');
        }
        xhr.send(params.join('&'));
    }
}

setInterval(listReload, 5000);
