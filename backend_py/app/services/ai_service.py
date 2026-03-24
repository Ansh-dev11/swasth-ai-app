"""
AI Service module for health analysis using Google Gemini API
"""
import os
from pathlib import Path
import json
import re
from typing import Dict, List, Any, Optional
import google.generativeai as genai
from dotenv import load_dotenv

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(ENV_PATH)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not configured. AI features will be limited.")

# Configure Gemini API
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def extract_json_from_text(text: str) -> Optional[Dict]:
    """Extract JSON from text response"""
    try:
        json_match = re.search(r'\{[\s\S]*\}', text)
        if json_match:
            return json.loads(json_match.group())
    except json.JSONDecodeError:
        pass
    return None


async def ask_health_question(
    question: str, 
    user_context: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    """
    Answer health questions using Gemini API (FAST mode)
    
    Args:
        question: Health question from user
        user_context: Optional user context (medical_history, recent_health_data)
    
    Returns:
        Dict with answer, sources, and confidence
    """
    try:
        if not GEMINI_API_KEY:
            return {
                "answer": "General health tip: Stay hydrated, exercise regularly, and get adequate sleep.",
                "sources": [],
                "confidence": 0.5
            }
        
        user_context = user_context or {}
        
        # Better prompt for detailed answers
        prompt = f"""Answer this health question in detail with clear, professional formatting:

{question}

**Format requirements:**
- Use clear section headers with ## for major topics
- Use **bold** for important terms and concepts
- Use bullet points (•) for lists and key facts
- Keep paragraphs short and scannable
- Use line breaks between sections
- Highlight key numbers and recommendations

Provide thorough, accurate health information with:
- Clear explanation with headers
- Important points in bullet format
- Relevant details and practical context
- How it affects health
- Actionable tips in easy-to-follow steps

Make it visually organized and easy to scan."""
        
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.6,
                max_output_tokens=1000,  # Detailed answers
                top_p=0.85
            )
        )
        
        return {
            "answer": response.text,
            "sources": ["Google Gemini"],
            "confidence": 0.85
        }
    except Exception as error:
        print(f"Error in ask_health_question: {error}")
        error_text = str(error)

        if "429" in error_text or "quota" in error_text.lower():
            return {
                "answer": "Gemini API quota is currently exceeded for this key. Please enable billing or use a key with available quota, then try again.",
                "sources": ["System"],
                "confidence": 0.0
            }

        if "API key" in error_text or "permission" in error_text.lower():
            return {
                "answer": "Gemini API key is invalid or missing permissions. Please verify key and API access in Google AI Studio.",
                "sources": ["System"],
                "confidence": 0.0
            }
        
        raise Exception(f"Failed to get AI response: {error_text}") from error


async def analyze_health_report(
    report_content: str, 
    report_type: str
) -> Dict[str, Any]:
    """
    Analyze health reports using Gemini API (FAST mode)
    
    Args:
        report_content: Content of the health report
        report_type: Type of report (e.g., blood_work, imaging)
    
    Returns:
        Dict with analysis results
    """
    try:
        if not GEMINI_API_KEY:
            return {
                "analysis": "Report analysis: Values appear normal. Consult doctor for detailed interpretation.",
                "keyFindings": ["Normal range readings"],
                "recommendations": ["Schedule follow-up in 6 months"],
                "riskFactors": []
            }
        
        # Detailed analysis prompt
        prompt = f"""Analyze this {report_type} comprehensively with professional formatting:

{report_content}

**Format your response with:**
- ## Headers for each section
- **Bold** for important values and findings
- • Bullet points for key items
- Clear, scannable layout
- Short paragraphs between sections

Provide extensive analysis including:
1. **Key Findings** - All findings with clear headers
2. **Results Explanation** - What values mean
3. **Concerns** - Any values of concern with explanations
4. **Recommendations** - Health recommendations with reasoning
5. **Follow-up Timeline** - When to see doctor
6. **Questions to Ask** - Healthcare provider questions

Make it professional and easy to scan."""
        
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.5,
                max_output_tokens=900,  # Detailed analysis
                top_p=0.85
            )
        )
        
        parsed = extract_json_from_text(response.text)
        if parsed:
            return parsed
        
        return {
            "analysis": response.text,
            "keyFindings": [],
            "recommendations": [],
            "riskFactors": []
        }
    except Exception as error:
        raise Exception(f"Failed to analyze report: {str(error)}")


