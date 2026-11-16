dishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

function createDishCard(dish) {
    //главный div карточки
    const card = document.createElement('div');
    card.classList.add('dish');
    card.setAttribute('data-dish', dish.keyword);

    // Картинка
    const img = document.createElement('img');
    img.src = dish.image; // лаба 7
    img.alt = dish.name;

    // Цена
    const price = document.createElement('p');
    price.classList.add('price');
    price.textContent = `${dish.price} ₽`;

    // Название
    const name = document.createElement('p');
    name.classList.add('name');
    name.textContent = dish.name;

    // Вес
    const weight = document.createElement('p');
    weight.classList.add('weight');
    weight.textContent = dish.count;

    // Кнопка
    const button = document.createElement('button');
    button.textContent = 'Добавить';

    // Собираем карточку
    card.append(img, price, name, weight, button);

    return card;
}

function updateSelectedCards() {
    document.querySelectorAll('.dish[data-dish]').forEach(card => {
        const dish = dishes.find(item => item.keyword === card.dataset.dish);

        card.classList.toggle(
            'selected',
            Boolean(dish) && selected[dish.category]?.keyword === dish.keyword
        );
    });
}

function updateOrderPanel() {
    const panel = document.getElementById('order-panel');
    const total = document.getElementById('order-panel-total');
    const link = document.getElementById('order-panel-link');

    if (!panel) return;

    panel.hidden = !categories.some(({ key }) => selected[key]);

    if (total) {
        total.textContent = `${getOrderTotal()}₽`;
    }

    if (!link) return;

    if (getOrderError()) {
        link.removeAttribute('href');
    } else {
        link.href = 'order.html';
    }
}

//Обработка клика по карточке
function setupDishClicks() {
    const cards = document.querySelectorAll('.dish');

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            // Получаем keyword из data атрибута
            const keyword = card.getAttribute('data-dish');

            // Ищем блюдо в массиве
            const dish = dishes.find(d => d.keyword === keyword);

            if (!dish) return;

            selected[dish.category] = dish;
            saveOrder();
            updateSelectedCards();
            updateOrderPanel();
        });
    });
}

// Текущие активные фильтры по категориям
const activeFilters = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

// Отображение с учётом фильтра
function displayDishes() {
    const containers = {
        soup: document.getElementById('soups'),
        main: document.getElementById('main-dishes'),
        salad: document.getElementById('salads'),
        drink: document.getElementById('drinks'),
        dessert: document.getElementById('desserts')
    };

    // очищаем все
    Object.values(containers).forEach(c => {
        if (c) c.innerHTML = '';
    });

    dishes.forEach(dish => {
        const container = containers[dish.category];
        if (!container) return;

        const filter = activeFilters[dish.category];

        // если фильтр активен и kind не совпадает — пропускаем
        if (filter && dish.kind !== filter) return;

        const card = createDishCard(dish);
        container.append(card);
    });

    setupDishClicks(); // заново вешаем клики
    updateSelectedCards();
}

// Клики по фильтрам
function setupFilters() {
    document.querySelectorAll('.filters button').forEach(btn => {
        btn.addEventListener('click', function () {
            const category = this.parentElement.dataset.category;
            const kind = this.dataset.kind;

            // если нажали уже активный фильтр — сбрасываем
            if (activeFilters[category] === kind) {
                activeFilters[category] = null;
                this.classList.remove('active');
            } else {
                // снимаем active у всех кнопок этой категории
                this.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeFilters[category] = kind;
            }

            displayDishes();
        });
    });
}

// лаба 8: запуск страницы меню с учётом сохранённого заказа
restoreOrder();
displayDishes();
setupFilters();
updateSelectedCards();
updateOrderPanel();

// кнопка «Назад» может вернуть страницу из кэша браузера
window.addEventListener('pageshow', event => {
    if (event.persisted && dishes.length) {
        restoreOrder();
        updateSelectedCards();
        updateOrderPanel();
    }
});
