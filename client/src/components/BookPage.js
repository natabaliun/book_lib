import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBookById } from '../services/api';

const BookPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

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
        </div>
    );
};

export default BookPage;