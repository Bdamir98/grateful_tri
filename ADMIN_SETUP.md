# Admin User Setup Guide

This guide will help you create an admin user for The Grateful Tribe website.

## Quick Setup (Recommended)

### Step 1: Create User in Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Click **"Add User"** or **"Invite User"**
5. Fill in the form:
   - **Email:** `admin@gratefultribe.org`
   - **Password:** `Admin123!` (or your preferred password)
   - **✅ Check:** "Auto Confirm User" (important!)
6. Click **Create User**

### Step 2: Grant Admin Role

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste this SQL:

```sql
UPDATE public.profiles 
SET 
  role = 'admin',
  full_name = 'Site Administrator'
WHERE email = 'admin@gratefultribe.org';
```

4. Click **Run** or press `Ctrl + Enter`
5. You should see: `Success. 1 rows affected.`

### Step 3: Verify Admin User

Run this query in SQL Editor to verify:

```sql
SELECT id, email, full_name, role, created_at
FROM public.profiles
WHERE role = 'admin';
```

You should see your admin user listed.

### Step 4: Login

1. Navigate to: `http://localhost:3000/admin/login`
2. Enter your credentials:
   - Email: `admin@gratefultribe.org`
   - Password: `Admin123!`
3. You should be redirected to the admin dashboard

## Alternative: Using Migration File

If you want to add the admin setup to your migrations:

1. Run the migration:
```bash
# If using Supabase CLI
supabase db push

# Or apply manually in Supabase Dashboard SQL Editor
```

2. The migration file is located at: `supabase/migrations/003_create_admin_user.sql`

3. After migration, you still need to create the user in Supabase Dashboard (Step 1 above)

4. The migration will automatically grant admin role to `admin@gratefultribe.org`

## Using the Helper Function

The migration also creates a helper function to promote any user to admin:

```sql
-- Promote existing user to admin
SELECT public.promote_to_admin('user@example.com');
```

## Default Admin Credentials

For development environment:

```
Email:    admin@gratefultribe.org
Password: Admin123!
URL:      http://localhost:3000/admin/login
```

**⚠️ IMPORTANT:** 
- Change this password immediately after first login
- Never use these credentials in production
- Use strong, unique passwords for production environments

## Troubleshooting

### Issue: "User not found" error

**Solution:** Make sure you created the user in Supabase Authentication first (Step 1)

### Issue: Still showing "user" role instead of "admin"

**Solution:** 
1. Check if the SQL query ran successfully
2. Verify the email matches exactly (case-sensitive)
3. Try running the SQL query again

### Issue: Can't login with credentials

**Solution:**
1. Make sure "Auto Confirm User" was checked when creating the user
2. Try resetting the password in Supabase Dashboard
3. Check browser console for error messages

### Issue: Redirect loop at /admin/login

**Solution:** Clear your browser cookies and cache, then try again

## Security Best Practices

1. **Change default credentials immediately**
2. **Use strong passwords** (min 12 characters, mix of letters, numbers, symbols)
3. **Enable 2FA** in production environments
4. **Limit admin access** to trusted team members only
5. **Regular audits** of admin user list

## Need Help?

If you encounter issues:
1. Check the browser console for errors (F12)
2. Check Supabase logs in the Dashboard
3. Verify your `.env.local` file has correct Supabase credentials
