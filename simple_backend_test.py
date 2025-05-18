import requests
import sys

def test_api(base_url):
    print(f"Using API URL: {base_url}")
    
    # Test health check
    print("\n🔍 Testing health check endpoint...")
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "ok":
                print("✅ Health check passed")
            else:
                print(f"❌ Health check failed: Unexpected response: {data}")
                return False
        else:
            print(f"❌ Health check failed: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check failed: {str(e)}")
        return False
    
    # Test get products
    print("\n🔍 Testing get products endpoint...")
    try:
        response = requests.get(f"{base_url}/products", timeout=5)
        if response.status_code == 200:
            products = response.json()
            if isinstance(products, list) and len(products) > 0:
                print(f"✅ Get products passed - Found {len(products)} products")
                print(f"   First product: {products[0]['name']} (ID: {products[0]['id']})")
                product_id = products[0]['id']
            else:
                print(f"❌ Get products failed: No products returned")
                return False
        else:
            print(f"❌ Get products failed: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Get products failed: {str(e)}")
        return False
    
    # Test create cart
    print("\n🔍 Testing create cart endpoint...")
    try:
        response = requests.post(f"{base_url}/cart", timeout=5)
        if response.status_code == 200:
            cart = response.json()
            if "id" in cart and "items" in cart:
                print(f"✅ Create cart passed - Cart ID: {cart['id']}")
                cart_id = cart['id']
            else:
                print(f"❌ Create cart failed: Invalid response: {cart}")
                return False
        else:
            print(f"❌ Create cart failed: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Create cart failed: {str(e)}")
        return False
    
    # Test add to cart
    print("\n🔍 Testing add to cart endpoint...")
    try:
        payload = {
            "product_id": product_id,
            "quantity": 2
        }
        response = requests.post(
            f"{base_url}/cart/{cart_id}/items", 
            json=payload,
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            if "message" in data:
                print(f"✅ Add to cart passed - {data['message']}")
            else:
                print(f"✅ Add to cart passed")
        else:
            print(f"❌ Add to cart failed: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Add to cart failed: {str(e)}")
        return False
    
    # Test get cart
    print("\n🔍 Testing get cart endpoint...")
    try:
        response = requests.get(f"{base_url}/cart/{cart_id}", timeout=5)
        if response.status_code == 200:
            cart = response.json()
            if cart["id"] == cart_id:
                if len(cart["items"]) > 0:
                    print(f"✅ Get cart passed - Items: {len(cart['items'])}, Total: ${cart.get('total', 'N/A')}")
                    for item in cart["items"]:
                        product_name = item.get('product', {}).get('name', 'Unknown Product')
                        print(f"   - {product_name} x {item['quantity']}")
                else:
                    print("✅ Get cart passed - Cart is empty")
            else:
                print(f"❌ Get cart failed: Cart ID mismatch")
                return False
        else:
            print(f"❌ Get cart failed: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Get cart failed: {str(e)}")
        return False
    
    # Test update cart item
    print("\n🔍 Testing update cart item endpoint...")
    try:
        new_quantity = 3
        response = requests.put(
            f"{base_url}/cart/{cart_id}/items/{product_id}?quantity={new_quantity}",
            timeout=5
        )
        if response.status_code == 200:
            # Verify the update
            response = requests.get(f"{base_url}/cart/{cart_id}", timeout=5)
            if response.status_code == 200:
                cart = response.json()
                item_found = False
                for item in cart["items"]:
                    if item["product_id"] == product_id:
                        if item["quantity"] == new_quantity:
                            print(f"✅ Update cart item passed - New quantity: {item['quantity']}")
                            item_found = True
                            break
                        else:
                            print(f"❌ Update cart item failed: Quantity not updated")
                            return False
                
                if not item_found:
                    print(f"❌ Update cart item failed: Product not found in cart after update")
                    return False
            else:
                print(f"❌ Update cart item failed: Could not verify update")
                return False
        else:
            print(f"❌ Update cart item failed: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Update cart item failed: {str(e)}")
        return False
    
    # Test remove from cart
    print("\n🔍 Testing remove from cart endpoint...")
    try:
        response = requests.delete(
            f"{base_url}/cart/{cart_id}/items/{product_id}",
            timeout=5
        )
        if response.status_code == 200:
            # Verify the removal
            response = requests.get(f"{base_url}/cart/{cart_id}", timeout=5)
            if response.status_code == 200:
                cart = response.json()
                for item in cart["items"]:
                    if item["product_id"] == product_id:
                        print(f"❌ Remove from cart failed: Product still in cart after removal")
                        return False
                
                print(f"✅ Remove from cart passed")
            else:
                print(f"❌ Remove from cart failed: Could not verify removal")
                return False
        else:
            print(f"❌ Remove from cart failed: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Remove from cart failed: {str(e)}")
        return False
    
    print("\n✅ All API tests passed!")
    return True

if __name__ == "__main__":
    # Get the backend URL from the frontend .env file
    with open('/app/frontend/.env', 'r') as f:
        env_content = f.read()
        # Extract the URL from REACT_APP_BACKEND_URL=http://localhost:8001/api
        base_url = env_content.strip().split('=')[1]
    
    success = test_api(base_url)
    sys.exit(0 if success else 1)
