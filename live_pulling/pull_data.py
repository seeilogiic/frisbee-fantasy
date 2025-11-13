"""
Automated data pulling script for UltiAnalytics team websites.
Downloads CSV data directly into memory, processes it, and filters for Cowbell tournament players.

Usage:
    1. Add UltiAnalytics CSV export URLs to ULTIANALYTICS_EXPORT_URLS dictionary
    2. Install dependencies: pip install -r requirements.txt
    3. Run script: python pull_data.py

For GitHub Actions:
    - No browser installation needed (uses direct HTTP requests)
    - No disk writes for CSV downloads (all processing in memory)
    - Script is fully automated and ready for CI/CD
"""

import os
import sys
import csv
from datetime import datetime
from pathlib import Path
from io import StringIO
import requests
# Playwright import kept for potential future use, but not currently needed
# from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

# Add scripts directory to path to import calculation functions
scripts_dir = Path(__file__).parent.parent / "scripts"
sys.path.insert(0, str(scripts_dir))

from utils.calculations import (
    set_players_stats,
    calculate_all_scores,
    calculate_players_prices,
    filter_csv_by_tournaments,
)

# Hardcoded list of UltiAnalytics team CSV export URLs
# Format: {team_name: export_url}
# Team names will be used in the output CSV and should match your desired team names
ULTIANALYTICS_EXPORT_URLS = {
    "Auburn": "https://www.ultianalytics.com/rest/view/team/5377984558006272/stats/export",
    "Alabama": "https://www.ultianalytics.com/rest/view/team/5248247823073280/stats/export",
}

# Tournament to filter for - search for anything containing "cow"
TOURNAMENT_SEARCH_TERM = "cow"  # Will match: Cowbell, cowbell, Cowbell2025, alabamacowbell, etc.

# Directories
SCRIPT_DIR = Path(__file__).parent


def ensure_directories():
    """Ensure required directories exist (for output CSV)."""
    SCRIPT_DIR.mkdir(parents=True, exist_ok=True)


def download_csv_to_memory(export_url, team_name):
    """
    Download CSV data directly from UltiAnalytics export URL into memory.
    
    Args:
        export_url: Direct CSV export URL from UltiAnalytics
        team_name: Name of the team (for logging)
        
    Returns:
        CSV content as string, or None if failed
    """
    try:
        print(f"Downloading CSV for {team_name} from {export_url}...")
        
        # Download CSV directly using requests
        response = requests.get(export_url, timeout=30)
        response.raise_for_status()
        
        # Check if response is CSV
        content_type = response.headers.get('content-type', '').lower()
        if 'csv' not in content_type and 'text' not in content_type:
            print(f"Warning: Unexpected content type: {content_type}")
        
        # Decode content to string (assuming UTF-8 encoding)
        csv_content = response.text
        
        print(f"✓ Successfully downloaded CSV for {team_name} ({len(csv_content)} bytes)")
        return csv_content
        
    except requests.exceptions.RequestException as e:
        print(f"Error downloading CSV for {team_name}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error downloading CSV for {team_name}: {e}")
        return None


def set_players_and_teams_from_content(csv_content, players_dict, team_name):
    """
    Wrapper function to set players and teams from CSV content in memory.
    
    Args:
        csv_content: CSV content as string
        players_dict: Dictionary to update
        team_name: Name of the team
        
    Returns:
        Tuple of (updated players_dict, list of CSV rows)
    """
    csv_file = StringIO(csv_content)
    whole_csv = list(csv.DictReader(csv_file))
    
    if team_name not in players_dict:
        players_dict[team_name] = {}
    
    for row in whole_csv:
        for j in range(7):  # Set players on each line
            name = row[f"Player {j}"]
            if name not in players_dict[team_name]:
                players_dict[team_name][name] = {}
    
    players_dict[team_name].pop("", None)
    return players_dict, whole_csv


def collect_tournaments_from_content(csv_content):
    """
    Collect all unique tournaments from CSV content in memory.
    
    Args:
        csv_content: CSV content as string
        
    Returns:
        Sorted list of tournament names
    """
    tournaments = set()
    csv_file = StringIO(csv_content)
    reader = csv.DictReader(csv_file)
    
    for row in reader:
        tournament = row.get("Tournamemnt", "").strip()
        if tournament:  # Only add non-empty tournaments
            tournaments.add(tournament)
    
    return sorted(list(tournaments))


