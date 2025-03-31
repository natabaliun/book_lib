import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBookById, createRental } from '../services/api';

const BookPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [rentalDuration, setRentalDuration] = useState('2 недели');

    useEffect(() => {
        const fetchBook = async () => {
            const response = await getBookById(id);
            setBook(response.data);
        };
        fetchBook();
    }, [id]);

    if (!book) {
        return <div>Загрузка...</div>;
    }
    const handleRental = async () => {
        let rentalEndDate;
        const startDate = new Date().toISOString().split('T')[0];

        if (rentalDuration === '2 недели') {
            rentalEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        } else if (rentalDuration === 'месяц') {
            rentalEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        } else if (rentalDuration === '3 месяца') {
            rentalEndDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        }

        try {
            const response = await createRental({
                user_id: 1, // Замените на ID текущего пользователя
                book_id: book.book_id,
                rental_start_date: startDate,
                rental_end_date: rentalEndDate,
                rental_status: 'активна',
            });
            console.log(response.data);
            alert('Книга арендована успешно!');
        } catch (error) {
            console.error(error);
            alert('Ошибка аренды книги!');
        }
    };

    return (
        <div>
            <h2>{book.title}</h2>
            <p>Автор: {book.author_name}</p>
            <p>Жанр: {book.genre_name}</p>
            <p>Год издания: {book.publication_year}</p>
            <p>Описание: {book.description}</p>
            <p>Цена: {book.price}</p>
            <p>Количество на складе: {book.stock_quantity}</p>
            <p>ISBN: {book.isbn}</p>
            <img src={book.image_url} alt={book.title} style={{ maxWidth: '200px' }} />

            <div>
                <label>Срок аренды: </label>
                <select value={rentalDuration} onChange={(e) => setRentalDuration(e.target.value)}>
                    <option value="2 недели">2 недели</option>
                    <option value="месяц">Месяц</option>
                    <option value="3 месяца">3 месяца</option>
                </select>
                <button onClick={handleRental}>Арендовать</button>
            </div>
            <button>Купить</button>
        </div>
    );
};

export default BookPage;