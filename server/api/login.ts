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
                    //TODO: check if username is valid syntax
                    await db.sql`INSERT INTO users (username, email, password, grade)
                                 VALUES (${body.username}, ${body.email}, ${hashedPassword}, ${body.grade})`;
                    await db.sql`INSERT INTO userStats (username, rank, points, crystals)
                                 VALUES (${body.username}, 0, 10, 0)`;
                    // Starte die Session für den User
                    await setUserSession(event, {
                        user: {
                            username: body.username,
                            grade: body.grade,
                            isCurrentTaskSolved: 0,
                            rank: 0,
                            points: 10,
                            crystals: 0
                        }, // User-Daten, die in der Session gespeichert werden
                    });
                    const session = await getUserSession(event);
                    await resetGameProfile(session);
                    return {success: true, message: "user registered"};
                } catch (e: any) {
                    if (e.message === 'UNIQUE constraint failed: users.username') {
                        return {success: false, message: "Dieser Benutzername ist leider bereits vergeben"};
                    } else {
                        return {success: false, message: "Es ist ein unbekannter Fehler aufgetreten. Bitte lade die Seite neu und versuche es noch einmal."};
                    }
                }
            }
            case 'loginUser': {
                const hashedPasswordRequest = await db.sql`SELECT password
                                                           FROM users
                                                           WHERE username = ${body.username}`;
                if (hashedPasswordRequest.rows?.length === 1 && await verifyPassword(<string>hashedPasswordRequest.rows[0].password, body.password)) {
                    // get grade from users table
                    const gradeRequest = await db.sql`SELECT grade
                                                      FROM users
                                                      WHERE username = ${body.username}`;
                    const grade = gradeRequest.rows?.[0].grade as number;
                    const isCurrentTaskSolvedQuery = await db.sql`SELECT isCurrentTaskSolved
                                                                  FROM userGameProfile
                                                                  WHERE username = ${body.username}`;
                    const isCurrentTaskSolved = isCurrentTaskSolvedQuery.rows?.[0].isCurrentTaskSolved as number;
                    // get current rank, points and crystals from userStats table to store in session
                    const userStatsRequest = await db.sql`SELECT rank, points, crystals
                                                          FROM userStats
                                                          WHERE username = ${body.username}`;
                    const rank = userStatsRequest.rows?.[0].rank as number;
                    const points = userStatsRequest.rows?.[0].points as number;
                    const crystals = userStatsRequest.rows?.[0].crystals as number;
                    await setUserSession(event, {
                        user: {
                            username: body.username,
                            grade: grade,
                            isCurrentTaskSolved: isCurrentTaskSolved,
                            rank,
                            points,
                            crystals
                        }, // User-Daten, die in der Session gespeichert werden
                    });
                    return {success: true, message: "user logged in"};
                } else if (hashedPasswordRequest.rows?.length === 1) {
                    return {success: false, message: "Benutzername oder Passwort ist falsch"};
                } else if (hashedPasswordRequest.rows?.length === 0) {
                    return {success: false, message: "Benutzername oder Passwort ist falsch"};
                } else {
                    return {success: false, message: "Es ist ein unbekannter Fehler aufgetreten. Bitte lade die Seite neu und versuche es noch einmal."};
                }
            }

            default:
                throw createError({statusCode: 400, message: 'Ungültige Aktion'});
        }
    }

    throw createError({statusCode: 405, message: 'Method not allowed'});
});