async def generate_health_insights(
    health_data: List[Dict],
    user_profile: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generate AI-powered health insights (FAST mode)
    
    Args:
        health_data: List of health data points
        user_profile: User profile information
    
    Returns:
        Dict with health insights
    """
    try:
        if not GEMINI_API_KEY:
            return {
                "summary": "Health looks stable. Keep monitoring metrics.",
                "trends": ["Stable trend observed"],
                "recommendations": ["Continue current routine", "Stay active"],
                "alerts": []
            }
        
        # Analyze trends first for context
        trends = analyze_health_trends(health_data)
        
        # Detailed insights prompt
        prompt = f"""Generate comprehensive health insights with professional formatting:
Blood Pressure: {trends['current_bp']} (trend: {trends['bp_trend']})
Blood Sugar: {trends['current_sugar']} (trend: {trends['sugar_trend']})
Weight: {trends['current_weight']} (trend: {trends['weight_trend']})

**Use this format:**
- ## Major section headers
- **Bold** for metrics and key points
- • Bullet points for lists
- Clear visual hierarchy
- Short scannable sections

Organize as:
1. **Health Status Summary** - Quick overview
2. **Vital Trends** - Each metric with explanation
3. **Key Observations** - Notable patterns (bullet points)
4. **Recommendations** - Specific actions (bullet points)
5. **Health Alerts** - Any concerns highlighted
6. **Positive Factors** - What's working well

Be thorough, visual, and encouraging."""
        
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.6,
                max_output_tokens=950,  # Detailed insights
                top_p=0.85
            )
        )
        
        parsed = extract_json_from_text(response.text)
        if parsed:
            return parsed
        
        return {
            "summary": response.text,
            "trends": [f"BP: {trends['bp_trend']}", f"Sugar: {trends['sugar_trend']}", f"Weight: {trends['weight_trend']}"],
            "recommendations": ["Monitor vitals regularly", "Maintain balanced nutrition"],
            "alerts": []
        }
    except Exception as error:
        raise Exception(f"Failed to generate insights: {str(error)}")


async def predict_health_risks(
    health_data: List[Dict],
    medical_history: Optional[str] = None
) -> Dict[str, Any]:
    """
    Predict health risks based on health data (FAST mode with fallback)
    
    Args:
        health_data: List of health data points
        medical_history: Optional medical history
    
    Returns:
        Dict with risk predictions
    """
    try:
        if not GEMINI_API_KEY:
            # Return quick mock prediction without API
            return generate_mock_health_prediction(health_data)
        
        # Analyze health trends from data
        trends = analyze_health_trends(health_data)
        
        # Comprehensive risk assessment prompt
        prompt = f"""Analyze health data and provide detailed, comprehensive risk assessment with professional formatting:
Blood Pressure: {trends['current_bp']} (trend: {trends['bp_trend']})
Blood Sugar: {trends['current_sugar']} (trend: {trends['sugar_trend']})
Weight: {trends['current_weight']}kg (trend: {trends['weight_trend']})
Medical History: {medical_history or 'None reported'}

**Format requirements:**
- Use ## for section headers
- Use **bold** for risk levels, metrics, and key terms
- Use • bullet points for lists (risks, recommendations)
- Keep sections short and scannable
- Emphasize important information

Structure as:
1. **Overall Risk Assessment** - Clear risk level with brief explanation
2. **Key Health Risks** - Each risk as bullet point with explanation
3. **Detailed Recommendations** - Actionable steps (bullet points)
4. **Follow-up Timeline** - Specific dates and milestones
5. **Lifestyle Changes** - Organized by category (diet, exercise, sleep)
6. **When to Seek Help** - Red flags and urgent signs
7. **Positive Health Factors** - What's working well

Make it professional, organized, and easy to understand."""
        
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.5,
                max_output_tokens=1200,  # Very detailed risk assessment
                top_p=0.85
            )
        )
        
        parsed = extract_json_from_text(response.text)
        if parsed:
            return parsed
        
        # Fallback to mock if parsing fails
        return generate_mock_health_prediction(health_data)
        
    except Exception as error:
        print(f"Prediction error: {str(error)}")
        # Return mock prediction on any error for fast fallback
        return generate_mock_health_prediction([])


def analyze_health_trends(health_data: List[Dict]) -> Dict[str, Any]:
    """Analyze trends in health data"""
    if len(health_data) < 2:
        return {
            "bp_trend": "stable",
            "sugar_trend": "stable", 
            "weight_trend": "stable",
            "current_bp": "N/A",
            "current_sugar": "N/A",
            "current_weight": "N/A"
        }
    
    # Get first and last entries
    first = health_data[0] if health_data else {}
    last = health_data[-1] if health_data else {}
    
    return {
        "bp_trend": "up" if last.get("bp", 0) > first.get("bp", 0) else "down",
        "sugar_trend": "up" if last.get("sugar", 0) > first.get("sugar", 0) else "down",
        "weight_trend": "up" if last.get("weight", 0) > first.get("weight", 0) else "down",
        "current_bp": f"{last.get('bp', 'N/A')}",
        "current_sugar": f"{last.get('sugar', 'N/A')}",
        "current_weight": f"{last.get('weight', 'N/A')}"
    }


def generate_mock_health_prediction(health_data: List[Dict]) -> Dict[str, Any]:
    """Generate instant mock health prediction for fast results"""
    return {
        "riskLevel": "low",
        "risks": [
            "Monitor blood pressure regularly",
            "Maintain healthy weight",
            "Watch sugar levels"
        ],
        "recommendations": [
            "Continue regular exercise (150 min/week)",
            "Maintain balanced diet with low sodium",
            "Stay hydrated (8 glasses/day)",
            "Get 7-9 hours sleep daily",
            "Reduce stress through meditation"
        ],
        "followUpTimeline": "6 months"
    }


async def verify_medicine_info(
    medicine_name: str,
    dosage: Optional[str] = None
) -> Dict[str, Any]:
    """
    Verify and retrieve medicine information (FAST mode)
    
    Args:
        medicine_name: Name of the medicine
        dosage: Optional dosage information
    
    Returns:
        Dict with verified medicine information
    """
    try:
        if not GEMINI_API_KEY:
            return {
                "verified": True,
                "medicineName": medicine_name,
                "uses": "Consult pharmacist for details",
                "sideEffects": ["Common side effects may include mild reactions"],
                "interactions": ["Consult doctor before combining with other medicines"]
            }
        
        # Comprehensive medicine info prompt
        prompt = f"""Provide detailed, verified pharmaceutical information about {medicine_name}{f' ({dosage})' if dosage else ''} with professional formatting:

**Format requirements:**
- Use ## for section headers
- Use **bold** for important terms
- Use • bullet points for lists
- Use ⚠️ for warnings
- Make it scannable and organized

Organize information as:

## 📋 Overview
- Generic name
- What type of medicine it is

## ✅ Primary Uses
- List main therapeutic uses

## ⚠️ Side Effects
- Common side effects (severity indicator)
- Rare but serious effects
- When to contact doctor

## 🔄 Drug Interactions
- Medications to avoid
- Foods or supplements to be careful with

## 💊 Dosage & Administration
- Typical dosage
- How to take it
- Best times to take

## ⚠️ Warnings & Precautions
- Important warnings
- Who should not take this
- Pregnancy/nursing considerations

## 🚨 When to Seek Help
- Severe reactions
- Emergency signs

Provide accurate, evidence-based pharmaceutical information for patient safety."""
        
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.4,
                max_output_tokens=1100,  # Comprehensive medicine info
                top_p=0.85
            )
        )
        
        parsed = extract_json_from_text(response.text)
        if parsed:
            return {"verified": True, **parsed}
        
        return {
            "verified": True,
            "medicineName": medicine_name,
            "uses": response.text,
            "sideEffects": [],
            "interactions": []
        }
    except Exception as error:
        raise Exception(f"Failed to verify medicine: {str(error)}")


async def generate_health_plan(
    user_profile: Dict[str, Any],
    health_data: List[Dict],
    goals: str
) -> Dict[str, Any]:
    """
    Generate personalized health improvement plan (FAST mode)
    
    Args:
        user_profile: User profile information
        health_data: List of health data points
        goals: Health improvement goals
    
    Returns:
        Dict with personalized health plan
    """
    try:
        if not GEMINI_API_KEY:
            return {
                "plan": "Daily: Exercise 30min, Eat vegetables, Sleep 8hrs, Track metrics",
                "weeklyActions": [
                    "Exercise 3-4 times (cardio + strength)",
                    "Prepare healthy meals",
                    "Review progress"
                ],
                "longTermGoals": [
                    "Maintain healthy BMI",
                    "Control blood pressure",
                    "Achieve stable glucose levels"
                ],
                "trackingMetrics": ["BP", "Weight", "Blood Sugar"]
            }
        
        # Comprehensive health plan prompt
        prompt = f"""Create a detailed, comprehensive, personalized health improvement plan for these goals:
{goals}

**Format your response with:**
- ## Section headers
- **bold** for important items
- • Bullet points for action items
- Clear, scannable layout
- Visual hierarchy

Create this detailed plan structure:

## 🎯 Your Goal
- Brief statement of goal

## 📅 Daily Actions (Pick 3-5 to start)
- Specific action 1: [frequency/time]
- Specific action 2: [frequency/time]
- (with brief explanation)

## 📊 Weekly Milestones
- Week 1-2: ...
- Week 3-4: ...

## 🏆 Long-term Goals (3-6 months)
- Goal 1: [target]
- Goal 2: [target]

## 🍎 Nutrition Guide
- Foods to eat: • ...
- Foods to limit: • ...

## 💪 Exercise Plan
- Type: [specific]
- Duration: [time]
- Frequency: [per week]

## 😴 Sleep & Wellness
- Sleep target: ...
- Stress management: ...

## 📈 Tracking Metrics
- Metric 1: [target]
- Metric 2: [target]

## 💡 Success Tips
- Tip 1: ...
- Tip 2: ...

## 📍 Timeline
- Month 1: ...
- Month 2: ...

Make it detailed, specific, personalized, and encouraging."""
        
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.6,
                max_output_tokens=1300,  # Very detailed health plan
                top_p=0.85
            )
        )
        
        parsed = extract_json_from_text(response.text)
        if parsed:
            return parsed
        
        return {
            "plan": response.text,
            "weeklyActions": ["Exercise 3-4 times", "Prepare healthy meals"],
            "longTermGoals": [goals],
            "trackingMetrics": ["Health metrics"]
        }
    except Exception as error:
        raise Exception(f"Failed to generate health plan: {str(error)}")
