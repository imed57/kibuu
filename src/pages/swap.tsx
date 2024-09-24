/* eslint-disable react-hooks/rules-of-hooks */
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider"; // Make sure to import the provider detection
import { providers } from "ethers";

const swap: NextPage = () => {
    const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
    const [account, setAccount] = useState<string | null>(null);

    useEffect(() => {
        const initializeProvider = async () => {
            const ethereumProvider = await detectEthereumProvider();

            if (ethereumProvider) {
                const web3Provider = new providers.Web3Provider(ethereumProvider);
                setProvider(web3Provider);

                const accounts = await web3Provider.listAccounts();
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            }
        };

        initializeProvider();
    }, []);

    const handleWalletConnect = async () => {
        if (!provider) return;
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center", // Horizontally center the content
                    alignItems: "center", // Vertically center the content
                    height: "90vh", // Full viewport height
                    flexDirection: "column", // Align items in a column
                }}
            >
                <iframe
                    src="https://app.uniswap.org/#/swap?exactField=input&inputCurrency=0x0F5D2fB29fb7d3CFeE444a200298f468908cC942"
                    height="900"
                    width="100%"
                    style={{
                        border: 0,
                        margin: "0 auto",
                        display: "block",
                        borderRadius: "10px",
                        maxWidth: "50vw",
                        marginTop: "15vh",
                        height: "90wh"
                    }}
                />
            </div>
        </div>
    );
};

export default swap;
