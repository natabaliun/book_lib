const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bookstore.db');

function addAuthor(name, callback) {
    db.run('INSERT INTO Authors (author_name) VALUES (?)', [name], function(err) {
        if (err) {
            return callback(err);
        }
        callback(null, this.lastID);
    });
}

function addGenre(name, callback) {
    db.run('INSERT INTO Genres (genre_name) VALUES (?)', [name], function(err) {
        if (err) {
            return callback(err);
        }
        callback(null, this.lastID);
    });
}

function addBook(title, authorId, genreId, publicationYear, description, price, stockQuantity, isbn, imageUrl, callback) {
    db.run(`
        INSERT INTO Books (title, author_id, genre_id, publication_year, description, price, stock_quantity, isbn, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, authorId, genreId, publicationYear, description, price, stockQuantity, isbn, imageUrl], callback);
}

let authorIds = {};
let genreIds = {};

addAuthor('Лев Толстой', (err, id) => { authorIds['Лев Толстой'] = id; });
addAuthor('Федор Достоевский', (err, id) => { authorIds['Федор Достоевский'] = id; });
addAuthor('Михаил Булгаков', (err, id) => { authorIds['Михаил Булгаков'] = id; });
addAuthor('Александр Пушкин', (err, id) => { authorIds['Александр Пушкин'] = id; });
addAuthor('Антон Чехов', (err, id) => { authorIds['Антон Чехов'] = id; });
addAuthor('Сергей Лукьяненко', (err, id) => { authorIds['Сергей Лукьяненко'] = id; });
addAuthor('Дмитрий Глуховский', (err, id) => { authorIds['Дмитрий Глуховский'] = id; });
addAuthor('Борис Акунин', (err, id) => { authorIds['Борис Акунин'] = id; });
addAuthor('Стивен Кинг', (err, id) => { authorIds['Стивен Кинг'] = id; });
addAuthor('Джоан Роулинг', (err, id) => { authorIds['Джоан Роулинг'] = id; });
addAuthor('Джордж Оруэлл', (err, id) => { authorIds['Джордж Оруэлл'] = id; });
addAuthor('Рэй Брэдбери', (err, id) => { authorIds['Рэй Брэдбери'] = id; });
addAuthor('Эрих Мария Ремарк', (err, id) => { authorIds['Эрих Мария Ремарк'] = id; });
addAuthor('Габриэль Гарсиа Маркес', (err, id) => { authorIds['Габриэль Гарсиа Маркес'] = id; });
addAuthor('Пауло Коэльо', (err, id) => { authorIds['Пауло Коэльо'] = id; });
addAuthor('Харуки Мураками', (err, id) => { authorIds['Харуки Мураками'] = id; });
addAuthor('Макс Фрай', (err, id) => { authorIds['Макс Фрай'] = id; });
addAuthor('Людмила Улицкая', (err, id) => { authorIds['Людмила Улицкая'] = id; });
addAuthor('Виктор Пелевин', (err, id) => { authorIds['Виктор Пелевин'] = id; });
addAuthor('Евгений Водолазкин', (err, id) => { authorIds['Евгений Водолазкин'] = id; });

addGenre('Классика', (err, id) => { genreIds['Классика'] = id; });
addGenre('Фантастика', (err, id) => { genreIds['Фантастика'] = id; });
addGenre('Детектив', (err, id) => { genreIds['Детектив'] = id; });
addGenre('Фэнтези', (err, id) => { genreIds['Фэнтези'] = id; });
addGenre('Антиутопия', (err, id) => { genreIds['Антиутопия'] = id; });
addGenre('Роман', (err, id) => { genreIds['Роман'] = id; });
addGenre('Магический реализм', (err, id) => { genreIds['Магический реализм'] = id; });
addGenre('Современная проза', (err, id) => { genreIds['Современная проза'] = id; });

addBook('Война и мир', authorIds['Лев Толстой'], genreIds['Классика'], 1869, 'Роман-эпопея о русском обществе в эпоху наполеоновских войн.', 500.00, 10, '978-5-17-098251-1', 'https://example.com/war_and_peace.jpg', () => {});
addBook('Преступление и наказание', authorIds['Федор Достоевский'], genreIds['Классика'], 1866, 'Психологический роман о студенте, совершившем убийство.', 450.00, 8, '978-5-17-098252-8', 'https://example.com/crime_and_punishment.jpg', () => {});
addBook('Мастер и Маргарита', authorIds['Михаил Булгаков'], genreIds['Классика'], 1967, 'Мистический роман о дьяволе в Москве.', 550.00, 12, '978-5-17-098253-5', 'https://example.com/master_and_margarita.jpg', () => {});
addBook('Евгений Онегин', authorIds['Александр Пушкин'], genreIds['Классика'], 1833, 'Роман в стихах о любви и разочаровании.', 400.00, 15, '978-5-17-098254-2', 'https://example.com/evgeny_onegin.jpg', () => {});
addBook('Вишневый сад', authorIds['Антон Чехов'], genreIds['Классика'], 1904, 'Пьеса о судьбе дворянской семьи.', 350.00, 20, '978-5-17-098255-9', 'https://example.com/cherry_orchard.jpg', () => {});
addBook('Ночной дозор', authorIds['Сергей Лукьяненко'], genreIds['Фантастика'], 1998, 'Фэнтезийный роман о противостоянии Света и Тьмы.', 480.00, 9, '978-5-17-098256-6', 'https://example.com/night_watch.jpg', () => {});
addBook('Метро 2033', authorIds['Дмитрий Глуховский'], genreIds['Фантастика'], 2005, 'Постапокалиптический роман о жизни в московском метро.', 520.00, 11, '978-5-17-098257-3', 'https://example.com/metro_2033.jpg', () => {});
addBook('Азазель', authorIds['Борис Акунин'], genreIds['Детектив'], 1998, 'Детективный роман об Эрасте Фандорине.', 460.00, 10, '978-5-17-098258-0', 'https://example.com/azazel.jpg', () => {});
addBook('Оно', authorIds['Стивен Кинг'], genreIds['Роман'], 1986, 'Хоррор-роман о зловещем клоуне.', 600.00, 7, '978-5-17-098259-7', 'https://example.com/it.jpg', () => {});
addBook('Гарри Поттер и философский камень', authorIds['Джоан Роулинг'], genreIds['Фэнтези'], 1997, 'Фэнтезийный роман о мальчике-волшебнике.', 550.00, 12, '978-5-17-098260-3', 'https://example.com/harry_potter.jpg', () => {});
addBook('1984', authorIds['Джордж Оруэлл'], genreIds['Антиутопия'], 1949, 'Антиутопический роман о тоталитарном обществе.', 490.00, 8, '978-5-17-098261-0', 'https://example.com/1984.jpg', () => {});
addBook('451 градус по Фаренгейту', authorIds['Рэй Брэдбери'], genreIds['Антиутопия'], 1953, 'Антиутопический роман о мире, где сжигают книги.', 470.00, 9, 'https://example.com/451_fahrenheit.jpg', () => {});
addBook('Три товарища', authorIds['Эрих Мария Ремарк'], genreIds['Роман'], 1936, 'Роман о дружбе и любви в послевоенной Германии.', 510.00, 11, '978-5-17-098263-4', 'https://example.com/three_comrades.jpg', () => {});
addBook('Сто лет одиночества', authorIds['Габриэль Гарсиа Маркес'], genreIds['Магический реализм'], 1967, 'Роман о жизни семьи Буэндиа в мистическом городе Макондо.', 580.00, 7, '978-5-17-098264-1', 'https://example.com/one_hundred_years_of_solitude.jpg', () => {});
addBook('Алхимик', authorIds['Пауло Коэльо'], genreIds['Роман'], 1988, 'Притча о пастухе, отправившемся на поиски сокровища.', 440.00, 10, '978-5-17-098265-8', 'https://example.com/the_alchemist.jpg', () => {});
addBook('Норвежский лес', authorIds['Харуки Мураками'], genreIds['Роман'], 1987, 'Роман о любви, одиночестве и поиске смысла жизни.', 530.00, 12, '978-5-17-098266-5', 'https://example.com/norwegian_wood.jpg', () => {});
addBook('Лабиринты Ехо', authorIds['Макс Фрай'], genreIds['Фэнтези'], 1996, 'Фэнтезийный цикл о приключениях сэра Макса.', 480.00, 9, '978-5-17-098267-2', 'https://example.com/labyrinths_of_echo.jpg', () => {});
addBook('Медея и ее дети', authorIds['Людмила Улицкая'], genreIds['Современная проза'], 1996, 'Семейная сага о нескольких поколениях семьи.', 560.00, 11, '978-5-17-098268-9', 'https://example.com/medea_and_her_children.jpg', () => {});
addBook('Чапаев и Пустота', authorIds['Виктор Пелевин'], genreIds['Современная проза'], 1996, 'Постмодернистский роман о Гражданской войне в России.', 540.00, 10, '978-5-17-098269-6', 'https://example.com/chapaev_and_void.jpg', () => {});
addBook('Лавр', authorIds['Евгений Водолазкин'], genreIds['Современная проза'], 2012, 'Исторический роман о средневековом враче.', 570.00, 12, '978-5-17-098270-2', 'https://example.com/lavr.jpg', () => {});
