import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import LoginPage from "./pages/LoginPage/LoginPage";

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleLogin = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <Router>
            <div className="page">
                <header className="header">
                    <div className="header__inner">
                        <div className="brand">Book Haven</div>
                        <div className="header__right">
                            {token ? (
                                <>
                                    <Link to="/" className="btn header__link">Товары</Link>
                                    <button className="btn btn--danger" onClick={handleLogout}>Logout</button>
                                </>
                            ) : (
                                <Link to="/login" className="btn header__link">Вход/Регистрация</Link>
                            )}
                        </div>
                    </div>
                </header>
                <main className="main">
                    <Routes>
                        <Route path="/" element={<ProductsPage />} />
                        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    </Routes>
                </main>
                <footer className="footer">
                    <div className="footer__inner">© {new Date().getFullYear()} Book Haven</div>
                </footer>
            </div>
        </Router>
    );
}

export default App;