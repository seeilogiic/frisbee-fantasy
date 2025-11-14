# Google Sheets Setup Guide

This guide will help you set up Google Sheets integration to automatically update your sheet with player stats and scores.

## Prerequisites

1. A Google account
2. A Google Sheet where you want the data to be written

## Step 1: Create a Google Service Account

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Enable the Google Drive API:
   - In the same library, search for "Google Drive API"
   - Click "Enable"
5. Create a Service Account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Give it a name (e.g., "frisbee-fantasy-sheets")
   - Click "Create and Continue"
   - Skip the optional steps and click "Done"
6. Create a key for the service account:
   - Click on the service account you just created
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Click "Create" - this will download a JSON file with your credentials

## Step 2: Share Your Google Sheet

1. Open your Google Sheet
2. Click the "Share" button
3. Add the service account email (found in the JSON file as `client_email`)
   - Example: `frisbee-fantasy-sheets@your-project.iam.gserviceaccount.com`
4. Give it "Editor" permissions
5. Click "Send"

## Step 3: Get Your Google Sheet ID

The Sheet ID is in the URL of your Google Sheet:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
```

Copy the `SHEET_ID_HERE` part.

## Step 4: Set Environment Variables

You have three options for providing credentials:

### Option A: Using a .env File (Recommended for local development)

1. Create a `.env` file in the project root directory (same level as `live_pulling/` folder)
2. Add your configuration:
   ```bash
   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url_here
   SUPABASE_KEY=your_supabase_service_role_key_here
   
   # Google Sheets Configuration
   # Option 1: Use credentials file path
   GOOGLE_SHEETS_CREDENTIALS=/path/to/your/credentials.json
   
   # Option 2: Use credentials JSON string (paste entire JSON as one line)
   # GOOGLE_SHEETS_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
   
   # Google Sheet ID
   GOOGLE_SHEET_ID=your_google_sheet_id_here
   ```
3. The script will automatically load these variables from the `.env` file
4. **Important:** The `.env` file is already in `.gitignore`, so it won't be committed to git

### Option B: Using Environment Variables Directly

1. Save the downloaded JSON file somewhere secure (e.g., `~/credentials/google-sheets-credentials.json`)
2. Set the environment variables:
   ```bash
   export SUPABASE_URL="your_supabase_url"
   export SUPABASE_KEY="your_supabase_key"
   export GOOGLE_SHEETS_CREDENTIALS="/path/to/your/credentials.json"
   export GOOGLE_SHEET_ID="your_sheet_id_here"
   ```

### Option C: Using JSON String (Recommended for CI/CD and GitHub Actions)

1. Copy the entire contents of the JSON file
2. Set the environment variable as a JSON string:
   ```bash
   export GOOGLE_SHEETS_CREDENTIALS_JSON='{"type":"service_account","project_id":"..."}'
   export GOOGLE_SHEET_ID="your_sheet_id_here"
   ```

## Step 4b: Setting Up GitHub Actions Secrets

If you're using GitHub Actions (which is already configured in `.github/workflows/pull_player_data.yml`), you need to add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret** and add the following secrets:

   **Secret 1: `GOOGLE_SHEETS_CREDENTIALS_JSON`**
   - Name: `GOOGLE_SHEETS_CREDENTIALS_JSON`
   - Value: Paste the **entire contents** of your JSON credentials file (the one you downloaded in Step 1)
   - Important: Copy the entire JSON file content, including all the curly braces and quotes
   - Example format:
     ```json
     {
       "type": "service_account",
       "project_id": "your-project-id",
       "private_key_id": "...",
       "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
       "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
       ...
     }
     ```

   **Secret 2: `GOOGLE_SHEET_ID`**
   - Name: `GOOGLE_SHEET_ID`
   - Value: Your Google Sheet ID (from Step 3)
   - Example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

4. Make sure you also have these existing secrets (for Supabase):
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

**Important Notes:**
- The `GOOGLE_SHEETS_CREDENTIALS_JSON` secret must contain the **entire JSON file** as a single string
- Make sure there are no extra spaces or line breaks when copying
- The service account email from the JSON file must have access to your Google Sheet (see Step 2)

## Step 5: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 6: Run the Script

The script will now automatically update your Google Sheet with:
- Team
- Player name
- Goals
- Assists
- Ds (Defensive plays)
- Turnovers
- Captain Score
- Handler Score
- Cutter Score
- Defender Score

**Note:** Price is NOT included in the Google Sheet output (as requested).

## Troubleshooting

### "Missing Google Sheets credentials" error
- Make sure you've set either `GOOGLE_SHEETS_CREDENTIALS` or `GOOGLE_SHEETS_CREDENTIALS_JSON`
- Verify the path to your credentials file is correct

### "No Google Sheet ID provided" warning
- Make sure you've set `GOOGLE_SHEET_ID` environment variable
- Verify the Sheet ID is correct (from the URL)

### "Permission denied" error
- Make sure you've shared the Google Sheet with the service account email
- Verify the service account has "Editor" permissions

### "Worksheet not found" error
- The script will automatically create a worksheet named "Sheet1" if it doesn't exist
- You can specify a different worksheet name by modifying the `worksheet_name` parameter in the `output_to_google_sheets()` function call

