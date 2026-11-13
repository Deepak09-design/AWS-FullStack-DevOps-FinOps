
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import Product, Order, OrderItem

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CloudCart API",
    description="CloudCart E-Commerce Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class OrderItemRequest(BaseModel):
    product_id: int
    quantity: int = Field(gt=0, le=100)


class OrderRequest(BaseModel):
    customer_name: str = Field(min_length=2, max_length=150)
    customer_email: EmailStr
    items: list[OrderItemRequest]


@app.get("/")
def home():
    return {"message": "Welcome to CloudCart API", "status": "running"}


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "application": "CloudCart"
    }


@app.get("/api/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


@app.get("/api/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


@app.post("/api/orders")
def create_order(
    order_data: OrderRequest,
    db: Session = Depends(get_db)
):
    if not order_data.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_amount = 0
    order_items = []

    for item in order_data.items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found"
            )

        item_total = product.price * item.quantity
        total_amount += item_total

        order_items.append(
            OrderItem(
                product_id=product.id,
                quantity=item.quantity,
                price=product.price
            )
        )

    new_order = Order(
        customer_name=order_data.customer_name,
        customer_email=order_data.customer_email,
        total_amount=total_amount,
        status="Pending",
        items=order_items
    )

    try:
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not create order")

    return {
        "message": "Order placed successfully",
        "order_id": new_order.id,
        "customer_name": new_order.customer_name,
        "total_amount": new_order.total_amount,
        "status": new_order.status
    }


@app.get("/api/orders")
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()
