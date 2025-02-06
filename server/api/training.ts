import { promises as fs } from 'fs';

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);

    // Prüfen, ob der User eingeloggt ist
    if (!session?.user?.username) {
        throw createError({ statusCode: 401, message: 'Nicht autorisiert' });
    }

    const db = useDatabase();
    const userTaskIdQuery = await db.sql`SELECT currentTaskId FROM userGameProfile WHERE username = ${session.user.username}`;
    const userTaskId = userTaskIdQuery.rows?.[0].currentTaskId;

    const gradeQuery = await db.sql`SELECT grade FROM users WHERE username = ${session.user.username}`;
    let grade;
    switch(gradeQuery.rows?.[0].grade) {
        case 3 || 4:
            grade = `34`;
            break;
        case 5 || 6:
            grade = `56`;
            break;
        case 7 || 8:
            grade = `78`;
            break;
    }
    // Bild aus dem geschützten Ordner laden
    const shouldSolutionShow = getQuery(event).sol; // aus der URL
    let imagePath;
    if(shouldSolutionShow) {
        //TODO: correct filepath to solution
        imagePath = `private/tasks/${grade}/${userTaskId}.gif`;
    }
    else{
        imagePath = `private/tasks/${grade}/${userTaskId}.gif`;
    }
    try {
        const file = await fs.readFile(imagePath);
        setHeader(event, 'Content-Type', 'image/gif');
        return file;
    } catch {
        throw createError({ statusCode: 404, message: 'Bild nicht gefunden' });
    }
});
