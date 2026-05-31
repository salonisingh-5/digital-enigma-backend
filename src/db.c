#include <stdio.h>
#include "db.h"

PGconn* connect_db() {
    
    PGconn *conn = PQconnectdb(
        "host=localhost "
        "port=5432 "
        "dbname=postgres "
        "user=postgres "
        "password=ShreyaSharma@21.8"
    );

    if (PQstatus(conn) != CONNECTION_OK) {
        fprintf(stderr, "Connection failed: %s\n", PQerrorMessage(conn));
        PQfinish(conn);
        return NULL;
    }

    /* REMOVED: printf("DB connected successfully.\n");
       Any printf to stdout breaks Node.js JSON.parse() on the output.
       Use fprintf(stderr, ...) only for debug messages. */

    return conn;
}

void close_db(PGconn *conn) {
    if (conn) PQfinish(conn);
}