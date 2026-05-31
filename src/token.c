#include <stdio.h>
#include "token.h"

/*
 * spend_tokens()
 * Deducts 'amount' tokens from the player.
 * Returns 1 on success, 0 if not enough tokens.
 */
int spend_tokens(Player *p, int amount) {
    if (p->tokens < amount) {
        fprintf(stderr, "Not enough tokens! Have %d, need %d\n",
                p->tokens, amount);
        return 0;
    }
    p->tokens -= amount;
    return 1;
}

/*
 * earn_tokens()
 * Awards tokens when a puzzle is solved.
 * Formula: BASE_REWARD * difficulty * difficulty_multiplier
 */
void earn_tokens(Player *p, int puzzle_difficulty) {
    int earned = (int)(BASE_REWARD * puzzle_difficulty * p->difficulty_multiplier);
    p->tokens += earned;
    p->puzzles_solved++;

    /* REMOVED: printf("Earned %d tokens! Total: %d\n", earned, p->tokens);
       stdout is reserved for JSON output only.
       Node.js will crash on JSON.parse() if anything else appears here. */
    fprintf(stderr, "Earned %d tokens! Total: %d\n", earned, p->tokens);
}

/*
 * calculate_rank()
 * Updates rank_points and returns the new value.
 * Formula: puzzles_solved * 100 + tokens / 2
 */
int calculate_rank(Player *p) {
    p->rank_points = (p->puzzles_solved * 100) + (p->tokens / 2);
    return p->rank_points;
}