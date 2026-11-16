const API_URL = 'https://web-basics-api-gagashaggy.msk1.amvera.tech';
const API_KEY = '5cb5d4cf-0b01-381f-82fb-3ec448459cc5';

function loadDishes() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${API_URL}/labs/api/dishes/default?api_key=${API_KEY}`, false);
    xhr.overrideMimeType('application/json; charset=utf-8');
    xhr.send();

    if (xhr.status !== 200) {
        alert('Не удалось загрузить блюда с сервера');
        return [];
    }

    return JSON.parse(xhr.responseText).map(dish => ({
        ...dish,
        category: dish.category === 'main-course' ? 'main' : dish.category,
        image: `${API_URL}/labs/api/${dish.image}?api_key=${API_KEY}`
    }));
}

const dishes = loadDishes();

document.addEventListener('error', event => {
    const img = event.target;

    if (img.tagName === 'IMG' && img.closest('.dish') && !img.dataset.fallback) {
        img.dataset.fallback = 'true';
        img.src = 'images/obed.jpg';
    }
}, true);
