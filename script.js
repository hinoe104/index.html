/**
 * Luminous Salon - Integrated Fortune Launcher
 */

// --- Data Definitions ---

// Tarot Data (Subset for display logic, full names generated dynamically or mapped)
const TAROT_DATA = {
    majors: [
        "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
        "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
        "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
        "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"
    ],
    suits: ["Wands", "Cups", "Swords", "Pentacles"],
    ranks: ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"],
    
    translate: function(name) {
        const majorMap = {
            "The Fool": "愚者", "The Magician": "魔術師", "The High Priestess": "女教皇", "The Empress": "女帝", 
            "The Emperor": "皇帝", "The Hierophant": "法王", "The Lovers": "恋人", "The Chariot": "戦車", 
            "Strength": "力", "The Hermit": "隠者", "Wheel of Fortune": "運命の輪", "Justice": "正義", 
            "The Hanged Man": "吊るされた男", "Death": "死神", "Temperance": "節制", "The Devil": "悪魔", 
            "The Tower": "塔", "The Star": "星", "The Moon": "月", "The Sun": "太陽", 
            "Judgement": "審判", "The World": "世界"
        };
        if (majorMap[name]) return majorMap[name];
        
        const suitMap = {"Wands": "ワンド", "Cups": "カップ", "Swords": "ソード", "Pentacles": "ペンタクル"};
        const rankMap = {"Ace": "エース", "Two": "2", "Three": "3", "Four": "4", "Five": "5", "Six": "6", "Seven": "7", "Eight": "8", "Nine": "9", "Ten": "10", "Page": "ペイジ", "Knight": "ナイト", "Queen": "クイーン", "King": "キング"};
        
        const parts = name.split(" of ");
        if (parts.length === 2) return `${suitMap[parts[1]]}の${rankMap[parts[0]]}`;
        return name;
    }
};

const LENORMAND_DATA = [
    {no: 1, name: "騎士"}, {no: 2, name: "クローバー"}, {no: 3, name: "船"}, {no: 4, name: "家"},
    {no: 5, name: "樹木"}, {no: 6, name: "雲"}, {no: 7, name: "蛇"}, {no: 8, name: "棺"},
    {no: 9, name: "花束"}, {no: 10, name: "鎌"}, {no: 11, name: "鞭"}, {no: 12, name: "鳥"},
    {no: 13, name: "子供"}, {no: 14, name: "狐"}, {no: 15, name: "熊"}, {no: 16, name: "星"},
    {no: 17, name: "コウノトリ"}, {no: 18, name: "犬"}, {no: 19, name: "塔"}, {no: 20, name: "庭園"},
    {no: 21, name: "山"}, {no: 22, name: "道"}, {no: 23, name: "鼠"}, {no: 24, name: "ハート"},
    {no: 25, name: "指輪"}, {no: 26, name: "本"}, {no: 27, name: "手紙"}, {no: 28, name: "紳士"},
    {no: 29, name: "淑女"}, {no: 30, name: "百合"}, {no: 31, name: "太陽"}, {no: 32, name: "月"},
    {no: 33, name: "鍵"}, {no: 34, name: "魚"}, {no: 35, name: "錨"}, {no: 36, name: "十字架"}
];