def process_csv_data_in_memory(csv_data_dict):
    """
    Process CSV data from memory and filter for Cowbell tournament.
    
    Args:
        csv_data_dict: Dictionary mapping team_name to CSV content string
        
    Returns:
        Dictionary of players data filtered for Cowbell tournament
    """
    players_dict = {}
    
    if not csv_data_dict:
        print("No CSV data provided")
        return players_dict
    
    # Process each team's CSV data
    for i, (team_name, csv_content) in enumerate(csv_data_dict.items(), 1):
        print(f"\nProcessing {i}/{len(csv_data_dict)}: {team_name}")
        
        try:
            # Set players and teams from CSV content
            players_dict, whole_csv = set_players_and_teams_from_content(
                csv_content, players_dict, team_name
            )
            
            # Collect tournaments and filter for Cowbell only (case-insensitive)
            team_tournaments = collect_tournaments_from_content(csv_content)
            
            # Find tournament that contains "cow" (case-insensitive)
            matching_tournament = None
            for tournament in team_tournaments:
                if TOURNAMENT_SEARCH_TERM.lower() in tournament.lower():
                    matching_tournament = tournament
                    break
            
            if not matching_tournament:
                print(f"  Warning: No tournament containing '{TOURNAMENT_SEARCH_TERM}' found for {team_name}")
                print(f"  Available tournaments: {', '.join(team_tournaments)}")
                # Remove team from players_dict if it was added
                if team_name in players_dict:
                    del players_dict[team_name]
                # Skip this team - no Cowbell data
                continue
            
            selected_tournaments = [matching_tournament]
            
            # Filter CSV data to only include Cowbell tournament
            filtered_csv = filter_csv_by_tournaments(whole_csv, selected_tournaments)
            
            if not filtered_csv:
                print(f"  No data found for '{TOURNAMENT_SEARCH_TERM}' tournament in {team_name}")
                # Remove team from players_dict
                if team_name in players_dict:
                    del players_dict[team_name]
                continue
            
            # Set player stats from filtered data
            players_dict = set_players_stats(players_dict, team_name, filtered_csv)
            
        except Exception as e:
            print(f"  Error processing {team_name}: {e}")
            import traceback
            traceback.print_exc()
            # Remove team from players_dict if it was added
            if team_name in players_dict:
                del players_dict[team_name]
            continue
    
    return players_dict


def filter_players_for_cowbell(players_dict):
    """
    Filter players_dict to only include players who have a tournament containing "cow".
    
    Returns:
        Filtered players_dict
    """
    filtered_dict = {}
    
    for team_name, players in players_dict.items():
        filtered_dict[team_name] = {}
        
        for player_name, player_data in players.items():
            tournaments = player_data.get("tournamemnts", {})
            
            # Check if player has any tournament containing "cow" (case-insensitive)
            has_cowbell = False
            for tournament_name in tournaments.keys():
                if TOURNAMENT_SEARCH_TERM.lower() in tournament_name.lower():
                    has_cowbell = True
                    break
            
            if has_cowbell:
                filtered_dict[team_name][player_name] = player_data
    
    return filtered_dict


