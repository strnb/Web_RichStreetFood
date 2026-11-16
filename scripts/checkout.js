// лаба 8: страница «Оформить заказ»

const orderForm = document.querySelector('.order-form');

function createOrderCard(dish) {
    const card = document.createElement('div');
    card.classList.add('dish');
    card.dataset.dish = dish.keyword;

    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <p class="price">${dish.price} ₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button type="button">Удалить</button>
    `;

    return card;
}

function updateOrderPage() {
    const selectedList = categories.filter(({ key }) => selected[key]);

    document.getElementById('order-empty').hidden = selectedList.length > 0;

    document.getElementById('order-dishes').replaceChildren(
        ...selectedList.map(({ key }) => createOrderCard(selected[key]))
    );

    categories.forEach(({ key, emptyText }) => {
        const item = document.getElementById(`order-${key}`);
        const dish = selected[key];

        item.querySelector('.order-name').textContent = dish
            ? `${dish.name} ${dish.price}₽`
            : emptyText;
    });

    document.getElementById('order-total-value').textContent = `${getOrderTotal()}₽`;
}

function buildOrderData() {
    const data = Object.fromEntries(new FormData(orderForm));

    data.subscribe = orderForm.elements.subscribe.checked ? 1 : 0;

    if (data.delivery_type === 'now') {
        delete data.delivery_time;
    }

    categories.forEach(({ key, apiField }) => {
        if (selected[key]) {
            data[apiField] = selected[key].id;
        }
    });

    return data;
}

async function sendOrder(data) {
    const response = await fetch(`${API_URL}/labs/api/orders?api_key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `Сервер ответил с кодом ${response.status}`);
    }
}

document.getElementById('order-dishes').addEventListener('click', event => {
    const button = event.target.closest('.dish button');
    if (!button) return;

    const card = button.closest('.dish');
    const dish = dishes.find(item => item.keyword === card.dataset.dish);
    if (!dish) return;

    selected[dish.category] = null;
    saveOrder();
    updateOrderPage();
});

orderForm.addEventListener('submit', async event => {
    event.preventDefault();

    const error = getOrderError();
    if (error) {
        showNotification(error);
        return;
    }

    const data = buildOrderData();

    if (data.delivery_type === 'by_time' && !data.delivery_time) {
        showNotification('Укажите время доставки');
        return;
    }

    const submitButton = orderForm.querySelector('[type="submit"]');
    submitButton.disabled = true;

    try {
        await sendOrder(data);

        clearOrder();
        updateOrderPage();
        orderForm.reset();
        showNotification('Заказ успешно оформлен');
    } catch (sendError) {
        console.error('Не удалось оформить заказ:', sendError);

        const reason = sendError instanceof TypeError
            ? 'Нет связи с сервером'
            : sendError.message;

        showNotification(`Не удалось оформить заказ. ${reason}`);
    } finally {
        submitButton.disabled = false;
    }
});

restoreOrder();
updateOrderPage();

window.addEventListener('pageshow', event => {
    if (event.persisted && dishes.length) {
        restoreOrder();
        updateOrderPage();
    }
});
