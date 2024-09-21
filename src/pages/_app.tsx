import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import Navbar from "components/navbar";
import { chains, wagmiClient } from "config/wagmi";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "styles/globals.css";
import "styles/rainbowkit.css";
import { WagmiConfig } from "wagmi";

function MyApp({ Component, pageProps }: AppProps) {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const isLandingPage = router.pathname === '/';
    const isHome = router.pathname === '/home';



    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
            {!isLandingPage && !isHome && <Navbar />}
                <Component {...pageProps} />
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default MyApp;
