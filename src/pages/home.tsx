import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Navbar from "components/navbar"; // Adjust path if needed

const Home: NextPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isContentVisible, setIsContentVisible] = useState(false); // Used for smooth transition

    // Simulate loading phase (e.g., fetching data)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setIsContentVisible(true), 100); // Start transition after loader hides
        }, 2000); // Simulate 2 seconds of loading time

        return () => clearTimeout(timer); // Clean up the timer when the component is unmounted
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
                            height: "100vh",             // Adjust height of the container
                            width: "100vw",              // Adjust width of the container
                            flexDirection: "column",     // Align the div and content in a column layout
                            opacity: isContentVisible ? 1 : 0,  // Fade in/out
                            transition: "opacity 1s ease-in",   // Smooth fade-in effect
                        }}
                    >
                        <img
                            src="/bg-ext.jpg"  // Replace with your image path
                            alt="Background"
                            style={{
                                width: "100vw",              // Full width of the container
                                height: "100vh",             // Full height of the container
                                objectFit: "fill",           // Ensure full image is displayed
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
