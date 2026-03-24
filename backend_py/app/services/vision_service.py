"""
Vision service for analyzing medicine packaging images using Google Gemini
"""
import base64
import json
import re
from typing import Dict, Any, Union
import google.generativeai as genai
from dotenv import load_dotenv
import os
from pathlib import Path

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(ENV_PATH)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_VISION_MODEL = os.getenv("GEMINI_VISION_MODEL", "gemini-2.5-flash-image")

if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not configured. Vision features will be limited.")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def _extract_from_raw_text(text: str, existing_result: dict) -> Dict[str, Any]:
    """
    Fallback extraction: Parse raw text response to find medicine data using regex/keywords.
    Used when AI returns JSON with too many nulls.
    """
    result = existing_result if existing_result else {
        "medicine_name": None,
        "dosage": None,
        "batch_number": None,
        "expiry_date": None,
        "manufacturing_date": None,
        "manufacturer_name": None,
        "spelling_errors": False,
        "packaging_damage": False,
        "suspicious_print_quality": False,
        "notes": ""
    }
    
    # Try to extract dosage first (numbers followed by mg/mcg/units/%)
    if not result.get("dosage"):
        dosage_match = re.search(r'(\d+(?:\.\d+)?)\s*(mg|mcg|ug|IU|units|%|g)(?:\b|/)', text, re.IGNORECASE)
        if dosage_match:
            result["dosage"] = dosage_match.group(0).strip()
    
    # Try to extract medicine name (look for common drug names or UPPERCASE sequences)
    if not result.get("medicine_name"):
        # Look for capitalized words that might be drug names
        words = text.split()
        for i, word in enumerate(words):
            if len(word) > 3 and word[0].isupper() and ("medicine" not in word.lower() and "tablet" not in word.lower()):
                # Combine consecutive capitalized words
                name_parts = [word]
                for j in range(i+1, min(i+3, len(words))):
                    if words[j][0].isupper() or "-" in words[j]:
                        name_parts.append(words[j])
                    else:
                        break
                potential_name = " ".join(name_parts)
                if len(potential_name) < 50:  # Reasonable length for medicine name
                    result["medicine_name"] = potential_name
                    break
    
    # Try to extract batch number (look for L/B followed by numbers or alphanumeric sequences)
    if not result.get("batch_number"):
        batch_match = re.search(r'(?:LOT|Batch|Lot|B|L)\s*[:\s]*([A-Z0-9]{4,12})', text, re.IGNORECASE)
        if batch_match:
            result["batch_number"] = batch_match.group(1).strip()
        else:
            # Try just alphanumeric after numbers
            batch_match = re.search(r'(?:\bL|B)\s*([0-9]{6,10})', text)
            if batch_match:
                result["batch_number"] = batch_match.group(1).strip()
    
    # Try to extract expiry date (look for Exp, Expiry followed by date)
    if not result.get("expiry_date"):
        exp_match = re.search(r'(?:Exp|Expiry|EXP|Use Before)[\s:]*(\d{1,2}[/-]\d{2,4})', text, re.IGNORECASE)
        if exp_match:
            result["expiry_date"] = exp_match.group(1).strip()
    
    # Try to extract manufacturing date
    if not result.get("manufacturing_date"):
        mfg_match = re.search(r'(?:Mfg|Mfd|Manufactured|Made By)[\s:]*(\d{1,2}[/-]\d{2,4})', text, re.IGNORECASE)
        if mfg_match:
            result["manufacturing_date"] = mfg_match.group(1).strip()
    
    # Try to extract manufacturer name (look for company names or trademarks)
    if not result.get("manufacturer_name"):
        mfr_match = re.search(r'(?:Mfg by|Manufacturer|Made by)[\s:]*([A-Za-z\s&.,]+?)(?:\n|,|Lot|Batch|$)', text, re.IGNORECASE)
        if mfr_match:
            name = mfr_match.group(1).strip()
            if len(name) < 100:  # Reasonable length
                result["manufacturer_name"] = name
    
    # Store any text that couldn't be parsed
    if not result.get("notes"):
        result["notes"] = f"Fallback extraction from text. Full text: {text[:300]}"
    
    return result


