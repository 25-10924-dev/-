const phrases = [
  { id: 1, category: '인사', ja: 'こんにちは。', romaji: 'Konnichiwa.', ko: '안녕하세요.' },
  { id: 2, category: '인사', ja: 'ありがとうございます。', romaji: 'Arigatou gozaimasu.', ko: '감사합니다.' },
  { id: 3, category: '교통', ja: '東京駅はどこですか？', romaji: 'Toukyou eki wa doko desu ka?', ko: '도쿄역은 어디인가요?' },
  { id: 4, category: '교통', ja: 'この電車は新宿に行きますか？', romaji: 'Kono densha wa Shinjuku ni ikimasu ka?', ko: '이 전철은 신주쿠에 가나요?' },
  { id: 5, category: '식당', ja: 'おすすめは何ですか？', romaji: 'Osusume wa nan desu ka?', ko: '추천 메뉴는 무엇인가요?' },
  { id: 6, category: '식당', ja: 'お会計お願いします。', romaji: 'Okaikei onegaishimasu.', ko: '계산 부탁드립니다.' },
  { id: 7, category: '쇼핑', ja: 'これを試着してもいいですか？', romaji: 'Kore o shichaku shite mo ii desu ka?', ko: '이거 입어봐도 될까요?' },
  { id: 8, category: '쇼핑', ja: '免税できますか？', romaji: 'Menzei dekimasu ka?', ko: '면세 가능한가요?' },
  { id: 9, category: '긴급', ja: '助けてください。', romaji: 'Tasukete kudasai.', ko: '도와주세요.' },
  { id: 10, category: '긴급', ja: '病院はどこですか？', romaji: 'Byouin wa doko desu ka?', ko: '병원은 어디인가요?' },
  { id: 11, category: '편의', ja: 'トイレはどこですか？', romaji: 'Toire wa doko desu ka?', ko: '화장실은 어디인가요?' },
  { id: 12, category: '편의', ja: 'Wi-Fiはありますか？', romaji: 'Wi-Fi wa arimasu ka?', ko: '와이파이가 있나요?' },
];

const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const favoritesOnly = document.getElementById('favoritesOnly');
const phraseList = document.getElementById('phraseList');
const emptyState = document.getElementById('emptyState');
const template = document.getElementById('phraseItemTemplate');

const FAVORITES_KEY = 'jp-phrase-favorites';
const favoriteSet = new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'));

function initCategories() {
  const categories = [...new Set(phrases.map((p) => p.category))];
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
  });
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favoriteSet]));
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => alert('복사되었습니다.'));
}

function matchesFilter(phrase) {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;

  const inCategory = category === 'all' || phrase.category === category;
  const inFavorites = !favoritesOnly.checked || favoriteSet.has(phrase.id);
  const containsKeyword =
    !keyword ||
    phrase.ja.toLowerCase().includes(keyword) ||
    phrase.romaji.toLowerCase().includes(keyword) ||
    phrase.ko.toLowerCase().includes(keyword);

  return inCategory && inFavorites && containsKeyword;
}

function render() {
  phraseList.innerHTML = '';
  const filtered = phrases.filter(matchesFilter);
  emptyState.hidden = filtered.length > 0;

  filtered.forEach((phrase) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector('.category').textContent = phrase.category;
    node.querySelector('.ja').textContent = phrase.ja;
    node.querySelector('.romaji').textContent = phrase.romaji;
    node.querySelector('.ko').textContent = phrase.ko;

    const favoriteBtn = node.querySelector('.favorite-btn');
    favoriteBtn.textContent = favoriteSet.has(phrase.id) ? '★' : '☆';

    favoriteBtn.addEventListener('click', () => {
      if (favoriteSet.has(phrase.id)) favoriteSet.delete(phrase.id);
      else favoriteSet.add(phrase.id);
      saveFavorites();
      render();
    });

    node.querySelector('.copy-btn').addEventListener('click', () => copyToClipboard(phrase.ja));

    phraseList.append(node);
  });
}

[searchInput, categorySelect, favoritesOnly].forEach((el) => {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
});

initCategories();
render();
