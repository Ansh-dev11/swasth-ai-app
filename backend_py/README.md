# Swasth AI Backend - Python (FastAPI)

Modern Python backend for the Swasth AI health management platform using FastAPI, Google Gemini API, and Supabase.

## 🚀 Features

- **FastAPI Framework**: Modern, fast, production-ready Python web framework
- **Google Gemini AI Integration**: Advanced AI capabilities for health analysis
- **Async/Await**: Full async support for better performance
- **JWT Authentication**: Secure token-based authentication
- **Supabase Integration**: PostgreSQL database with real-time capabilities
- **CORS Enabled**: Ready for frontend integration
- **Type Hints**: Full Python type annotations for better IDE support

## 📋 Prerequisites

- Python 3.10 or higher
- pip (Python package manager)
- Virtual environment tools (venv or virtualenv)
- Supabase account and credentials
- Google Gemini API key

## 🔧 Installation

### 1. Navigate to the backend directory

```bash
cd backend_py
```

### 2. Create and activate virtual environment

**Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Copy the `.env` file and update with your credentials:

```bash
cp .env .env
# Edit .env with your actual credentials
```

Required variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `GEMINI_API_KEY`: Your Google Gemini API key
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend application URL

## 🏃 Running the Server

### Development Mode (with auto-reload)

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

Or using the main file:

```bash
python app/main.py
```

### Production Mode

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 5000 --workers 4
```

The API will be available at: `http://localhost:5000`

## 📚 API Documentation

Once the server is running, visit:

- **Interactive Swagger UI**: http://localhost:5000/docs
- **Alternative ReDoc**: http://localhost:5000/redoc

## 📁 Project Structure

```
backend_py/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── auth.py            # JWT authentication
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_service.py      # Google Gemini API integration
│   │   └── supabase_service.py # Database operations
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── ai.py              # AI endpoints
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── health.py          # Health check endpoints
│   │   ├── medicine.py        # Medicine endpoints
│   │   └── report.py          # Medical report endpoints
│   └── utils/
│       ├── __init__.py
│       └── helpers.py         # Helper functions
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
└── README.md                 # This file
```

## 🔗 API Endpoints

### Health Checks
- `GET /api/health` - Basic health check
- `GET /api/health/status` - Detailed service status

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### AI Services (Requires Auth)
- `POST /api/ai/ask` - Ask health question
- `GET /api/ai/conversation` - Get conversation history
- `GET /api/ai/insights` - Generate health insights
- `GET /api/ai/predict-risks` - Predict health risks
- `POST /api/ai/health-plan` - Generate health plan
- `POST /api/ai/medicine-interactions` - Analyze medicine interactions

### Medicines (Requires Auth)
- `GET /api/medicines` - Search medicines
- `GET /api/medicines/{id}` - Get medicine details
- `POST /api/medicines/verify` - Verify medicine batch
- `POST /api/medicines/add` - Add medicine to profile
- `GET /api/medicines/user/medicines` - Get user medicines

### Medical Reports (Requires Auth)
- `POST /api/reports/upload` - Upload medical report
- `GET /api/reports` - Get reports
- `GET /api/reports/{id}` - Get specific report
- `DELETE /api/reports/{id}` - Delete report
- `POST /api/reports/{id}/analyze` - Analyze report with AI

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns JWT token
3. Client includes token in `Authorization: Bearer <token>` header for protected routes

## 🤖 AI Features

### Google Gemini Integration

The backend uses Google's Gemini API for:
- Health question answering
- Medical report analysis
- Health insights generation
- Risk prediction
- Medicine information verification
- Personalized health plan generation

### All functions are async-ready:
```python
await ai_service.ask_health_question(question, user_context)
await ai_service.analyze_health_report(report_content, report_type)
await ai_service.generate_health_insights(health_data, user_profile)
await ai_service.predict_health_risks(health_data, medical_history)
await ai_service.verify_medicine_info(medicine_name, dosage)
await ai_service.generate_health_plan(user_profile, health_data, goals)
```

## 📦 Database Schema

Uses Supabase/PostgreSQL with tables:
- `users` - User profiles
- `ai_queries` - AI question history
- `ai_responses` - AI responses
- `health_data` - Health measurements
- `medical_reports` - User medical reports
- `medicines` - Medicine database
- `user_medicines` - User's medicine prescriptions
- `medicine_verifications` - Medicine batch verifications

## 🛠️ Development

### Code Quality

The project uses Python best practices:
- Type hints throughout
- Async/await patterns
- Comprehensive error handling
- RESTful API design
- Clear separation of concerns

### Adding New Endpoints

1. Create route handler in appropriate file in `app/routes/`
2. Add service methods in `app/services/`
3. Use `@router.get()`, `@router.post()`, etc. decorators
4. Leverage dependency injection with `Depends(verify_token)`

Example:
```python
@router.get("/example")
async def get_example(user: dict = Depends(verify_token)) -> dict:
    user_id = user.get("id")
    # Your logic here
    return format_response(data)
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Use a different port
python -m uvicorn app.main:app --port 5001
```

### Module not found errors
```bash
# Ensure virtual environment is activated and dependencies installed
pip install -r requirements.txt
```

### Gemini API errors
- Verify `GEMINI_API_KEY` is set correctly
- Check API quota limits
- Ensure network connectivity

### Supabase connection issues
- Verify all Supabase credentials
- Check database is running
- Confirm network access

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Anonymous key for client-side | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | `eyJ...` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `JWT_SECRET` | Secret for JWT signing | `your-secret` |
| `JWT_EXPIRY` | Token expiration | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `FRONTEND_URL` | Frontend app URL | `http://localhost:3000` |

## 🚀 Deployment

### Using Docker (Coming Soon)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
```

### Using Heroku

```bash
heroku create swasth-ai-backend
heroku config:set GEMINI_API_KEY=<your-key>
# Add other environment variables...
git push heroku main
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Note**: This is a Python FastAPI version of the Swasth AI backend. All API endpoints remain compatible with the Node.js version, ensuring seamless frontend integration.
