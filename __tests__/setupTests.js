// setupTests.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Использование in-memory базы данных для тестов

global.db = db; // Делаем db доступным глобально

// Создание таблиц
beforeAll((done) => {
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

        done();
    });
});

// Закрытие базы данных после всех тестов
afterAll((done) => {
    db.close(done);
});