const SPREADS = {
    tarot: {
        "one": { count: 1, name: "ワンオラクル", layout: ["メッセージ"], gridAreas: ["msg"] },
        "three": { count: 3, name: "3枚引き", layout: ["過去/原因", "現状/課題", "未来/結果"], gridAreas: ["past", "present", "future"] },
        "greek": {
            count: 5, name: "ギリシャ十字",
            layout: ["現状", "障害", "助言", "気持ち", "最終結果"],
            gridAreas: [
                "present", // 1. 現状 (Center)
                "obstacle", // 2. 障害 (Crosses present)
                "advice",   // 3. 助言 (Top)
                "feelings", // 4. 質問者の気持ち (Left)
                "outcome"   // 5. 最終結果 (Right)
            ]
        },

        "horseshoe": {
            count: 7,
            name: "ホースシュー",
            layout: ["過去", "現在", "近い未来", "解決策/アドバイス", "他者の影響", "障害/希望", "最終結果"],
            gridAreas: [
                "past",         // 1. 過去
                "present",      // 2. 現在
                "near_future",  // 3. 近い未来
                "advice",       // 4. 解決策/アドバイス
                "influences",   // 5. 他者の影響
                "obstacles",    // 6. 障害/希望
                "outcome"       // 7. 最終結果
            ]
        },

        "celtic": {
            count: 10, name: "ケルト十字",
            layout: [
                "現状", "障害", "潜在意識", "過去", "顕在的意図", "近い未来",
                "質問者", "外部環境", "願望/不安", "最終結果"
            ],
            gridAreas: [
                "cross_center", // 1. 現状
                "cross_center", // 2. 障害
                "unconscious",  // 3. 潜在意識
                "past",         // 4. 過去
                "conscious",    // 5. 顕在的意図
                "near_future",  // 6. 近い未来
                "querent",      // 7. 質問者
                "external",     // 8. 外部環境
                "hopes",        // 9. 願望/不安
                "outcome"       // 10. 最終結果
            ]
        }
    },
    lenormand: {
        "3": { count: 3, name: "3枚引き", layout: ["1", "2", "3"], gridAreas: ["pos1", "pos2", "pos3"] },
        "5": { count: 5, name: "5枚引き", layout: ["1", "2", "3", "4", "5"], gridAreas: ["pos1", "pos2", "pos3", "pos4", "pos5"] },
        "9": { count: 9, name: "9枚引き (スクエア)", layout: ["1", "2", "3", "4", "5", "6", "7", "8", "9"], gridAreas: Array.from({length: 9}, (_,i)=>`pos${i+1}`) },
        "36": { count: 36, name: "グランタブロー", layout: [], gridAreas: Array.from({length: 36}, (_,i)=>`pos${i+1}`) }
    }
};

// --- Application State ---
let currentState = {
    type: null, // 'tarot', 'lenormand', 'geomancy'
    spread: null, // key from SPREADS
    results: null // Store divination results
};

// --- DOM Elements ---
const spreadContainer = document.getElementById('spread-container');
const spreadOptions = document.getElementById('spread-options');
const divinateBtn = document.getElementById('divinate-btn');
const resultArea = document.getElementById('result-area');
const visualArea = document.getElementById('visual-area');
const listArea = document.getElementById('list-area');
const resultList = document.getElementById('result-list');
const resetBtn = document.getElementById('reset-btn');
const selectionArea = document.getElementById('selection-area');

// --- Init ---
document.querySelectorAll('.divination-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Reset UI
        document.querySelectorAll('.divination-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const type = btn.dataset.type;
        currentState.type = type;
        renderSpreads(type);
        
        currentState.spread = null;
        divinateBtn.classList.add('hidden');
    });
});

divinateBtn.addEventListener('click', () => {
    if (currentState.type && currentState.spread) {
        performDivination();
    }
});

resetBtn.addEventListener('click', () => {
    resultArea.classList.add('hidden');
    visualArea.innerHTML = '';
    resultList.innerHTML = '';
    listArea.classList.add('hidden');
    
    resetBtn.classList.add('hidden');
    selectionArea.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Functions ---

function renderSpreads(type) {
    spreadOptions.innerHTML = '';
    const options = SPREADS[type];
    
    if (!options) return;

    Object.keys(options).forEach(key => {
        const spread = options[key];
        const btn = document.createElement('button');
        btn.className = 'spread-btn';
        btn.textContent = spread.name;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.spread-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentState.spread = key;
            divinateBtn.classList.remove('hidden');
        });
        spreadOptions.appendChild(btn);
    });

    spreadContainer.classList.remove('hidden');
    spreadContainer.classList.add('fade-in');
}

function performDivination() {
    selectionArea.classList.add('hidden');
    resultArea.classList.remove('hidden');
    resetBtn.classList.remove('hidden');
    
    // Clear previous results
    visualArea.innerHTML = '';
    resultList.innerHTML = '';
    listArea.classList.add('hidden'); // Default hidden

    const { type, spread } = currentState;
    
    if (type === 'tarot') {
        drawTarot(spread);
    } else if (type === 'lenormand') {
        drawLenormand(spread);
    }
}

