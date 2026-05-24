#include <stdio.h>
#include "db.h"

PGconn* connect_db() {
    /*
     * ============================================================
     *  PERSON 1 FILLS THIS IN
     *  Replace the values below with what Person 1 gives you in
     *  their db_config.txt file.
     *  Typical values:
     *    host     = localhost  (or their IP if on another machine)
     *    port     = 5432       (default PostgreSQL port)
     *    dbname   = ctf_db     (whatever Person 1 named the DB)
     *    user     = postgres   (or the user Person 1 created)
     *    password = <their password>
     * ============================================================
     */
    PGconn *conn = PQconnectdb(
        "host=localhost "
        "port=5432 "
        "dbname=digital_enigma "       /* <-- change to Person 1's DB name  */
        "user=postgres "         /* <-- change to Person 1's username  */
        "password=Saloni@14"  /* <-- change to Person 1's password */
    );

    if (PQstatus(conn) != CONNECTION_OK) {
        fprintf(stderr, "Connection failed: %s\n", PQerrorMessage(conn));
        PQfinish(conn);
        return NULL;
    }

    printf("DB connected successfully.\n");
    return conn;
}

void close_db(PGconn *conn) {
    if (conn) PQfinish(conn);
}