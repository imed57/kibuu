/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Navbar from "components/navbar"; // Adjust path if needed
import { ethers } from "ethers";

const ERC20_ABI = [
  "function totalSupply() view returns (uint256)", // Fetch total supply
  "function decimals() view returns (uint8)",
];

const TOKEN_ADDRESS = "0x853Ac006B41026AD31963C29788525170fa30163"; // Replace with the token contract address
const DEXSCREENER_API_URL = `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`; // Dexscreener API

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true); // State to control the loader
  const [isContentVisible, setIsContentVisible] = useState(false); // State to fade in content
  const [marketCap, setMarketCap] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);

  // Initialize provider and contract
  const loadContract = async () => {
    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await web3Provider.send("eth_requestAccounts", []); // Request wallet connection
      const signer = web3Provider.getSigner();
      const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, signer);

      setProvider(web3Provider);
      setTokenContract(token);
    } catch (error) {
      console.error("Error loading contract:", error);
    }
  };

  // Function to load market cap
  const loadMarketCap = async () => {
    if (tokenContract) {
      try {
        const totalSupply = await tokenContract.totalSupply();
        const decimals = await tokenContract.decimals();
        const formattedTotalSupply = parseFloat(ethers.utils.formatUnits(totalSupply, decimals));        

        // Fetch the USD price from Dexscreener
        try {
          const response = await fetch(DEXSCREENER_API_URL);
          const data = await response.json();
          console.log(data);
          
          if (data?.pairs?.length > 0) {
            const price = parseFloat(data.pairs[0].priceUsd);
            
            const calculatedMarketCap = formattedTotalSupply * price;

            const truncatedMarketCap = Math.floor(calculatedMarketCap * 100) / 100;
            setMarketCap(truncatedMarketCap.toString()); // Store the market cap
            console.log("Market Cap:", truncatedMarketCap);
          }
        } catch (error) {
          console.error("Error fetching USD price from Dexscreener:", error);
        }
      } catch (error) {
        console.error("Error fetching total supply:", error);
      }
    }
  };

  useEffect(() => {
    // Load contract and wallet connection on component mount
    loadContract();
  }, []);

  useEffect(() => {
    // Once the contract is loaded, fetch the market cap
    if (tokenContract) {
      loadMarketCap();
    }
  }, [tokenContract]);

  useEffect(() => {
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
    fontFamily: "Press Start 2P", // Ensure the font is applied
    top: "28vh", // Adjust the position above the numbers
    left: "48%",
    fontSize: "3vh", // Smaller font size for the label
    fontWeight: "bold",
    color: "white",
    transform: "translateX(-50%) rotate(-5deg)", // Apply the same transform to match the style
    textAlign: "center", // Center the text
  }}
>
  Market Cap :
</div>

<div
  style={{
    position: "absolute",
    fontFamily: "Press Start 2P", // Font for the numbers
    top: "32.5vh", // Adjust this as necessary
    left: "48%",
    fontSize: "4.6vh", // Larger font size for the numbers
    fontWeight: "bold",
    color: "black",
    transform: "translateX(-50%) rotate(-5deg)",
    textAlign: "center", // Ensure numbers are centered
  }}
>
  {marketCap !== null ? `${marketCap}$` : "Loading..."}
</div>
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
                                href="https://x.com/KibuOnBase" // Replace with your Twitter profile
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
                                href="https://t.me/kibucoin" // Replace with your Telegram profile
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
