"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import ColorThief from "colorthief"

export default function Home() {

  const [image, setImage] = useState(null)
  const router = useRouter()

  const fetchInfo = useCallback(async () => {
    const res = await fetch("/api/info");
    if (res.status === 401) {
        router.push("/login");
    } else {
        const data = await res.json();

        setImage(data.image_url);

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

  return (
    <>
      <div className="backbacktainer">
        <div id="body" className="backcontainer">

          <div id="1st"></div>
          <div id="2nd"></div>
          <div id="3rd"></div>
          <div id="4th"></div>
          <div id="5th"></div>
        </div>
      </div>
    </>
  )
}
