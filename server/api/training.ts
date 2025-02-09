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
                let {correctAnswer: correctAnswerLetter, difficulty} = await getCorrectAnswer(currentTaskId, session);
                await setIsCurrentTaskSolved(session, 1);
                let {
                    newRank,
                    newPoints,
                    pointsDelta,
                    newCrystals
                } = await setNewUserStats(session, body.userAnswer === correctAnswerLetter, difficulty);
                return {
                    success: true,
                    correctAnswer: correctAnswerLetter,
                    newRank,
                    newPoints,
                    pointsDelta,
                    newCrystals
                };
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
        if (shouldSolutionShow && session.user!.isCurrentTaskSolved === 1) {
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

    // calculate new rank, points and crystals for the user after solving a task
    async function setNewUserStats(session: UserSession, isUserAnswerCorrect: boolean, difficulty: number) {
        let newRank, newPoints, newCrystals: number;
        let oldRank: number = session.user?.rank as number;
        let oldPoints: number = session.user?.points as number;
        let oldCrystals: number = session.user?.crystals as number;
        newRank = oldRank;
        const pointsMultiplier = 100;
        const rankMultiplier = 100;
        if (isUserAnswerCorrect) {
            newPoints = oldPoints + difficulty * pointsMultiplier;
            if (newPoints >= pointsMultiplier * rankMultiplier) {
                newPoints = newPoints - pointsMultiplier * rankMultiplier;
                newRank = oldRank + 1;
            }
            newCrystals = oldCrystals + 10;
        } else {
            newPoints = oldPoints - difficulty * pointsMultiplier * 0.75;
            if (oldRank > 0 && newPoints < 0) {
                newPoints = newPoints + pointsMultiplier * rankMultiplier;
                newRank = oldRank - 1 >= 0 ? oldRank - 1 : 0;
            } else if (oldRank === 0 && newPoints < 0) {
                newPoints = 0;
            }
            newCrystals = oldCrystals;
        }
        //set new rank, points and crystals in the user session and db table userStats
        await db.sql`UPDATE userStats
                     SET rank     = ${newRank},
                         points   = ${newPoints},
                         crystals = ${newCrystals}
                     WHERE username = ${session.user!.username}`;
        await setUserSession(event, {
            user: {rank: newRank, points: newPoints, crystals: newCrystals}, // User-Daten, die in der Session gespeichert werden
        });
        return {newRank, newPoints, pointsDelta: newPoints - oldPoints, newCrystals};
    }

    // get correct answer for current task
    async function getCorrectAnswer(currentTaskId: number, session: UserSession) {
        let correctAnswerQuery;
        switch (session.user?.grade) {
            case 3:
            case 4:
                correctAnswerQuery = await db.sql`SELECT solution, difficulty
                                                  FROM tasks34
                                                  WHERE id = ${currentTaskId}`;
                break;
            case 5 :
            case 6:
                correctAnswerQuery = await db.sql`SELECT solution, difficulty
                                                  FROM tasks56
                                                  WHERE id = ${currentTaskId}`;
                break;
            case 7:
            case 8:
                correctAnswerQuery = await db.sql`SELECT solution, difficulty
                                                  FROM tasks78
                                                  WHERE id = ${currentTaskId}`;
                break;
            default:
                throw createError({statusCode: 400, message: 'Ungültige Aktion'});
        }
        return {
            correctAnswer: correctAnswerQuery.rows?.[0].solution as string,
            difficulty: correctAnswerQuery.rows?.[0].difficulty as number
        };
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
