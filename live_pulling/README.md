# Live Data Pulling

Automated script to pull player statistics from UltiAnalytics team websites and process them for the Cowbell tournament.

## Setup

1. Add UltiAnalytics CSV export URLs to `ULTIANALYTICS_EXPORT_URLS` dictionary in `pull_data.py`
2. Install dependencies: `pip install -r requirements.txt`
3. Run script: `python pull_data.py`

## GitHub Actions

This script is configured to run manually via GitHub Actions:

- **Manual Trigger**: Run from the GitHub Actions tab → "Pull Player Data" → "Run workflow"
- **Output**: Creates timestamped CSV files in the `live_pulling/` directory

### Workflow Features

- Downloads CSV data directly into memory (no disk writes for downloads)
- Processes and filters for tournaments containing "cow" (Cowbell, etc.)
- Generates timestamped CSV files with processed player data
- Automatically commits and pushes CSV files to the repository
- Fully automated - no manual steps required

### How to Run

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. Select "Pull Player Data" workflow from the left sidebar
4. Click "Run workflow" button
5. Select the branch (usually `main` or `master`)
6. Click the green "Run workflow" button

The workflow will run and automatically create a new CSV file with the latest player data, then commit and push it to the repository.

## Output

The script generates timestamped CSV files (e.g., `Players_20250101-120000.csv`) in the `live_pulling/` directory with the following columns:

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

