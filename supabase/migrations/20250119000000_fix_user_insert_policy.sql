-- Fix: Add INSERT policy for dona_users to allow signup
-- This policy allows authenticated users to create their own profile
CREATE POLICY "Users can insert their own profile" ON dona_users
    FOR INSERT WITH CHECK (id = auth.uid());

