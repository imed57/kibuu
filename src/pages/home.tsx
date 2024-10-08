/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Navbar from "components/navbar"; // Adjust path if needed
import { ethers } from "ethers";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const VAULT_ADDRESS = "0xFc4d2F28d5F4186155Dfcc6F9a16ee3079f68d46"; // Replace with the vault contract address
const TOKEN_ADDRESS = "0xC79915f6A159D847d922C36d16bC33708E054E1b"; // Replace with the token contract address
const DEXSCREENER_API_URL = `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`; // Dexscreener API

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true); // State to control the loader
  const [isContentVisible, setIsContentVisible] = useState(false); // State to fade in content
  const [usdAmount, setUsdAmount] = useState<string | null>(null);
  const [vaultTokenBalance, setVaultTokenBalance] = useState<string | null>(null);
  const [contractLoaded, setContractLoaded] = useState(false); // Track if contract is loaded
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
      setContractLoaded(true); // Set contract loaded to true
    } catch (error) {
      console.error("Error loading contract:", error);
    }
  };

  // Function to load token balance in the vault contract
  const loadTokenBalance = async () => {
    if (tokenContract) {
      try {
        const balance = await tokenContract.balanceOf(VAULT_ADDRESS);
        const decimals = await tokenContract.decimals();
        const roundedBalance = Math.round(parseFloat(ethers.utils.formatUnits(balance, decimals)));
        setVaultTokenBalance(roundedBalance.toString());
        console.log("Vault token balance:", roundedBalance);
        try {
            const response = await fetch(DEXSCREENER_API_URL);
            const data = await response.json();
            if (data?.pairs?.length > 0 && vaultTokenBalance) {
              const price = parseFloat(data.pairs[0].priceUsd);
              const calculatedUsdAmount = parseInt(vaultTokenBalance) * price;
      
              const truncatedUsdAmount = Math.floor(calculatedUsdAmount * 100) / 100;
              setUsdAmount(truncatedUsdAmount.toString()); // Store the result as a string without rounding
              console.log("USD amount:", truncatedUsdAmount);
            }
          } catch (error) {
            console.error("Error fetching USD price from Dexscreener:", error);
          }
      } catch (error) {
        console.error("Error fetching vault token balance:", error);
      }
    }
  };

  // Function to load USD price from Dexscreener API
  const loadUsdPrice = async () => {
    try {
      const response = await fetch(DEXSCREENER_API_URL);
      const data = await response.json();
      if (data?.pairs?.length > 0 && vaultTokenBalance) {
        const price = parseFloat(data.pairs[0].priceUsd);
        const calculatedUsdAmount = parseInt(vaultTokenBalance) * price;

        const truncatedUsdAmount = Math.floor(calculatedUsdAmount * 100) / 100;
        setUsdAmount(truncatedUsdAmount.toString()); // Store the result as a string without rounding
      }
    } catch (error) {
      console.error("Error fetching USD price from Dexscreener:", error);
    }
  };

  useEffect(() => {
    // Load contract and wallet connection on component mount
    loadContract();
  }, []);

  useEffect(() => {
    // Once the contract is loaded, fetch vault balance
    if (contractLoaded) {
      loadTokenBalance(); // Load vault token balance initially
    }
  }, [contractLoaded]);

  useEffect(() => {
    // Fetch USD price once the vault balance is loaded
    if (vaultTokenBalance) {
      loadUsdPrice(); // Fetch USD price after balance is available
      const usdPriceInterval = setInterval(() => {
        loadUsdPrice(); // Fetch USD price every 5 seconds
      }, 5000);

      return () => {
        clearInterval(usdPriceInterval); // Clear the interval on component unmount
      };
    }
  }, [vaultTokenBalance]); // Ensure it reloads price when vault token balance is set

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
