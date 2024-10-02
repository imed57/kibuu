import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Navbar from "components/navbar"; // Adjust path if needed
import { ethers } from "ethers";
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

// ABI of the ERC20 token (standard ERC20 ABI for balanceOf and decimals)
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
];

const VAULT_ADDRESS = "0xFc4d2F28d5F4186155Dfcc6F9a16ee3079f68d46"; // Replace with the vault contract address
const TOKEN_ADDRESS = "0xC79915f6A159D847d922C36d16bC33708E054E1b"; // Replace with the token contract address

const Home: NextPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [balance, setBalance] = useState<string | null>(null);
    const [usdPrice, setUsdPrice] = useState<number | null>(null); // State for USD price
    const [usdAmount, setUsdAmount] = useState<string | null>(null); // State for USD amount

    // Function to load balance
    const loadTokenBalance = async () => {
        try {
            // Connect to Ethereum provider (use MetaMask or a public provider like Infura)
            const provider = new ethers.providers.Web3Provider(window.ethereum); // For MetaMask
            await provider.send("eth_requestAccounts", []); // Request user permission to connect
            const signer = provider.getSigner();
    
            // Connect to the token contract
            const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, signer);
    
            // Get balance and decimals
            const balance = await tokenContract.balanceOf(VAULT_ADDRESS);
            const decimals = await tokenContract.decimals();
    
            // Round the balance and convert to string
            const roundedBalance = Math.round(parseFloat(ethers.utils.formatUnits(balance, decimals)));
    
            // Set the rounded balance
            setBalance(roundedBalance.toString());

            await Moralis.start({
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImE3YjdlMTVhLTYwY2UtNDNiOC1iOTlmLTUzNjBlYzFjNDM5ZiIsIm9yZ0lkIjoiNDEwMjY0IiwidXNlcklkIjoiNDIxNjAwIiwidHlwZUlkIjoiZjM5ZmZjZDQtOTYzMy00ZjM2LTg2NmEtZTJhMmE2Y2ZmOTIyIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mjc5MTA0OTksImV4cCI6NDg4MzY3MDQ5OX0.NLEofD1rIo2vqE8G-kie4K7i_tkl6kwNTJKbYoFbGRQ", // Replace with your Moralis API key
                // ...and any other configuration
            });
            
            const address = TOKEN_ADDRESS; // Use the token contract address
            const chain = EvmChain.BASE;
            
            const response = await Moralis.EvmApi.token.getTokenPrice({
                address,
                chain,
            });

            // Get the USD price from the response
            const priceData = response.toJSON();
            const price = parseFloat(priceData.usdPriceFormatted); // Extract the formatted USD price
            setUsdPrice(price); // Set the USD price

            // Calculate and set the USD amount
            const calculatedUsdAmount = (roundedBalance * price).toFixed(2); // Calculate the USD amount and format it to 2 decimal places
            setUsdAmount(calculatedUsdAmount);

        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    // Fetch balance on page load
    useEffect(() => {
        loadTokenBalance();
    }, []);

    // Simulate loading phase (e.g., fetching data)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setIsContentVisible(true), 100);
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
                                top: "32.5vh",            // Position it near the top
                                left: "48%",            // Center horizontally
                                fontSize: "4.6vh",       // Adjust size of the number
                                fontWeight: "bold",     // Make the number bold
                                color: "black",          // Color of the number
                                transform: "translateX(-50%) rotate(-5deg)", // Slight rotation
                            }}
                        >
                            {usdAmount !== null ? `${usdAmount}$` : "Loading..."} {/* Display USD amount */}
                        </div>
                        {/* Social Media Icons */}
                        <div
                            style={{
                                position: "fixed",
                                bottom: "20px",          // Position it slightly above the bottom
                                left: "20px",            // Position it slightly to the right of the left edge
                                display: "flex",
                                gap: "15px",             // Space between the icons
                            }}
                        >
                            <a
                                href="https://x.com/KibuOnEth_" // Replace with your Twitter profile
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none" }}
                            >
                                <img
                                    src="/twitter.png" // Replace with the path to your Twitter icon
                                    alt="Twitter"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        transition: "transform 0.2s ease-in-out", // Smooth hover effect
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.3)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                />
                            </a>
                            <a
                                href="https://t.me/yourprofile" // Replace with your Telegram profile
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none" }}
                            >
                                <img
                                    src="/telegram.png" // Replace with the path to your Telegram icon
                                    alt="Telegram"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        transition: "transform 0.2s ease-in-out", // Smooth hover effect
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.3)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                />
                            </a>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
