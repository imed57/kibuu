import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Navbar from "components/navbar"; // Adjust path if needed

const Home: NextPage = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading phase (e.g., fetching data)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Simulate 2 seconds of loading time

        return () => clearTimeout(timer); // Clean up the timer when the component is unmounted
    }, []);

    // Custom cursor effect
    useEffect(() => {
        const updateCursor = (e: MouseEvent) => {
            const cursor = document.querySelector('.custom-cursor') as HTMLElement;
            if (cursor) {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            }
        };

        // Hide default cursor
        document.body.style.cursor = "none";

        // Create custom cursor element
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.position = 'fixed';
        cursor.style.width = '30px'; // Adjust size as necessary
        cursor.style.height = '30px'; // Adjust size as necessary
        cursor.style.backgroundImage = "url('../../public/nut.png)"; // Path to your custom cursor image
        cursor.style.backgroundSize = 'contain';
        cursor.style.pointerEvents = 'none'; // Prevent interference with other elements
        cursor.style.background = 'url(../../public/nut.png) no-repeat center center'
        document.body.appendChild(cursor);

        // Update cursor position on mouse move
        window.addEventListener('mousemove', updateCursor);

        // Clean up on unmount
        return () => {
            window.removeEventListener('mousemove', updateCursor);
            document.body.removeChild(cursor);
            document.body.style.cursor = "auto"; // Reset cursor when component unmounts
        };
    }, []);

    return (
        <div>
            {isLoading ? (
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
                        muted                     // Ensure video has no sound
                        style={{
                            width: "40%",      // Make video cover the screen
                            height: "50%",
                            objectFit: "cover", // Ensure video covers the entire area
                        }}
                    />
                </div>
            ) : (
                // Actual page content after the loader
                <>
                    <Navbar /> {/* Show Navbar after loading */}
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
                </>
            )}
        </div>
    );
};

export default Home;
