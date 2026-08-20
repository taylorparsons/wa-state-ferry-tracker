import urllib.request, ssl, re

ctx = ssl._create_unverified_context()

urls_to_search = [
    "https://wsdot.wa.gov/travel/real-time/cameras",
    "https://wsdot.com/travel/real-time/cameras/seattle",
    "https://wsdot.com/travel/real-time/cameras/bainbridge",
    "https://wsdot.com/travel/real-time/cameras/edmonds",
    "https://wsdot.com/travel/real-time/cameras/mukilteo",
    "https://wsdot.com/travel/real-time/cameras/kingston"
]

for url in urls_to_search:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            matches = list(set(re.findall(r'https?://[^\s"\'<>]+\.(?:jpg|jpeg|png)', html, re.IGNORECASE)))
            print(f"URL: {url} -> Found {len(matches)} images")
            for m in matches[:10]:
                print("  Found Cam Image:", m)
    except Exception as e:
        print(f"Error {url}: {e}")
