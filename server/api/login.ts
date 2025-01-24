export default defineEventHandler(async (event) => {
    const db = useDatabase();
    // await db.sql`DROP TABLE IF EXISTS users`;
    await db.sql`CREATE TABLE IF NOT EXISTS users
                 (
                     "id"
                     INTEGER
                     PRIMARY
                     KEY,
                     "username"
                     TEXT
                     UNIQUE,
                     "email"
                     TEXT,
                     "password"
                     TEXT,
                     "grade"
                     INTEGER
                 )`;

    if (event.node.req.method === 'POST') {
        const body = await readBody(event);

        switch (body.action) {
            case 'registerUser': {
                try {
                    await db.sql`INSERT INTO users (username, email, password, grade)
                                 VALUES (${body.username}, ${body.email}, ${body.password}, ${body.grade})`;
                } catch (e: any) {
                    if (e.message === 'UNIQUE constraint failed: users.username') {
                        console.log("user already exists", e.message);
                        return "user already exists";
                    } else {
                        console.log("unknown server error: ", e.message);
                        return "unknown server error";
                    }
                }
                return "succeeded";
            }
            case 'loginUser': {
                //TODO: case1: user does not exist
                //TODO: case2: password is wrong
                //TODO: case3: user is logged in already

            }

            default:
                throw createError({statusCode: 400, message: 'Ungültige Aktion'});
        }
    }

    throw createError({statusCode: 405, message: 'Method not allowed'});
});

