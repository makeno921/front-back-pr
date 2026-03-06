const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

const JWT_SECRET = 'secret_key_2026';

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

let users = [];

app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204
}));

app.use(express.json());

// Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Book Haven API',
            version: '1.0.0',
            description: 'API для аутентификации и управления продуктами'
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./app.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Аутентификация (JWT)
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token" });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
}

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Регистрация нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "user@example.com"
 *             password: "qwerty123"
 *     responses:
 *       201:
 *         description: Пользователь зарегистрирован
 */
app.post("/auth/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email и password обязательны" });
    if (users.find(u => u.email === email)) return res.status(400).json({ error: "Пользователь существует" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: nanoid(6), email, password: hashedPassword };
    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token });
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Вход в систему
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          example:
 *             email: "user@example.com"
 *             password: "qwerty123"
 *     responses:
 *       200:
 *         description: Успешный вход
 */
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: "Неверные данные" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Неверные данные" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Информация о текущем пользователе
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя
 *       401:
 *         description: Неавторизован
 */
app.get("/auth/me", authenticate, (req, res) => {
    res.json({ id: req.user.id, email: req.user.email });
});

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Список всех товаров
 *     responses:
 *       200:
 *         description: Список товаров
 */
app.get("/products", (req, res) => res.json(products));

/**
 * @openapi
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Создать новый товар
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          example:
 *             name: "Война и мир"
 *             category: "Роман"
 *             description: "Роман эпопея Льва Толстого"
 *             price: 500
 *             stock: 32
 *             rating: 5
 *             image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3u2a1Mmsw6L-D-BRSKUbDif7ban1AjdkPYw&s"
 *     responses:
 *       201:
 *         description: Товар создан
 *       401:
 *         description: Неавторизован
 */
app.post("/products", authenticate, (req, res) => {
    const { name, category, description, price, stock, rating, image } = req.body;
    if (!name || !category || !description || price === undefined || stock === undefined) {
        return res.status(400).json({ error: "Missing fields" });
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
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Получить товар по ID
 *     security:
 *       - bearerAuth: []
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
app.get("/products/:id", (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
});

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     tags: [Products]
 *     summary: Обновить товар
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Товар обновлён
 *       404:
 *         description: Товар не найден
 *       401:
 *         description: Неавторизован
 */
app.patch("/products/:id", authenticate, (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    Object.assign(product, req.body);
    res.json(product);
});

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Удалить товар
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Неавторизован
 */
app.delete("/products/:id", authenticate, (req, res) => {
    products = products.filter(p => p.id !== req.params.id);
    res.status(204).send();
});

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(port, () => {
    console.log(`Сервер: http://localhost:${port}`);
    console.log(`Swagger: http://localhost:${port}/api-docs`);
});