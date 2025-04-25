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
        is_too_long = result_text.length > 100 ? '...' : '';
        showResult('success', `${result_text.slice(0, 100)}${is_too_long}`);
        loadQuestions(1);
    } catch (error) {
        result_text = `提交失败: ${error.message}`;
        is_too_long = result_text.length > 100 ? '...' : '';
        showResult('error', `${result_text.slice(0, 100)}${is_too_long}`);
        console.error(error);
    }
}

function loadQuestions(page) {
    $.ajax({
        url: '/api/x/get_asks/',
        type: 'GET',
        data: { page: page },
        headers: { 'X-CSRFToken': m_csrf_token },
        success: function(response) {
            const container = $('.question-list');
            container.empty();
            response.asks.forEach(ask => {
                const answerDiv = ask.ans_text ? 
                    `<div class="answer"><p>${ask.ans_text}</p></div>` : 
                    '<div class="answer" style="display:none;"></div>';
                const deleteBtn = ask.can_delete ? 
                `<button class="delete-btn" data-id="${ask.id}">撤回</button>` : '';
                const questionHtml = ` 
                    <div class="question-wrapper">
                        <a>
                            <div class="question">
                                <div class="header">
                                    ${deleteBtn}
                                    <span class="badge">${ask.que_time}</span>
                                    <span class="author">${ask.nickname}</span>
                                </div>
                                <p>${ask.que_text}</p>
                                ${answerDiv}
                            </div>
                        </a>
                    </div>`;
                container.append(questionHtml);
            });
            const paginationHtml = `
                <div class="next-prev-page">
                    <div>
                        ${response.current_page > 1 ? 
                            `<a onclick="loadQuestions(${response.current_page - 1})">上一页</a>` : 
                            '<a class="disabled">到头啦</a>'}
                    </div>
                    <span class="page-indicator">
                        第 ${response.current_page} / ${response.total_pages} 页
                    </span>
                    <div>
                        ${response.current_page < response.total_pages ? 
                            `<a onclick="loadQuestions(${response.current_page + 1})">下一页</a>` : 
                            '<a class="disabled">到尾啦</a>'}
                    </div>
                </div>`;
            container.append(paginationHtml);
        },
        error: function(xhr) {
            console.error('Error:', xhr.statusText);
        }
    });
}
$(document).ready(function() {
    loadQuestions(1);
});

$(() => {
    let currentConfirmingBtn = null;
    $(document).on('click', '.delete-btn', function() {
        const btn = $(this);
        const askId = btn.data('id');
        
        if(currentConfirmingBtn && currentConfirmingBtn[0] !== btn[0]) {
            currentConfirmingBtn.text('撤回').removeClass('confirming');
        }
        if(btn.text() === '撤回') {
            btn.text('确认撤回？').addClass('confirming');
            currentConfirmingBtn = btn;
        } else if(btn.text() === '确认撤回？') {
            btn.prop('disabled', true).text('处理中...');
            $.ajax({
                url: `/api/x/delete_ask/${askId}/`,
                method: 'DELETE',
                headers: { 'X-CSRFToken': m_csrf_token },
                success: () => {
                    btn.text('撤回成功').prop('disabled', false).removeClass('confirming');
                    btn.css('background', '#18c440');
                    setTimeout(() => {
                        loadQuestions(1);
                    }, 800);
                },
                error: (xhr) => {
                    btn.text('撤回失败').prop('disabled', false).removeClass('confirming');
                    setTimeout(() => {
                        btn.text('撤回').css('opacity', 1);
                    }, 1500);
                    btn.css('opacity', 0.5);
                    let count = 0;
                    const shake = setInterval(() => {
                        btn.css('transform', `translateX(${count++ % 2 ? 5 : -5}px)`);
                        if(count >= 6) {
                            clearInterval(shake);
                            btn.css('transform', '');
                        }
                    }, 50);
                },
                complete: () => {
                    currentConfirmingBtn = null;
                }
            });
        }
    });
});
