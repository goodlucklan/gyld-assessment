const fs = require("fs");
const csv = require("csv-parser");
const { program } = require("commander");

program
  .requiredOption("--teams <number>", "Número de equipos (ej: 3)")
  .option(
    "--seed <number>",
    "Semilla para aleatoriedad (no usada en este enfoque, pero incluida)",
    "42"
  );

program.parse(process.argv);

const options = program.opts();
const T = parseInt(options.teams);

if (isNaN(T) || T < 1) {
  console.error("Error: --teams debe ser un número positivo.");
  process.exit(1);
}

// Leer CSV
const players = [];
fs.createReadStream("data/level_a_players.csv")
  .pipe(csv())
  .on("data", (row) => {
    const player = {
      player_id: parseInt(row.player_id),
      historical_events_participated: parseInt(
        row.historical_events_participated
      ),
      historical_event_engagements: parseInt(row.historical_event_engagements),
      historical_points_earned: parseInt(row.historical_points_earned),
      historical_points_spent: parseInt(row.historical_points_spent),
      historical_messages_sent: parseInt(row.historical_messages_sent),
      current_total_points: parseInt(row.current_total_points),
      days_active_last_30: parseInt(row.days_active_last_30),
      current_streak_value: parseInt(row.current_streak_value),
      last_active_ts: parseInt(row.last_active_ts),
      current_team_id: parseInt(row.current_team_id),
      current_team_name: row.current_team_name,
    };
    player.score =
      player.historical_event_engagements +
      player.historical_messages_sent +
      player.days_active_last_30 * 10 +
      player.current_streak_value * 5 +
      player.current_total_points;
    players.push(player);
  })
  .on("end", () => {
    players.sort((a, b) => b.score - a.score || a.player_id - b.player_id);

    const teams = Array.from({ length: T }, (_, i) => ({
      id: i + 1,
      size: 0,
      total_score: 0,
      players: [],
    }));

    players.forEach((player) => {
      const minScore = Math.min(...teams.map((t) => t.total_score));
      let candidates = teams.filter((t) => t.total_score === minScore);
      candidates.sort((a, b) => a.id - b.id);
      const team = candidates[0];

      team.players.push(player);
      team.size++;
      team.total_score += player.score;
      player.new_team = team.id;
    });

    console.log("Player assignments:");
    players.sort((a, b) => a.player_id - b.player_id);
    players.forEach((p) => console.log(`${p.player_id} -> ${p.new_team}`));

    console.log("\nTeam summaries:");
    teams.sort((a, b) => a.id - b.id);
    teams.forEach((t) => {
      console.log(
        `Team ${t.id}: size ${t.size}, total engagement score: ${t.total_score}`
      );
    });

    console.log(
      "\nJustification: The total engagement score is a weighted sum of event engagements, messages sent, recent active days, streak, and current points. This ensures teams are balanced in overall player engagement, making the assignment fair and trustworthy."
    );
  });
