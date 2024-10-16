import { NextResponse } from "next/server";

// Server-side API route to handle Spotify authentication
export async function GET() {
    const scope = ['user-read-playback-state', 'user-library-read', 'user-library-modify'];
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    const state = "gaygaygaygaygay";

    // Join the scope array into a single string with space-separated values
    const scopes = encodeURIComponent(scope.join(' '));

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri!)}&scope=${scopes}&state=${state}`;

    // Redirect the user to the Spotify authorization URL
    return NextResponse.redirect(spotifyAuthUrl);
}
