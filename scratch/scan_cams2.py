import urllib.request, ssl

ctx = ssl._create_unverified_context()

found = []

# Scan routes: SR 99 (Seattle/Colman), SR 305 (Bainbridge), SR 104 (Edmonds/Kingston), SR 525 (Mukilteo/Clinton), SR 20 (Anacortes), SR 160 (Fauntleroy)
routes = ["099", "305", "104", "525", "020", "160", "005"]

for r in routes:
    for num in range(0, 100, 5):
        cid = f"{r}vc{num:05d}"
        url = f"https://images.wsdot.wa.gov/nw/{cid}.jpg"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, context=ctx, timeout=2) as resp:
                data = resp.read()
                if len(data) > 2000:
                    print(f"FOUND: {cid} -> {url} ({len(data)} bytes)")
                    found.append(url)
        except Exception:
            pass

print(f"\nTotal Live Cams Found: {len(found)}")
