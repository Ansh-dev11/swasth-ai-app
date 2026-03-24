# Supabase Database Setup

## Database Tables to Create

Copy and paste each SQL query into the Supabase SQL Editor to create the required tables:

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  age INT,
  blood_type VARCHAR(3),
  phone VARCHAR(20),
  medical_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Health Data Table
```sql
CREATE TABLE health_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  value FLOAT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_health_data_user_id ON health_data(user_id);
CREATE INDEX idx_health_data_date ON health_data(date);
```

### 3. Medical Reports Table
```sql
CREATE TABLE medical_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  report_type VARCHAR(100),
  findings JSONB,
  file_url TEXT,
  date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  analyzed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_medical_reports_user_id ON medical_reports(user_id);
```

### 4. AI Queries Table
```sql
CREATE TABLE ai_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_queries_user_id ON ai_queries(user_id);
```

### 5. AI Responses Table
```sql
CREATE TABLE ai_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID NOT NULL REFERENCES ai_queries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  answer TEXT,
  sources JSONB,
  confidence FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_responses_query_id ON ai_responses(query_id);
CREATE INDEX idx_ai_responses_user_id ON ai_responses(user_id);
```

### 6. Medicine Verifications Table
```sql
CREATE TABLE medicine_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medicine_id VARCHAR(255),
  batch_number VARCHAR(100),
  is_valid BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_medicine_verifications_user_id ON medicine_verifications(user_id);
```

## Steps to Set Up:

1. Go to your Supabase Project Dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste each SQL query above (one by one)
5. Click the play button to execute each query
6. Verify all tables are created by checking the "Tables" section

## Environment Variables Configured ✅

The following environment variables have been set:

**Backend (.env):**
- `SUPABASE_URL`: Connected to your Supabase project
- `SUPABASE_ANON_KEY`: Frontend/client key
- `SUPABASE_SERVICE_ROLE_KEY`: Backend/server key

**Frontend (.env.local):**
- `VITE_SUPABASE_URL`: Configured for frontend use
- `VITE_SUPABASE_ANON_KEY`: Client-side authentication

## Testing the Connection

After creating tables, restart the backend:
```bash
cd backend_py
python run.py
```

The app will now automatically save all data to your Supabase database!
