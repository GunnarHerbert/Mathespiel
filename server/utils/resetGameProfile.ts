import {UserSession} from "#auth-utils";
/*
* Reset the game profile of the user: currentTask, isCurrentTaskSolved, unsolvedTasks
* @param grade: grade of the user
*/
export const resetGameProfile = async (session: UserSession) => {
    const db = useDatabase();
    let IdQuery;
    switch (session.user?.grade) {
        case 3:
        case 4:
            IdQuery = await db.sql`SELECT id
                                   FROM tasks34`;
            break;
        case 5 :
        case 6:
            IdQuery = await db.sql`SELECT id
                                   FROM tasks56`;
            break;
        case 7:
        case 8:
            IdQuery = await db.sql`SELECT id
                                   FROM tasks78`;
            break;
        default:
            throw createError({statusCode: 400, message: 'Ungültige Aktion'});
    }
    let unsolvedTasksArr = IdQuery.rows?.map(row => row.id?.toString());
    unsolvedTasksArr = unsolvedTasksArr?.sort(() => Math.random() - 0.5);
    const currentTask = unsolvedTasksArr?.shift();
    const unsolvedTasks = unsolvedTasksArr?.join(";");

    const username = session.user!.username;

    // if row for username does not exist, create a new row (register user)
    const userGameProfileQuery = await db.sql`SELECT username
                                              FROM userGameProfile
                                              WHERE username = ${username}`;
    if (userGameProfileQuery.rows?.length === 0) {
        //user does not exist yet
        await db.sql`INSERT INTO userGameProfile (username, currentTaskId, isCurrentTaskSolved, unsolvedTasks)
                     VALUES (${username}, ${currentTask}, 0, ${unsolvedTasks})`;
    } else {
        //user already exists but solved all tasks already
        await db.sql`UPDATE userGameProfile
                     SET currentTaskId = ${currentTask}
                     WHERE username = ${username}`;
        await db.sql`UPDATE userGameProfile
                     SET unsolvedTasks = ${unsolvedTasks}
                     WHERE username = ${username}`;
    }
};
