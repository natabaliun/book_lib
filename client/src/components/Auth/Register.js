import React, { useState } from 'react';
import { registerUser } from '../../services/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser({ username, password, email, address, phone_number: phoneNumber });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Имя пользователя" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Адрес" value={address} onChange={(e) => setAddress(e.target.value)} />
            <input type="text" placeholder="Номер телефона" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <button type="submit">Зарегистрироваться</button>
        </form>
    );
};

export default Register;