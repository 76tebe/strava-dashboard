const clientId = import.meta.env.STRAVA_CLIENT_ID;
const redirectUri = import.meta.env.STRAVA_REDIRECT_URI;

const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read_all,profile:read_all`;

export async function GET() {
    return Response.redirect(authUrl, 302);
}
