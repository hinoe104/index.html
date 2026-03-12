/**
 * Luminous Salon - Integrated Fortune Launcher
 */

// --- Data Definitions ---

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
            gridAreas: ["present", "obstacle", "advice", "feelings", "outcome"]
        },
        "horseshoe": {
            count: 7, name: "ホースシュー",
            layout: ["過去", "現在", "近い未来", "解決策/アドバイス", "他者の影響", "障害/希望", "最終結果"],
            gridAreas: ["past", "present", "near_future", "advice", "influences", "obstacles", "outcome"]
        },
        "celtic": {
            count: 10, name: "ケルト十字",
            layout: ["現状", "障害", "潜在意識", "過去", "顕在的意図", "近い未来", "質問者", "外部環境", "願望/不安", "最終結果"],
            gridAreas: ["cross_center", "cross_center", "unconscious", "past", "conscious", "near_future", "querent", "external", "hopes", "outcome"]
        }
    },
    lenormand: {
        "3": { count: 3, name: "3枚引き", layout: ["1", "2", "3"], gridAreas: ["pos1", "pos2", "pos3"] },
        "5": { count: 5, name: "5枚引き", layout: ["1", "2", "3", "4", "5"], gridAreas: ["pos1", "pos2", "pos3", "pos4", "pos5"] },
        "9": { count: 9, name: "9枚引き (スクエア)", layout: ["1", "2", "3", "4", "5", "6", "7", "8", "9"], gridAreas: Array.from({length: 9}, (_,i)=>`pos${i+1}`) },
        "36": { count: 36, name: "グランタブロー", layout: [], gridAreas: Array.from({length: 36}, (_,i)=>`pos${i+1}`) }
    }
};

let currentState = { type: null, spread: null, results: null };

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

function getImagePath(cardName) {
    const basePath = 'assets/images/tarot/';
    const majorMap = {
        "The Fool": "m00.jpg", "The Magician": "m01.jpg", "The High Priestess": "m02.jpg", "The Empress": "m03.jpg",
        "The Emperor": "m04.jpg", "The Hierophant": "m05.jpg", "The Lovers": "m06.jpg", "The Chariot": "m07.jpg",
        "Strength": "m08.jpg", "The Hermit": "m09.jpg", "Wheel of Fortune": "m10.jpg", "Justice": "m11.jpg",
        "The Hanged Man": "m12.jpg", "Death": "m13.jpg", "Temperance": "m14.jpg", "The Devil": "m15.jpg",
        "The Tower": "m16.jpg", "The Star": "m17.jpg", "The Moon": "m18.jpg", "The Sun": "m19.jpg",
        "Judgement": "m20.jpg", "The World": "m21.jpg"
    };
    if (majorMap[cardName]) return basePath + majorMap[cardName];
    const suitPrefix = { "Wands": "w", "Cups": "c", "Swords": "s", "Pentacles": "p" };
    const rankMap = { "Ace": "01", "Two": "02", "Three": "03", "Four": "04", "Five": "05", "Six": "06", "Seven": "07", "Eight": "08", "Nine": "09", "Ten": "10", "Page": "11", "Knight": "12", "Queen": "13", "King": "14" };
    const parts = cardName.split(" of ");
    if (parts.length === 2) return `${basePath}${suitPrefix[parts[1]]}${rankMap[parts[0]]}.jpg`;
    return basePath + 'back.jpg';
}

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
}

function performDivination() {
    selectionArea.classList.add('hidden');
    resultArea.classList.remove('hidden');
    resetBtn.classList.remove('hidden');
    visualArea.innerHTML = '';
    resultList.innerHTML = '';
    const { type, spread } = currentState;
    if (type === 'tarot') { drawTarot(spread); }
    else if (type === 'lenormand') { drawLenormand(spread); }
}

function drawTarot(spreadKey) {
    const spreadDef = SPREADS.tarot[spreadKey];
    let deck = [];
    TAROT_DATA.majors.forEach(name => deck.push({ name: name, isMajor: true }));
    TAROT_DATA.suits.forEach(suit => {
        TAROT_DATA.ranks.forEach(rank => { deck.push({ name: `${rank} of ${suit}`, isMajor: false }); });
    });
    deck.sort(() => 0.5 - Math.random());
    const cards = deck.slice(0, spreadDef.count).map(card => ({
        ...card,
        isUpright: Math.random() >= 0.5,
        jpName: TAROT_DATA.translate(card.name)
    }));
    renderCards(cards, spreadDef.layout, 'tarot', spreadKey);
}

function drawLenormand(spreadKey) {
    const spreadDef = SPREADS.lenormand[spreadKey];
    const deck = [...LENORMAND_DATA].sort(() => 0.5 - Math.random());
    const cards = deck.slice(0, spreadDef.count);
    let layout = spreadDef.layout || [];
    if (spreadKey === '36') { layout = Array(36).fill("").map((_, i) => `Pos ${i+1}`); }
    renderCards(cards, layout, 'lenormand', spreadKey);
}

function renderCards(cards, layout, type, spreadKey) {
    const container = document.createElement('div');
    container.className = 'cards-container';
    if (type === 'tarot') {
        container.classList.add(`tarot-${spreadKey}-layout`);
        listArea.classList.remove('hidden');
    } else {
        container.classList.add(`lenormand-${spreadKey}-layout`);
    }
    
    cards.forEach((card, index) => {
        const slot = document.createElement('div');
        slot.className = 'card-slot';
        if (type === 'tarot') {
            const spreadDef = SPREADS[type][spreadKey];
            if (spreadDef && spreadDef.gridAreas && spreadDef.gridAreas[index]) {
                slot.style.gridArea = spreadDef.gridAreas[index];
            }
            if (spreadKey === 'celtic' && index === 1) { slot.classList.add('celtic-obstacle'); }
            const li = document.createElement('li');
            const posText = layout[index] || `#${index + 1}`;
            let reversedMark = card.isUpright ? "" : ' <span class="reversed-mark">(R)</span>';
            li.innerHTML = `<span class="list-pos">${posText}</span><span class="list-name">${card.jpName}${reversedMark}</span>`;
            resultList.appendChild(li);
        }

        const visual = document.createElement('div');
        visual.className = `card-visual ${type}`;
        if (card.isUpright === false) { visual.classList.add('reversed'); }
        const visualContent = document.createElement('div');
        visualContent.className = 'visual-inner';
        
        const img = document.createElement('img');
        if (type === 'tarot') {
            img.src = getImagePath(card.name);
        } else {
            const paddedNo = String(card.no).padStart(2, '0');
            img.src = `assets/images/lenormand/${paddedNo}.png`;
        }
        img.className = 'tarot-image';
        visualContent.appendChild(img);
        visual.appendChild(visualContent);
        slot.appendChild(visual);

        if (type !== 'tarot') {
            const nameDiv = document.createElement('div');
            nameDiv.className = 'card-name';
            nameDiv.textContent = card.name;
            slot.appendChild(nameDiv);
        }
        container.appendChild(slot);
    });
    visualArea.appendChild(container);
}
