import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
    return (
        <nav className="App-link">
            <Link to="/">Главная</Link>
            <Link to="/login">Войти</Link>
            <Link to="/register">Регистрация</Link>
            <Link to="/user">Пользователь</Link>
            <Link to="/admin">Администратор</Link>
        </nav>
    );
};

export default Navigation;