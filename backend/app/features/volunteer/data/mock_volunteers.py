MOCK_VOLUNTEERS = {
    "Medical": "Volunteer Sarah (Medical Team - Section A)",
    "Lost Child": "Volunteer John (Guest Services - North Gate)",
    "Lost Item": "Volunteer Emma (Information Desk - Main Concourse)",
    "Safety Concern": "Officer Mike (Stadium Security - Patrol Sector 4)",
    "Unknown": "Volunteer Alex (General Operations)",
}


def get_volunteer_for_category(category: str) -> str:
    """
    Returns a deterministically assigned volunteer for the given category.
    """
    return MOCK_VOLUNTEERS.get(category, MOCK_VOLUNTEERS["Unknown"])
