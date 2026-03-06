import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ProductsPage/ProductsPage.css";
import { api } from "../../api";

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = isRegister ? await api.register({ email, password }) : await api.login({ email, password });
            onLogin(response.token);
            navigate('/');
        } catch (err) {
            console.error("Ошибка авторизации:", err);
            if (err.response) {
                alert(`Неверный логин или пароль`);
            }
        }
    };

    return (
        <div className="container">
            <h1 className="title">{isRegister ? "Регистрация" : "Вход"}</h1>
            <form className="form" onSubmit={handleSubmit}>
                <label className="label">Email <input className="input" value={email} onChange={e => setEmail(e.target.value)} /></label>
                <label className="label">Password <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
                <button type="submit" className="btn btn--primary">{isRegister ? "Зарегистрироваться" : "Войти"}</button>
                <button type="button" className="btn" onClick={() => setIsRegister(!isRegister)}>{isRegister ? "Вход" : "Регистрация"}</button>
            </form>
        </div>
    );
}