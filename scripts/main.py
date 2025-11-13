import os
from utils.calculations import (
    set_players_and_teams,
    set_players_stats,
    calculate_all_scores,
    output_to_csv_file,
    calculate_players_prices,
    collect_tournaments_from_file,
    select_tournaments,
    filter_csv_by_tournaments,
    manage_players,
)

filenames = []
folder_dir = 'raw_data_files'
for filename in os.listdir(folder_dir):
    filenames.append(folder_dir + '/' + filename)

team_name = []
for i, filename in enumerate(filenames):
    filename.replace('raw_data_files/', '')
    name = input(f'{i}/{len(filenames)} | Enter team name for file {filename}: ')
    team_name.append(name)

players_dict = {}

for i, file in enumerate(filenames):

    players_dict, whole_csv = set_players_and_teams(
        file, players_dict, team_name[i]
    )
    
    # Collect tournaments for this team and let user select which to include
    team_tournaments = collect_tournaments_from_file(file)
    selected_tournaments = select_tournaments(team_tournaments, team_name[i])
    
    # Filter CSV data to only include selected tournaments
    filtered_csv = filter_csv_by_tournaments(whole_csv, selected_tournaments)
    
    players_dict = set_players_stats(players_dict, team_name[i], filtered_csv)
    
    # Allow user to add/delete players before calculations
    players_dict = manage_players(players_dict, team_name[i])

players_dict = calculate_all_scores(players_dict)
players_dict = calculate_players_prices(players_dict)

output_to_csv_file(players_dict)
