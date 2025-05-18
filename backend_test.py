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
        self.timeout = 5  # 5 seconds timeout for all requests

    def test_01_health_check(self):
        """Test the health check endpoint"""
        print("\n🔍 Testing health check endpoint...")
        try:
            response = requests.get(f"{self.base_url}/health", timeout=self.timeout)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data["status"], "ok")
            print("✅ Health check passed")
        except Exception as e:
            print(f"❌ Health check failed: {str(e)}")
            self.fail(f"Health check failed: {str(e)}")

    def test_02_get_products(self):
        """Test getting all products"""
        print("\n🔍 Testing get products endpoint...")
        try:
            response = requests.get(f"{self.base_url}/products", timeout=self.timeout)
            self.assertEqual(response.status_code, 200)
            products = response.json()
            self.assertIsInstance(products, list)
            self.assertGreater(len(products), 0, "No products returned")
            
            # Save a product ID for later tests
            self.product_id = products[0]["id"]
            print(f"✅ Get products passed - Found {len(products)} products")
            print(f"   First product: {products[0]['name']} (ID: {self.product_id})")
        except Exception as e:
            print(f"❌ Get products failed: {str(e)}")
            self.fail(f"Get products failed: {str(e)}")

    def test_03_get_product_by_id(self):
        """Test getting a product by ID"""
        if not self.product_id:
            self.skipTest("No product ID available")
        
        print(f"\n🔍 Testing get product by ID endpoint for ID: {self.product_id}...")
        try:
            response = requests.get(f"{self.base_url}/products/{self.product_id}", timeout=self.timeout)
            self.assertEqual(response.status_code, 200)
            product = response.json()
            self.assertEqual(product["id"], self.product_id)
            print(f"✅ Get product by ID passed - Found: {product['name']}")
        except Exception as e:
            print(f"❌ Get product by ID failed: {str(e)}")
            self.fail(f"Get product by ID failed: {str(e)}")

    def test_04_create_cart(self):
        """Test creating a new cart"""
        print("\n🔍 Testing create cart endpoint...")
        try:
            response = requests.post(f"{self.base_url}/cart", timeout=self.timeout)
            self.assertEqual(response.status_code, 200)
            cart = response.json()
            self.assertIn("id", cart)
            self.assertIn("items", cart)
            # The total field might not be present in an empty cart
            
            # Save cart ID for later tests
            self.cart_id = cart["id"]
            print(f"✅ Create cart passed - Cart ID: {self.cart_id}")
        except Exception as e:
            print(f"❌ Create cart failed: {str(e)}")
            self.fail(f"Create cart failed: {str(e)}")

    def test_05_add_to_cart(self):
        """Test adding an item to the cart"""
        if not self.cart_id or not self.product_id:
            self.skipTest("No cart ID or product ID available")
        
        print(f"\n🔍 Testing add to cart endpoint...")
        try:
            payload = {
                "product_id": self.product_id,
                "quantity": 2
            }
            response = requests.post(
                f"{self.base_url}/cart/{self.cart_id}/items", 
                json=payload,
                timeout=self.timeout
            )
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertIn("message", data)
            print(f"✅ Add to cart passed - {data['message']}")
        except Exception as e:
            print(f"❌ Add to cart failed: {str(e)}")
            self.fail(f"Add to cart failed: {str(e)}")

    def test_06_get_cart(self):
        """Test getting cart information"""
        if not self.cart_id:
            self.skipTest("No cart ID available")
        
        print(f"\n🔍 Testing get cart endpoint for cart ID: {self.cart_id}...")
        try:
            response = requests.get(f"{self.base_url}/cart/{self.cart_id}", timeout=self.timeout)
            self.assertEqual(response.status_code, 200)
            cart = response.json()
            self.assertEqual(cart["id"], self.cart_id)
            
            # Check if there are items in the cart
            if len(cart["items"]) > 0:
                # If there are items, check the total
                if "total" in cart:
                    self.assertGreater(cart["total"], 0, "Cart total is zero")
                
                print(f"✅ Get cart passed - Items: {len(cart['items'])}, Total: ${cart.get('total', 'N/A')}")
                for item in cart["items"]:
                    product_name = item.get('product', {}).get('name', 'Unknown Product')
                    print(f"   - {product_name} x {item['quantity']}")
            else:
                print("✅ Get cart passed - Cart is empty")
        except Exception as e:
            print(f"❌ Get cart failed: {str(e)}")
            self.fail(f"Get cart failed: {str(e)}")

    def test_07_update_cart_item(self):
        """Test updating an item in the cart"""
        if not self.cart_id or not self.product_id:
            self.skipTest("No cart ID or product ID available")
        
        print(f"\n🔍 Testing update cart item endpoint...")
        try:
            new_quantity = 3
            response = requests.put(
                f"{self.base_url}/cart/{self.cart_id}/items/{self.product_id}?quantity={new_quantity}",
                timeout=self.timeout
            )
            self.assertEqual(response.status_code, 200)
            
            # Verify the update
            response = requests.get(f"{self.base_url}/cart/{self.cart_id}", timeout=self.timeout)
            cart = response.json()
            for item in cart["items"]:
                if item["product_id"] == self.product_id:
                    self.assertEqual(item["quantity"], new_quantity)
                    print(f"✅ Update cart item passed - New quantity: {item['quantity']}")
                    return
            
            self.fail("Product not found in cart after update")
        except Exception as e:
            print(f"❌ Update cart item failed: {str(e)}")
            self.fail(f"Update cart item failed: {str(e)}")

    def test_08_remove_from_cart(self):
        """Test removing an item from the cart"""
        if not self.cart_id or not self.product_id:
            self.skipTest("No cart ID or product ID available")
        
        print(f"\n🔍 Testing remove from cart endpoint...")
        try:
            response = requests.delete(
                f"{self.base_url}/cart/{self.cart_id}/items/{self.product_id}",
                timeout=self.timeout
            )
            self.assertEqual(response.status_code, 200)
            
            # Verify the removal
            response = requests.get(f"{self.base_url}/cart/{self.cart_id}", timeout=self.timeout)
            cart = response.json()
            for item in cart["items"]:
                if item["product_id"] == self.product_id:
                    self.fail("Product still in cart after removal")
            
            print(f"✅ Remove from cart passed")
        except Exception as e:
            print(f"❌ Remove from cart failed: {str(e)}")
            self.fail(f"Remove from cart failed: {str(e)}")

if __name__ == "__main__":
    # Run the tests individually to avoid timeout issues
    test_cases = [
        'test_01_health_check',
        'test_02_get_products',
        'test_03_get_product_by_id',
        'test_04_create_cart',
        'test_05_add_to_cart',
        'test_06_get_cart',
        'test_07_update_cart_item',
        'test_08_remove_from_cart'
    ]
    
    all_passed = True
    for test_case in test_cases:
        test_suite = unittest.TestSuite()
        test_suite.addTest(EcoFlowAPITest(test_case))
        runner = unittest.TextTestRunner(verbosity=2)
        result = runner.run(test_suite)
        if not result.wasSuccessful():
            all_passed = False
            print(f"❌ Test {test_case} failed")
    
    if all_passed:
        print("\n✅ All backend API tests passed successfully!")
    else:
        print("\n❌ Some backend API tests failed")
