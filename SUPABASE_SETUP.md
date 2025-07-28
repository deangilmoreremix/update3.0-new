# Supabase Database Setup for Smart CRM

## 🗄️ Required Database Tables

### 1. Contacts Table
```sql
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  company VARCHAR,
  position VARCHAR,
  status VARCHAR DEFAULT 'active',
  tags TEXT[],
  notes TEXT,
  last_contact_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to access their own contacts
CREATE POLICY "Users can access their own contacts" ON contacts
  FOR ALL USING (auth.uid() = user_id);
```

### 2. Deals Table
```sql
CREATE TABLE deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  title VARCHAR NOT NULL,
  amount DECIMAL(10,2),
  stage VARCHAR DEFAULT 'prospect',
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users
CREATE POLICY "Users can access their own deals" ON deals
  FOR ALL USING (auth.uid() = user_id);
```

### 3. Tasks Table
```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR DEFAULT 'pending',
  priority VARCHAR DEFAULT 'medium',
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users
CREATE POLICY "Users can access their own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);
```

### 4. Appointments Table
```sql
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  location VARCHAR,
  status VARCHAR DEFAULT 'scheduled',
  meeting_link VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users
CREATE POLICY "Users can access their own appointments" ON appointments
  FOR ALL USING (auth.uid() = user_id);
```

### 5. AI Goals Table
```sql
CREATE TABLE ai_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2) DEFAULT 0,
  target_date DATE,
  status VARCHAR DEFAULT 'active',
  category VARCHAR,
  priority VARCHAR DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ai_goals ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users
CREATE POLICY "Users can access their own goals" ON ai_goals
  FOR ALL USING (auth.uid() = user_id);
```

## 🔐 Authentication Setup

### Enable Email Authentication
1. Go to Supabase Dashboard → Authentication → Settings
2. Enable "Email" provider
3. Configure email templates (optional)
4. Set site URL to your Netlify domain

### Row Level Security (RLS)
All tables have RLS enabled to ensure users only access their own data.

## 🚀 Quick Setup Commands

Execute these in your Supabase SQL Editor:

```sql
-- Run all table creation commands above in order
-- Then create indexes for better performance

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_ai_goals_user_id ON ai_goals(user_id);
```

## 🔧 Environment Variables

After setup, use these in Netlify:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-settings
```

## 🧪 Test Data (Optional)

```sql
-- Insert sample data after user authentication is set up
-- This should be done through the app interface after deployment
```

## 📋 Verification Checklist

- [ ] All tables created successfully
- [ ] RLS policies applied
- [ ] Indexes created for performance
- [ ] Authentication enabled
- [ ] Environment variables configured
- [ ] Test user can sign up/login
- [ ] Test data operations work

Your database is now ready for the Smart CRM application!
