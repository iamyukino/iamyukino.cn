function escapeHTML(text, b_kmj) {
    const kmjtext = text.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;', '<': '&lt;',
        '>': '&gt;',  '"': '&quot;',
        "'": '&#39;'
      }[m]));
    return b_kmj ? kmjtext.replace(/&amp;#(\d{2});/g, (_, numStr) => {
        const num = parseInt(numStr, 10);
        if (num >= 10 && num <= 34) {
            return `<img src="/statics/as-content/ask/images/kmj/${num}.jpg" alt="&amp;#${num};" class="kmj-img" />`;
        }
        return `&amp;#${numStr};`;
    }) : kmjtext;
};

// Back to top
$(() => {
    var curPos = 0;
    // Show or hide the sticky footer button
    $(window).off('load.ldBk2top')
    .on('load.ldBk2top', function(event) {
        if($(this).scrollTop() > 300){
            $('.back-to-top').fadeIn(200)
            $('.back-to-hpg').fadeIn(200)
        } else{
            $('.back-to-hpg').fadeOut(200)
            $('.back-to-top').fadeOut(200)
        }
    });
    $(window).off('scroll.btnBk2top')
    .on('scroll.btnBk2top', function(event) {
        if($(this).scrollTop() > 300){
            $('.back-to-top').fadeIn(200)
            $('.back-to-hpg').fadeIn(200)
        } else{
            $('.back-to-hpg').fadeOut(200)
            $('.back-to-top').fadeOut(200)
        }
    });
    
    // Animate the scroll to top
    $('.back-to-top').off('click.aniBk2top')
    .on('click.aniBk2top', function(event) {
        event.preventDefault();
        curPos = $(window).scrollTop();
        $('html, body').animate({
            scrollTop: 0,
        }, {
            duration: 1500,
            easing: 'easeInOutExpo',
            step: function(){
                const cpos = $(window).scrollTop();
                if (cpos <= curPos) { curPos = cpos; return ; }
                $('html, body').stop();
            }
        });
    });
});

function questChanged() {
    const text = document.getElementById('que-text').value;
    document.getElementById('cur-char-cnt').textContent = text.length;

    const previewPanel = document.querySelector('.view-panel');
    const newtext = escapeHTML(text, true);
    previewPanel.innerHTML = newtext;

    var btn = document.getElementById("submit-button");
    if (text.length > 300) {
        btn.disabled = true;
        btn.style.opacity = 0.4;
    } else {
        btn.disabled = false;
        btn.style.opacity = 1;
    }
}
$('#que-text,#nickname').on('input', questChanged);
// $('#que-text,#nickname').on('compositionend', questChanged);
// $('#que-text,#nickname').on('keyup', questChanged);

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
        // result_text = `提交成功(${result.id}): ${result.json}`;
        result_text = `提交成功(${result.id}): 问题被回复前仅自己可见/可撤回`;
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
                const safeQueText = escapeHTML(ask.que_text, true);
                const safeNickname = escapeHTML(ask.nickname, false);
                const safeAnsText = ask.ans_text ? escapeHTML(ask.ans_text, true) : '';
                const answerDiv = ask.ans_text ? 
                    `<div class="answer"><p>${safeAnsText}</p></div>` : 
                    '<div class="answer" style="display:none;"></div>';
                const deleteBtn = ask.can_delete ? 
                `<button class="delete-btn" data-id="${ask.id}">撤回</button>` : '';
                const questionHtml = ` 
                    <div class="question-wrapper" tabindex="0">
                        <a class="va">
                            <div class="question">
                                <div class="header">
                                    ${deleteBtn}
                                    <span class="badge">${ask.que_time}</span>
                                    <span class="author">${safeNickname}</span>
                                </div>
                                <p>${safeQueText}</p>
                                ${answerDiv}
                            </div>
                        </a>
                    </div>`;
                container.append(questionHtml);
            });
            const paginationHtml = `
                <div class="next-prev-page">
                    <div tabindex="0">
                        ${response.current_page > 1 ? 
                            `<a class="va" onclick="loadQuestions(${response.current_page - 1})">上一页</a>` : 
                            '<a class="va" class="disabled">到头啦</a>'}
                    </div>
                    <span class="page-indicator">
                        第 ${response.current_page} / ${response.total_pages} 页
                    </span>
                    <div tabindex="0">
                        ${response.current_page < response.total_pages ? 
                            `<a class="va" onclick="loadQuestions(${response.current_page + 1})">下一页</a>` : 
                            '<a class="va" class="disabled">到尾啦</a>'}
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
            $(document).one('click.rmStateDeleteBtn', function(e) {
                if (currentConfirmingBtn && !$(e.target).closest('.delete-btn').length) {
                    currentConfirmingBtn.text('撤回').removeClass('confirming');
                    currentConfirmingBtn = null;
                }
            });
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
                    }, 1200);
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

$(()=>{
    const textarea = document.getElementById('que-text');
    const kmjBtn = document.querySelector('.kmj-btn');
    const viewBtn = document.querySelector('.view-btn');
    const kmjPanel = document.querySelector('.kmj-panel');
    const viewPanel = document.querySelector('.view-panel');

    const panelContent = document.createDocumentFragment();
    for (let i = 10; i <= 34; i++) {
        const wrapper = document.createElement('i');
        wrapper.className = 'kmj-item';
        wrapper.title = `&#${i};`;
        const kmj = document.createElement('img');
        kmj.src = `/statics/as-content/ask/images/kmj/${i}.jpg`;
        kmj.dataset.index = i;
        kmj.alt = `&#${i};`;
        wrapper.appendChild(kmj);
        kmj.addEventListener('click', insertkmj);
        panelContent.appendChild(wrapper);
    }
    kmjPanel.appendChild(panelContent);

    let whichPanelOpen = 0;
    kmjBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (whichPanelOpen === 2)
            viewPanel.classList.toggle('show', false);
        
        if (whichPanelOpen === 1) whichPanelOpen = 0;
        else whichPanelOpen = 1;
        kmjPanel.classList.toggle('show', whichPanelOpen === 1);
    });
    viewBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (whichPanelOpen === 1)
            kmjPanel.classList.toggle('show', false);

        if (whichPanelOpen === 2) whichPanelOpen = 0;
        else whichPanelOpen = 2;
        viewPanel.classList.toggle('show', whichPanelOpen === 2);
    });

    function insertkmj(e) {
        const index = e.target.dataset.index;
        const code = `&#${index};`;
        insertText(code);
    }
    function insertText(text) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + 
                        text + textarea.value.substring(end);
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        questChanged();
    }
});