import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Image from "next/image";

const Home: NextPage = () => {
    const [loading, setLoading] = useState(true);  // State to control loader visibility

    useEffect(() => {
        // Set a timer to hide the loader after 5 seconds
        const timer = setTimeout(() => {
            setLoading(false);
        }, 5000);

        // Cleanup timer if the component unmounts before 5 seconds
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            {loading ? (
                // Loader: full-screen video playing in a loop
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",        // Fullscreen height for loader
                        width: "100vw",         // Fullscreen width for loader
                        position: "fixed",      // Fix it to cover the entire screen
                        top: 0,
                        left: 0,
                        zIndex: 9999,           // Make sure it's on top of everything
                    }}
                >
                    <video
                        src="/loading.mp4"       // Replace with your video file path
                        autoPlay
                        loop
                        muted                 // Ensure video has no sound
                        style={{
                            width: "40%",      // Make video cover the screen
                            height: "50%",
                            objectFit: "cover", // Ensure video covers the entire area
                        }}
                    />
                </div>
            ) : (
                // Actual page content after the loader
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",   // Horizontally center the content
                        alignItems: "center",        // Vertically center the content
                        height: "100vh",             // Full viewport height to center the content vertically
                        flexDirection: "column",     // Align the div and image in a column layout
                    }}
                >
                    <div>
                        <div style={{ textAlign: "center", marginBottom: "20px" }}>
                            alallala
                        </div>
                        <Image
                            src="/abdou_deg.jpg"
                            width={300}
                            height={300}
                            alt="Picture of the author"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
