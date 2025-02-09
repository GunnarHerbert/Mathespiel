import {promises as fs} from 'fs';
import {UserSession} from "#auth-utils";
import {resetGameProfile} from "../utils/resetGameProfile";

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);
    const db = useDatabase();
    // handle POST and GET requests
    if (event.node.req.method === 'POST') {
        const body = await readBody(event);
        switch (body.action) {
            // send user correct answer for his current task
            case 'validateUserAnswer': {
                let currentTaskId: number = await getCurrentTaskId(session);
                let correctAnswerLetter: string = await getCorrectAnswer(currentTaskId, session);
                await setIsCurrentTaskSolved(session, 1);
                return {success: true, correctAnswer: correctAnswerLetter};
            }
            default:
                throw createError({statusCode: 400, message: 'Ungültige Aktion'});
        }
    } else if (event.node.req.method === 'GET') {
        const dataFromURL = getQuery(event);
        switch (dataFromURL.action) {
            case 'loadImage': {
                return await loadImage(dataFromURL.sol as string, session);
            }
            case 'nextTask': {
                await setNextTaskId(session);
                await setIsCurrentTaskSolved(session, 0);
                break;
            }
            default:
                throw createError({statusCode: 400, message: 'Ungültige Aktion'});
        }
    }

    // load the task/solution image from the private folder
    async function loadImage(shouldSolutionShowString: string, session: UserSession) {
        // get the current task id of the user
        let userTaskId: number = await getCurrentTaskId(session);
        let grades: string = convertGradeToGrades(session.user!.grade!)!;
        // Bild aus dem geschützten Ordner laden
        let imagePath: string;
        // cast string to boolean
        let shouldSolutionShow: boolean = shouldSolutionShowString == "true";
        console.log("shouldSolutionShow", shouldSolutionShow);
        console.log("isCurrentTaskSolved", session.user?.isCurrentTaskSolved);
        if (shouldSolutionShow && session.user?.isCurrentTaskSolved === 1) {
            imagePath = `private/tasks/${grades}/solution/sol${userTaskId}.webp`;
        } else {
            imagePath = `private/tasks/${grades}/${userTaskId}.webp`;
        }
        try {
            const file = await fs.readFile(imagePath);
            setHeader(event, 'Content-Type', 'image/webp');
            return file;
        } catch {
            throw createError({statusCode: 404, message: 'Bild nicht gefunden'});
        }
    }

    // get the next task id for the user from his game profile
    async function setNextTaskId(session: UserSession) {
        // remove the first task id from the unsolvedTasks
        const unsolvedTasksQuery = await db.sql`SELECT unsolvedTasks
                                                FROM userGameProfile
                                                WHERE username = ${session.user!.username}`;
        const unsolvedTasks = unsolvedTasksQuery.rows?.[0].unsolvedTasks as string;
        const unsolvedTasksArr = unsolvedTasks.split(';');
        const newTaskId = unsolvedTasksArr.shift();
        //check if newTaskId is undefined
        if (newTaskId === "") {
            //TODO: what to do if there are no more tasks
            console.log("Keine weiteren Aufgaben");
            await resetGameProfile(session);
            return;
        }
        const newUnsolvedTasks = unsolvedTasksArr.join(';');
        // update the unsolvedTasks of the user with the new current taskId removed
        await db.sql`UPDATE userGameProfile
                     SET unsolvedTasks = ${newUnsolvedTasks}
                     WHERE username = ${session.user!.username}`;
        await db.sql`UPDATE userGameProfile
                     SET currentTaskId = ${newTaskId}
                     WHERE username = ${session.user!.username}`;
    }

    // set isCurrentTaskSolved (0 means the user hasn't solved the task, 1 means the user has solved the task)
    async function setIsCurrentTaskSolved(session: UserSession, isCurrentTaskSolved: number) {
        await db.sql`UPDATE userGameProfile
                     SET isCurrentTaskSolved = ${isCurrentTaskSolved}
                     WHERE username = ${session.user!.username}`;
        await setUserSession(event, {
            user: {isCurrentTaskSolved: isCurrentTaskSolved}, // User-Daten, die in der Session gespeichert werden
        });
    }

    // get correct answer for current task
    async function getCorrectAnswer(currentTaskId: number, session: UserSession) {
        let correctAnswerQuery;
        switch (session.user?.grade) {
            case 3:
            case 4:
                correctAnswerQuery = await db.sql`SELECT solution
                                                  FROM tasks34
                                                  WHERE id = ${currentTaskId}`;
                break;
            case 5 :
            case 6:
                correctAnswerQuery = await db.sql`SELECT solution
                                                  FROM tasks56
                                                  WHERE id = ${currentTaskId}`;
                break;
            case 7:
            case 8:
                correctAnswerQuery = await db.sql`SELECT solution
                                                  FROM tasks78
                                                  WHERE id = ${currentTaskId}`;
                break;
            default:
                throw createError({statusCode: 400, message: 'Ungültige Aktion'});
        }
        return correctAnswerQuery.rows?.[0].solution as string;
    }

    // get the current taskId of the user
    async function getCurrentTaskId(session: UserSession) {
        const userTaskIdQuery = await db.sql`SELECT currentTaskId
                                             FROM userGameProfile
                                             WHERE username = ${session.user!.username}`;
        return userTaskIdQuery.rows?.[0].currentTaskId as number;
    }

    // convert grade to table name
    function convertGradeToGrades(grade: number): string {
        switch (grade) {
            case 3:
            case 4:
                return `34`;
            case 5:
            case 6:
                return `56`;
            case 7:
            case 8:
                return `78`;
            default:
                throw createError({statusCode: 400, message: 'Illegal State. Grade not found'});
        }
    }
});
