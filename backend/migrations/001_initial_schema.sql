-- Kage Initial Schema for Supabase
-- Run this in Supabase SQL Editor or via Supabase CLI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    age INTEGER,
    height_cm NUMERIC,
    weight_kg NUMERIC,
    experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programs table
CREATE TABLE IF NOT EXISTS public.programs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    kanji TEXT,
    description TEXT,
    style TEXT,
    difficulty TEXT,
    days_per_week INTEGER,
    duration_weeks INTEGER,
    xp_multiplier NUMERIC DEFAULT 1.0,
    benefits JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Programs (active program tracking)
CREATE TABLE IF NOT EXISTS public.user_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    program_id TEXT REFERENCES public.programs(id),
    current_week INTEGER DEFAULT 1,
    current_day INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_days JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workouts / Sessions
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    program_id TEXT,
    name TEXT,
    date TIMESTAMPTZ DEFAULT NOW(),
    duration_seconds INTEGER,
    total_xp INTEGER DEFAULT 0,
    exercises JSONB,           -- full exercise + sets data
    mastery JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal Records
CREATE TABLE IF NOT EXISTS public.personal_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    best_weight NUMERIC,
    best_reps INTEGER,
    best_volume NUMERIC,
    date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, exercise_name)
);

-- Movement Insights (for long-term coaching)
CREATE TABLE IF NOT EXISTS public.movement_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    exercise_name TEXT,
    date TIMESTAMPTZ DEFAULT NOW(),
    common_issues JSONB,
    strengths JSONB,
    llm_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diet / Nutrition Logs
CREATE TABLE IF NOT EXISTS public.nutrition_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meals JSONB,
    total_calories NUMERIC,
    total_protein NUMERIC,
    total_carbs NUMERIC,
    total_fat NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Model Thinking Reports (cached)
CREATE TABLE IF NOT EXISTS public.ai_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    report_type TEXT, -- 'model_thinking', 'diet', etc.
    input_data JSONB,
    output_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movement_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (adjust as needed)
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Similar policies for other tables...
-- (You can expand these later)