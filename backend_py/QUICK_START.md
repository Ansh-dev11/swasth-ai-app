# Python Backend - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Navigate to Backend Directory
```bash
cd backend_py
```

### Step 2: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Update Environment Variables

Edit `.env` file with your actual credentials:
```
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key>
GEMINI_API_KEY=<your-gemini-key>
JWT_SECRET=<your-secret>
```

### Step 5: Start the Server
```bash
python -m uvicorn app.main:app --reload
```

✅ **Server is running at:** http://localhost:5000

## 📚 API Documentation

Visit: **http://localhost:5000/docs** for interactive API explorer

## 📂 Project Structure

All code is in **Python** (easy to understand):

- `app/services/ai_service.py` - All AI functions (Google Gemini)
- `app/routes/` - All API endpoints organized by feature
- `app/middleware/auth.py` - JWT authentication
- `app/services/supabase_service.py` - Database operations

## 🧠 AI Functions (Easy to Read Python)

```python
# All in app/services/ai_service.py

await ask_health_question(question, user_context)
await analyze_health_report(report_content, report_type)
await generate_health_insights(health_data, user_profile)
await predict_health_risks(health_data, medical_history)
await verify_medicine_info(medicine_name, dosage)
await generate_health_plan(user_profile, health_data, goals)
```

## 🔗 Frontend Integration

The Python backend is **100% compatible** with the React frontend!

No frontend changes needed - just update the backend URL in your frontend config.

## 🛠️ Development Tips

### Activate virtual environment (each time):
```bash
# Windows
.\venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### Install new packages:
```bash
pip install <package-name# 1. Go to backend
cd backend_py

# 2. Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Update .env with your API keys

# 5. Run server
python -m uvicorn app.main:app --reload>
pip freeze > requirements.txt
```

### Deactivate virtual environment:
```bash
deactivate
```

## 📋 Dependencies

- **fastapi** - Modern Python web framework
- **uvicorn** - ASGI server
- **google-generativeai** - Google Gemini API
- **supabase** - Database client
- **pydantic** - Data validation
- **PyJWT** - JWT tokens

See `requirements.txt` for complete list.

## ❓ Troubleshooting

**Issue**: `ModuleNotFoundError`
**Solution**: Ensure virtual environment is activated and run `pip install -r requirements.txt`

**Issue**: Port 5000 already in use
**Solution**: `python -m uvicorn app.main:app --port 5001`

**Issue**: Gemini API not working
**Solution**: Verify `GEMINI_API_KEY` in .env and check API quota

## 📖 Further Reading

- See `README.md` for detailed documentation
- FastAPI docs: https://fastapi.tiangolo.com/
- Google Generative AI: https://ai.google.dev/

---

**Start coding in Python - it's much easier to understand! 🐍**
