MOCK_VOLUNTEERS = {
    "Medical": "Volunteer Maria (Medical Station East - MetLife Stadium)",
    "Lost Child": "Volunteer John (Guest Services - North Gate)",
    "Lost Item": "Volunteer Emma (Information Desk - Main Concourse)",
    "Accessibility": "Volunteer Diego (Accessibility Desk - MetLife Gate B)",
    "Safety Concern": "Officer Mike (Stadium Security - Patrol Sector 4)",
    "Unknown": "Volunteer Alex (Gate A Information - Fan Assistance Zone)",
}


def get_volunteer_for_category(category: str) -> str:
    """
    Returns a deterministically assigned volunteer for the given category.
    """
    return MOCK_VOLUNTEERS.get(category, MOCK_VOLUNTEERS["Unknown"])
