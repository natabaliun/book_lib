import React, { useState, useEffect } from 'react';
import { getBooks } from '../../services/api';

const UserBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await getBooks();
            setBooks(response.data);
        };
        fetchBooks();
    }, []);

    return (
        <div>
            <h3>Книги</h3>
            <ul>
                {books.map((book) => (
                    <li key={book.book_id}>{book.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserBooks;