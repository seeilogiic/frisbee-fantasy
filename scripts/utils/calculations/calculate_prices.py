def calculate_players_prices(players_dict):
    captain_scores = []
    for team in players_dict:
        for player in players_dict[team]:
            score = players_dict[team][player]["scores"]["captain_score"]
            captain_scores.append(score)
            players_dict[team][player]["price"] = 0

    cap_min = min(captain_scores)
    cap_max = max(captain_scores)

    for i, score in enumerate(captain_scores):
        y = round((3 + (25 - 3) * (score - cap_min) / (cap_max - cap_min)))
        captain_scores[i] = [score, y]

    for team in players_dict:
        for player in players_dict[team]:
            for score in captain_scores:
                if players_dict[team][player]["scores"]["captain_score"] == score[0]:
                    players_dict[team][player]["price"] = score[1]

    return players_dict
