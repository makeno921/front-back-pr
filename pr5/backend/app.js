const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// ================== ДАННЫЕ ==================
let products = [
    {id: nanoid(6), name: '1984', category: 'Антиутопия', description: 'Классическая антиутопия Джорджа Орвелла о тоталитарном обществе.', price: 450, stock: 25, rating: 4.9, image: 'https://avatars.mds.yandex.net/get-mpic/1331400/img_id8422815951371681153.jpeg/orig'},
    {id: nanoid(6), name: 'Мастер и Маргарита', category: 'Классика', description: 'Роман Михаила Булгакова, сочетающий сатиру и фантастику.', price: 550, stock: 18, rating: 4.8, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_pj99Hv5Kcpj9iTS6qL8bRqsdgi99qX887H91scdzSXqdK2J9bct6ocuXW5tv1Ftqw0LfwAWw9QvlMPtZneKbjb29Ppss0GAhcQa3zcM&s=10'},
    {id: nanoid(6), name: 'Преступление и наказание', category: 'Классика', description: 'Психологический роман Федора Достоевского.', price: 400, stock: 30, rating: 4.7, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr9UPlicG2AeFG2ipFic9GERWorMkH_EXNk7dBiHmjCTo-ec0mgRQ8rtLYl60ImJT82qgn_frtfxiKzhGi93YK6ksofW_-YgTJZ49B2g1yRw&s=10'},
    {id: nanoid(6), name: 'Гарри Поттер и философский камень', category: 'Фэнтези', description: 'Первая книга серии о юном волшебнике.', price: 600, stock: 12, rating: 4.9, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzS-qFta5oa_rGXqMBTGAYEFqvh5X_QgU2qQ&s'},
    {id: nanoid(6), name: 'Властелин колец: Братство кольца', category: 'Фэнтези', description: 'Эпическая сага Дж.Р.Р. Толкина.', price: 650, stock: 8, rating: 4.8, image: 'https://flibusta.su/b/img/big/4883.jpg'},
    {id: nanoid(6), name: 'Убить пересмешника', category: 'Драма', description: 'Роман Харпер Ли о расизме в Америке.', price: 500, stock: 20, rating: 4.6, image: 'https://rahvaraamat.ee/_next/image?url=https%3A%2F%2Fra-product-image.s3.eu-north-1.amazonaws.com%2Ffc%2F86%2Ffc86167f24af771407fa7d6bec9aee33_origin_1.jpg&w=3840&q=90'},
    {id: nanoid(6), name: 'Гордость и предубеждение', category: 'Романтика', description: 'Классика Джейн Остин.', price: 350, stock: 22, rating: 4.5, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGZRJrGDIJJkCIx8SVb9yLHjwdxgbakmfWsw&s'},
    {id: nanoid(6), name: '451 градус по Фаренгейту', category: 'Антиутопия', description: 'Роман Рэя Брэдбери о мире без книг.', price: 420, stock: 15, rating: 4.7, image: 'https://flibusta.su/b/img/big/158.jpg'},
    {id: nanoid(6), name: 'Моби Дик или Белый Кит', category: 'Приключения', description: 'Роман Германа Мелвилла о китобое.', price: 480, stock: 10, rating: 4.4, image: 'https://cdn.ast.ru/v2/ASE000000000720487/COVER/cover1__w340.jpg'},
    {id: nanoid(6), name: 'Маленький принц', category: 'Детская литература', description: 'Философская сказка Антуана де Сент-Экзюпери.', price: 300, stock: 35, rating: 5.0, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnZbjnSaNww186IteN2SpFvM1KFK0Ukx-Mzw&s'}
];

// ================== SWAGGER ==================
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Book Haven API',
            version: '1.0.0',
            description: 'API товаров (практическое занятие №5)'
        },
        servers: [{ url: 'http://localhost:3000' }]
    },
    apis: ['./app.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ================== MIDDLEWARE ==================
app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());

// ================== ТОВАРЫ ==================

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags: [Товары]
 *     summary: Получить список всех товаров
 *     responses:
 *       200:
 *         description: Список товаров
 */
app.get("/api/products", (req, res) => res.json(products));

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags: [Товары]
 *     summary: Создать новый товар
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: ""
 *             category: ""
 *             description: ""
 *             price:
 *             stock:
 *             rating:
 *             image: ""
 *     responses:
 *       201:
 *         description: Товар успешно создан
 */
app.post("/api/products", (req, res) => {
    const { name, category, description, price, stock, rating, image } = req.body;
    if (!name || !category || !description || price === undefined || stock === undefined) {
        return res.status(400).json({ error: "Отсутствуют обязательные поля" });
    }
    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
        rating: Number(rating || 0),
        image: image ? image.trim() : `https://picsum.photos/id/${Math.floor(Math.random()*200)+1}/300/200`
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags: [Товары]
 *     summary: Получить товар по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар найден
 *       404:
 *         description: Товар не найден
 */
app.get("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).json({ error: "Товар не найден" });
    res.json(product);
});

/**
 * @openapi
 * /api/products/{id}:
 *   patch:
 *     tags: [Товары]
 *     summary: Обновить существующий товар
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             name: ""
 *             category: ""
 *             description: ""
 *             price:
 *             stock:
 *             rating:
 *             image: ""
 *     responses:
 *       200:
 *         description: Товар обновлён
 *       404:
 *         description: Товар не найден
 */
app.patch("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).json({ error: "Товар не найден" });
    Object.assign(product, req.body);
    res.json(product);
});

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     tags: [Товары]
 *     summary: Удалить товар
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Товар удалён
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", (req, res) => {
    const exists = products.some(p => p.id === req.params.id);
    if (!exists) return res.status(404).json({ error: "Товар не найден" });
    products = products.filter(p => p.id !== req.params.id);
    res.status(204).send();
});

// ================== ЗАПУСК ==================
app.listen(port, () => {
    console.log(`Сервер запущен → http://localhost:${port}`);
    console.log(`Swagger UI → http://localhost:${port}/api-docs`);
});