import requests
import unittest
import uuid
import json
import os

class EcoFlowAPITest(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Get the backend URL from the frontend .env file
        with open('/app/frontend/.env', 'r') as f:
            env_content = f.read()
            # Extract the URL from REACT_APP_BACKEND_URL=http://localhost:8001/api
            self.base_url = env_content.strip().split('=')[1]
        
        print(f"Using API URL: {self.base_url}")
        self.cart_id = None
        self.product_id = None

    def test_01_health_check(self):
        """Test the health check endpoint"""
        print("\n🔍 Testing health check endpoint...")
        response = requests.get(f"{self.base_url}/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ok")
        print("✅ Health check passed")

    def test_02_get_products(self):
        """Test getting all products"""
        print("\n🔍 Testing get products endpoint...")
        response = requests.get(f"{self.base_url}/products")
        self.assertEqual(response.status_code, 200)
        products = response.json()
        self.assertIsInstance(products, list)
        self.assertGreater(len(products), 0, "No products returned")
        
        # Save a product ID for later tests
        self.product_id = products[0]["id"]
        print(f"✅ Get products passed - Found {len(products)} products")
        print(f"   First product: {products[0]['name']} (ID: {self.product_id})")

    def test_03_get_product_by_id(self):
        """Test getting a product by ID"""
        if not self.product_id:
            self.skipTest("No product ID available")
        
        print(f"\n🔍 Testing get product by ID endpoint for ID: {self.product_id}...")
        response = requests.get(f"{self.base_url}/products/{self.product_id}")
        self.assertEqual(response.status_code, 200)
        product = response.json()
        self.assertEqual(product["id"], self.product_id)
        print(f"✅ Get product by ID passed - Found: {product['name']}")

    def test_04_create_cart(self):
        """Test creating a new cart"""
        print("\n🔍 Testing create cart endpoint...")
        response = requests.post(f"{self.base_url}/cart")
        self.assertEqual(response.status_code, 200)
        cart = response.json()
        self.assertIn("id", cart)
        self.assertIn("items", cart)
        self.assertIn("total", cart)
        
        # Save cart ID for later tests
        self.cart_id = cart["id"]
        print(f"✅ Create cart passed - Cart ID: {self.cart_id}")

    def test_05_add_to_cart(self):
        """Test adding an item to the cart"""
        if not self.cart_id or not self.product_id:
            self.skipTest("No cart ID or product ID available")
        
        print(f"\n🔍 Testing add to cart endpoint...")
        payload = {
            "product_id": self.product_id,
            "quantity": 2
        }
        response = requests.post(
            f"{self.base_url}/cart/{self.cart_id}/items", 
            json=payload
        )
        self.assertEqual(response.status_code, 200)
        print(f"✅ Add to cart passed")

    def test_06_get_cart(self):
        """Test getting cart information"""
        if not self.cart_id:
            self.skipTest("No cart ID available")
        
        print(f"\n🔍 Testing get cart endpoint for cart ID: {self.cart_id}...")
        response = requests.get(f"{self.base_url}/cart/{self.cart_id}")
        self.assertEqual(response.status_code, 200)
        cart = response.json()
        self.assertEqual(cart["id"], self.cart_id)
        self.assertGreater(len(cart["items"]), 0, "Cart is empty")
        self.assertGreater(cart["total"], 0, "Cart total is zero")
        
        print(f"✅ Get cart passed - Items: {len(cart['items'])}, Total: ${cart['total']}")
        for item in cart["items"]:
            print(f"   - {item['product']['name']} x {item['quantity']}")

    def test_07_update_cart_item(self):
        """Test updating an item in the cart"""
        if not self.cart_id or not self.product_id:
            self.skipTest("No cart ID or product ID available")
        
        print(f"\n🔍 Testing update cart item endpoint...")
        new_quantity = 3
        response = requests.put(
            f"{self.base_url}/cart/{self.cart_id}/items/{self.product_id}?quantity={new_quantity}"
        )
        self.assertEqual(response.status_code, 200)
        
        # Verify the update
        response = requests.get(f"{self.base_url}/cart/{self.cart_id}")
        cart = response.json()
        for item in cart["items"]:
            if item["product_id"] == self.product_id:
                self.assertEqual(item["quantity"], new_quantity)
                print(f"✅ Update cart item passed - New quantity: {item['quantity']}")
                return
        
        self.fail("Product not found in cart after update")

    def test_08_remove_from_cart(self):
        """Test removing an item from the cart"""
        if not self.cart_id or not self.product_id:
            self.skipTest("No cart ID or product ID available")
        
        print(f"\n🔍 Testing remove from cart endpoint...")
        response = requests.delete(
            f"{self.base_url}/cart/{self.cart_id}/items/{self.product_id}"
        )
        self.assertEqual(response.status_code, 200)
        
        # Verify the removal
        response = requests.get(f"{self.base_url}/cart/{self.cart_id}")
        cart = response.json()
        for item in cart["items"]:
            if item["product_id"] == self.product_id:
                self.fail("Product still in cart after removal")
        
        print(f"✅ Remove from cart passed")

if __name__ == "__main__":
    # Run the tests in order
    test_suite = unittest.TestSuite()
    test_suite.addTest(EcoFlowAPITest('test_01_health_check'))
    test_suite.addTest(EcoFlowAPITest('test_02_get_products'))
    test_suite.addTest(EcoFlowAPITest('test_03_get_product_by_id'))
    test_suite.addTest(EcoFlowAPITest('test_04_create_cart'))
    test_suite.addTest(EcoFlowAPITest('test_05_add_to_cart'))
    test_suite.addTest(EcoFlowAPITest('test_06_get_cart'))
    test_suite.addTest(EcoFlowAPITest('test_07_update_cart_item'))
    test_suite.addTest(EcoFlowAPITest('test_08_remove_from_cart'))
    
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(test_suite)
