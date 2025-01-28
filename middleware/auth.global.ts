export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.path == '/login') {
        return;
    }
    const {loggedIn, user} = useUserSession();
    if (!loggedIn.value) {
        return navigateTo('/login');
    }
})