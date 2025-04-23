$(function(){
    function questChanged() {
        const text = document.getElementById('que-text').value;
        document.getElementById('cur-char-cnt').textContent = text.length;
        var btn = document.getElementById("submit-button");
        if (text.length > 300) {
            btn.disabled = true;
            btn.style.opacity = 0.4;
        } else {
            btn.disabled = false;
            btn.style.opacity = 1;
        }
    }
    $('#que-text,#nickname').on('compositionend', questChanged);
    $('#que-text,#nickname').on('input', questChanged);
    $('#que-text,#nickname').on('keyup', questChanged);
});

async function submitQuestion() {
    showResult = (type, message) => {
        const resultDiv = document.getElementById('result');
        resultDiv.className = type;
        resultDiv.textContent = message;
    };
    extractTextFromHTML = (html) => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const errorContainers = [
                doc.querySelector('.error-page'),
                doc.querySelector('.content'),
                doc.body
            ];
            const container = errorContainers.find(el => el !== null);
            container.querySelectorAll('script, style, link, meta, title, button, a').forEach(el => el.remove());
            let text = container.textContent || container.innerText;
            return text.replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '').trim();
        } catch (e) { return "未知错误"; }
    };
    var btn = document.getElementById("submit-button");
    const submit_button = document.getElementById('submit-button');
    submit_button.disabled = true;
    btn.style.opacity = 0.4;

    const resultDiv = document.getElementById('result');
    resultDiv.className = '';
    resultDiv.textContent = '正在提交中...请稍后';
    const data = {
        nickname: document.getElementById('nickname').value.trim(),
        que_text: document.getElementById('que-text').value.trim()
    };
    if (!data.nickname) {
        showResult('error', '提交失败: 昵称不能为空');
        return;
    }
    if (!data.que_text) {
        showResult('error', '提交失败: 内容不能为空');
        return;
    }
    try {
        const response = await fetch('/api/x/submit_ask/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': m_csrf_token
            },
            body: JSON.stringify(data)
        });
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`${extractTextFromHTML(text)}`);
        }
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || '未知错误');
        }
        result_text = `提交成功(${result.id}): ${result.json}`;
        showResult('success', `${result_text.slice(0, 100)}...`);
    } catch (error) {
        result_text = `提交失败: ${error.message}`;
        showResult('error', `${result_text.slice(0, 100)}...`);
        console.error(error);
    }
}
