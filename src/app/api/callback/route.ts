import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";
import { cookies } from "next/headers";

export async function GET(req : NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Code not provided" }, { status: 400 });
  }

  const clientId=process.env.SPOTIFY_CLIENT_ID
  const clientSecret=process.env.SPOTIFY_CLIENT_SECRET
  const redirectUri=process.env.SPOTIFY_REDIRECT_URI

  const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectUri
  });

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);

    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];
    const expiresIn = data.body['expires_in'];

    // Set access token and refresh token in Spotify API instance
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    // set cookies
    cookies().set({
        name: 'token',
        value: accessToken,
        httpOnly: true,
        path: '/',
        maxAge: expiresIn
    })

    cookies().set({
        name: 'refreshToken',
        value: refreshToken,
        httpOnly: true,
        path: '/',
    })

    return NextResponse.redirect(process.env.DOMAIN + "/", { status: 307 });
  } 
  catch (err) {
    console.log('Something went wrong!', err);
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
  }
}
