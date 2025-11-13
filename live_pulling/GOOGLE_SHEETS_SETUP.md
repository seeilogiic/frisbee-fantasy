# Google Sheets Setup Guide

This guide will help you set up Google Sheets integration for the automated data pulling script.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
   - Also enable "Google Drive API" (required for accessing sheets)

## Step 2: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in:
   - Service account name: `frisbee-fantasy-bot` (or any name you prefer)
   - Service account ID: auto-generated
   - Click "Create and Continue"
4. Skip the optional steps and click "Done"

## Step 3: Create and Download Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Click "Create" - this will download a JSON file
6. **Keep this file secure!** It contains credentials that allow access to your Google Sheets

## Step 4: Share Your Google Sheet with the Service Account

1. Open your Google Sheet
2. Click the "Share" button
3. Get the email address from the downloaded JSON file (look for `"client_email"` field)
   - It will look like: `frisbee-fantasy-bot@your-project.iam.gserviceaccount.com`
4. Paste this email address in the "Share" dialog
5. Give it "Editor" permissions
6. Click "Send" (you can uncheck "Notify people" since it's a service account)

## Step 5: Get Your Google Sheet ID

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
3. Copy the `SHEET_ID_HERE` part - this is your Google Sheet ID

## Step 6: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:

   - **GOOGLE_SHEET_ID**: Your Google Sheet ID (from Step 5)
   - **GOOGLE_SHEET_NAME**: The worksheet/tab name (default: "Sheet1")
   - **GOOGLE_CREDENTIALS_JSON**: The entire contents of the JSON file downloaded in Step 3
     - Open the JSON file in a text editor
     - Copy the entire contents (all of it, including curly braces)
     - Paste it as the secret value

## Step 7: Configure Locally (Optional)

If you want to test locally, you can set environment variables:

```bash
export GOOGLE_SHEET_ID="your-sheet-id-here"
export GOOGLE_SHEET_NAME="Sheet1"
export GOOGLE_CREDENTIALS_JSON='{"type":"service_account","project_id":"..."}'
```

Or hardcode them in `pull_data.py` (not recommended for production):

```python
GOOGLE_SHEET_ID = "your-sheet-id-here"
GOOGLE_SHEET_NAME = "Sheet1"
GOOGLE_CREDENTIALS_JSON = '{"type":"service_account",...}'
```

## Testing

Once configured, you can test by running:

```bash
python live_pulling/pull_data.py
```

The script will:
1. Download data from UltiAnalytics
2. Process and filter for Cowbell tournament players
3. Write directly to your Google Sheet (replacing all existing data)

## Troubleshooting

- **"Permission denied"**: Make sure you shared the sheet with the service account email
- **"Sheet not found"**: Check that GOOGLE_SHEET_ID is correct
- **"Invalid JSON"**: Make sure GOOGLE_CREDENTIALS_JSON contains the entire JSON file contents
- **"API not enabled"**: Make sure Google Sheets API and Google Drive API are enabled in your project

