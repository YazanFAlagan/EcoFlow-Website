import os
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import uuid
from typing import List, Optional
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="EcoFlow API", description="Backend API for EcoFlow e-commerce website")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
mongo_url = os.environ.get("MONGO_URL")
database_name = os.environ.get("DATABASE_NAME", "ecoflow_db")

# Connect to MongoDB
@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(mongo_url)
    app.mongodb = app.mongodb_client[database_name]
    
    # Create indexes (optional)
    # await app.mongodb["products"].create_index("product_id", unique=True)
    
    # Check if products collection is empty, if so initialize with sample data
    if await app.mongodb["products"].count_documents({}) == 0:
        await initialize_sample_data(app.mongodb)

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

# Pydantic models
class ProductBase(BaseModel):
    name: str
    price: float
    sale_price: Optional[float] = None
    category: str
    description: Optional[str] = None
    image: str
    
class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: str
    created_at: datetime = Field(default_factory=datetime.now)
    
    class Config:
        from_attributes = True

class CartItem(BaseModel):
    product_id: str
    quantity: int = 1
    
class CartItemResponse(CartItem):
    product: Product

class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Cart(BaseModel):
    id: str
    items: List[CartItem] = []
    
class CartResponse(BaseModel):
    id: str
    items: List[CartItemResponse] = []
    total: float

class OrderCreate(BaseModel):
    cart_id: str
    customer_name: str
    email: str
    address: str
    city: str
    postal_code: str
    country: str
    
class Order(BaseModel):
    id: str
    items: List[CartItemResponse] = []
    total: float
    status: OrderStatus = OrderStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.now)
    customer_name: str
    email: str
    address: str
    city: str
    postal_code: str
    country: str

# Helper functions
async def initialize_sample_data(db):
    # Sample products data
    products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Ultra Pure 4-Stage Water Filter System",
            "price": 127.00,
            "sale_price": 80.00,
            "category": "Filter",
            "description": "High-quality 4-stage filtration system that removes impurities and provides clean, fresh-tasting water for your home.",
            "image": "/Assets/Products/1.jpg",
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Premium RO Water Filtration System",
            "price": 127.00,
            "sale_price": 80.00,
            "category": "Filter",
            "description": "Advanced reverse osmosis system that removes up to 99% of contaminants, providing the purest water possible.",
            "image": "/Assets/Products/2.jpg",
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Eco-Friendly UV Water Filter",
            "price": 127.00,
            "sale_price": 80.00,
            "category": "Filter",
            "description": "Environmentally friendly water filter using UV technology to kill bacteria and viruses without chemicals.",
            "image": "/Assets/Products/3.jpg",
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Advanced Alkaline Water Filter",
            "price": 127.00,
            "sale_price": 80.00,
            "category": "Filter",
            "description": "Specially designed filter that adds essential minerals to your water and creates alkaline water for better hydration.",
            "image": "/Assets/Products/4.jpg",
            "created_at": datetime.now()
        }
    ]
    
    await db["products"].insert_many(products)
    print("Sample data initialized")

# API routes
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "EcoFlow API is running"}

# Products endpoints
@app.get("/api/products", response_model=List[Product])
async def get_products():
    products = await app.mongodb["products"].find().to_list(1000)
    return products

@app.get("/api/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await app.mongodb["products"].find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/products", response_model=Product, status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductCreate):
    new_product = Product(
        id=str(uuid.uuid4()),
        **product.dict(),
        created_at=datetime.now()
    )
    await app.mongodb["products"].insert_one(new_product.dict())
    return new_product

# Cart endpoints
@app.post("/api/cart", response_model=Cart)
async def create_cart():
    cart_id = str(uuid.uuid4())
    cart = {"id": cart_id, "items": []}
    await app.mongodb["carts"].insert_one(cart)
    return cart

@app.get("/api/cart/{cart_id}", response_model=CartResponse)
async def get_cart(cart_id: str):
    cart = await app.mongodb["carts"].find_one({"id": cart_id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Get product details for each cart item
    cart_items = []
    total = 0
    
    for item in cart.get("items", []):
        product = await app.mongodb["products"].find_one({"id": item["product_id"]})
        if product:
            price = product.get("sale_price") or product.get("price")
            item_total = price * item["quantity"]
            total += item_total
            cart_items.append(CartItemResponse(
                product_id=item["product_id"],
                quantity=item["quantity"],
                product=Product(**product)
            ))
    
    return CartResponse(id=cart_id, items=cart_items, total=total)

@app.post("/api/cart/{cart_id}/items")
async def add_to_cart(cart_id: str, item: CartItem):
    # Check if product exists
    product = await app.mongodb["products"].find_one({"id": item.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if cart exists
    cart = await app.mongodb["carts"].find_one({"id": cart_id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Check if item already exists in cart
    existing_item = next((i for i in cart.get("items", []) if i["product_id"] == item.product_id), None)
    
    if existing_item:
        # Update quantity if item exists
        await app.mongodb["carts"].update_one(
            {"id": cart_id, "items.product_id": item.product_id},
            {"$inc": {"items.$.quantity": item.quantity}}
        )
    else:
        # Add new item to cart
        await app.mongodb["carts"].update_one(
            {"id": cart_id},
            {"$push": {"items": item.dict()}}
        )
    
    return {"message": "Item added to cart"}

@app.put("/api/cart/{cart_id}/items/{product_id}")
async def update_cart_item(cart_id: str, product_id: str, quantity: int):
    if quantity <= 0:
        # Remove item if quantity is 0 or negative
        await app.mongodb["carts"].update_one(
            {"id": cart_id},
            {"$pull": {"items": {"product_id": product_id}}}
        )
        return {"message": "Item removed from cart"}
    else:
        # Update quantity
        await app.mongodb["carts"].update_one(
            {"id": cart_id, "items.product_id": product_id},
            {"$set": {"items.$.quantity": quantity}}
        )
        return {"message": "Cart updated"}

@app.delete("/api/cart/{cart_id}/items/{product_id}")
async def remove_from_cart(cart_id: str, product_id: str):
    await app.mongodb["carts"].update_one(
        {"id": cart_id},
        {"$pull": {"items": {"product_id": product_id}}}
    )
    return {"message": "Item removed from cart"}

# Order endpoints
@app.post("/api/orders", response_model=Order, status_code=status.HTTP_201_CREATED)
async def create_order(order_data: OrderCreate):
    # Get cart
    cart_response = await get_cart(order_data.cart_id)
    
    # Create order
    order_id = str(uuid.uuid4())
    order = Order(
        id=order_id,
        items=cart_response.items,
        total=cart_response.total,
        **order_data.dict(exclude={"cart_id"}),
        created_at=datetime.now()
    )
    
    await app.mongodb["orders"].insert_one(order.dict())
    
    # Clear cart after order is created
    await app.mongodb["carts"].update_one(
        {"id": order_data.cart_id},
        {"$set": {"items": []}}
    )
    
    return order

@app.get("/api/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await app.mongodb["orders"].find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)