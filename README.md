
  # Badan Warisan Malaysia App

  This is a code bundle for Badan Warisan Malaysia App. The original project is available at https://www.figma.com/design/pOiAtPaBqTObegBikhC5ju/Badan-Warisan-Malaysia-App.

  ## Running the code

  Run `npm i` to install the dependencies.

  
Run `npm run dev` to start the development server.

## Supabase Setup (Member IDs)

To enable automatic Member ID generation (e.g., `BWM-1001`):

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Open the **SQL Editor**.
3.  Click **New Query**.
4.  Copy the contents of `SUPABASE_MEMBERSHIPS.sql` from this project.
5.  Paste it into the SQL Editor and click **Run**.

This will create the necessary tables and triggers to automatically assign a Member ID to every new user.
  