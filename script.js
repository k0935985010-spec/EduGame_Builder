document.addEventListener('DOMContentLoaded', () => {
    // Subject Toggle Elements
    const mathRadio = document.getElementById('math');
    const chineseRadio = document.getElementById('chinese');
    const scienceRadio = document.getElementById('science');
    const socialRadio = document.getElementById('social');
    const englishRadio = document.getElementById('english');
    
    // Labels & Placeholders
    const conceptLabel = document.getElementById('concept-label');
    const conceptInput = document.getElementById('concept-input');
    const answerLabel = document.getElementById('answer-label');
    
    // Preview Elements
    const previewSubjectBadge = document.getElementById('preview-subject-badge');
    const previewBody = document.getElementById('preview-body');
    
    // New Elements
    const challengeTypeGroup = document.getElementById('challenge-type-group');
    const challengeType = document.getElementById('challenge-type');
    const challengeHint = document.getElementById('challenge-hint');
    const sectionCSubtitle = document.getElementById('section-c-subtitle');
    const wrong1Label = document.getElementById('wrong-1-label');
    const wrong2Label = document.getElementById('wrong-2-label');
    const wrong3Label = document.getElementById('wrong-3-label');

    // Form Inputs
    const storyInput = document.getElementById('story-input');
    const answerInput = document.getElementById('answer-input');
    const wrong1 = document.getElementById('wrong-1');
    const wrong2 = document.getElementById('wrong-2');
    const wrong3 = document.getElementById('wrong-3');
    
    // Preview Outputs
    const previewConcept = document.getElementById('preview-concept');
    const previewStory = document.getElementById('preview-story');
    const previewCorrect = document.getElementById('preview-correct');
    const previewWrong1 = document.getElementById('preview-wrong-1');
    const previewWrong2 = document.getElementById('preview-wrong-2');
    const previewWrong3 = document.getElementById('preview-wrong-3');

    // Submit & Other Buttons
    const submitBtn = document.getElementById('submit-btn');
    const readStoryBtn = document.getElementById('read-story-btn');

    // Setup Subject Toggle
    function updateSubjectUI() {
        challengeTypeGroup.style.display = 'none';
        if (challengeHint) challengeHint.style.display = 'none';
        
        if (mathRadio.checked) {
            conceptLabel.innerText = '核心觀念';
            conceptInput.placeholder = '例如：分數加法';
            answerLabel.innerText = '正確答案';
            
            sectionCSubtitle.innerText = '設計三個看起來很真實的錯誤選項！';
            wrong1Label.innerText = '陷阱選項 1';
            wrong1.placeholder = '錯誤選項 1';
            wrong2Label.innerText = '陷阱選項 2';
            wrong2.placeholder = '錯誤選項 2';
            wrong3Label.innerText = '陷阱選項 3';
            wrong3.placeholder = '錯誤選項 3';

            previewSubjectBadge.innerText = '📐 數學挑戰';
            previewSubjectBadge.style.background = 'var(--math-color)';
        } else if (chineseRadio.checked) {
            challengeTypeGroup.style.display = 'block';
            if (challengeHint) challengeHint.style.display = 'block';
            
            conceptLabel.innerText = '核心觀念';
            conceptInput.placeholder = '輸入你想考驗的內容';
            answerLabel.innerText = '正確答案';
            
            sectionCSubtitle.innerText = '設計三個看起來很真實的錯誤選項！';
            wrong1Label.innerText = '陷阱選項 1';
            wrong1.placeholder = '錯誤選項 1';
            wrong2Label.innerText = '陷阱選項 2';
            wrong2.placeholder = '錯誤選項 2';
            wrong3Label.innerText = '陷阱選項 3';
            wrong3.placeholder = '錯誤選項 3';

            updateChallengeUI(); // Sets the hint and badge text for chinese
            previewSubjectBadge.style.background = 'var(--chinese-color)';
        } else if (scienceRadio.checked) {
            conceptLabel.innerText = '實驗主題';
            conceptInput.placeholder = '例如：光合作用 / 磁力原理';
            answerLabel.innerText = '實驗結果 / 關鍵科學名詞';
            
            sectionCSubtitle.innerText = '設計三個容易混淆的實驗結果或假說！';
            wrong1Label.innerText = '錯誤假說 1';
            wrong1.placeholder = '錯誤假說/正確結果 1';
            wrong2Label.innerText = '錯誤假說 2';
            wrong2.placeholder = '錯誤假說/正確結果 2';
            wrong3Label.innerText = '錯誤假說 3';
            wrong3.placeholder = '錯誤假說/正確結果 3';

            previewSubjectBadge.innerText = '🧪 自然科學實驗室';
            previewSubjectBadge.style.background = 'var(--science-color)';
        } else if (socialRadio.checked) {
            conceptLabel.innerText = '調查目標';
            conceptInput.placeholder = '例如：台灣地形 / 大航海時代';
            answerLabel.innerText = '歷史真相 / 正確地名';
            
            sectionCSubtitle.innerText = '提供三個看起來煞有其事的干擾線索！';
            wrong1Label.innerText = '干擾線索 1';
            wrong1.placeholder = '干擾線索 1';
            wrong2Label.innerText = '干擾線索 2';
            wrong2.placeholder = '干擾線索 2';
            wrong3Label.innerText = '干擾線索 3';
            wrong3.placeholder = '干擾線索 3';

            previewSubjectBadge.innerText = '🗺️ 社會歷史調查局';
            previewSubjectBadge.style.background = 'var(--social-color)';
        } else if (englishRadio.checked) {
            conceptLabel.innerText = '對話情境 / 單字句型';
            conceptInput.placeholder = '例如：At the restaurant / How much...';
            answerLabel.innerText = '正確回答 / 對應單字';
            
            sectionCSubtitle.innerText = '準備三個看似合理的錯誤回答！';
            wrong1Label.innerText = '錯誤回答 1';
            wrong1.placeholder = '錯誤回答 1';
            wrong2Label.innerText = '錯誤回答 2';
            wrong2.placeholder = '錯誤回答 2';
            wrong3Label.innerText = '錯誤回答 3';
            wrong3.placeholder = '錯誤回答 3';

            previewSubjectBadge.innerText = '🗣️ 英語情境對話';
            previewSubjectBadge.style.background = 'var(--english-color)';
        }
        
        previewBody.style.borderTop = 'none';
        updatePreview();
    }

    function updateChallengeUI() {
        if (!challengeHint) return;
        const type = challengeType.value;
        if (type === 'typo') {
            challengeHint.innerText = '💡 提示：請輸入你的目標生字/成語，並在情境故事中隱藏一個字形相似的錯字。';
            previewSubjectBadge.innerText = '🔍 字形幻術（國語文）';
        } else if (type === 'polyphonic') {
            challengeHint.innerText = '💡 提示：請輸入你的目標多音字與陷阱讀音。';
            previewSubjectBadge.innerText = '🎧 聲波陷阱（國語文）';
        } else if (type === 'context') {
            challengeHint.innerText = '💡 提示：請提供兩個意思相近但用法不同的詞彙作為陷阱，並將目標挖空讓挑戰者填寫！';
            previewSubjectBadge.innerText = '🧩 語境辨析（國語文）';
        }
    }

    mathRadio.addEventListener('change', updateSubjectUI);
    chineseRadio.addEventListener('change', updateSubjectUI);
    scienceRadio.addEventListener('change', updateSubjectUI);
    socialRadio.addEventListener('change', updateSubjectUI);
    englishRadio.addEventListener('change', updateSubjectUI);
    challengeType.addEventListener('change', () => {
        updateChallengeUI();
        updatePreview();
    });

    // Setup Live Preview Update
    function updatePreview() {
        const conceptVal = conceptInput.value.trim();
        if (conceptVal) {
            previewConcept.innerText = `🎯 目標：${conceptVal}`;
        } else {
            previewConcept.innerText = '🎯 目標：等待輸入...';
        }

        const storyVal = storyInput.value.trim();
        previewStory.innerText = storyVal ? storyVal : '故事內容將顯示在這裡...';
        
        previewCorrect.innerText = answerInput.value.trim() || '(正確答案)';
        previewWrong1.innerText = wrong1.value.trim() || '(陷阱 1)';
        previewWrong2.innerText = wrong2.value.trim() || '(陷阱 2)';
        previewWrong3.innerText = wrong3.value.trim() || '(陷阱 3)';
    }

    // Add event listeners to all inputs to trigger preview update immediately
    const allInputs = [conceptInput, storyInput, answerInput, wrong1, wrong2, wrong3];
    allInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Handle Read Story
    readStoryBtn.addEventListener('click', () => {
        const text = storyInput.value.trim();
        if (!text) {
            alert('⚠️ 請先輸入故事內容喔！');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = englishRadio.checked ? 'en-US' : 'zh-TW';
        
        window.speechSynthesis.speak(utterance);
    });

    // Handle Submit
    submitBtn.addEventListener('click', () => {
        // Gather data
        let subject = 'Math';
        if (chineseRadio.checked) subject = 'Chinese';
        else if (scienceRadio.checked) subject = 'Science';
        else if (socialRadio.checked) subject = 'Social';
        else if (englishRadio.checked) subject = 'English';

        let concept = conceptInput.value.trim();
        const story = storyInput.value.trim();
        const correctAnswer = answerInput.value.trim();
        const wrongOptions = [
            wrong1.value.trim(),
            wrong2.value.trim(),
            wrong3.value.trim()
        ].filter(opt => opt !== '');

        if (chineseRadio.checked) {
            const typeStr = challengeType.options[challengeType.selectedIndex].text;
            concept = `[${typeStr}] ${concept}`;
        }

        // Basic validation
        if (!conceptInput.value.trim() || !story || !correctAnswer) {
            alert('⚠️ 關主提示：請至少填寫「觀念」、「故事」和「正確答案」喔！');
            return;
        }

        if (wrongOptions.length === 0) {
            alert('⚠️ 關主提示：請至少設計一個「陷阱選項」來考驗同學！');
            return;
        }

        const questionData = {
            subject: subject,
            concept: concept,
            story: story,
            correctAnswer: correctAnswer,
            wrong_options: wrongOptions,
            createdAt: new Date().toISOString()
        };
        if (chineseRadio.checked) {
            questionData.challengeType = challengeType.value;
        }
        console.log('Sending JSON:', questionData);

        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = '傳送中...';
        submitBtn.disabled = true;

        fetch('https://script.google.com/macros/s/AKfycbw-xJUi8i1pc4qi5pjCR7N2zUtuo8jMPS034LOnNEMJuBpotVEeE7Y4bHE-juPCwiiaVQ/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(questionData)
        })
        .then(response => response.json())
        .then((data) => {
            if (data.result === 'success') {
                alert(data.message);
                
                // 清空所有輸入欄位
                conceptInput.value = '';
                storyInput.value = '';
                answerInput.value = '';
                wrong1.value = '';
                wrong2.value = '';
                wrong3.value = '';
                
                // 讓畫面恢復初始狀態
                updatePreview();
            } else if (data.result === 'revise') {
                alert(`⚠️ AI 關主退回：\n\n${data.message}`);
                // 保留輸入內容讓學生可以直接修改
            } else {
                alert(data.message || '發生未知結果，請通知老師！');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('傳送失敗，請稍後再試！');
        })
        .finally(() => {
            // 把按鈕文字改回來並啟用
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });

    });

    // Initialize UI on load
    updateSubjectUI();
});
