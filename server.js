const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 📌 Раздаём статику (чтобы сайт загружался)
app.use(express.static(path.join(__dirname, "public")));

// 📌 Главная страница
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "inv.html"));
});

// 📌 Файл для хранения гостей
const DATA_FILE = path.join(__dirname, "data.json");

// 📌 Функция чтения гостей
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    } catch (error) {
        console.error("Ошибка чтения data.json:", error);
        return [];
    }
};

// 📌 Функция записи гостей
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Ошибка записи data.json:", error);
    }
};

// 📌 Получить список гостей
app.get("/guests", (req, res) => {
    const guests = readData();
    res.json(guests);
});

// 📌 Сохранить анкету
app.post("/submit", (req, res) => {
    const { name, attending } = req.body;
    if (!name || !attending) {
        return res.status(400).json({ message: "Барлық өрістерді толтырыңыз." });
    }

    const guests = readData();
    guests.push({ name, attending });
    writeData(guests);

    res.json({ message: "Қатысу сәтті расталды!" });
});

// 📌 Запускаем сервер
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
});
