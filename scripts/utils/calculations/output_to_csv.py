import csv


def output_to_csv_file(players_dict):
    with open("players.csv", "w", newline="") as f:
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
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for team_name, players in players_dict.items():
            for player_name, data in players.items():
                # Handle misspelling of "tournamemnts"
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
                writer.writerow(
                    {
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
                    }
                )
