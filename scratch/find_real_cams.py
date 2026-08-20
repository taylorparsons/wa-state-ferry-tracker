import urllib.request, ssl, re

ctx = ssl._create_unverified_context()

# Fetch WSDOT traffic camera page html to find real live camera img URLs
urls_to_search = [
    "https://wsdot.com/travel/real-time/map/",
    "https://www.wsdot.com/traffic/seattle/default.aspx",
    "https://wsdot.wa.gov/travel/real-time/service/cameras"
]

for url in urls_to_search:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            # find all images on images.wsdot.wa.gov or similar
            matches = re.findall(r'https?://[^\s"\'<>]+\.jpg', html, re.IGNORECASE)
            print(f"URL: {url} -> Found {len(matches)} jpgs")
            for m in set(matches)[:10]:
                print("  Found Cam JPG:", m)
    except Exception as e:
        print(f"Error {url}: {e}")
