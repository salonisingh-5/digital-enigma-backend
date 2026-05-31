#ifndef TOKEN_H
#define TOKEN_H

#include "player.h"

/* Token costs */
#define HINT_COST        10
#define WRONG_PENALTY     5

/* Token rewards (multiplied by difficulty) */
#define BASE_REWARD      50

int   spend_tokens     (Player *p, int amount);
void  earn_tokens      (Player *p, int puzzle_difficulty);
int   calculate_rank   (Player *p);

#endif