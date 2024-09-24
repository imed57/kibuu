import { useState } from 'react';
import { FlippingPages } from 'flipping-pages';
import 'flipping-pages/dist/style.css';

const MemecoinStory = () => {
    const [selected, setSelected] = useState(0);

    const back = () => {
        setSelected(selected => Math.max(selected - 1, 0));
    };

    const next = () => {
        setSelected(selected => Math.min(selected + 1, 2));
    };

    return (
        <div>
            <div className="pages">
                <FlippingPages
                    direction="right-to-left"
                    onSwipeEnd={setSelected}
                    selected={selected}
                    animationDuration={800}
                >
                    {/* Page 1: Video on left, Text on right */}
                    <div className="page">
                        <div className="content-container">
                            <div className="video-container">
                                <video src="/loader.mp4" autoPlay loop muted />
                            </div>
                            <div className="text-container">
                                <h2>The Beginning of Memecoin</h2>
                                <p>Memecoin was created with a vision to make cryptocurrencies more fun and accessible for everyone.</p>
                            </div>
                        </div>
                    </div>

                    {/* Page 2: Text on left, Video on right */}
                    <div className="page">
                        <div className="content-container reverse">
                            <div className="text-container">
                                <h2>How Memecoin Gained Popularity</h2>
                                <p>With its humorous and light-hearted approach, Memecoin quickly gained a dedicated community.</p>
                            </div>
                            <div className="video-container">
                                <video src="/loader.mp4" autoPlay loop muted />
                            </div>
                        </div>
                    </div>

                    {/* Page 3: Video on left, Text on right */}
                    <div className="page">
                        <div className="content-container">
                            <div className="video-container">
                                <video src="/memecoin-future.mp4" autoPlay loop muted />
                            </div>
                            <div className="text-container">
                                <h2>The Future of Memecoin</h2>
                                <p>As the community grows, Memecoin continues to evolve with new features and innovations.</p>
                            </div>
                        </div>
                    </div>
                </FlippingPages>
            </div>
            <div className="navigation-buttons">
                <button onClick={back} disabled={selected === 0}>
                    Previous
                </button>
                <button onClick={next} disabled={selected === 2}>
                    Next
                </button>
            </div>
            <style jsx>{`
                html, body {
                    overflow: hidden; /* Prevent page scroll during transitions */
                }

                .pages {
                    width: 70vw;
                    height: 75vh;
                    margin-top: 13vh;
                    overflow: hidden; /* Prevent scrollbars */
                    box-shadow: 0 2px 12px rgba(34, 198, 248, 1);
                    border-radius: 20px;
                }

                .page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                    font-size: 1.5rem;
                    border: 1.5px solid black;
                    border-radius: 20px;
                    box-sizing: border-box;
                    background-color: rgb(34, 198, 248);
                }

                .content-container {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    height: 100%;
                }

                .content-container.reverse {
                    flex-direction: row-reverse;
                }

                .video-container {
                    width: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .video-container video {
                    width: 100%;
                    height: 95%;
                    border-radius: 10px;
                }

                .text-container {
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 20px;
                    text-align: left;
                }

                .text-container h2 {
                    margin-bottom: 10px;
                    font-size: 1.8rem;
                    color: #333;
                }

                .text-container p {
                    font-size: 1.2rem;
                    color: #666;
                }

                .navigation-buttons {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }

                .navigation-buttons button {
                    font-family: 'Press Start 2P';
                    padding: 10px 20px;
                    background-color: rgb(34, 198, 248);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .navigation-buttons button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }

                .navigation-buttons button:hover:not(:disabled) {
                    box-shadow: 0 0 10px 5px rgba(0, 87, 180, 0.7); /* Glowing effect without changing layout */
                }

                .navigation-buttons button:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
};

export default MemecoinStory;
