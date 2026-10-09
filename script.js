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

function displayDishes() {
    const soupsContainer = document.getElementById('soups');
    const mainContainer = document.getElementById('main-dishes');
    const drinksContainer = document.getElementById('drinks');

    soupsContainer.innerHTML = '';
    mainContainer.innerHTML = '';
    drinksContainer.innerHTML = '';

    dishes.forEach((dish) => {
        const card = createDishCard(dish);

        if (dish.category === 'soup') {
            soupsContainer.append(card);
        } else if (dish.category === 'main') {
            mainContainer.append(card);
        } else if (dish.category === 'drink') {
            drinksContainer.append(card);
        }
    });
}

displayDishes();
// Хранилище выбранных блюд 
const selected = {
    soup: null,
    main: null,
    drink: null
};

function updateOrderSummary() {
    const summary = document.getElementById('order-summary');
    summary.innerHTML = ''; 

    const hasSoup  = selected.soup  !== null;
    const hasMain  = selected.main  !== null;
    const hasDrink = selected.drink !== null;

    // Если ничего не выбрано
    if (!hasSoup && !hasMain && !hasDrink) {
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

    //Напиток
    const drinkBlock = document.createElement('div');
    drinkBlock.classList.add('order-item');
    drinkBlock.innerHTML = `
        <p class="order-category">Напиток</p>
        <p class="order-name">${hasDrink ? selected.drink.name + ' ' + selected.drink.price + '₽' : 'Напиток не выбран'}</p>
    `;
    summary.append(drinkBlock);

    //Стоимость
    let total = 0;
    if (hasSoup)  total += selected.soup.price;
    if (hasMain)  total += selected.main.price;
    if (hasDrink) total += selected.drink.price;

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

// Запускаем обработчики кликов после отображения блюд
setupDishClicks();