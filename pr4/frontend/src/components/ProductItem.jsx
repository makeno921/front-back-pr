import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
    return (
        <div className="userRow">
            <img src={product.image} alt={product.name} className="userImage" />
            <div className="userMain">
                <div className="userHeader">
                    <div className="userName">{product.name}</div>
                    <div className="userCategory">{product.category}</div>
                </div>
                <div className="userDesc">{product.description}</div>
                <div className="userFooter">
                    <div className="userAge">{product.price} ₽ • На складе: {product.stock}</div>
                    <div className="userRating">⭐ {product.rating}</div>
                </div>
            </div>
            <div className="userActions">
                <button className="btn" onClick={() => onEdit(product)}>Редактировать</button>
                <button className="btn btn--danger" onClick={() => onDelete(product.id)}>Удалить</button>
            </div>
        </div>
    );
}