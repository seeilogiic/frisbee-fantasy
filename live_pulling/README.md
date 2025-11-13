# Live Data Pulling

Automated script to pull player statistics from UltiAnalytics team websites and process them for the Cowbell tournament.

## Setup

1. Add UltiAnalytics CSV export URLs to `ULTIANALYTICS_EXPORT_URLS` dictionary in `pull_data.py`
2. Install dependencies: `pip install -r requirements.txt`
3. Run script: `python pull_data.py`

## Google Sheets Integration

This script writes data directly to Google Sheets (no CSV files created).

### Setup Required

1. **Create Google Cloud Service Account** (see `GOOGLE_SHEETS_SETUP.md` for detailed instructions)
2. **Share your Google Sheet** with the service account email
3. **Configure GitHub Secrets**:
   - `GOOGLE_SHEET_ID`: Your Google Sheet ID
   - `GOOGLE_SHEET_NAME`: Worksheet name (default: "Sheet1")
   - `GOOGLE_CREDENTIALS_JSON`: Service account JSON credentials

See `GOOGLE_SHEETS_SETUP.md` for complete setup instructions.

## GitHub Actions

This script is configured to run manually via GitHub Actions:

- **Manual Trigger**: Run from the GitHub Actions tab → "Pull Player Data" → "Run workflow"
- **Direct to Sheets**: Writes data directly to Google Sheets (no CSV files)

### Workflow Features

- Downloads CSV data directly into memory (no disk writes)
- Processes and filters for tournaments containing "cow" (Cowbell, etc.)
- Writes data directly to Google Sheets
- Fully automated - no manual steps required

### How to Run

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. Select "Pull Player Data" workflow from the left sidebar
4. Click "Run workflow" button
5. Select the branch (usually `main` or `master`)
6. Click the green "Run workflow" button

The workflow will run and automatically update your Google Sheet with the latest player data.

## Output

The script writes data directly to your configured Google Sheet with the following columns:

- Team name
- Player name
- Tournaments (filtered for Cowbell only)
- Games played
- Statistics (Assists, Goals, Ds, Turnovers)
- Calculated scores (Captain, Handler, Cutter, Defender)
- Player price
- Injury flag

## Requirements

- Python 3.11+
- requests library

