const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Добавляем cors

const app = express();
const port = 3000;

app.use(cors()); // Добавляем middleware cors

app.use(bodyParser.json({
    origin: 'http://localhost:3001', // Разрешаем запросы только с этого источника
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешаем указанные HTTP-методы
    credentials: true, // Разрешаем передачу куки
    optionsSuccessStatus: 204, // Устанавливаем статус успешного ответа для OPTIONS-запросов
}));

// Подключение к базе данных SQLite
const db = new sqlite3.Database('./bookstore.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Подключено к базе данных bookstore.db');
});

// Создание таблиц (если их нет)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Authors (
            author_id INTEGER PRIMARY KEY AUTOINCREMENT,
            author_name VARCHAR(255) NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Genres (
            genre_id INTEGER PRIMARY KEY AUTOINCREMENT,
            genre_name VARCHAR(255) NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Books (
            book_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(255) NOT NULL,
            author_id INTEGER,
            genre_id INTEGER,
            publication_year INTEGER,
            description TEXT,
            price DECIMAL(10, 2),
            stock_quantity INTEGER,
            isbn VARCHAR(20),
            image_url VARCHAR(255),
            FOREIGN KEY (author_id) REFERENCES Authors(author_id),
            FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            address VARCHAR(255),
            phone_number VARCHAR(20),
            registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Orders (
            order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            total_amount DECIMAL(10, 2),
            order_status VARCHAR(50),
            FOREIGN KEY (user_id) REFERENCES Users(user_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Order_Details (
            order_detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            book_id INTEGER,
            quantity INTEGER,
            price DECIMAL(10, 2),
            FOREIGN KEY (order_id) REFERENCES Orders(order_id),
            FOREIGN KEY (book_id) REFERENCES Books(book_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Rentals (
            rental_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            book_id INTEGER,
            rental_start_date DATE,
            rental_end_date DATE,
            rental_status VARCHAR(50),
            FOREIGN KEY (user_id) REFERENCES Users(user_id),
            FOREIGN KEY (book_id) REFERENCES Books(book_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Admins (
            admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `);

    // Добавление первого администратора (для примера)
    db.get(`SELECT COUNT(*) as count FROM Admins`, [], (err, row) => {
        if (row.count === 0) {
            db.run(`INSERT INTO Admins (username, password) VALUES (?, ?)`, ['admin', 'password']);
        }
    });

    // Заполнение тестовыми данными
    require('./seed');
});

// Эндпоинты

// Книги
app.get('/books', (req, res) => {
    db.all(`
        SELECT Books.*, Authors.author_name, Genres.genre_name
        FROM Books
        LEFT JOIN Authors ON Books.author_id = Authors.author_id
        LEFT JOIN Genres ON Books.genre_id = Genres.genre_id
    `, [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.post('/books', (req, res) => {
    const book = req.body;
    db.run(`
        INSERT INTO Books (title, author_id, genre_id, publication_year, description, price, stock_quantity, isbn, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [book.title, book.author_id, book.genre_id, book.publication_year, book.description, book.price, book.stock_quantity, book.isbn, book.image_url], (err) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json({ message: 'Книга добавлена успешно!' });
    });
});

app.get('/books/:id', (req, res) => {
    const id = req.params.id;
    db.get(`
        SELECT Books.*, Authors.author_name, Genres.genre_name
        FROM Books
        LEFT JOIN Authors ON Books.author_id = Authors.author_id
        LEFT JOIN Genres ON Books.genre_id = Genres.genre_id
        WHERE book_id = ?
    `, [id], (err, row) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).send('Книга не найдена!');
        }
    });
});

app.put('/books/:id', (req, res) => {
    const id = req.params.id;
    const book = req.body;
    db.run(`
        UPDATE Books
        SET title = ?, author_id = ?, genre_id = ?, publication_year = ?, description = ?, price = ?, stock_quantity = ?, isbn = ?, image_url = ?
        WHERE book_id = ?
    `, [book.title, book.author_id, book.genre_id, book.publication_year, book.description, book.price, book.stock_quantity, book.isbn, book.image_url, id], (err) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json({ message: 'Книга обновлена успешно!' });
    });
});

app.delete('/books/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM Books WHERE book_id = ?`, [id], (err) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json({ message: 'Книга удалена успешно!' });
    });
});