def output_to_csv(players_dict, output_dir):
    """
    Output players data to CSV file with timestamp.
    
    Args:
        players_dict: Dictionary of players data
        output_dir: Directory to save output CSV
        
    Returns:
        Path to output CSV file
    """
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    filename = f"Players_{timestamp}.csv"
    filepath = output_dir / filename
    
    fieldnames = [
        "Team",
        "Player",
        "Tournaments",
        "Games",
        "Assists",
        "Goals",
        "Ds",
        "Turnovers",
        "Price",
        "Games Played",
        "Captain Score",
        "Handler Score",
        "Cutter Score",
        "Defender Score",
        "Possible injury flag",
    ]
    
    with open(filepath, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for team_name, players in players_dict.items():
            for player_name, data in players.items():
                tournaments = data.get("tournamemnts", data.get("tournaments", {}))
                
                # Combine all tournaments into one string
                tournament_strs = []
                games_all = []
                
                for tournament_name, games in tournaments.items():
                    games_list = games if isinstance(games, list) else [str(games)]
                    games_all.extend(games_list)
                    tournament_strs.append(
                        f"{tournament_name}: {', '.join(games_list)}"
                    )
                
                tournaments_combined = " | ".join(tournament_strs)
                games_combined = ", ".join(games_all)
                
                scores = data.get("scores", {})
                questionable = data.get("questionable", False)
                
                writer.writerow({
                    "Team": team_name,
                    "Player": player_name,
                    "Tournaments": tournaments_combined,
                    "Games": games_combined,
                    "Assists": data.get("assists", 0),
                    "Goals": data.get("goals", 0),
                    "Ds": data.get("ds", 0),
                    "Turnovers": data.get("turnovers", 0),
                    "Price": data.get("price", 0),
                    "Games Played": data.get("games_played", 0),
                    "Captain Score": scores.get("captain_score", 0),
                    "Handler Score": scores.get("handler_score", 0),
                    "Cutter Score": scores.get("cutter_score", 0),
                    "Defender Score": scores.get("defender_score", 0),
                    "Possible injury flag": "TRUE" if questionable else "FALSE",
                })
    
    print(f"\nOutput CSV saved to: {filepath}")
    return filepath


def main():
    """Main execution function."""
    print("=" * 60)
    print("UltiAnalytics Data Pulling Script")
    print("=" * 60)
    
    # Ensure directories exist (for output CSV only)
    ensure_directories()
    
    # Check if URLs are configured
    if not ULTIANALYTICS_EXPORT_URLS:
        print("\nError: No UltiAnalytics export URLs configured!")
        print("Please add export URLs to ULTIANALYTICS_EXPORT_URLS dictionary in pull_data.py")
        return 1
    
    # Download CSV data directly into memory
    print(f"\nDownloading data from {len(ULTIANALYTICS_EXPORT_URLS)} team(s)...")
    
    csv_data_dict = {}
    for team_name, export_url in ULTIANALYTICS_EXPORT_URLS.items():
        csv_content = download_csv_to_memory(export_url, team_name)
        if csv_content:
            csv_data_dict[team_name] = csv_content
        else:
            print(f"  ✗ Failed to download data for {team_name}")
    
    if not csv_data_dict:
        print("\nError: No CSV data downloaded")
        return 1
    
    # Process CSV data from memory
    print(f"\n{'=' * 60}")
    print("Processing downloaded data...")
    print(f"{'=' * 60}")
    
    players_dict = process_csv_data_in_memory(csv_data_dict)
    
    if not players_dict:
        print(f"\n⚠ Warning: No player data found after processing files")
        print(f"  This may mean no teams have tournaments containing '{TOURNAMENT_SEARCH_TERM}'")
        print(f"  Continuing anyway...")
        players_dict = {}
    
    # Filter for tournaments containing "cow"
    print(f"\nFiltering for tournaments containing '{TOURNAMENT_SEARCH_TERM}'...")
    players_dict = filter_players_for_cowbell(players_dict)
    
    if not players_dict:
        print(f"\n⚠ Warning: No players found with tournaments containing '{TOURNAMENT_SEARCH_TERM}'")
        print(f"  The output CSV will be empty or contain only headers")
    
    # Calculate scores and prices
    if players_dict:
        print("\nCalculating scores and prices...")
        players_dict = calculate_all_scores(players_dict)
        players_dict = calculate_players_prices(players_dict)
    else:
        print("\nSkipping score/price calculations (no players found)")
    
    # Output to CSV
    print(f"\n{'=' * 60}")
    print("Generating output CSV...")
    print(f"{'=' * 60}")
    
    output_file = output_to_csv(players_dict, SCRIPT_DIR)
    
    print(f"\n{'=' * 60}")
    if players_dict:
        print("✓ Script completed successfully!")
        print(f"Output file: {output_file}")
    else:
        print("⚠ Script completed with warnings (no Cowbell tournament data found)")
        print(f"Output file: {output_file} (empty or headers only)")
    print(f"{'=' * 60}")
    
    return 0


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)

