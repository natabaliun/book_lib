import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminPage = () => {
    return (
        <div>
            <h2>Раздел администратора</h2>
            <nav>
                <Link to="/admin/users">Пользователи</Link>
                <Link to="/admin/orders">Заказы</Link>
                <Link to="/admin/rentals">Аренда</Link>
                <Link to="/admin/books">Книги</Link>
            </nav>
            <Outlet />
        </div>
    );
};

export default AdminPage;