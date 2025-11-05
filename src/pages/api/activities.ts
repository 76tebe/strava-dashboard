const clientId = import.meta.env.STRAVA_CLIENT_ID;
const clientSecret = import.meta.env.STRAVA_CLIENT_SECRET;
const refreshToken = import.meta.env.STRAVA_REFRESH_TOKEN;
const activitiesUrl = "https://www.strava.com/api/v3/athlete/activities?per_page=200&after=1735664401";

async function getValidAccessToken() {
  const accessToken = import.meta.env.STRAVA_ACCESS_TOKEN;
  const expiresToken = parseInt(import.meta.env.STRAVA_EXPIRES_AT);
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime < expiresToken) {
    return accessToken;
  }

  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    // TODO: In prod, save these new tokens to KV
    console.log("NEW TOKENS - Update your .env:");
    console.log("STRAVA_ACCESS_TOKEN=", data.access_token);
    console.log("STRAVA_REFRESH_TOKEN=", data.refresh_token);
    console.log("STRAVA_EXPIRES_AT=", data.expires_at);

    return data.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

export async function GET() {
  try {
    const validToken = await getValidAccessToken();

    const response = await fetch(activitiesUrl, {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch activities");
    }

    const activities = await response.json();

    return new Response(
      JSON.stringify({
        activities: activities,
        count: activities.length,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch activities" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}