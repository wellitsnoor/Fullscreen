import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

interface CustomError {
  status?: number; // Optional status property
  message: string; // Ensure you have a message property
}

export async function GET() {

  const accessToken = cookies().get('token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const is_liked = await axios.get("https://api.spotify.com/v1/me/tracks/contains?ids=" + response.data.item.id, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return NextResponse.json({
      playing: response.data.is_playing,
      artist: response.data.item.artists.map((artist: { name: string; }) => artist.name) || [],
      name: response.data.item.name || "",
      image_url: response.data.item.album.images[0].url || "",
      liked: is_liked.data[0],
      status: 200
    });
    // return NextResponse.json(response.data)
  }
  catch (err: unknown) {
    return NextResponse.json({
      playing: false,
      artist: ["Untitled", "Untitled"],
      name:  "Untitled",
      image_url: "/music.jpg",
      liked: false,
      status: (err as CustomError).status
    });

  }
}
