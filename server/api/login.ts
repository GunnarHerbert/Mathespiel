import {resetGameProfile} from "../utils/resetGameProfile";

export default defineEventHandler(async (event) => {
    const db = useDatabase();
    // @formatter:off
    await db.sql`CREATE TABLE IF NOT EXISTS users ("id" INTEGER PRIMARY KEY, "username" TEXT UNIQUE, "email" TEXT, "password" TEXT, "grade" INTEGER)`;
    // @formatter:on
    if (event.node.req.method === 'POST') {
        const body = await readBody(event);

        switch (body.action) {
            case 'registerUser': {
                const hashedPassword = await hashPassword(body.password);
                try {
                    //TODO: check if username is valid
                    //TODO: sql injection possible? -> use orm (drizzle)
                    await db.sql`INSERT INTO users (username, email, password, grade)
                                 VALUES (${body.username}, ${body.email}, ${hashedPassword}, ${body.grade})`;
                    // Starte die Session für den User
                    await setUserSession(event, {
                        user: {username: body.username, grade: body.grade}, // User-Daten, die in der Session gespeichert werden
                    });
                    const session = await getUserSession(event);
                    await resetGameProfile(session);
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
                const hashedPasswordRequest = await db.sql`SELECT password
                                                           FROM users
                                                           WHERE username = ${body.username}`;
                if (hashedPasswordRequest.rows?.length === 1 && await verifyPassword(<string>hashedPasswordRequest.rows[0].password, body.password)) {
                    //get grade from users table
                    const gradeRequest = await db.sql`SELECT grade
                                                      FROM users
                                                      WHERE username = ${body.username}`;
                    const grade = gradeRequest.rows?.[0].grade as number;
                    await setUserSession(event, {
                        user: {username: body.username, grade: grade},
                    });
                    return {success: true, message: "user logged in"};
                } else if (hashedPasswordRequest.rows?.length === 1) {
                    console.log("incorrect username or password");
                    return {success: false, message: "incorrect username or password"};
                } else if (hashedPasswordRequest.rows?.length === 0) {
                    console.log("no such user found");
                    return {success: false, message: "no such user found"};
                } else {
                    console.log("###########################unknown server error###########################");
                    return {success: false, message: "unknown server error"};
                }
            }

            default:
                throw createError({statusCode: 400, message: 'Ungültige Aktion'});
        }
    }

    throw createError({statusCode: 405, message: 'Method not allowed'});
});
