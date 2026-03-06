import React, { useEffect, useState } from "react";

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [rating, setRating] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        if (!open) return;
        setName(initialProduct?.name ?? "");
        setCategory(initialProduct?.category ?? "");
        setDescription(initialProduct?.description ?? "");
        setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
        setStock(initialProduct?.stock != null ? String(initialProduct.stock) : "");
        setRating(initialProduct?.rating != null ? String(initialProduct.rating) : "");
        setImage(initialProduct?.image ?? "");
    }, [open, initialProduct]);

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedCat = category.trim();
        const trimmedDesc = description.trim();
        const pPrice = Number(price);
        const pStock = Number(stock);
        const pRating = Number(rating);

        if (!trimmedName || !trimmedCat || !trimmedDesc) { alert("Заполните обязательные поля"); return; }
        if (!Number.isFinite(pPrice) || pPrice <= 0) { alert("Цена должна быть больше 0"); return; }
        if (!Number.isFinite(pStock) || pStock < 0) { alert("Количество на складе ≥ 0"); return; }
        if (!Number.isFinite(pRating) || pRating < 0 || pRating > 5) { alert("Рейтинг от 0 до 5"); return; }

        onSubmit({
            id: initialProduct?.id,
            name: trimmedName,
            category: trimmedCat,
            description: trimmedDesc,
            price: pPrice,
            stock: pStock,
            rating: pRating,
            image: image.trim()
        });
    };

    return (
        <div className="backdrop" onMouseDown={onClose}>
            <div className="modal" onMouseDown={e => e.stopPropagation()}>
                <div className="modal__header">
                    <div className="modal__title">{mode === "edit" ? "Редактирование товара" : "Новый товар"}</div>
                    <button className="iconBtn" onClick={onClose}>✕</button>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">Название<input className="input" value={name} onChange={e => setName(e.target.value)} /></label>
                    <label className="label">Категория<input className="input" value={category} onChange={e => setCategory(e.target.value)} /></label>
                    <label className="label">Описание<textarea className="input" value={description} onChange={e => setDescription(e.target.value)} rows="3" /></label>
                    <label className="label">Цена (₽)<input className="input" type="number" value={price} onChange={e => setPrice(e.target.value)} /></label>
                    <label className="label">На складе<input className="input" type="number" value={stock} onChange={e => setStock(e.target.value)} /></label>
                    <label className="label">Рейтинг (0-5)<input className="input" type="number" step="0.1" value={rating} onChange={e => setRating(e.target.value)} /></label>
                    <label className="label">URL фото<input className="input" value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." /></label>

                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>Отмена</button>
                        <button type="submit" className="btn btn--primary">{mode === "edit" ? "Сохранить" : "Создать"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}