def initialize_empty_player():
    """Create a player entry with empty stats."""
    return {
        "assists": 0,
        "goals": 0,
        "ds": 0,
        "turnovers": 0,
        "tournamemnts": {},
        "games_played": 0,
        "questionable": False,
    }


def manage_players(players_dict, team_name):
    """Import players that will be playing at next tournament, then allow adding more."""
    if team_name not in players_dict:
        players_dict[team_name] = {}
    
    all_players = list(players_dict[team_name].keys())
    
    if not all_players:
        print(f"\nNo players found for {team_name}.")
        print("You can add players manually.")
    else:
        print(f"\n{'='*60}")
        print(f"Import players that will be playing at next tournament for {team_name} team")
        print(f"{'='*60}")
        
        print("\nAll available players:")
        print("-" * 60)
        for i, player in enumerate(all_players, 1):
            print(f"{i}. {player}")
        print("-" * 60)
        
        # Step 1: Select players for next tournament
        player_input = input("\nEnter player number(s) that will be playing (comma-separated, e.g., 1,2,3): ").strip()
        
        if player_input:
            try:
                # Parse comma-separated numbers
                player_nums = [int(x.strip()) - 1 for x in player_input.split(",")]
                
                # Get selected players
                selected_players = []
                invalid_nums = []
                
                for player_index in player_nums:
                    if 0 <= player_index < len(all_players):
                        selected_players.append(all_players[player_index])
                    else:
                        invalid_nums.append(player_index + 1)  # Convert back to 1-based for display
                
                if invalid_nums:
                    print(f"Warning: Invalid player number(s) ignored: {', '.join(map(str, invalid_nums))}")
                
                if selected_players:
                    # Keep only selected players, remove the rest
                    players_to_remove = [p for p in all_players if p not in selected_players]
                    for player in players_to_remove:
                        del players_dict[team_name][player]
                    
                    print(f"\nImported {len(selected_players)} player(s) for next tournament: {', '.join(selected_players)}")
                else:
                    print("\nNo valid players selected. Keeping all players.")
            except ValueError:
                print("Invalid input. Keeping all players.")
        else:
            print("\nNo players selected. Keeping all players.")
    
    # Step 2: Allow adding more players
    print(f"\n{'='*60}")
    print("Add additional players (type -1 to finish)")
    print(f"{'='*60}")
    
    while True:
        current_players = list(players_dict[team_name].keys())
        if current_players:
            print("\nCurrent players:")
            print("-" * 60)
            for i, player in enumerate(current_players, 1):
                print(f"{i}. {player}")
            print("-" * 60)
        
        new_player = input("\nEnter player name to add (or -1 to finish): ").strip()
        
        if new_player == "-1":
            break
        
        if new_player:
            if new_player in players_dict[team_name]:
                print(f"Player '{new_player}' already exists.")
            else:
                players_dict[team_name][new_player] = initialize_empty_player()
                print(f"Added player '{new_player}' with empty stats.")
        else:
            print("Player name cannot be empty.")
    
    # Step 3: Mark players as questionable/injured
    current_players = list(players_dict[team_name].keys())
    if current_players:
        print(f"\n{'='*60}")
        print("Mark players as questionable/injured (type -1 to skip)")
        print(f"{'='*60}")
        
        print("\nCurrent players:")
        print("-" * 60)
        for i, player in enumerate(current_players, 1):
            questionable_status = " (QUESTIONABLE)" if players_dict[team_name][player].get("questionable", False) else ""
            print(f"{i}. {player}{questionable_status}")
        print("-" * 60)
        
        injury_input = input("\nEnter player number(s) that are questionable (comma-separated, e.g., 1,2,3) or -1 to skip: ").strip()
        
        if injury_input and injury_input != "-1":
            try:
                # First, reset all players to not questionable
                for player in current_players:
                    players_dict[team_name][player]["questionable"] = False
                
                # Parse comma-separated numbers
                player_nums = [int(x.strip()) - 1 for x in injury_input.split(",")]
                
                # Mark selected players as questionable
                questionable_players = []
                invalid_nums = []
                
                for player_index in player_nums:
                    if 0 <= player_index < len(current_players):
                        player_name = current_players[player_index]
                        players_dict[team_name][player_name]["questionable"] = True
                        questionable_players.append(player_name)
                    else:
                        invalid_nums.append(player_index + 1)  # Convert back to 1-based for display
                
                if invalid_nums:
                    print(f"Warning: Invalid player number(s) ignored: {', '.join(map(str, invalid_nums))}")
                
                if questionable_players:
                    print(f"\nMarked {len(questionable_players)} player(s) as questionable: {', '.join(questionable_players)}")
            except ValueError:
                print("Invalid input. No players marked as questionable.")
    
    return players_dict

