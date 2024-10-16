import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Get the refresh token from cookies
    const refreshToken = cookies().get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token found" }, { status: 400 });
    }

    // Create a new SpotifyWebApi instance with client credentials
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    // Set the refresh token on the instance
    spotifyApi.setRefreshToken(refreshToken);

    // Refresh the access token
    const data = await spotifyApi.refreshAccessToken();

    const newAccessToken = data.body['access_token'];
    const expiresIn = data.body['expires_in']; // Expires in seconds

    // Set the new access token in cookies
    cookies().set({
      name: "token",
      value: newAccessToken,
      httpOnly: true,
      path: "/",
      maxAge: expiresIn, // Expires after 'expires_in' seconds
    });

    // Return success response
    return NextResponse.json({
      message: "Access token refreshed",
      access_token: newAccessToken,
    });
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return NextResponse.json({ error: "Failed to refresh access token" }, { status: 500 });
  }
}
