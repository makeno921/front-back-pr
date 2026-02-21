const express = require('express');
const app = express();
const port = 3000;

//список товаров
let goods = [
    {id: 1, name: 'камаз', price: 176},
    {id: 2, name: 'вантуз', price: 185},
    {id: 3, name: 'стол', price: 204},
]

// Middleware для парсинга JSON
app.use(express.json());
// Главная страница
app.get('/', (req, res) => {
    res.send('Главная страница товаров');
});

//создать товар
app.post('/goods', (req, res) => {
    const {name, price} = req.body;
    const newGoods = {
        id: Date.now(),
        name,
        price,
    };
    goods.push(newGoods);
    res.status(201).json(newGoods);
});

//пролучить список всех товаров
app.get('/goods', (req, res) => {
    res.send(JSON.stringify(goods));
});

//пролучить список товаров по id
app.get('/goods/:id', (req,res) => {
    let item = goods.find(g => g.id == req.params.id);
    res.send(JSON.stringify(item));
});

//редактирование товара по id
app.patch('/goods/:id', (req,res) => {
    const item = goods.find(g=> g.id == req.params.id);
    const {name, price} = req.body;
    if (name !== undefined) item.name = name;
    if (price !== undefined) item.price = price;

    res.json(item);
});

//удаление товара по id
app.delete('/goods/:id', (req,res) => {
    goods=goods.filter(g=>g.id != req.params.id);
    res.send('OK');
});

//запуск
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});