export default defineEventHandler(async (event) => {
    const db = useDatabase();
    // await db.sql`DROP TABLE IF EXISTS users`;
    //TODO: change code format
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
                const hashedPassword = await hashPassword(body.password);
                try {
                    //TODO: check if username is valid
                    //TODO: sql injection possible -> use orm (drizzle)
                    await db.sql`INSERT INTO users (username, email, password, grade)
                                 VALUES (${body.username}, ${body.email}, ${hashedPassword}, ${body.grade})`;
                    // Starte die Session für den User
                    await setUserSession(event, {
                        user: {username: body.username}, // User-Daten, die in der Session gespeichert werden
                    });
                    return {success: true, message: "user registered"};
                } catch (e: any) {
                    if (e.message === 'UNIQUE constraint failed: users.username') {
                        console.log("user already exists", e.message);
                        return {success: false, message: "user already exists"};
                    } else {
                        console.log("unknown server error: ", e.message);
                        return {success: false, message: "unknown server error"};
                    }
                }
            }
            case 'loginUser': {
                //TODO: case1: user does not exist
                //TODO: case2: password is wrong
                //TODO: case3: user is logged in already
                //TODO: get hashedPassword from db
                const hashedPassword = "";
                if (await verifyPassword(hashedPassword, body.password)) {
                    console.log("passwords match");
                }
                break;
            }

            default:
                throw createError({statusCode: 400, message: 'Ungültige Aktion'});
        }
    }

    throw createError({statusCode: 405, message: 'Method not allowed'});
});

