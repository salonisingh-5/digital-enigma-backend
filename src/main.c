#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "db.h"
#include "player.h"
#include "puzzle.h"
#include "token.h"

/* ------------------------------------------------------------------ */
/*  JSON output helpers                                                 */
/* ------------------------------------------------------------------ */

static void json_ok(const char *result, int tokens, int rank, const char *msg) {
    printf("{\"result\":\"%s\",\"tokens\":%d,\"rank\":%d,\"message\":\"%s\"}\n",
           result, tokens, rank, msg);
}

static void json_error(const char *msg) {
    printf("{\"result\":\"error\",\"message\":\"%s\"}\n", msg);
}

static void json_hint(const char *hint, int tokens_left) {
    printf("{\"result\":\"hint\",\"hint\":\"%s\",\"tokens_left\":%d}\n",
           hint, tokens_left);
}

/* ------------------------------------------------------------------ */
/*  Commands                                                            */
/* ------------------------------------------------------------------ */

/*
 * submit <player_name> <puzzle_id> <flag> <time_taken_seconds>
 * Node.js calls: ./game_engine submit arjun 3 "FLAG{hello}" 45
 */
static void cmd_submit(PGconn *conn, int argc, char *argv[]) {
    if (argc < 6) { json_error("usage: submit <player> <puzzle_id> <flag> <time_secs>"); return; }

    const char *player_name = argv[2];
    int         puzzle_id   = atoi(argv[3]);
    const char *submitted   = argv[4];
    int         time_secs   = atoi(argv[5]);
    (void)time_secs;   /* can use for bonus scoring later */

    Player p;
    if (load_player(conn, player_name, &p) != 1) {
        json_error("Player not found");
        return;
    }

    Puzzle pz;
    if (load_puzzle(conn, puzzle_id, &pz) != 1) {
        json_error("Puzzle not found");
        return;
    }

    if (validate_flag(&pz, submitted)) {
        earn_tokens(&p, pz.difficulty);
        calculate_rank(&p);
        save_player(conn, &p);

        /* log correct attempt */
        char pid[16], pzid[16];
        snprintf(pid,  sizeof pid,  "%d", p.id);
        snprintf(pzid, sizeof pzid, "%d", pz.id);
        const char *vals[2] = { pid, pzid };
        PGresult *r = PQexecParams(conn,
            "INSERT INTO attempts (player_id, puzzle_id, is_correct, attempted_at) "
            "VALUES ($1, $2, TRUE, NOW())",
            2, NULL, vals, NULL, NULL, 0);
        PQclear(r);

        json_ok("correct", p.tokens, p.rank_points, "Well done!");
    } else {
        /* deduct penalty tokens */
        spend_tokens(&p, WRONG_PENALTY);
        save_player(conn, &p);
        json_ok("wrong", p.tokens, p.rank_points, "Incorrect flag. Try again!");
    }
}

/*
 * hint <player_name> <puzzle_id> <hint_number>
 * Node.js calls: ./game_engine hint arjun 3 1
 */
static void cmd_hint(PGconn *conn, int argc, char *argv[]) {
    if (argc < 5) { json_error("usage: hint <player> <puzzle_id> <hint_num>"); return; }

    const char *player_name = argv[2];
    int         puzzle_id   = atoi(argv[3]);
    int         hint_num    = atoi(argv[4]);

    Player p;
    if (load_player(conn, player_name, &p) != 1) {
        json_error("Player not found");
        return;
    }

    /* hints cost tokens */
    if (!spend_tokens(&p, HINT_COST)) {
        json_error("Not enough tokens for a hint");
        return;
    }

    char hint_text[200];
    if (get_hint(conn, p.id, puzzle_id, hint_num, hint_text, sizeof hint_text) != 1) {
        json_error("Could not fetch hint");
        return;
    }

    save_player(conn, &p);
    json_hint(hint_text, p.tokens);
}

/*
 * leaderboard
 * Node.js calls: ./game_engine leaderboard
 * Prints a JSON array of top 10 players.
 */
static void cmd_leaderboard(PGconn *conn) {
    PGresult *res = PQexec(conn,
        "SELECT name, rank_points, tokens, puzzles_solved "
        "FROM   players "
        "ORDER  BY rank_points DESC "
        "LIMIT  10"
    );

    if (PQresultStatus(res) != PGRES_TUPLES_OK) {
        json_error("Leaderboard query failed");
        PQclear(res);
        return;
    }

    int rows = PQntuples(res);
    printf("[");
    for (int i = 0; i < rows; i++) {
        printf("{\"rank\":%d,\"name\":\"%s\",\"rank_points\":%s,"
               "\"tokens\":%s,\"puzzles_solved\":%s}",
               i + 1,
               PQgetvalue(res, i, 0),
               PQgetvalue(res, i, 1),
               PQgetvalue(res, i, 2),
               PQgetvalue(res, i, 3));
        if (i < rows - 1) printf(",");
    }
    printf("]\n");
    PQclear(res);
}

/* ------------------------------------------------------------------ */
/*  main()                                                              */
/* ------------------------------------------------------------------ */

int main(int argc, char *argv[]) {
    if (argc < 2) {
        json_error("No command given. Use: submit | hint | leaderboard");
        return 1;
    }

    PGconn *conn = connect_db();
    if (!conn) {
        json_error("Database connection failed");
        return 1;
    }

    const char *cmd = argv[1];

    if      (strcmp(cmd, "submit")      == 0) cmd_submit(conn, argc, argv);
    else if (strcmp(cmd, "hint")        == 0) cmd_hint(conn, argc, argv);
    else if (strcmp(cmd, "leaderboard") == 0) cmd_leaderboard(conn);
    else    json_error("Unknown command");

    close_db(conn);
    return 0;
}