"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import NextImage from "next/image"
import ColorThief from "colorthief"

export default function Home() {

  const [name, setName] = useState(null)
  const [artist, setArtist] = useState([])
  const [image, setImage] = useState(null)
  const [playing, setPlaying] = useState(null)
  const [liked, setLiked] = useState(null)
  const router = useRouter()

  const fetchInfo = useCallback(async () => {
    const res = await fetch("/api/info");
    if (res.status === 401) {
        router.push("/login");
    } else {
        const data = await res.json();

        setName(data.name);
        setArtist(data.artist);
        setImage(data.image_url);
        setPlaying(data.playing);
        setLiked(data.liked);

        if (data.status === 400) {
            refresh();
        }
    }
  }, [router]);

  useEffect(() => {
      fetchInfo();

      const intervalId = setInterval(() => {
          fetchInfo();
      }, 2000);

      return () => clearInterval(intervalId);
  }, [fetchInfo]); // Add fetchInfo as a dependency


  // refresh token after some time
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refresh();  
    }, (3600 - 300) * 1000); // Call refresh 5 minutes before token expiration
  
    return () => clearInterval(refreshInterval); // Cleanup on component unmount
  }, []);

  function refresh() {
    fetch("/api/refresh", {
      method: "GET",
      credentials: "include", // Make sure cookies are sent
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          console.log("Token refreshed:", data.access_token);
        } else {
          console.log("Token refresh failed:", data.error);
        }
      })
      .catch((err) => {
        console.log("Error refreshing token:", err);
      });
  }

  useEffect(() => {
    const colorThief = new ColorThief();
    const img = new Image();

   
  
    img.addEventListener('load', () => {
      const colors = colorThief.getPalette(img, 5);
      const dominant = colorThief.getColor(img);

      function getLuminance(color : [number, number, number]) {
        const [r, g, b] = color;
        // Normalize the RGB values by dividing them by 255
        const normalizedR = r / 255;
        const normalizedG = g / 255;
        const normalizedB = b / 255;
      
        // Calculate luminance
        return 0.2126 * normalizedR + 0.7152 * normalizedG + 0.0722 * normalizedB;
      }

      const dark = colors.sort((a, b) => getLuminance(a) - getLuminance(b));
      
      if(colors.length == 1){
        // document.getElementById("body")!.style.backgroundColor = `rgb(${dominant})`;
        document.getElementById("1st")!.style.backgroundColor = `rgb(${dominant})`;
        document.getElementById("2nd")!.style.backgroundColor = `rgb(${dominant})`;
        document.getElementById("3rd")!.style.backgroundColor = `rgb(${dominant})`;
        document.getElementById("4th")!.style.backgroundColor = `rgb(${dominant})`;
        document.getElementById("5th")!.style.backgroundColor = `rgb(${dominant})`;
      }
      else{
        // document.getElementById("body")!.style.backgroundColor = `rgb(${dominant})`;
        document.getElementById("1st")!.style.backgroundColor = `rgb(${dark[1]})`; 
        document.getElementById("2nd")!.style.backgroundColor = `rgb(${dark[4]})`; // need to be same
        document.getElementById("3rd")!.style.backgroundColor = `rgb(${dark[2]})`; 
        document.getElementById("4th")!.style.backgroundColor = `rgb(${dark[0]})`; // text area
        document.getElementById("5th")!.style.backgroundColor = `rgb(${dark[4]})`; // need to be same
      }
    });
  
    img.crossOrigin = "Anonymon"
    img.src = image || "/music.jpg";

  }, [image])

  async function dislike(){
    const res = await fetch("/api/dislike")
    if(res.status != 200){
      console.log("erorr disliking")
    }
  }

  async function like() {
    const res = await fetch("/api/like")
    if(res.status != 200){
      console.log("error liking")
    }
  }

  return (
    <>
      <div id="body" className="backcontainer">
        <div id="1st"></div>
        <div id="2nd"></div>
        <div id="3rd"></div>
        <div id="4th"></div>
        <div id="5th"></div>
      </div>
      <div className="center">
          <div id="playing" className={`${playing ? "show" : "hide"} relative inline-block `}>
            <NextImage 
              src={image || "/music.jpg"}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
              alt="album art" id="track-image" priority></NextImage>
              <div className="flex mt-2">
                  <div className="leading-tight  w-full ">
                  <p id="track-name" className="noselect">{name}</p>
                  <p id="track-artist" className="noselect">{artist.join(", ")}</p>
                  </div>
                  <div className="h-full max-h-14 flex m-auto justify-right items-right text-right">
                    {liked ? (
                      <>  
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-7 cursor-pointer" onClick={dislike}>
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                      </>
                    ) : (
  
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="size-7 cursor-pointer" onClick={like}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>


                    )}
                  </div>
              </div>          
        </div>
       
        <div id="not-playing" className={`${playing ? "hide" : "show"}`}>
            <p className="noselect" id="nothing">nothing is playing!</p>
        </div>
    </div>
    </>
  )
}
