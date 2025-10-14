"""
Utility to fetch nearby places using OpenStreetMap Overpass API (Free)
"""
import requests
from typing import List, Dict, Optional

def get_coordinates_from_address(address: str) -> Optional[tuple]:
    """
    Get latitude and longitude from address using Nominatim (OpenStreetMap)
    """
    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': address,
            'format': 'json',
            'limit': 1
        }
        headers = {'User-Agent': 'KMKHomes/1.0'}
        
        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if data:
            return float(data[0]['lat']), float(data[0]['lon'])
        return None
    except Exception as e:
        print(f"Error getting coordinates: {e}")
        return None

def fetch_nearby_places(address: str, radius_km: float = 5.0) -> List[Dict]:
    """
    Fetch nearby places using Overpass API
    Returns list of nearby amenities with name, type, and distance
    """
    coordinates = get_coordinates_from_address(address)
    if not coordinates:
        return []
    
    lat, lon = coordinates
    radius_meters = radius_km * 1000
    
    # Categories to search for
    amenity_types = {
        'railway': '🚉 Railway Station',
        'hospital': '🏥 Hospital',
        'school': '🏫 School',
        'college': '🎓 College',
        'restaurant': '🍽️ Restaurant',
        'cafe': '☕ Cafe',
        'bank': '🏦 Bank',
        'atm': '💳 ATM',
        'pharmacy': '💊 Pharmacy',
        'police': '👮 Police Station',
        'fire_station': '🚒 Fire Station',
        'park': '🌳 Park',
        'cinema': '🎬 Cinema',
        'shopping_mall': '🏪 Shopping Mall',
        'supermarket': '🛒 Supermarket',
        'fuel': '⛽ Petrol Pump',
        'airport': '✈️ Airport',
        'bus_station': '🚌 Bus Station',
        'gym': '💪 Gym',
        'library': '📚 Library'
    }
    
    try:
        # Build Overpass query
        amenity_query = '|'.join([f'amenity={key}' for key in amenity_types.keys()])
        
        overpass_url = "https://overpass-api.de/api/interpreter"
        query = f"""
        [out:json][timeout:25];
        (
          node[{amenity_query}](around:{radius_meters},{lat},{lon});
          way[{amenity_query}](around:{radius_meters},{lat},{lon});
        );
        out center;
        """
        
        response = requests.post(overpass_url, data={'data': query}, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        places = []
        
        for element in data.get('elements', []):
            tags = element.get('tags', {})
            amenity = tags.get('amenity')
            
            if amenity not in amenity_types:
                continue
            
            # Get element coordinates
            if element['type'] == 'node':
                elem_lat = element['lat']
                elem_lon = element['lon']
            elif 'center' in element:
                elem_lat = element['center']['lat']
                elem_lon = element['center']['lon']
            else:
                continue
            
            # Calculate distance (approximate)
            distance_km = calculate_distance(lat, lon, elem_lat, elem_lon)
            
            place = {
                'name': tags.get('name', f"Unnamed {amenity_types[amenity]}"),
                'type': amenity_types[amenity],
                'category': amenity,
                'distance': round(distance_km, 2),
                'address': tags.get('addr:full', tags.get('addr:street', ''))
            }
            places.append(place)
        
        # Sort by distance and limit to top 20
        places.sort(key=lambda x: x['distance'])
        return places[:20]
        
    except Exception as e:
        print(f"Error fetching nearby places: {e}")
        return []

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two coordinates in kilometers
    Using Haversine formula
    """
    from math import radians, sin, cos, sqrt, atan2
    
    R = 6371  # Earth's radius in km
    
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    
    return R * c
