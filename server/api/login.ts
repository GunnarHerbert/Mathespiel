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
                    const {currentTaskId, unsolvedTasks} = await resetGameProfile(body.grade);
                    await db.sql`INSERT INTO userGameProfile (username, currentTaskId, isCurrentTaskSolved, unsolvedTasks)
                                 VALUES (${body.username}, ${currentTaskId}, 0, ${unsolvedTasks})`;
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
                const hashedPasswordRequest = await db.sql`SELECT password
                                                           FROM users
                                                           WHERE username = ${body.username}`;
                if (hashedPasswordRequest.rows?.length === 1 && await verifyPassword(<string>hashedPasswordRequest.rows[0].password, body.password)) {
                    await setUserSession(event, {
                        user: {username: body.username},
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


    /*
    * Reset the game profile of the user: currentTask, isCurrentTaskSolved, unsolvedTasks
    * @param grade: grade of the user
     */
    async function resetGameProfile (grade:number) {
        let table = `tasks56`
        switch(grade) {
            case 3 || 4:
                table = `tasks34`;
                break;
            case 5 || 6:
                table = `tasks56`;
                break;
            case 7 || 8:
                table = `tasks78`;
                break;
        }
        const IdQuery = await db.sql`SELECT id FROM tasks56`;
        let unsolvedTasksArr = IdQuery.rows?.map(row => row.id?.toString());
        unsolvedTasksArr = unsolvedTasksArr?.sort(()=>Math.random()-0.5);
        const currentTask = unsolvedTasksArr?.shift();
        const unsolvedTasks = unsolvedTasksArr?.join(";");
        return { currentTaskId: currentTask, unsolvedTasks: unsolvedTasks };
    }
});
