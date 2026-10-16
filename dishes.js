const dishes = [
    // СУПЫ
    // fish — 2
    {
        keyword: 'tomyam',
        name: 'Том Ям',
        price: 450,
        category: 'soup',
        count: '400 мл',
        image: 'tomyam',
        kind: 'fish'
    },
    {
        keyword: 'miso',
        name: 'Мисо-суп с лососем',
        price: 380,
        category: 'soup',
        count: '350 мл',
        image: 'miso',
        kind: 'fish'
    },

    // meat — 2
    {
        keyword: 'phobo',
        name: 'Фо Бо',
        price: 420,
        category: 'soup',
        count: '450 мл',
        image: 'phobo',
        kind: 'meat'
    },
    {
        keyword: 'kimchi',
        name: 'Кимчи-чиге',
        price: 410,
        category: 'soup',
        count: '400 мл',
        image: 'kimchenin',
        kind: 'meat'
    },

    // veg — 2
    {
        keyword: 'tomkha',
        name: 'Том Кха',
        price: 390,
        category: 'soup',
        count: '400 мл',
        image: 'tomkha',
        kind: 'veg'
    },
    {
        keyword: 'vegramen',
        name: 'Овощной рамен',
        price: 360,
        category: 'soup',
        count: '420 мл',
        image: 'vegramen',
        kind: 'veg'
    },

    // ГЛАВНЫЕ БЛЮДА
    // fish — 2
    {
        keyword: 'padthai',
        name: 'Пад Тай с креветками',
        price: 420,
        category: 'main',
        count: '320 г',
        image: 'padtai',
        kind: 'fish'
    },
    {
        keyword: 'salmonteriyaki',
        name: 'Лосось терияки с рисом',
        price: 480,
        category: 'main',
        count: '350 г',
        image: 'salmonteriyaki',
        kind: 'fish'
    },

    // meat — 2
    {
        keyword: 'kungpao',
        name: 'Кунг Пао с курицей',
        price: 370,
        category: 'main',
        count: '350 г',
        image: 'kungchtototam',
        kind: 'meat'
    },
    {
        keyword: 'bulgogi',
        name: 'Пулгоги с говядиной',
        price: 450,
        category: 'main',
        count: '340 г',
        image: 'bulgogi',
        kind: 'meat'
    },

    // veg — 2
    {
        keyword: 'vegpadthai',
        name: 'Пад Тай овощной',
        price: 340,
        category: 'main',
        count: '300 г',
        image: 'vegpadthai',
        kind: 'veg'
    },
    {
        keyword: 'tofu',
        name: 'Тофу в кисло-сладком соусе',
        price: 320,
        category: 'main',
        count: '280 г',
        image: 'tofu',
        kind: 'veg'
    },

    //  САЛАТЫ
    // fish — 1
    {
        keyword: 'tunasalad',
        name: 'Салат с тунцом',
        price: 390,
        category: 'salad',
        count: '250 г',
        image: 'tunasalad',
        kind: 'fish'
    },

    // meat — 1
    {
        keyword: 'chickensalad',
        name: 'Салат с курицей терияки',
        price: 360,
        category: 'salad',
        count: '240 г',
        image: 'chickensalad',
        kind: 'meat'
    },

    // veg — 4
    {
        keyword: 'kimchisalad',
        name: 'Салат с кимчи',
        price: 280,
        category: 'salad',
        count: '200 г',
        image: 'kimchisalad',
        kind: 'veg'
    },
    {
        keyword: 'seaweed',
        name: 'Салат из водорослей',
        price: 250,
        category: 'salad',
        count: '180 г',
        image: 'seaweed',
        kind: 'veg'
    },
    {
        keyword: 'springrolls',
        name: 'Спринг-роллы овощные',
        price: 310,
        category: 'salad',
        count: '4 шт',
        image: 'springrolls',
        kind: 'veg'
    },
    {
        keyword: 'edamame',
        name: 'Эдамаме',
        price: 220,
        category: 'salad',
        count: '150 г',
        image: 'edamame',
        kind: 'veg'
    },

    // НАПИТКИ
    // cold — 3
    {
        keyword: 'lemonade',
        name: 'Домашний лимонад',
        price: 180,
        category: 'drink',
        count: '400 мл',
        image: 'limonad',
        kind: 'cold'
    },
    {
        keyword: 'coconut',
        name: 'Кокосовая вода',
        price: 150,
        category: 'drink',
        count: '330 мл',
        image: 'koks',
        kind: 'cold'
    },
    {
        keyword: 'thaitea',
        name: 'Тайский холодный чай',
        price: 170,
        category: 'drink',
        count: '350 мл',
        image: 'thaitea',
        kind: 'cold'
    },

    // hot — 3
    {
        keyword: 'greentea',
        name: 'Зелёный чай',
        price: 120,
        category: 'drink',
        count: '300 мл',
        image: 'greentea',
        kind: 'hot'
    },
    {
        keyword: 'jasminetea',
        name: 'Чай с жасмином',
        price: 130,
        category: 'drink',
        count: '300 мл',
        image: 'jasminetea',
        kind: 'hot'
    },
    {
        keyword: 'matcha',
        name: 'Матча латте',
        price: 220,
        category: 'drink',
        count: '300 мл',
        image: 'matcha',
        kind: 'hot'
    },

    // ДЕСЕРТЫ (6)
    // small — 3
    {
        keyword: 'mochi',
        name: 'Моти (2 шт)',
        price: 190,
        category: 'dessert',
        count: '80 г',
        image: 'mochi',
        kind: 'small'
    },
    {
        keyword: 'dorayaki',
        name: 'Дораяки',
        price: 160,
        category: 'dessert',
        count: '90 г',
        image: 'dorayaki',
        kind: 'small'
    },
    {
        keyword: 'sesameball',
        name: 'Кунжутный шарик',
        price: 140,
        category: 'dessert',
        count: '70 г',
        image: 'sesameball',
        kind: 'small'
    },

    // medium — 2
    {
        keyword: 'mangopudding',
        name: 'Манговый пудинг',
        price: 250,
        category: 'dessert',
        count: '150 г',
        image: 'mangopudding',
        kind: 'medium'
    },
    {
        keyword: 'bananefritter',
        name: 'Банановые фриттеры',
        price: 230,
        category: 'dessert',
        count: '180 г',
        image: 'bananefritter',
        kind: 'medium'
    },

    // large — 1
    {
        keyword: 'bingsu',
        name: 'Бингсу с манго',
        price: 420,
        category: 'dessert',
        count: '400 г',
        image: 'bingsu',
        kind: 'large'
    }
];