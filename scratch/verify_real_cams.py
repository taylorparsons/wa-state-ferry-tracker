import urllib.request, ssl

ctx = ssl._create_unverified_context()

# Test candidate WSDOT traffic and ferry camera image URLs on images.wsdot.wa.gov/nw/
candidates = [
    ("Seattle SR 99 Alaskan Way", "https://images.wsdot.wa.gov/nw/099vc03120.jpg"),
    ("I-5 Seattle Commute", "https://images.wsdot.wa.gov/nw/005vc16939.jpg"),
    ("I-5 Downtown Seattle", "https://images.wsdot.wa.gov/nw/005vc16500.jpg"),
    ("SR 520 Lake Washington", "https://images.wsdot.wa.gov/nw/520vc00300.jpg"),
    ("I-90 Floating Bridge", "https://images.wsdot.wa.gov/nw/090vc00500.jpg"),
    ("Seattle Waterfront", "https://images.wsdot.wa.gov/nw/099vc03000.jpg"),
]

valid = []
for name, url in candidates:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=3) as resp:
            data = resp.read()
            if len(data) > 1000:
                print(f"VERIFIED LIVE REAL CAM: {name} -> {url} ({len(data)} bytes)")
                valid.append((name, url))
    except Exception as e:
        print(f"Failed {name} ({url}): {e}")

print(f"\nTotal verified real WSDOT live cameras: {len(valid)}")
