export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    if(session?.user){
        return {isLoggedIn: true, user: session.user};
    }
    return {isLoggedIn: false};
});