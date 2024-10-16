import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET() {
    const accessToken = cookies().get('token')?.value;

    if (!accessToken) {
        return NextResponse.json({
            error: "Access token is missing or invalid",
        });
    }

    try {
        const response = await axios.get("https://api.spotify.com/v1/me/player", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const trackId = response.data.item.id;

        if (!trackId) {
            return NextResponse.json({
                error: "No track ID found in response",
            });
        }

        // Make a PUT request to save the album to the user's library
        await axios.delete(
            `https://api.spotify.com/v1/me/tracks?ids=${trackId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return NextResponse.json({
            message: "Removed from library!"
        }, {status: 200});
      
    } catch (err) {
        return NextResponse.json({
            error: (err as Error).message || "An error occurred",
        }, {status: 400});
    }
}
