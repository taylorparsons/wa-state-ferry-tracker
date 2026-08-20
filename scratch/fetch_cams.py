import urllib.request
import re

urls = {
    "Seattle": "https://wsdot.wa.gov/travel/real-time/cameras",
    "FerryMap": "https://www.wsdot.wa.gov/traffic/ferries/",
    "WSF": "https://wsdot.com/travel/real-time/map/?hotspot=ferries"
}

for name, url in urls.items():
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            imgs = re.findall(r'https?://[^\s"\'<>]+\.(?:jpg|jpeg|png)', html, re.IGNORECASE)
            print(f"=== {name} ({len(imgs)} images) ===")
            for img in set(imgs):
                if any(k in img.lower() for k in ["cam", "traffic", "holding", "ferry", "wsdot"]):
                    print("  -", img)
    except Exception as e:
        print(f"=== {name} Error: {e} ===")
