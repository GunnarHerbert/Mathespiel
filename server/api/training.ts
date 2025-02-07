import {promises as fs} from 'fs';
import {UserSession} from "#auth-utils";

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    await checkIfUserIsLoggedIn(session);

    const db = useDatabase();
    if (event.node.req.method === 'POST') {
        //TODO: handle answer post
    } else if (event.node.req.method === 'GET') {
        const dataFromURL = getQuery(event);
        return await loadImage(dataFromURL.sol as string, session);
    }

    async function loadImage(shouldSolutionShowString: string, session: UserSession) {
        // get the current task id of the user
        const userTaskIdQuery = await db.sql`SELECT currentTaskId
                                             FROM userGameProfile
                                             WHERE username = ${session.user!.username}`;
        let userTaskId = userTaskIdQuery.rows?.[0].currentTaskId;

        const gradeQuery = await db.sql`SELECT grade
                                        FROM users
                                        WHERE username = ${session.user!.username}`;
        let grade = convertGradeToTable(gradeQuery.rows?.[0].grade);
        // Bild aus dem geschützten Ordner laden
        let imagePath:string;
        // cast string to boolean
        let shouldSolutionShow:boolean = shouldSolutionShowString == "true";
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
