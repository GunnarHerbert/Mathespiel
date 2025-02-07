import {promises as fs} from 'fs';

export default defineEventHandler(async (event) => {
    await checkIfUserIsLoggedIn(event);

    const db = useDatabase();
    if (event.node.req.method === 'POST') {
        //TODO: handle answer post
    } else if (event.node.req.method === 'GET') {
        const dataFromURL = getQuery(event);
        return await loadImage(dataFromURL.sol);
    }

    async function loadImage(shouldSolutionShow: boolean) {
        const userTaskIdQuery = await db.sql`SELECT currentTaskId
                                             FROM userGameProfile
                                             WHERE username = ${session.user.username}`;
        const userTaskId = userTaskIdQuery.rows?.[0].currentTaskId;

        const gradeQuery = await db.sql`SELECT grade
                                        FROM users
                                        WHERE username = ${session.user.username}`;
        let grade = convertGradeToTable(gradeQuery.rows?.[0].grade);
        // Bild aus dem geschützten Ordner laden
        let imagePath;
        // cast string to boolean
        shouldSolutionShow = shouldSolutionShow === 'true';
        if (shouldSolutionShow) {
            console.log("shouldSolutionShow is true");
            //TODO: correct filepath to solution
            imagePath = `private/tasks/${grade}/${userTaskId}.gif`;
        } else {
            console.log("shouldSolutionShow is false");
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

    function convertGradeToTable(grade: number) {
        switch (grade) {
            case 3 || 4:
                return `tasks34`;
            case 5 || 6:
                return `tasks56`;
            case 7 || 8:
                return `tasks78`;
        }
    }

    async function checkIfUserIsLoggedIn(event: any) {
        const session = await getUserSession(event);
        if (!session.user) {
            throw createError({statusCode: 401, message: 'Nicht eingeloggt'});
        }
    }
});
