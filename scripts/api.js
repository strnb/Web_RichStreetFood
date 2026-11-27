// лаба 7-10: настройки приходят из scripts/config.js (в git не попадает)
const API_URL = window.API_URL ?? '';
const API_KEY = window.API_KEY ?? '';

// лаба 7: локальные картинки для блюд, которых нет на сервере
const localImages = {
    tom_yum: 'tomyam',
    chicken_soup: 'phobo',
    fried_potatoes_with_mushrooms: 'kungchtototam',
    chicken_cutlets_with_puree: 'bulgogi',
    fish_cutlet_with_rice: 'salmonteriyaki',
    margherita_pizza: 'xiaolunbao',
    shrimp_pasta: 'padtai',
    korean_salad: 'kimchisalad',
    caesar_chicken: 'chickensalad',
    tuna_salad: 'tunasalad',
    fries_caesar: 'springrolls',
    fries_ketchup: 'springrolls',
    orange_juice: 'limonad',
    apple_juice: 'koks',
    carrot_juice: 'thaitea',
    green_tea: 'greentea',
    black_tea: 'jasminetea',
    cheesecake: 'mangopudding',
    chocolate_cheesecake: 'mochi',
    chocolate_cake: 'bingsu',
    donuts3: 'sesameball',
    donuts6: 'bananefritter'
};

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
        image: localImages[dish.keyword]
            ? `images/${localImages[dish.keyword]}.jpg`
            : `${API_URL}/labs/api/${dish.image}?api_key=${API_KEY}`
    }));
}

const dishes = loadDishes();
