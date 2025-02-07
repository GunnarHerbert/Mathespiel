import {promises as fs} from 'fs';
import {UserSession} from "#auth-utils";

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    await checkIfUserIsLoggedIn(session);

    const db = useDatabase();
    if (event.node.req.method === 'POST') {
        //TODO: handle answer post
        console.log("post request received");
        let currentTaskId: number = await getCurrentTaskId(session);
        const gradeQuery = await db.sql`SELECT grade
                                        FROM users
                                        WHERE username = ${session.user!.username}`;

        let correctAnswerQuery;
        switch (gradeQuery.rows?.[0].grade) {
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
        let correctAnswerLetter = correctAnswerQuery.rows![0].solution as string;
        console.log("correctAnswerLetter: ", correctAnswerLetter);
        return {success: true, correctAnswer: correctAnswerLetter};
    } else if (event.node.req.method === 'GET') {
        const dataFromURL = getQuery(event);
        return await loadImage(dataFromURL.sol as string, session);
    }

    async function loadImage(shouldSolutionShowString: string, session: UserSession) {
        // get the current task id of the user
        console.log("Debug1");
        let userTaskId: number = await getCurrentTaskId(session);
        console.log("userTaskId: ", userTaskId);
        const gradeQuery = await db.sql`SELECT grade
                                        FROM users
                                        WHERE username = ${session.user!.username}`;
        let grade: string = convertGradeToTable(gradeQuery.rows?.[0].grade)!;
        // Bild aus dem geschützten Ordner laden
        let imagePath: string;
        // cast string to boolean
        let shouldSolutionShow: boolean = shouldSolutionShowString == "true";
        if (shouldSolutionShow) {
            //TODO: correct filepath to solution
            userTaskId = userTaskId as number + 1;
            imagePath = `private/tasks/${grade}/${userTaskId}.gif`;
        } else {
            imagePath = `private/tasks/${grade}/${userTaskId}.gif`;
        }
        try {
            const file = await fs.readFile(imagePath);
            setHeader(event, 'Content-Type', 'image/gif');
            return file;
        } catch {
            throw createError({statusCode: 404, message: 'Bild nicht gefunden'});
        }
    }

    async function getCurrentTaskId(session: UserSession) {
        const userTaskIdQuery = await db.sql`SELECT currentTaskId
                                             FROM userGameProfile
                                             WHERE username = ${session.user!.username}`;
        return userTaskIdQuery.rows?.[0].currentTaskId as number;
    }

    function convertGradeToTable(grade: unknown) {
        switch (grade) {
            case 3 || 4:
                return `34`;
            case 5 || 6:
                return `56`;
            case 7 || 8:
                return `78`;
        }
    }

    async function checkIfUserIsLoggedIn(session: any) {
        if (!session.user) {
            throw createError({statusCode: 401, message: 'Nicht eingeloggt'});
        }
    }
});
