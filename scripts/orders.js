// лаба 9: страница «Заказы» — просмотр, редактирование и удаление заказов
// используются API_URL и API_KEY из api.js, а также categories и showNotification из order.js

const ordersStatus = document.getElementById('orders-status');
const ordersTableWrap = document.getElementById('orders-table-wrap');
const ordersList = document.getElementById('orders-list');

const editForm = document.getElementById('edit-form');
const deleteButton = document.getElementById('delete-confirm');

let orders = [];
let currentOrder = null;

// блюда по id — для названий в составе и стоимости
const dishesById = new Map(dishes.map(dish => [dish.id, dish]));

// запрос к API с ключом в строке запроса
async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_URL}/labs/api/${path}?api_key=${API_KEY}`, options);
    const body = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(body?.error ?? `Сервер ответил с кодом ${response.status}`);
    }

    return body;
}

// экранирование пользовательских данных перед вставкой через innerHTML
function esc(value) {
    const span = document.createElement('span');
    span.textContent = value ?? '';
    return span.innerHTML;
}

// в ответе API больше 3 знаков после точки — лишние доли секунды отбрасываем
function parseDate(value) {
    return new Date(String(value).replace(/(\.\d{3})\d+/, '$1'));
}

function formatDate(value) {
    const date = parseDate(value);
    if (Number.isNaN(date.getTime())) return value;

    const pad = number => String(number).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} `
        + `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// блюда заказа по категориям, пустые поля пропускаем
function getOrderItems(order) {
    return categories
        .filter(({ apiField }) => order[apiField] !== null)
        .map(({ title, apiField }) => {
            const dish = dishesById.get(order[apiField]);
            return {
                title,
                name: dish ? dish.name : `Блюдо #${order[apiField]}`,
                price: dish ? dish.price : 0
            };
        });
}

function getOrderTotal(order) {
    return getOrderItems(order).reduce((sum, item) => sum + item.price, 0);
}

function getDeliveryText(order) {
    return order.delivery_type === 'by_time'
        ? order.delivery_time ?? '—'
        : 'Как можно скорее (с 7:00 до 23:00)';
}

function compositionHtml(order) {
    const items = getOrderItems(order);
    if (!items.length) return '<p>Состав не указан</p>';

    return items
        .map(item => `
            <p class="modal-row">
                <span>${esc(item.title)}</span>
                <span>${esc(item.name)} (${item.price}₽)</span>
            </p>
        `)
        .join('');
}

function openModal(id) {
    document.getElementById(id).hidden = false;
}

function closeModal(id) {
    document.getElementById(id).hidden = true;
}

// загрузка списка: новые заказы сверху
async function loadOrders() {
    ordersStatus.hidden = false;
    ordersStatus.textContent = 'Загрузка заказов…';
    ordersTableWrap.hidden = true;

    try {
        orders = await apiRequest('orders');
        orders.sort((a, b) => parseDate(b.created_at) - parseDate(a.created_at));
        renderOrders();
    } catch (error) {
        ordersStatus.textContent = `Не удалось загрузить заказы. ${error.message}`;
    }
}

function renderOrders() {
    if (!orders.length) {
        ordersStatus.hidden = false;
        ordersStatus.innerHTML = 'У вас пока нет заказов. '
            + '<a href="menu.html">Соберите ланч</a>, чтобы оформить первый.';
        ordersTableWrap.hidden = true;
        return;
    }

    ordersStatus.hidden = true;
    ordersTableWrap.hidden = false;

    ordersList.replaceChildren(...orders.map((order, index) => {
        const row = document.createElement('tr');
        const dishesText = getOrderItems(order).map(item => item.name).join(', ');

        row.innerHTML = `
            <td data-label="№">${index + 1}</td>
            <td data-label="Дата">${formatDate(order.created_at)}</td>
            <td class="orders-dishes" data-label="Состав">${esc(dishesText)}</td>
            <td data-label="Стоимость">${getOrderTotal(order)}₽</td>
            <td data-label="Доставка">${esc(getDeliveryText(order))}</td>
            <td class="orders-actions" data-label="Действия">
                <button type="button" class="orders-action" data-action="view" data-id="${order.id}">Подробнее</button>
                <button type="button" class="orders-action" data-action="edit" data-id="${order.id}">Редактировать</button>
                <button type="button" class="orders-action orders-action--danger" data-action="delete" data-id="${order.id}">Удалить</button>
            </td>
        `;

        return row;
    }));
}

