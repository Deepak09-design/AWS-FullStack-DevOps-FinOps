from app.database import SessionLocal
from app.models import Product

products = [
    {
        "name": "Premium Wireless Headphones",
        "category": "Electronics",
        "price": 2499,
        "oldPrice": 3999,
        "rating": 4.8,
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700",
    },
    {
        "name": "Minimal Classic Watch",
        "category": "Fashion",
        "price": 1899,
        "oldPrice": 2999,
        "rating": 4.6,
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
    },
    {
        "name": "Everyday Travel Backpack",
        "category": "Accessories",
        "price": 1499,
        "oldPrice": 2199,
        "rating": 4.7,
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700",
    },
    {
        "name": "Modern Running Sneakers",
        "category": "Fashion",
        "price": 3299,
        "oldPrice": 4499,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
    },
]

db = SessionLocal()

try:
    if db.query(Product).count() == 0:
        for item in products:
            db.add(Product(**item))
        db.commit()
        print("Four products inserted successfully!")
    else:
        print("Products already exist. No duplicate records inserted.")
finally:
    db.close()