// --- Rendering Helpers ---// --- Tarot Logic ---
function drawTarot(spreadKey) {
    const spreadDef = SPREADS.tarot[spreadKey];
    
    let deck = [];
    TAROT_DATA.majors.forEach(name => deck.push({ name: name, isMajor: true }));
    TAROT_DATA.suits.forEach(suit => {
        TAROT_DATA.ranks.forEach(rank => {
            deck.push({ name: `${rank} of ${suit}`, isMajor: false });
        });
    });

    deck.sort(() => 0.5 - Math.random());

    const cards = deck.slice(0, spreadDef.count).map(card => ({
        ...card,
        isUpright: Math.random() >= 0.5,
        jpName: TAROT_DATA.translate(card.name)
    }));

    renderCards(cards, spreadDef.layout, 'tarot', spreadKey);
}

// --- Lenormand Logic ---
function drawLenormand(spreadKey) {
    const spreadDef = SPREADS.lenormand[spreadKey];
    const deck = [...LENORMAND_DATA].sort(() => 0.5 - Math.random());
    const count = spreadDef.count;
    const cards = deck.slice(0, count);
    
    let layout = spreadDef.layout || [];
    if (spreadKey === '36') {
        layout = Array(36).fill("").map((_, i) => `Pos ${i+1}`);
    }

    renderCards(cards, layout, 'lenormand', spreadKey);
}



// --- Rendering Helpers ---

function renderCards(cards, layout, type, spreadKey) {
    const container = document.createElement('div');
    container.className = 'cards-container';
    
    // Assign layout class based on spread key
    let layoutClass = '';
    if (type === 'tarot') {
        layoutClass = `tarot-${spreadKey}-layout`;
        listArea.classList.remove('hidden'); // Show list for Tarot
    } else if (type === 'lenormand') {
        layoutClass = `lenormand-${spreadKey}-layout`;
    }
    
    if (layoutClass) {
        container.classList.add(layoutClass);
    }
    
    cards.forEach((card, index) => {
        const slot = document.createElement('div');
        slot.className = 'card-slot';
        
        // Grid Area logic for Tarot
        if (type === 'tarot') {
            const spreadDef = SPREADS[type][spreadKey];
            if (spreadDef && spreadDef.gridAreas && spreadDef.gridAreas[index]) {
                slot.style.gridArea = spreadDef.gridAreas[index];
            }
            if (spreadKey === 'celtic' && index === 1) {
                slot.classList.add('celtic-obstacle');
            }
            
            // Add to Result List
            const li = document.createElement('li');
            const posText = layout && layout[index] ? layout[index] : `#${index + 1}`;
            let cardNameText = card.jpName || card.name;
            let reversedMark = "";
            if (card.isUpright === false) {
                reversedMark = ' <span class="reversed-mark">(R)</span>';
            }
            li.innerHTML = `<span class="list-pos">${posText}</span><span class="list-name">${cardNameText}${reversedMark}</span>`;
            resultList.appendChild(li);
        }

        // Highlight Key Cards
        if (type === 'lenormand' && (card.no === 28 || card.no === 29)) {
            slot.classList.add('key-card');
        }

        // Position Name (Non-Tarot)
        if (type !== 'tarot') {
             const posName = document.createElement('div');
             posName.className = 'position-name';
             if (layout && layout[index]) {
                 posName.textContent = layout[index];
             } else {
                  posName.textContent = `#${index + 1}`;
             }
             slot.appendChild(posName);
        }

        // Visual
        const visual = document.createElement('div');
        visual.className = `card-visual ${type}`;
        if (card.isUpright === false) {
            visual.classList.add('reversed');
        }
        
        const visualContent = document.createElement('div');
        visualContent.className = 'visual-inner';
        
        if (type === 'tarot') {
            visualContent.innerHTML = formatTarotVisual(card.name);
            if(card.isUpright === false) {
                 visualContent.style.transform = 'rotate(180deg)';
            }
        } else if (type === 'lenormand') {
            visualContent.textContent = card.no;
            visualContent.style.fontFamily = 'var(--font-en)';
        }
        
        visual.appendChild(visualContent);
        slot.appendChild(visual);

        // Card Name (Non-Tarot)
        if (type !== 'tarot') {
            const nameDiv = document.createElement('div');
            nameDiv.className = 'card-name';
            let displayName = card.jpName || card.name;
            nameDiv.textContent = displayName;
            slot.appendChild(nameDiv);
        }

        container.appendChild(slot);
    });

    visualArea.appendChild(container);
}

function formatTarotVisual(name) {
    return name.replace(' of ', '<br>').replace('The ', 'The<br>');
}
