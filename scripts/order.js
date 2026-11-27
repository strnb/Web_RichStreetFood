    // лаба 8: общее состояние заказа для страниц меню и оформления
const ORDER_STORAGE_KEY = 'rich-street-food-order';

const categories = [
    { key: 'soup', title: 'Суп', emptyText: 'Не выбран', apiField: 'soup_id' },
    { key: 'main', title: 'Главное блюдо', emptyText: 'Не выбрано', apiField: 'main_course_id' },
    { key: 'salad', title: 'Салат/стартер', emptyText: 'Не выбран', apiField: 'salad_id' },
    { key: 'drink', title: 'Напиток', emptyText: 'Не выбран', apiField: 'drink_id' },
    { key: 'dessert', title: 'Десерт', emptyText: 'Не выбран', apiField: 'dessert_id' }
];

const selected = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

function readStoredIds() {
    try {
        return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY)) ?? {};
    } catch {
        return {};
    }
}

function restoreOrder() {
    const ids = readStoredIds();

    categories.forEach(({ key }) => {
        selected[key] = dishes.find(dish => dish.id === ids[key] && dish.category === key) ?? null;
    });
}

function saveOrder() {
    const ids = {};

    categories.forEach(({ key }) => {
        if (selected[key]) {
            ids[key] = selected[key].id;
        }
    });

    try {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(ids));
    } catch {
        // localStorage может быть недоступен
    }
}

function clearOrder() {
    categories.forEach(({ key }) => {
        selected[key] = null;
    });

    try {
        localStorage.removeItem(ORDER_STORAGE_KEY);
    } catch {
        // localStorage может быть недоступен
    }
}

function getOrderTotal() {
    return categories.reduce((total, { key }) => total + (selected[key]?.price ?? 0), 0);
}

function getOrderError() {
    const soup = selected.soup !== null;
    const main = selected.main !== null;
    const salad = selected.salad !== null;
    const drink = selected.drink !== null;
    const dessert = selected.dessert !== null;

    if (!soup && !main && !salad && !drink && !dessert) {
        return 'Ничего не выбрано. Выберите блюда для заказа';
    }

    if (main || (soup && salad)) {
        return drink ? null : 'Выберите напиток';
    }

    if (soup) {
        return 'Выберите главное блюдо/салат/стартер';
    }

    if (salad) {
        return 'Выберите суп или главное блюдо';
    }

    return 'Выберите главное блюдо';
}

function showNotification(message) {
    const old = document.querySelector('.notification');
    if (old) old.remove();

    const wrap = document.createElement('div');
    wrap.classList.add('notification');

    const box = document.createElement('div');
    box.classList.add('notification-box');

    const text = document.createElement('p');
    text.textContent = message;

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Окей 👌';
    button.addEventListener('click', () => wrap.remove());

    box.append(text, button);
    wrap.append(box);
    document.body.append(wrap);
}
