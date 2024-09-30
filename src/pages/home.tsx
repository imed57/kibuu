/* eslint-disable @next/next/no-img-element */
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
                    <img
                        src="/cc.jpg"       // Replace with your video file path
                        alt="bg"
                        style={{
                            width: "100%",      // Make video cover the screen
                            height: "100%",
                            objectFit: "cover", // Ensure video covers the entire area
                        }}
                    />
                                        <img
                        src="/kibuuu.gif"  // Replace with your GIF file path
                        alt="Loading animation"
                        style={{
                            position: "absolute",   // Position it absolutely on top of the loader
                            top: "50%",             // Center vertically
                            left: "50%",            // Center horizontally
                            transform: "translate(-50%, -50%)", // Ensure perfect centering
                            width: "55%",         // Adjust width of the GIF
                            height: "55%",        // Adjust height of the GIF
                            objectFit: "contain",   // Ensure the GIF fits correctly
                            zIndex: 10000,          // Higher than the background image
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
                            src="/bg-main.jpg"  // Replace with your image path
                            alt="Background"
                            style={{
                                width: "100vw",              // Full width of the container
                                height: "100vh",             // Full height of the container
                                objectFit: "fill",           // Ensure full image is displayed
                                
                            }}
                        />
                            <div
                                style={{
                                    position: "absolute",   // Position it absolutely on top of the image
                                    fontFamily: 'Press Start 2P',
                                    top: "30.5vh",            // Position it near the top
                                    left: "47.5%",            // Center horizontally
                                    fontSize: "7.6vh",       // Adjust size of the number
                                    fontWeight: "bold",     // Make the number bold
                                    color: "black",          // Color of the number (white for contrast)
                                    transform: "translateX(-50%) rotate(-5deg)", // Rotate slightly to the left (-10 degrees)

                                }}
                            >
                                70000$
                            </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
