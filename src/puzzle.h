#ifndef PUZZLE_H
#define PUZZLE_H

#include <libpq-fe.h>

typedef struct {
    int  id;
    char domain[50];
    char question[500];
    char flag[100];
    int  difficulty;
    char hint1[200];
    char hint2[200];
    char hint3[200];
} Puzzle;

int load_puzzle    (PGconn *conn, int puzzle_id, Puzzle *out);
int validate_flag  (const Puzzle *p, const char *submitted_flag);
int get_hint       (PGconn *conn, int player_id, int puzzle_id,
                    int hint_num, char *out_hint, int out_len);

#endif