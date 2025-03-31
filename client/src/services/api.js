import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
});

export const getBooks = () => api.get('/books');
export const addBook = (book) => api.post('/books', book);
export const getBookById = (id) => api.get(`/books/${id}`);
export const updateBook = (id, book) => api.put(`/books/${id}`, book);
export const deleteBook = (id) => api.delete(`/books/${id}`);
export const getBooksByAuthor = (authorName) => api.get(`/books/author/${authorName}`);

export const registerUser = (user) => api.post('/users/register', user);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const getUserRentals = (userId) => api.get(`/users/${userId}/rentals`);
export const getUserOrders = (userId) => api.get(`/users/${userId}/orders`);
export const getUserRentalsHistory = (userId) => api.get(`/users/${userId}/rentals/history`);

export const registerAdmin = (admin) => api.post('/admins/register', admin);
export const loginAdmin = (credentials) => api.post('/admins/login', credentials);
export const getAllUsers = () => api.get('/admin/users');
export const getAllOrders = () => api.get('/admin/orders');
export const getAllRentals = () => api.get('/admin/rentals');

export const createRental = (rental) => api.post('/rentals', rental);
export const getRentalById = (id) => api.get(`/rentals/${id}`);
export const updateRental = (id, rental) => api.put(`/rentals/${id}`, rental);
export const deleteRental = (id) => api.delete(`/rentals/${id}`);