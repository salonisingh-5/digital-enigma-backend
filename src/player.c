#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "player.h"

/*
 * load_player()
 * Fetches a player row from the DB by name and fills the Player struct.
 * Returns 1 on success, 0 if player not found, -1 on DB error.
 */
int load_player(PGconn *conn, const char *name, Player *out) {
    const char *paramValues[1] = { name };

    PGresult *res = PQexecParams(conn,
        "SELECT id, name, tokens, puzzles_solved, "
        "       difficulty_multiplier, rank_points "
        "FROM   players "
        "WHERE  name = $1",
        1,           /* number of params      */
        NULL,        /* let server infer types */
        paramValues,
        NULL, NULL,  /* param lengths / formats (text) */
        0            /* result in text format  */
    );

    if (PQresultStatus(res) != PGRES_TUPLES_OK) {
        fprintf(stderr, "load_player query failed: %s\n", PQerrorMessage(conn));
        PQclear(res);
        return -1;
    }

    if (PQntuples(res) == 0) {
        PQclear(res);
        return 0;   /* player not found */
    }

    out->id                   = atoi(PQgetvalue(res, 0, 0));
    strncpy(out->name,               PQgetvalue(res, 0, 1), 99);
    out->tokens               = atoi(PQgetvalue(res, 0, 2));
    out->puzzles_solved       = atoi(PQgetvalue(res, 0, 3));
    out->difficulty_multiplier= atof(PQgetvalue(res, 0, 4));
    out->rank_points          = atoi(PQgetvalue(res, 0, 5));

    PQclear(res);
    return 1;
}

/*
 * save_player()
 * Updates tokens, puzzles_solved, difficulty_multiplier, rank_points
 * for an existing player.
 * Returns 1 on success, -1 on error.
 */
int save_player(PGconn *conn, const Player *p) {
    char tok[16], ps[16], dm[16], rp[16], pid[16];
    snprintf(tok, sizeof tok, "%d",  p->tokens);
    snprintf(ps,  sizeof ps,  "%d",  p->puzzles_solved);
    snprintf(dm,  sizeof dm,  "%.2f",p->difficulty_multiplier);
    snprintf(rp,  sizeof rp,  "%d",  p->rank_points);
    snprintf(pid, sizeof pid, "%d",  p->id);

    const char *vals[5] = { tok, ps, dm, rp, pid };

    PGresult *res = PQexecParams(conn,
        "UPDATE players "
        "SET    tokens=$1, puzzles_solved=$2, "
        "       difficulty_multiplier=$3, rank_points=$4 "
        "WHERE  id=$5",
        5, NULL, vals, NULL, NULL, 0
    );

    if (PQresultStatus(res) != PGRES_COMMAND_OK) {
        fprintf(stderr, "save_player failed: %s\n", PQerrorMessage(conn));
        PQclear(res);
        return -1;
    }

    PQclear(res);
    return 1;
}

void print_player(const Player *p) {
    printf("Player  : %s (id=%d)\n", p->name, p->id);
    printf("Tokens  : %d\n",         p->tokens);
    printf("Solved  : %d\n",         p->puzzles_solved);
    printf("Mult    : %.2f\n",        p->difficulty_multiplier);
    printf("Rank pts: %d\n",         p->rank_points);
}