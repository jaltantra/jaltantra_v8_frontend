import requests

def check_frontend_ping(url="http://localhost:5173/ping"):
    try:
        r = requests.get(url, timeout=5)
        if r.status_code == 200 and "<title>Jaltantra</title>" in r.text:
            print("Frontend /ping is healthy ✅")
        else:
            print(f"Frontend /ping returned {r.status_code}, or content did not match! ❌")
            print(f"Body: {r.text[:200]}")  # print a snippet for debugging
    except Exception as e:
        print(f"Could not reach /ping: {e}")

check_frontend_ping()


