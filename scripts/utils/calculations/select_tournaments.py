import csv


def collect_tournaments_from_file(filename):
    """Collect all unique tournaments from a single CSV file."""
    tournaments = set()
    
    with open(filename, newline="") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            tournament = row.get("Tournamemnt", "").strip()
            if tournament:  # Only add non-empty tournaments
                tournaments.add(tournament)
    
    return sorted(list(tournaments))


def collect_all_tournaments(filenames):
    """Collect all unique tournaments from all CSV files."""
    tournaments = set()
    
    for filename in filenames:
        with open(filename, newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                tournament = row.get("Tournamemnt", "").strip()
                if tournament:  # Only add non-empty tournaments
                    tournaments.add(tournament)
    
    return sorted(list(tournaments))


def select_tournaments(tournaments, team_name=None):
    """Prompt user to select which tournaments to include."""
    if not tournaments:
        if team_name:
            print(f"No tournaments found for {team_name}.")
        else:
            print("No tournaments found in the data files.")
        return []
    
    if team_name:
        print(f"\nInput tournaments you'd like to include for {team_name} team:")
    else:
        print("\nAvailable tournaments:")
    
    print("-" * 50)
    for i, tournament in enumerate(tournaments, 1):
        print(f"{i}. {tournament}")
    print("-" * 50)
    
    print("\nEnter tournament numbers to include (comma-separated, e.g., 1,2,3)")
    print("Or press Enter to include all tournaments:")
    
    selection = input().strip()
    
    if not selection:
        # Include all tournaments
        return tournaments
    
    try:
        indices = [int(x.strip()) - 1 for x in selection.split(",")]
        selected = [tournaments[i] for i in indices if 0 <= i < len(tournaments)]
        
        if not selected:
            print("No valid tournaments selected. Including all tournaments.")
            return tournaments
        
        print(f"\nSelected tournaments: {', '.join(selected)}")
        return selected
    except (ValueError, IndexError):
        print("Invalid input. Including all tournaments.")
        return tournaments


def filter_csv_by_tournaments(whole_csv, selected_tournaments):
    """Filter CSV rows to only include selected tournaments."""
    if not selected_tournaments:
        return whole_csv
    
    filtered = []
    for row in whole_csv:
        tournament = row.get("Tournamemnt", "").strip()
        if tournament in selected_tournaments:
            filtered.append(row)
    
    return filtered

