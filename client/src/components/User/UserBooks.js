import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../../services/api';

const UserBooks = () => {
    const [books, setBooks] = useState([]);
    const [sortConfig, setSortConfig] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await getBooks();
            setBooks(response.data);
        };
        fetchBooks();
    }, []);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedBooks = React.useMemo(() => {
        let sortableBooks = [...books];
        if (sortConfig !== null) {
            sortableBooks.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableBooks;
    }, [books, sortConfig]);

    return (
        <div>
            <h3>Книги</h3>
            <table>
                <thead>
                <tr>
                    <th>
                        <button type="button" onClick={() => requestSort('title')}>
                            Название
                        </button>
                    </th>
                    <th>
                        <button type="button" onClick={() => requestSort('author_name')}>
                            Автор
                        </button>
                    </th>
                    <th>
                        <button type="button" onClick={() => requestSort('publication_year')}>
                            Год издания
                        </button>
                    </th>
                    <th>
                        <button type="button" onClick={() => requestSort('genre_name')}>
                            Категория
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>
                {sortedBooks.map((book) => (
                    <tr key={book.book_id}>
                        <td>
                            <Link to={`/book/${book.book_id}`}>{book.title}</Link>
                        </td>
                        <td>{book.author_name}</td>
                        <td>{book.publication_year}</td>
                        <td>{book.genre_name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserBooks;