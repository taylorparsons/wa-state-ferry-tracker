import urllib.request, ssl

ctx = ssl._create_unverified_context()

# Test candidate WSDOT Seattle / Bainbridge / Edmonds camera IDs on images.wsdot.wa.gov/nw/
candidates = [
    "005vc16939",
    "005vc16500",
    "099vc00010",
    "099vc00020",
    "104vc00010",
    "104vc00020",
    "104vc00030",
    "305vc00010",
    "305vc00020",
    "525vc00010",
    "525vc00020"
]

for c in candidates:
    url = f"https://images.wsdot.wa.gov/nw/{c}.jpg"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=4) as resp:
            data = resp.read()
            if len(data) > 1000:
                print(f"LIVE CAM FOUND! {url} ({len(data)} bytes)")
    except Exception as e:
        pass
