import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const UserPage = () => {
    return (
        <div>
            <h2>Раздел пользователя</h2>
            <nav>
                <Link to="/user/books">Книги</Link>
                <Link to="/user/rentals">Аренда</Link>
                <Link to="/user/orders">Заказы</Link>
                <Link to="/user/rentals-history">История аренды</Link>
            </nav>
            <Outlet />
        </div>
    );
};

export default UserPage;