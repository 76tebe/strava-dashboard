const clientId = import.meta.env.STRAVA_CLIENT_ID;
const clientSecret = import.meta.env.STRAVA_CLIENT_SECRET;

export async function GET({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response(JSON.stringify({ error: "No auth code provided" }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
      })
    });

    if (!response.ok) {
        throw new Error("Failed to exchange token");
    }

    const data = await response.json();

    return new Response(
        JSON.stringify({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_at
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )

  } catch (error) {
    console.error('Error:', error);
    return new Response(
        JSON.stringify({ error: 'Failed to authenticate' }),
        {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
  }
}