app.get('/books/author/:authorName', (req, res) => {
    const authorName = req.params.authorName;
    db.all(`
        SELECT Books.*, Authors.author_name, Genres.genre_name
        FROM Books
        LEFT JOIN Authors ON Books.author_id = Authors.author_id
        LEFT JOIN Genres ON Books.genre_id = Genres.genre_id
        WHERE Authors.author_name = ?
    `, [authorName], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

// Пользователи
app.post('/users/register', async (req, res) => {
    const { username, password, email, address, phone_number } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(`
            INSERT INTO Users (username, password, email, address, phone_number)
            VALUES (?, ?, ?, ?, ?)
        `, [username, hashedPassword, email, address, phone_number], (err) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.json({ message: 'Пользователь зарегистрирован успешно!' });
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/users/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM Users WHERE username = ?`, [username], async (err, row) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        if (row) {
            const passwordMatch = await bcrypt.compare(password, row.password);
            if (passwordMatch) {
                res.json({ message: 'Пользователь аутентифицирован!' });
            } else {
                res.status(401).send('Неверный пароль!');
            }
        } else {
            res.status(404).send('Пользователь не найден!');
        }
    });
});

app.get('/users/:userId/rentals', (req, res) => {
    const userId = req.params.userId;
    db.all(`
        SELECT Books.*, Rentals.rental_start_date, Rentals.rental_end_date, Rentals.rental_status
        FROM Rentals
        LEFT JOIN Books ON Rentals.book_id = Books.book_id
        WHERE Rentals.user_id = ?
    `, [userId], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.get('/users/:userId/orders', (req, res) => {
    const userId = req.params.userId;
    db.all(`
        SELECT Orders.*, Order_Details.quantity, Order_Details.price, Books.title
        FROM Orders
        LEFT JOIN Order_Details ON Orders.order_id = Order_Details.order_id
        LEFT JOIN Books ON Order_Details.book_id = Books.book_id
        WHERE Orders.user_id = ?
    `, [userId], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.get('/users/:userId/rentals/history', (req, res) => {
    const userId = req.params.userId;
    db.all(`
        SELECT Books.*, Rentals.rental_start_date, Rentals.rental_end_date, Rentals.rental_status
        FROM Rentals
        LEFT JOIN Books ON Rentals.book_id = Books.book_id
        WHERE Rentals.user_id = ? AND Rentals.rental_status = 'завершена'
    `, [userId], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

// Администраторы
app.post('/admins/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(`
            INSERT INTO Admins (username, password)
            VALUES (?, ?)
            `, [username, hashedPassword], (err) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.json({ message: 'Администратор зарегистрирован успешно!' });
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/admins/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM Admins WHERE username = ?`, [username], async (err, row) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        if (row) {
            const passwordMatch = await bcrypt.compare(password, row.password);
            if (passwordMatch) {
                res.json({ message: 'Администратор аутентифицирован!' });
            } else {
                res.status(401).send('Неверный пароль!');
            }
        } else {
            res.status(404).send('Администратор не найден!');
        }
    });
});

app.get('/admin/users', (req, res) => {
    db.all(`SELECT * FROM Users`, [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.get('/admin/orders', (req, res) => {
    db.all(`
        SELECT Orders.*, Users.username
        FROM Orders
        LEFT JOIN Users ON Orders.user_id = Users.user_id
    `, [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.get('/admin/rentals', (req, res) => {
    db.all(`
        SELECT Rentals.*, Users.username, Books.title
        FROM Rentals
        LEFT JOIN Users ON Rentals.user_id = Users.user_id
        LEFT JOIN Books ON Rentals.book_id = Books.book_id
    `, [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.post('/rentals', (req, res) => {
    const rental = req.body;
    db.run(`
        INSERT INTO Rentals (user_id, book_id, rental_start_date, rental_end_date, rental_status)
        VALUES (?, ?, ?, ?, ?)
    `, [rental.user_id, rental.book_id, rental.rental_start_date, rental.rental_end_date, rental.rental_status], (err) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json({ message: 'Аренда создана успешно!' });
    });
});

app.get('/rentals/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT * FROM Rentals WHERE rental_id = ?`, [id], (err, row) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).send('Аренда не найдена!');
        }
    });
});

app.put('/rentals/:id', (req, res) => {
    const id = req.params.id;
    const rental = req.body;
    db.run(`
        UPDATE Rentals
        SET user_id = ?, book_id = ?, rental_start_date = ?, rental_end_date = ?, rental_status = ?
        WHERE rental_id = ?
    `, [rental.user_id, rental.book_id, rental.rental_start_date, rental.rental_end_date, rental.rental_status, id], (err) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json({ message: 'Аренда обновлена успешно!' });
    });
});

app.delete('/rentals/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM Rentals WHERE rental_id = ?`, [id], (err) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json({ message: 'Аренда удалена успешно!' });
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

module.exports = app;