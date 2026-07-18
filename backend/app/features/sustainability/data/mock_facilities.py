import functools
MOCK_WATER_STATIONS = [
    "Water Refill Station - Gate A Concourse",
    "Water Refill Station - Section 102",
    "Water Refill Station - VIP Lounge Entrance",
    "Water Refill Station - Fan Zone East"
]

MOCK_RECYCLING_BINS = [
    "Eco Recycling Hub - Main Plaza",
    "Recycling Point - Section 105",
    "Recycling Point - Gate C Food Court",
    "Compost & Recycling - Fan Zone West"
]



# NOTE (Performance Optimization): This lru_cache is a temporary optimization for mock deterministic data.
# When this function is replaced with live database queries in future releases, this cache should be replaced with a proper caching layer (e.g. Redis).
@functools.lru_cache(maxsize=128)
def get_nearest_facilities(location: str):
    """
    Simulates finding the nearest facilities based on a location string.
    Returns deterministic results based on string length to simulate variety.
    """
    length = len(location)
    
    # Deterministic subset selection
    water_idx = length % len(MOCK_WATER_STATIONS)
    recycling_idx = (length * 2) % len(MOCK_RECYCLING_BINS)
    
    return {
        "water_stations": [
            MOCK_WATER_STATIONS[water_idx],
            MOCK_WATER_STATIONS[(water_idx + 1) % len(MOCK_WATER_STATIONS)]
        ],
        "recycling_bins": [
            MOCK_RECYCLING_BINS[recycling_idx],
            MOCK_RECYCLING_BINS[(recycling_idx + 1) % len(MOCK_RECYCLING_BINS)]
        ]
    }