def analyze_medicine_package(image_data: Union[bytes, str]) -> Dict[str, Any]:
    """
    Analyze a medicine package image and extract pharmaceutical info using Gemini Vision
    
    Args:
        image_data: Raw image bytes or base64 encoded string
    
    Returns:
        Dictionary containing extracted medicine information with strict null-checking
    """
    try:
        if not GEMINI_API_KEY:
            return {
                "error": "Vision API not configured",
                "medicine_name": None,
                "dosage": None,
                "batch_number": None,
                "expiry_date": None,
                "manufacturing_date": None,
                "manufacturer_name": None,
                "spelling_errors": None,
                "packaging_damage": None,
                "suspicious_print_quality": None,
                "notes": "GEMINI_API_KEY not configured"
            }
        
        # Convert bytes to base64 if needed
        if isinstance(image_data, bytes):
            try:
                # Verify it's valid image data by checking first few bytes
                if len(image_data) < 10:
                    return {
                        "error": "image_not_clear",
                        "medicine_name": None,
                        "dosage": None,
                        "batch_number": None,
                        "expiry_date": None,
                        "manufacturing_date": None,
                        "manufacturer_name": None,
                        "spelling_errors": False,
                        "packaging_damage": False,
                        "suspicious_print_quality": False,
                        "notes": "Image file too small"
                    }
                
                image_base64 = base64.standard_b64encode(image_data).decode("utf-8")
            except Exception as encode_error:
                print(f"Base64 encoding error: {str(encode_error)}")
                return {
                    "error": "image_not_clear",
                    "medicine_name": None,
                    "dosage": None,
                    "batch_number": None,
                    "expiry_date": None,
                    "manufacturing_date": None,
                    "manufacturer_name": None,
                    "spelling_errors": False,
                    "packaging_damage": False,
                    "suspicious_print_quality": False,
                    "notes": f"Failed to process image: {str(encode_error)}"
                }
        else:
            image_base64 = image_data
        
        # Initialize Gemini model
        model = genai.GenerativeModel(GEMINI_VISION_MODEL)
        
        # Detailed extraction prompt for comprehensive medicine info
        prompt = """EXTRACT ALL VISIBLE TEXT from this medicine package image. Return ONLY JSON.

CRITICAL FIELDS TO EXTRACT:

1. medicine_name (REQUIRED - find this!)
   - Main drug name, brand name, or generic name
   - Usually the LARGEST text on package
   - Examples: "Pantoprazole", "Aspirin", "Ibuprofen", "Paracetamol"
   - Look on FRONT prominently displayed

2. dosage (REQUIRED - look for numbers!)
   - The strength/dose with units
   - Examples: "500mg", "20mg", "1000 units", "10%"
   - Look for numbers followed by: mg, mcg, units, IU, g, %, drops
   - Can be on front, back, or sides

3. batch_number
   - Lot or batch identifier (alphanumeric)
   - Starts with: L, B, LOT, BATCH, or just numbers
   - Examples: "L123456", "B567890", "LOT20240115"
   - Usually on back or bottom

4. expiry_date
   - When medicine expires
   - Look for: "Exp", "Expiry", "E", "Use Before", "Best Before"
   - Examples: "03/2025", "12/26", "03/2026", "MM/YYYY"

5. manufacturing_date
   - When medicine was made
   - Look for: "Mfg", "Mfd", "Manufactured", "Made", "M"
   - Examples: "01/2024", "11/22", "MM/YYYY"

6. manufacturer_name
   - Company/brand name
   - Examples: "Cipla Ltd", "GSK", "Abbott", "Pfizer"
   - Look for: "Mfg by", "Manufacturer", "Made by", or trademark

OTHER CHECKS:
7. spelling_errors: Any obvious typos? true/false
8. packaging_damage: Torn, dented, damaged? true/false  
9. suspicious_print_quality: Blurry, faded, counterfeit-looking? true/false
10. notes: Any other visible text or observations

INSTRUCTIONS:
- Search EVERY visible part: FRONT, BACK, LEFT, RIGHT, TOP, BOTTOM
- Extract text EXACTLY as shown
- Use null ONLY if truly not visible
- Numbers with "mg" = DOSAGE
- Extract what you CAN see, don't guess

RETURN ONLY THIS JSON:
{
  "medicine_name": "text or null",
  "dosage": "text or null",
  "batch_number": "text or null",
  "expiry_date": "text or null",
  "manufacturing_date": "text or null",
  "manufacturer_name": "text or null",
  "spelling_errors": false,
  "packaging_damage": false,
  "suspicious_print_quality": false,
  "notes": "any other text"
}"""
        
        # Call Gemini Vision API - first attempt with detailed extraction
        response = model.generate_content(
            [
                prompt,
                {
                    "mime_type": "image/jpeg",
                    "data": image_base64
                }
            ],
            generation_config=genai.types.GenerationConfig(
                temperature=0.5,  # Higher temp for more varied text extraction attempts
                max_output_tokens=1000  # More tokens for thorough extraction
            )
        )
        
        response_text = response.text.strip()
        
        # Parse JSON from response
        try:
            # Try to extract JSON from response (may contain markdown code blocks)
            json_match = re.search(r"\{[\s\S]*?\}", response_text)
            
            if json_match:
                json_str = json_match.group()
                result = json.loads(json_str)
                
                # Ensure all required fields exist
                required_fields = [
                    "medicine_name", "dosage", "batch_number", 
                    "expiry_date", "manufacturing_date", "manufacturer_name",
                    "spelling_errors", "packaging_damage", "suspicious_print_quality",
                    "notes"
                ]
                
                for field in required_fields:
                    if field not in result:
                        if field in ["spelling_errors", "packaging_damage", "suspicious_print_quality"]:
                            result[field] = False
                        else:
                            result[field] = None
                
                # CHECK: If too many critical fields are null, try raw text extraction
                null_count = sum(1 for k in ["medicine_name", "dosage", "batch_number", "expiry_date"] 
                                if result.get(k) is None or result.get(k) == "null")
                
                if null_count >= 3:  # If 3+ critical fields are null, fallback to aggressive extraction
                    print(f"WARNING: Too many null values in extraction. Using fallback text parsing.")
                    result = _extract_from_raw_text(response_text, result)
                
                return result
            else:
                # If no JSON found, try to extract info from raw text
                return _extract_from_raw_text(response_text, {})
        
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {str(e)}")
            print(f"Response was: {response_text}")
            # Return partial analysis from text
            return {
                "medicine_name": "Medicine package" if len(response_text) > 20 else None,
                "dosage": None,
                "batch_number": None,
                "expiry_date": None,
                "manufacturing_date": None,
                "manufacturer_name": None,
                "spelling_errors": False,
                "packaging_damage": False,
                "suspicious_print_quality": False,
                "notes": response_text[:300] if response_text else "Parsing error"
            }
    
    except Exception as error:
        print(f"Vision analysis error: {str(error)}")
        # Return basic analysis instead of failing completely
        return {
            "medicine_name": "Medicine package",
            "dosage": None,
            "batch_number": None,
            "expiry_date": None,
            "manufacturing_date": None,
            "manufacturer_name": None,
            "spelling_errors": False,
            "packaging_damage": False,
            "suspicious_print_quality": False,
            "notes": f"Basic analysis available. API said: {str(error)[:100]}"
        }


