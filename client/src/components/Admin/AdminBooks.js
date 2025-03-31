import React, { useState, useEffect } from 'react';
import { getBooks, updateBook, deleteBook } from '../../services/api';

const AdminBooks = () => {
    const [books, setBooks] = useState([]);
    const [editingBook, setEditingBook] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await getBooks();
            setBooks(response.data);
        };
        fetchBooks();
    }, []);

    const handleEdit = (book) => {
        setEditingBook(book);
    };

    const handleSave = async () => {
        try {
            await updateBook(editingBook.book_id, editingBook);
            setEditingBook(null);
            fetchBooks();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteBook(id);
            fetchBooks();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchBooks = async () => {
        const response = await getBooks();
        setBooks(response.data);
    };

    return (
        <div>
            <h3>Управление книгами</h3>
            <table>
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Автор</th>
                    <th>Год</th>
                    <th>Цена</th>
                    <th>Статус</th>
                    <th>Доступность</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {books.map((book) => (
                    <tr key={book.book_id}>
                        <td>
                            {editingBook && editingBook.book_id === book.book_id ? (
                                <input type="text" value={editingBook.title} onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })} />
                            ) : (
                                book.title
                            )}
                        </td>
                        <td>
                            {editingBook && editingBook.book_id === book.book_id ? (
                                <input type="text" value={editingBook.author_name} onChange={(e) => setEditingBook({ ...editingBook, author_name: e.target.value })} />
                            ) : (
                                book.author_name
                            )}
                        </td>
                        <td>
                            {editingBook && editingBook.book_id === book.book_id ? (
                                <input type="number" value={editingBook.publication_year} onChange={(e) => setEditingBook({ ...editingBook, publication_year: parseInt(e.target.value) })} />
                            ) : (
                                book.publication_year
                            )}
                        </td>
                        <td>
                            {editingBook && editingBook.book_id === book.book_id ? (
                                <input type="number" value={editingBook.price} onChange={(e) => setEditingBook({ ...editingBook, price: parseFloat(e.target.value) })} />
                            ) : (
                                book.price
                            )}
                        </td>
                        <td>
                            {editingBook && editingBook.book_id === book.book_id ? (
                                <input type="text" value={editingBook.status} onChange={(e) => setEditingBook({ ...editingBook, status: e.target.value })} />
                            ) : (
                                book.status
                            )}
                        </td>
                        <td>
                            {editingBook && editingBook.book_id === book.book_id ? (
                                <input type="checkbox" checked={editingBook.available} onChange={(e) => setEditingBook({ ...editingBook, available: e.target.checked })} />
                            ) : (
                                book.available ? 'Да' : 'Нет'
                            )}
                        </td>
                        <td>
                            {editingBook && editingBook.book_id === book.book_id ? (
                                <>
                                    <button onClick={handleSave}>Сохранить</button>
                                    <button onClick={() => setEditingBook(null)}>Отмена</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEdit(book)}>Изменить</button>
                                    <button onClick={() => handleDelete(book.book_id)}>Удалить</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminBooks;