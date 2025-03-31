const request = require('supertest');
const app = require('../src/app'); // Путь к вашему файлу app.js

describe('Bookstore API Tests', () => {
    describe('Books Endpoints', () => {
        it('should get all books', async () => {
            const res = await request(app).get('/books');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should add a book', async () => {
            const res = await request(app)
                .post('/books')
                .send({
                    title: 'Test Book',
                    author_id: 1,
                    genre_id: 1,
                    publication_year: 2023,
                    description: 'Test Description',
                    price: 10.0,
                    stock_quantity: 5,
                    isbn: '1234567890',
                    image_url: 'test.jpg',
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ message: 'Книга добавлена успешно!' });
        });

        it('should get books by author', async () => {
            const res = await request(app).get('/books/author/Лев Толстой');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });

    // Тесты для эндпоинтов пользователей
    describe('Users Endpoints', () => {
        it('should register a user', async () => {
            const res = await request(app)
                .post('/users/register')
                .send({
                    username: 'testuser',
                    password: 'password',
                    email: 'test@example.com',
                    address: 'Test Address',
                    phone_number: '1234567890',
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ message: 'Пользователь зарегистрирован успешно!' });
        });

        it('should login a user', async () => {
            const res = await request(app)
                .post('/users/login')
                .send({
                    username: 'testuser',
                    password: 'password',
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ message: 'Пользователь аутентифицирован!' });
        });

        it('should get user rentals', async () => {
            const res = await request(app).get('/users/1/rentals');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should get user orders', async () => {
            const res = await request(app).get('/users/1/orders');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should get user rentals history', async () => {
            const res = await request(app).get('/users/1/rentals/history');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });

    // Тесты для эндпоинтов администраторов
    describe('Admins Endpoints', () => {
        it('should register an admin', async () => {
            const res = await request(app)
                .post('/admins/register')
                .send({
                    username: 'testadmin',
                    password: 'password',
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ message: 'Администратор зарегистрирован успешно!' });
        });

        it('should login an admin', async () => {
            const res = await request(app)
                .post('/admins/login')
                .send({
                    username: 'testadmin',
                    password: 'password',
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ message: 'Администратор аутентифицирован!' });
        });

        it('should get all users', async () => {
            const res = await request(app).get('/admin/users');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should get all orders', async () => {
            const res = await request(app).get('/admin/orders');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should get all rentals', async () => {
            const res = await request(app).get('/admin/rentals');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });
});

describe('Rentals Endpoints', () => {
    it('should create a rental', async () => {
        const res = await request(app)
            .post('/rentals')
            .send({
                user_id: 1,
                book_id: 1,
                rental_start_date: '2023-01-01',
                rental_end_date: '2023-01-15',
                rental_status: 'активна',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ message: 'Аренда создана успешно!' });
    });

    it('should get a rental by id', async () => {
        const res = await request(app).get('/rentals/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('rental_id');
    });

    it('should update a rental', async () => {
        const res = await request(app)
            .put('/rentals/1')
            .send({
                rental_status: 'завершена',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ message: 'Аренда обновлена успешно!' });
    });

    it('should delete a rental', async () => {
        const res = await request(app).delete('/rentals/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ message: 'Аренда удалена успешно!' });
    });
});