# Kage Backend - FastAPI + Supabase

## ✅ Current Status
Supabase credentials have been added. The backend is now connected to your Supabase project.

### Connected Services
- Supabase URL: https://onkubggcahallhxdnttj.supabase.co
- Using Service Role Key for backend operations

## Run the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at: `http://localhost:8000`

## Key Endpoints (v1)
- `POST /api/v1/ai/model-thinking` → AI Strategist
- `POST /api/v1/diet/recommendation` → Personalized Diet
- `GET  /api/v1/programs/` → List programs

## Next Steps
1. Run the initial migration (`migrations/001_initial_schema.sql`) in Supabase SQL Editor.
2. Test the AI endpoints.
3. Start migrating the mobile app to call this backend.

## Security Note
The service role key is only used in the backend. Never expose it to the frontend.
