// 請填入GAS發布網址
const GAS_URL = "https://script.google.com/macros/s/AKfycbw-xJUi8i1pc4qi5pjCR7N2zUtuo8jMPS034LOnNEMJuBpotVEeE7Y4bHE-juPCwiiaVQ/exec";

// Global Game State
let currentQuestions = [];
let currentQuest = null;
let currentUniverse = 'theme-rpg';
let completedQuests = new Set();
let synth = window.speechSynthesis;

const subjectIcons = {
    '國語': '📜',
    '數學': '📐',
    '英語': '🔤',
    '自然': '🔬',
    '社會': '🗺️',
    '預設': '🎯'
};

// Mock data fallback if GAS_URL is not set or fetch fails
const MOCK_DATA = {
    settings: {
        universe: "theme-ninja", // change to theme-cyber or theme-rpg for testing
        status: "🟢"
    },
    questions: [
        {
            id: "q1",
            subject: "國語",
            concept: "形音義",
            difficulty: 3,
            story: "在古老的村落裡，村長留下了一段密文，只有解開密文才能找到寶藏的鑰匙。密文寫著：「這個字的讀音與『刃』相同，且帶有『心』部，代表忍耐。」",
            options: ["忍", "認", "仞", "任"]
        },
        {
            id: "q2",
            subject: "英語",
            concept: "Vocabulary",
            difficulty: 4,
            story: "The ancient dragon is sleeping. You need to find the correct magic word to wake it up without making it angry...",
            options: ["Awake", "Sleep", "Eat", "Run"]
        },
        {
            id: "q3",
            subject: "數學",
            concept: "分數加減",
            difficulty: 2,
            story: "小明有 1/2 塊魔法石，小華給了他 1/4 塊魔法石，請問小明現在總共有多少魔法石？",
            options: ["3/4", "2/4", "1/4", "1/2"]
        },
         {
            id: "q4",
            subject: "自然",
            concept: "生態系",
            difficulty: 5,
            story: "在這片被污染的森林中，哪一種生物的消失會最快導致整個食物網崩潰？",
            options: ["生產者 (如：植物)", "初級消費者 (如：昆蟲)", "次級消費者 (如：青蛙)", "最高級消費者 (如：老鷹)"]
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    setupEventListeners();
});

async function initGame() {
    try {
        if (GAS_URL === "請填入GAS發布網址" || !GAS_URL) {
            console.warn("GAS_URL not set, using mock data.");
            setTimeout(() => applyGameData(MOCK_DATA), 1000); // Simulate network latency
            return;
        }

        const response = await fetch(GAS_URL);
        const data = await response.json();
        applyGameData(data);

    } catch (error) {
        console.error("Failed to fetch game data:", error);
        // Fallback to mock data for demonstration purposes if fetch fails
        applyGameData(MOCK_DATA);
    }
}

function applyGameData(data) {
    // Hide Loading Screen
    document.getElementById('loading-screen').classList.add('hidden');

    // Check system status
    if (data.settings.status && data.settings.status.includes('🔴')) {
        document.getElementById('maintenance-screen').classList.remove('hidden');
        return;
    }

    // Apply Multiverse Theme
    if (data.settings.universe) {
        const uName = data.settings.universe;
        if (uName.includes('木葉')) {
            currentUniverse = 'theme-ninja';
        } else if (uName.includes('賽博')) {
            currentUniverse = 'theme-cyber';
        } else if (uName.includes('RPG') || uName.includes('台灣')) {
            currentUniverse = 'theme-rpg';
        } else {
            currentUniverse = uName;
        }
        document.body.className = currentUniverse; // Replace all classes with the theme class
    }

    // Load Questions
    if (data.questions && Array.isArray(data.questions)) {
        currentQuestions = data.questions;
        renderQuestBoard();
        document.getElementById('game-lobby').classList.remove('hidden');
    }
}

function renderQuestBoard() {
    const grid = document.getElementById('quest-board');
    grid.innerHTML = '';

    currentQuestions.forEach(quest => {
        const card = document.createElement('div');
        card.className = 'quest-card';
        card.id = `quest-${quest.id}`;
        
        if (completedQuests.has(quest.id)) {
            card.classList.add('completed');
        }

        const subjectKey = Object.keys(subjectIcons).find(key => quest.subject && quest.subject.includes(key));
        const icon = subjectKey ? subjectIcons[subjectKey] : subjectIcons['預設'];
        const numStars = quest.difficulty && quest.difficulty >= 1 ? quest.difficulty : 3;
        const starsDisplay = '★'.repeat(numStars) + '☆'.repeat(Math.max(0, 5 - numStars));

        card.innerHTML = `
            <div class="stamp">已完成</div>
            <div class="quest-icon">${icon}</div>
            <h3 class="quest-concept">${quest.concept || '神秘任務'}</h3>
            <div class="quest-difficulty">${starsDisplay}</div>
            <button class="action-btn accept-btn" onclick="openQuestModal('${quest.id}')">接受委託</button>
        `;

        grid.appendChild(card);
    });
}

function getRewardTextByUniverse() {
    switch (currentUniverse) {
        case 'theme-ninja':
            return '獲得查克拉卷軸！';
        case 'theme-cyber':
            return '獲得核心代碼！';
        case 'theme-rpg':
            return '獲得黑面琵鷺羽毛！';
        default:
            return '獲得神秘宇宙寶石！';
    }
}

// Utility: Fisher-Yates Shuffle
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Global function to be called from inline HTML
window.openQuestModal = function(questId) {
    currentQuest = currentQuestions.find(q => q.id === questId);
    if (!currentQuest) return;

    // Reset UI state
    document.getElementById('feedback-msg').classList.add('hidden');
    
    // Set Header
    const subjectKey = Object.keys(subjectIcons).find(key => currentQuest.subject && currentQuest.subject.includes(key));
    const icon = subjectKey ? subjectIcons[subjectKey] : subjectIcons['預設'];
    document.getElementById('modal-icon').innerText = icon;
    document.getElementById('modal-subject').innerText = `${currentQuest.subject} 挑戰`;
    
    const numStars = currentQuest.difficulty && currentQuest.difficulty >= 1 ? currentQuest.difficulty : 3;
    document.getElementById('modal-difficulty').innerText = '★'.repeat(numStars);
    
    // Set Story
    document.getElementById('modal-story').innerText = currentQuest.story || '任務內容發生錯誤...';

    // Prepare Options (Assumption: first option in array is the correct one)
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    if (currentQuest.options && Array.isArray(currentQuest.options)) {
        let optionsData = currentQuest.options.map((opt, i) => ({
            text: opt,
            isCorrect: i === 0 // The first option is treated as the correct answer
        }));

        optionsData = shuffleArray(optionsData);

        for (let idx = 0; idx < optionsData.length; idx++) {
            const opt = optionsData[idx];
            const btn = document.createElement('button');
            btn.className = 'action-btn option-btn';
            btn.innerText = opt.text;
            btn.onclick = () => handleOptionClick(btn, opt.isCorrect);
            optionsContainer.appendChild(btn);
        }
    }

    // Show Modal
    document.getElementById('combat-modal').classList.remove('hidden');
    
    // Stop any ongoing speech when opening a new quest
    if (synth.speaking) {
        synth.cancel();
    }
};

function handleOptionClick(btn, isCorrect) {
    if (isCorrect) {
        // Stop speech
        if (synth.speaking) synth.cancel();

        // Hide Combat Modal
        document.getElementById('combat-modal').classList.add('hidden');
        
        // Mark as completed
        completedQuests.add(currentQuest.id);
        const card = document.getElementById(`quest-${currentQuest.id}`);
        if(card) {
            card.classList.add('completed');
        }

        // Show Victory Screen
        document.getElementById('reward-text').innerText = getRewardTextByUniverse();
        document.getElementById('victory-screen').classList.remove('hidden');

    } else {
        // Warning feedback
        btn.classList.add('error', 'shake');
        document.getElementById('feedback-msg').classList.remove('hidden');
        
        // Vibrate if supported by device
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }

        setTimeout(() => {
            btn.classList.remove('error', 'shake');
            document.getElementById('feedback-msg').classList.add('hidden');
        }, 1000);
    }
}

function setupEventListeners() {
    // Close Modal Button
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('combat-modal').classList.add('hidden');
        if (synth.speaking) {
            synth.cancel();
        }
    });

    // Back to Lobby from Victory
    document.getElementById('back-to-lobby-btn').addEventListener('click', () => {
        document.getElementById('victory-screen').classList.add('hidden');
    });

    // UDL Text-to-Speech
    document.getElementById('read-aloud-btn').addEventListener('click', () => {
        if (!currentQuest) return;

        if (synth.speaking) {
            synth.cancel(); // Stop if already speaking
            return;
        }

        const utterThis = new SpeechSynthesisUtterance(currentQuest.story);
        
        // Determine language based on subject
        const isEnglish = currentQuest.subject && 
                          (currentQuest.subject.includes('英語') || currentQuest.subject.toLowerCase().includes('english'));
        
        utterThis.lang = isEnglish ? 'en-US' : 'zh-TW';
        
        // Optional: fine-tune pitch/rate
        utterThis.rate = 1.0; 

        synth.speak(utterThis);
    });
}
