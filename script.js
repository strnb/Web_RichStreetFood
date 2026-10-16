dishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

function createDishCard(dish) {
    //главный div карточки
    const card = document.createElement('div');
    card.classList.add('dish');
    card.setAttribute('data-dish', dish.keyword);

    // Картинка
    const img = document.createElement('img');
    img.src = `images/${dish.image}.jpg`;
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

// Хранилище выбранных блюд
const selected = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

function updateOrderSummary() {
    const summary = document.getElementById('order-summary');
    summary.innerHTML = '';

    const hasSoup = selected.soup !== null;
    const hasMain = selected.main !== null;
    const hasSalad = selected.salad !== null;
    const hasDrink = selected.drink !== null;
    const hasDessert = selected.dessert !== null;

    // Если ничего не выбрано
    if (!hasSoup && !hasMain && !hasSalad && !hasDrink && !hasDessert) {
        summary.innerHTML = '<p class="nothing">Ничего не выбрано</p>';
        return;
    }

    //Суп
    const soupBlock = document.createElement('div');
    soupBlock.classList.add('order-item');
    soupBlock.innerHTML = `
        <p class="order-category">Суп</p>
        <p class="order-name">${hasSoup ? selected.soup.name + ' ' + selected.soup.price + '₽' : 'Блюдо не выбрано'}</p>
    `;
    summary.append(soupBlock);

    //Главное блюдо
    const mainBlock = document.createElement('div');
    mainBlock.classList.add('order-item');
    mainBlock.innerHTML = `
        <p class="order-category">Главное блюдо</p>
        <p class="order-name">${hasMain ? selected.main.name + ' ' + selected.main.price + '₽' : 'Блюдо не выбрано'}</p>
    `;
    summary.append(mainBlock);

    //Салат
    const saladBlock = document.createElement('div');
    saladBlock.classList.add('order-item');
    saladBlock.innerHTML = `
        <p class="order-category">Салат/стартер</p>
        <p class="order-name">${hasSalad ? selected.salad.name + ' ' + selected.salad.price + '₽' : 'Блюдо не выбрано'}</p>
    `;
    summary.append(saladBlock);

    //Напиток
    const drinkBlock = document.createElement('div');
    drinkBlock.classList.add('order-item');
    drinkBlock.innerHTML = `
        <p class="order-category">Напиток</p>
        <p class="order-name">${hasDrink ? selected.drink.name + ' ' + selected.drink.price + '₽' : 'Напиток не выбран'}</p>
    `;
    summary.append(drinkBlock);

    //Десерт
    const dessertBlock = document.createElement('div');
    dessertBlock.classList.add('order-item');
    dessertBlock.innerHTML = `
        <p class="order-category">Десерт</p>
        <p class="order-name">${hasDessert ? selected.dessert.name + ' ' + selected.dessert.price + '₽' : 'Десерт не выбран'}</p>
    `;
    summary.append(dessertBlock);

    //Стоимость
    let total = 0;
    if (hasSoup) total += selected.soup.price;
    if (hasMain) total += selected.main.price;
    if (hasSalad) total += selected.salad.price;
    if (hasDrink) total += selected.drink.price;
    if (hasDessert) total += selected.dessert.price;

    const totalBlock = document.createElement('div');
    totalBlock.classList.add('order-total');
    totalBlock.innerHTML = `
        <p class="order-category">Стоимость заказа</p>
        <p class="order-price">${total}₽</p>
    `;
    summary.append(totalBlock);
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
            document.querySelectorAll(`.dish[data-dish]`).forEach(c => {
                const d = dishes.find(item => item.keyword === c.getAttribute('data-dish'));
                if (d && d.category === dish.category) {
                    c.classList.remove('selected');
                }
            });
            card.classList.add('selected');

            updateOrderSummary();
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

// запуск
displayDishes();
setupFilters();