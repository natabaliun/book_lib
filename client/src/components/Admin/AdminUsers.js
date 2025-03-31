import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await getAllUsers();
            setUsers(response.data);
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <h3>Пользователи</h3>
            <ul>
                {users.map((user) => (
                    <li key={user.user_id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default AdminUsers;