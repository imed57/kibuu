/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Navbar from "components/navbar"; // Adjust path if needed
import { ethers } from "ethers";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
];

const VAULT_ADDRESS = "0xFc4d2F28d5F4186155Dfcc6F9a16ee3079f68d46"; // Replace with the vault contract address
const TOKEN_ADDRESS = "0xC79915f6A159D847d922C36d16bC33708E054E1b"; // Replace with the token contract address

const Home: NextPage = () => {
    const [isLoading, setIsLoading] = useState(true); // State to control the loader
    const [isContentVisible, setIsContentVisible] = useState(false); // State to fade in content
    const [usdAmount, setUsdAmount] = useState<string | null>(null);

    // Function to load balance
    const loadTokenBalance = async () => {
        try {
            // Check if we already have a cached result in localStorage
            const cachedData = localStorage.getItem("tokenData");
            const cachedTimestamp = localStorage.getItem("tokenDataTimestamp");

            if (cachedData && cachedTimestamp) {
                const cachedTime = new Date(parseInt(cachedTimestamp));
                const currentTime = new Date();

                // Check if 10 minutes have passed since the last API call
                const minutesPassed = (currentTime.getTime() - cachedTime.getTime()) / 1000 / 60;

                if (minutesPassed < 10) {
                    const data = JSON.parse(cachedData);
                    setUsdAmount(data.usdAmount);
                    return;
                }
            }

            // Proceed with API call if data is expired or non-existent
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, signer);
            const balance = await tokenContract.balanceOf(VAULT_ADDRESS);
            const decimals = await tokenContract.decimals();
            const roundedBalance = Math.round(parseFloat(ethers.utils.formatUnits(balance, decimals)));

            const response = await Moralis.EvmApi.token.getTokenPrice({
                address: TOKEN_ADDRESS,
                chain: EvmChain.BASE,
            });

            const priceData = response.toJSON();
            const price = parseFloat(priceData.usdPriceFormatted);
            const calculatedUsdAmount = (roundedBalance * price).toFixed(2);

            // Store result in state and cache it in localStorage
            setUsdAmount(calculatedUsdAmount);
            localStorage.setItem("tokenData", JSON.stringify({ usdAmount: calculatedUsdAmount }));
            localStorage.setItem("tokenDataTimestamp", Date.now().toString());
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    // Moralis initialization and balance load
    useEffect(() => {
        const initializeMoralis = async () => {
            try {
                if (!Moralis.Core.isStarted) {
                    await Moralis.start({
                        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImY0YjQ0ZTA1LWUyYmMtNDU2Ny1hMjJhLTJkM2IxMDMwYTc5OCIsIm9yZ0lkIjoiNDEwMzgwIiwidXNlcklkIjoiNDIxNzMwIiwidHlwZUlkIjoiNjBjMWI3N2MtMTBlMS00NWViLTlhODYtM2M1YzI4Mzc5N2U1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mjc5ODkxNTgsImV4cCI6NDg4Mzc0OTE1OH0.kkuOq5M57z5jxfa1qwMHRKdTugdLCF0tq6JsD49XqzI", // Replace with your Moralis API key
                    });
                }
                loadTokenBalance();
            } catch (error) {
                console.error("Error initializing Moralis:", error);
            }
        };

        if (typeof window !== "undefined") {
            // Run only on client-side
            initializeMoralis();
        }

        // Set a timeout to hide the loader after 3 seconds
        const timer = setTimeout(() => {
            setIsLoading(false); // Hide the loader
            setIsContentVisible(true); // Show the content
        }, 3000); // 3 seconds delay

        return () => clearTimeout(timer); // Clear the timeout when component unmounts
    }, []);

    return (
        <div>
            {isLoading ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        width: "100vw",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        zIndex: 9999,
                    }}
                >
                    <img
                        src="/cc.jpg"
                        alt="bg"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                    <img
                        src="/kibuuu.gif"
                        alt="Loading animation"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "55%",
                            height: "55%",
                            objectFit: "contain",
                            zIndex: 10000,
                        }}
                    />
                </div>
            ) : (
                <>
                    <Navbar />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh",
                            width: "100vw",
                            flexDirection: "column",
                            opacity: isContentVisible ? 1 : 0,
                            transition: "opacity 1s ease-in",
                        }}
                    >
                        <img
                            src="/bg-main.jpg"
                            alt="Background"
                            style={{
                                width: "100vw",
                                height: "100vh",
                                objectFit: "fill",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                fontFamily: "Press Start 2P", // Use the desired font
                                top: "32.5vh",
                                left: "48%",
                                fontSize: "4.6vh",
                                fontWeight: "bold",
                                color: "black",
                                transform: "translateX(-50%) rotate(-5deg)",
                            }}
                        >
                            {usdAmount !== null ? `${usdAmount}$` : "Loading..."}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
