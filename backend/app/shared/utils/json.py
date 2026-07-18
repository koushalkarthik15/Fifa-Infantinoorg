import re

def clean_json(text: str) -> str:
    """
    Strips markdown formatting from a string, allowing safe parsing of LLM outputs 
    that might be wrapped in ```json ... ``` blocks, or contain conversational filler.
    """
    text = text.strip()
    
    # Try to find a JSON object or array by finding the outermost braces/brackets
    start_obj = text.find('{')
    end_obj = text.rfind('}')
    
    start_arr = text.find('[')
    end_arr = text.rfind(']')
    
    if start_obj != -1 and end_obj != -1 and end_obj > start_obj:
        obj_len = end_obj - start_obj
    else:
        obj_len = -1
        
    if start_arr != -1 and end_arr != -1 and end_arr > start_arr:
        arr_len = end_arr - start_arr
    else:
        arr_len = -1
        
    # Extract whichever block is larger (object vs array)
    if obj_len > -1 and obj_len > arr_len:
        return text[start_obj:end_obj+1]
    elif arr_len > -1:
        return text[start_arr:end_arr+1]
        
    # Fallback to simple regex if no valid braces found
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()