function openView(order) {
    document.getElementById('view-body').innerHTML = `
        <p class="modal-row"><span>Дата оформления</span><span>${formatDate(order.created_at)}</span></p>

        <h3>Доставка</h3>
        <p class="modal-row"><span>Имя получателя</span><span>${esc(order.full_name)}</span></p>
        <p class="modal-row"><span>Адрес доставки</span><span>${esc(order.delivery_address)}</span></p>
        <p class="modal-row"><span>Время доставки</span><span>${esc(getDeliveryText(order))}</span></p>
        <p class="modal-row"><span>Телефон</span><span>${esc(order.phone)}</span></p>
        <p class="modal-row"><span>Email</span><span>${esc(order.email)}</span></p>

        <h3>Комментарий</h3>
        <p>${esc(order.comment ?? '') || '—'}</p>

        <h3>Состав заказа</h3>
        ${compositionHtml(order)}

        <p class="modal-total">Стоимость: ${getOrderTotal(order)}₽</p>
    `;

    openModal('view-modal');
}

// время доставки нужно только для доставки ко времени
function toggleDeliveryTime() {
    const byTime = editForm.elements.delivery_type.value === 'by_time';
    editForm.elements.delivery_time.disabled = !byTime;
    editForm.elements.delivery_time.required = byTime;
}

function openEdit(order) {
    editForm.elements.full_name.value = order.full_name;
    editForm.elements.email.value = order.email;
    editForm.elements.phone.value = order.phone;
    editForm.elements.delivery_address.value = order.delivery_address;
    editForm.elements.delivery_type.value = order.delivery_type;
    editForm.elements.delivery_time.value = order.delivery_time ?? '';
    editForm.elements.comment.value = order.comment ?? '';

    document.getElementById('edit-date').textContent = formatDate(order.created_at);
    document.getElementById('edit-composition').innerHTML = compositionHtml(order);
    document.getElementById('edit-total').textContent = `${getOrderTotal(order)}₽`;

    toggleDeliveryTime();
    openModal('edit-modal');
}

function openDelete(order) {
    document.getElementById('delete-modal').querySelector('p').textContent =
        `Вы уверены, что хотите удалить заказ от ${formatDate(order.created_at)}?`;

    openModal('delete-modal');
}

ordersList.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    const order = orders.find(item => item.id === Number(button.dataset.id));
    if (!order) return;

    currentOrder = order;

    if (button.dataset.action === 'view') openView(order);
    if (button.dataset.action === 'edit') openEdit(order);
    if (button.dataset.action === 'delete') openDelete(order);
});

// крестик и кнопки отмены закрывают окно; клик по фону тоже
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', event => {
        if (event.target.closest('[data-close]') || event.target === modal) {
            modal.hidden = true;
        }
    });
});

editForm.elements.delivery_type.addEventListener('change', toggleDeliveryTime);

editForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!currentOrder) return;

    const data = {
        full_name: editForm.elements.full_name.value.trim(),
        email: editForm.elements.email.value.trim(),
        phone: editForm.elements.phone.value.trim(),
        delivery_address: editForm.elements.delivery_address.value.trim(),
        delivery_type: editForm.elements.delivery_type.value,
        comment: editForm.elements.comment.value.trim()
    };

    if (data.delivery_type === 'by_time') {
        data.delivery_time = editForm.elements.delivery_time.value;
    }

    // серверу достаточно передать только изменившиеся поля
    const changes = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== (currentOrder[key] ?? ''))
    );

    if (!Object.keys(changes).length) {
        closeModal('edit-modal');
        showNotification('Данные заказа не изменились');
        return;
    }

    const saveButton = editForm.querySelector('[type="submit"]');
    saveButton.disabled = true;

    try {
        await apiRequest(`orders/${currentOrder.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(changes)
        });

        closeModal('edit-modal');
        showNotification('Заказ успешно изменён');
        await loadOrders();
    } catch (error) {
        showNotification(`Не удалось изменить заказ. ${error.message}`);
    } finally {
        saveButton.disabled = false;
    }
});

deleteButton.addEventListener('click', async () => {
    if (!currentOrder) return;

    deleteButton.disabled = true;

    try {
        await apiRequest(`orders/${currentOrder.id}`, { method: 'DELETE' });

        closeModal('delete-modal');
        showNotification('Заказ успешно удалён');
        await loadOrders();
    } catch (error) {
        showNotification(`Не удалось удалить заказ. ${error.message}`);
    } finally {
        deleteButton.disabled = false;
    }
});

loadOrders();
