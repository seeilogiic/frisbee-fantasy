import csv


def set_players_and_teams(filename, players_dict, team_name):
    with open(filename, newline="") as csvfile:
        whole_csv = list(csv.DictReader(csvfile))

    if team_name not in players_dict:
        players_dict[team_name] = {}

    for row in whole_csv:

        for j in range(7):  # Set players on each line to
            name = row[f"Player {j}"]

            if name not in players_dict[team_name]:
                players_dict[team_name][name] = {}

    players_dict[team_name].pop("", None)
    return players_dict, whole_csv
