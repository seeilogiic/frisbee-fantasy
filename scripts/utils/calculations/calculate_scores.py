def calculate_captain_score(players_dict):
    for team in players_dict:
        for player in players_dict[team].values():
            assists = player["assists"]
            goals = player["goals"]
            ds = player["ds"]
            turnovers = player["turnovers"]

            captain_score = (3 * assists) + (3 * goals) + (9 * ds) - (3 * turnovers)
            player["scores"]["captain_score"] = captain_score

    return players_dict


def calculate_handler_score(players_dict):
    for team in players_dict:
        for player in players_dict[team].values():
            assists = player["assists"]
            goals = player["goals"]
            ds = player["ds"]
            turnovers = player["turnovers"]

            handler_score = (3 * assists) + (1 * goals) + (3 * ds) - (1 * turnovers)
            player["scores"]["handler_score"] = handler_score

    return players_dict


def calculate_cutter_score(players_dict):
    for team in players_dict:
        for player in players_dict[team].values():
            assists = player["assists"]
            goals = player["goals"]
            ds = player["ds"]
            turnovers = player["turnovers"]

            cutter_score = (1 * assists) + (3 * goals) + (3 * ds) - (1 * turnovers)
            player["scores"]["cutter_score"] = cutter_score

    return players_dict


def calculate_defender_score(players_dict):
    for team in players_dict:
        for player in players_dict[team].values():
            assists = player["assists"]
            goals = player["goals"]
            ds = player["ds"]
            turnovers = player["turnovers"]

            defender_score = (1 * assists) + (1 * goals) + (9 * ds) - (1 * turnovers)
            player["scores"]["defender_score"] = defender_score

    return players_dict


def calculate_all_scores(players_dict):
    for team in players_dict:
        for player in players_dict[team].values():
            player["scores"] = {
                "captain_score": 0,
                "handler_score": 0,
                "cutter_score": 0,
                "defender_score": 0,
            }

    players_dict = calculate_captain_score(players_dict)
    players_dict = calculate_handler_score(players_dict)
    players_dict = calculate_cutter_score(players_dict)
    players_dict = calculate_defender_score(players_dict)

    return players_dict
