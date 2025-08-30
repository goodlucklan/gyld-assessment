# Explanation

For this code I used GROK as an AI assistant.
In this case, I used two libraries:
The first one called Commander to write code on the command line, and then I used csv-parser to obtain the data sent to me in the folder.
In this case, it was a bit complicated because I had to copy the folder, transfer it to Excel, and then convert it to CSV to simulate this project. Another solution could have been to convert it into an array of objects, but I don't think it was the best option.

The approach I used was as follows.

Engagement score calculation: For each player, I calculate a composite score: historical_event_engagements + historical_messages_sent + days_active_last_30 _ 10 + current_streak_value _ 5 + current_total_points.

This weights recent activity and overall engagement.
Ordering: I sort players by descending score (most engaged first), breaking ties by ascending player_id.

Assignment: I assign each player to the team with the lowest current total score (breaking ties by lowest team ID). This ensures balance in size and engagement.

Deterministic: Doesn't use randomness, so the seed is optional and doesn't affect the score (but I include it for compliance).

Output: Mapping from player_id -> new_team, summary by team (size + total engagement score), and justification.
