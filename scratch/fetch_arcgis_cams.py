import urllib.request
import json

arcgis_url = "https://gisdata.wsdot.wa.gov/arcgis/rest/services/Traffic/Cameras/MapServer/0/query?where=1%3D1&outFields=*&f=json"

try:
    req = urllib.request.Request(arcgis_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        features = data.get("features", [])
        print(f"Total ArcGIS cameras: {len(features)}")
        for f in features:
            attrs = f.get("attributes", {})
            title = attrs.get("CAMERATITLE", "") or attrs.get("TITLE", "") or str(attrs)
            url = attrs.get("IMAGEURL", "") or attrs.get("URL", "")
            if any(k in title.lower() for k in ["ferry", "colman", "bainbridge", "edmonds", "kingston", "mukilteo", "clinton", "fauntleroy", "vashon", "anacortes", "southworth"]):
                print(f"Title: {title} | ImageURL: {url}")
except Exception as e:
    print("ArcGIS Error:", e)
