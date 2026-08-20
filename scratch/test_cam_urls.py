import urllib.request

test_urls = [
    "https://images.wsdot.wa.gov/nw/099vc00010.jpg",
    "https://images.wsdot.wa.gov/nw/104vc00010.jpg",
    "https://images.wsdot.wa.gov/nw/525vc00010.jpg",
    "https://images.wsdot.wa.gov/nw/305vc00010.jpg",
    "https://images.wsdot.wa.gov/ferries/colman/holding.jpg",
    "https://images.wsdot.wa.gov/ferries/bainbridge/holding.jpg",
    "https://images.wsdot.wa.gov/ferries/edmonds/holding.jpg",
    "https://images.wsdot.wa.gov/ferries/mukilteo/holding.jpg",
    "https://images.wsdot.wa.gov/ferries/kingston/holding.jpg",
    "https://images.wsdot.wa.gov/ferries/clinton/holding.jpg"
]

for url in test_urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            print(f"SUCCESS {resp.status} - {url} ({len(resp.read())} bytes)")
    except Exception as e:
        print(f"FAILED - {url} ({e})")
