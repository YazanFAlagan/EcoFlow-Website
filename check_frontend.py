import requests

def check_frontend(url):
    try:
        response = requests.get(url)
        print(f"Status code: {response.status_code}")
        print(f"Content type: {response.headers.get('Content-Type')}")
        print(f"Content length: {len(response.text)}")
        print(f"First 200 characters: {response.text[:200]}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    frontend_url = "http://localhost:3000"
    print(f"Checking frontend at {frontend_url}")
    success = check_frontend(frontend_url)
    print(f"Frontend check {'passed' if success else 'failed'}")