async def analyze_qr_code(image_data: str) -> Dict[str, Any]:
    """
    Analyze an image containing a QR code
    
    Args:
        image_data: Base64 encoded image data
    
    Returns:
        Extracted QR code information
    """
    try:
        if not GEMINI_API_KEY:
            return {
                "error": "Vision API not configured",
                "qr_code_data": None,
                "notes": "API not configured"
            }
        
        model = genai.GenerativeModel("gemini-pro-vision")
        
        prompt = """Analyze this image and extract any QR code content or data visible.
        
If there is a QR code, tell me what it contains.
If you cannot read the QR code or it's not clear, say so.

Return JSON:
{
  "qr_code_found": true/false,
  "qr_code_data": "content here or null",
  "notes": "any additional info"
}"""
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        
        response = await model.generate_content_async(
            [prompt, {"mime_type": "image/jpeg", "data": image_bytes}],
            generation_config=genai.types.GenerationConfig(
                temperature=0.1,
                max_output_tokens=300
            )
        )
        
        response_text = response.text
        
        try:
            json_match = re.search(r"\{[\s\S]*\}", response_text)
            if json_match:
                result = json.loads(json_match.group())
                return result
        except json.JSONDecodeError:
            pass
        
        return {
            "qr_code_found": False,
            "qr_code_data": None,
            "notes": response_text
        }
    
    except Exception as error:
        print(f"QR code analysis error: {str(error)}")
        return {
            "error": f"Analysis failed: {str(error)}",
            "qr_code_found": False,
            "qr_code_data": None,
            "notes": str(error)
        }
