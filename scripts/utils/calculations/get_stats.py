import csv


def set_players_stats(players_dict, team_name, whole_csv):
    for player in players_dict[team_name]:
        players_dict[team_name][player] = {
            "assists": 0,
            "goals": 0,
            "ds": 0,
            "turnovers": 0,
            "tournamemnts": {},
            "games_played": 0,
            "questionable": False,
        }

    # Get Stats (avoiding anon and '')
    for row in whole_csv:

        thrower = row["Passer"]
        reciever = row["Receiver"]
        defender = row["Defender"]

        if row["Action"] == "Goal":
            if thrower in players_dict[team_name]:
                players_dict[team_name][thrower]["assists"] += 1
            if reciever in players_dict[team_name]:
                players_dict[team_name][reciever]["goals"] += 1

        elif row["Action"] == "D":
            if defender in players_dict[team_name]:
                players_dict[team_name][defender]["ds"] += 1

        elif row["Action"] == "Throwaway":
            if thrower in players_dict[team_name]:
                players_dict[team_name][thrower]["turnovers"] += 1

        elif row["Action"] == "Drop":
            if reciever in players_dict[team_name]:
                players_dict[team_name][reciever]["turnovers"] += 1

        # Get games played for each player
        for i in range(7):
            name = row[f"Player {i}"]
            tourney = row["Tournamemnt"]
            opponent = row["Opponent"]

            if name in players_dict[team_name]:
                if tourney in players_dict[team_name][name]["tournamemnts"]:
                    if (
                        opponent
                        not in players_dict[team_name][name]["tournamemnts"][tourney]
                    ):
                        players_dict[team_name][name]["tournamemnts"][tourney].append(
                            opponent
                        )
                else:
                    players_dict[team_name][name]["tournamemnts"][tourney] = []
                    players_dict[team_name][name]["tournamemnts"][tourney].append(
                        opponent
                    )

    for player in players_dict[team_name].values():
        for tourney in player["tournamemnts"].values():
            player["games_played"] += len(tourney)

    # players_dict[team_name].pop('', None)
    return players_dict
