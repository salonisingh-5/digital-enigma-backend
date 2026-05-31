CC      = gcc
CFLAGS  = -Wall -Wextra -g -std=c11 -IC:/msys64/ucrt64/include
LDFLAGS = -LC:/msys64/ucrt64/lib
LIBS    = -lpq

SRC = src/main.c src/db.c src/player.c src/puzzle.c src/token.c
OUT = build/game_engine.exe

all:
	$(CC) $(CFLAGS) $(SRC) -o $(OUT) $(LDFLAGS) $(LIBS)

clean:
	rm -f $(OUT)