#ifndef PLAYER_H
#define PLAYER_H

#include <libpq-fe.h>

typedef struct {
    int    id;
    char   name[100];
    int    tokens;
    int    puzzles_solved;
    float  difficulty_multiplier;
    int    rank_points;
} Player;

int  load_player (PGconn *conn, const char *name, Player *out);
int  save_player (PGconn *conn, const Player *p);
void print_player(const Player *p);

#endif