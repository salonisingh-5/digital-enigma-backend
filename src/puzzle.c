#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "puzzle.h"

/*
 * load_puzzle()
 * Loads a puzzle by its ID from the DB.
 * Returns 1 on success, 0 not found, -1 error.
 */
int load_puzzle(PGconn *conn, int puzzle_id, Puzzle *out) {
    char id_str[16];
    snprintf(id_str, sizeof id_str, "%d", puzzle_id);
    const char *params[1] = { id_str };

    PGresult *res = PQexecParams(conn,
        "SELECT id, domain, question, flag, difficulty, "
        "       hint1, hint2, hint3 "
        "FROM   puzzles "
        "WHERE  id = $1",
        1, NULL, params, NULL, NULL, 0
    );

    if (PQresultStatus(res) != PGRES_TUPLES_OK) {
        fprintf(stderr, "load_puzzle failed: %s\n", PQerrorMessage(conn));
        PQclear(res);
        return -1;
    }

    if (PQntuples(res) == 0) {
        PQclear(res);
        return 0;
    }

    out->id         = atoi(PQgetvalue(res, 0, 0));
    strncpy(out->domain,   PQgetvalue(res, 0, 1), 49);
    strncpy(out->question, PQgetvalue(res, 0, 2), 499);
    strncpy(out->flag,     PQgetvalue(res, 0, 3), 99);
    out->difficulty = atoi(PQgetvalue(res, 0, 4));
    strncpy(out->hint1,    PQgetvalue(res, 0, 5), 199);
    strncpy(out->hint2,    PQgetvalue(res, 0, 6), 199);
    strncpy(out->hint3,    PQgetvalue(res, 0, 7), 199);

    PQclear(res);
    return 1;
}

/*
 * validate_flag()
 * Case-insensitive comparison between submitted flag and correct flag.
 * Returns 1 if correct, 0 if wrong.
 */
int validate_flag(const Puzzle *p, const char *submitted_flag) {
    /* convert both to lowercase for comparison */
    char correct[100], submitted[100];
    int i;

    strncpy(correct,   p->flag,      99);
    strncpy(submitted, submitted_flag, 99);

    for (i = 0; correct[i];   i++) if (correct[i]   >= 'A' && correct[i]   <= 'Z') correct[i]   += 32;
    for (i = 0; submitted[i]; i++) if (submitted[i]  >= 'A' && submitted[i] <= 'Z') submitted[i] += 32;

    return strcmp(correct, submitted) == 0 ? 1 : 0;
}

/*
 * get_hint()
 * Returns hint 1, 2, or 3 for a puzzle.
 * Also logs the hint request in the attempts table.
 * Returns 1 on success, -1 on error.
 */
int get_hint(PGconn *conn, int player_id, int puzzle_id,
             int hint_num, char *out_hint, int out_len) {
    Puzzle p;
    if (load_puzzle(conn, puzzle_id, &p) != 1) return -1;

    const char *hint = NULL;
    if      (hint_num == 1) hint = p.hint1;
    else if (hint_num == 2) hint = p.hint2;
    else if (hint_num == 3) hint = p.hint3;
    else { fprintf(stderr, "Invalid hint number %d\n", hint_num); return -1; }

    strncpy(out_hint, hint, out_len - 1);
    out_hint[out_len - 1] = '\0';

    /* log hint in attempts table */
    char pid[16], pzid[16], hn[4];
    snprintf(pid,  sizeof pid,  "%d", player_id);
    snprintf(pzid, sizeof pzid, "%d", puzzle_id);
    snprintf(hn,   sizeof hn,   "%d", hint_num);
    const char *vals[3] = { pid, pzid, hn };

    PGresult *res = PQexecParams(conn,
        "INSERT INTO attempts (player_id, puzzle_id, hint_used, attempted_at) "
        "VALUES ($1, $2, $3, NOW())",
        3, NULL, vals, NULL, NULL, 0
    );
    PQclear(res);   /* ignore insert errors — hint still shown */

    return 1;
}