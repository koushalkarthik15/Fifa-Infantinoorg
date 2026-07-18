# ==========================================
# Crowd AI Prompts
# ==========================================
# These are versioned constant prompt templates for the Gemini AI Provider.

CROWD_PREDICTION_PROMPT_TEMPLATE = """
You are an expert crowd management AI for the FIFA World Cup 2026.
Given the following context about the current crowd density in various zones, 
predict the expected movement and congestion for a user traveling from 
{current_zone} to {target_zone} in {time_offset_minutes} minutes.

Current Crowd Density State:
{heatmap_context}

Please provide:
1. prediction_text: A short, natural language explanation of expected congestion.
2. recommended_action: A concise, actionable recommendation (e.g. "Wait 10 minutes", "Proceed now").

Format your response as valid JSON matching this schema:
{{
    "prediction_text": "string",
    "recommended_action": "string"
}}
"""

ROUTE_AUGMENTATION_PROMPT_TEMPLATE = """
You are an expert crowd management AI for the FIFA World Cup 2026.
A routing engine has recommended the following path from {origin} to {destination}.

Routing Segments:
{route_segments_context}

Current Crowd Density State:
{heatmap_context}

Evaluate the recommended route against the current crowd density.
Provide a short, natural language explanation (max 2 sentences) describing 
if this route is optimal or if the user should expect delays along the way 
due to high density zones.

Format your response as valid JSON matching this schema:
{{
    "crowd_context": "string"
}}
"""
