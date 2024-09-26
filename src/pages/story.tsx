/* eslint-disable react-hooks/rules-of-hooks */
import MemecoinStory from "components/pages";
import type { NextPage } from "next";

const story: NextPage = () => {
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",   // Horizontally center the content
                    alignItems: "center",        // Vertically center the content
                    flexDirection: "column",     // Align items in a column
                    height: "100vh",             // Make sure the background covers full height
                    backgroundImage: "url('/uni-bg.jpg')",  // Background image URL
                    backgroundSize: "cover",     // Ensure the image covers the whole page
                    backgroundPosition: "center",// Center the background image
                    backgroundRepeat: "no-repeat",
                    
                }}
            >
                <MemecoinStory />
            </div>
        </div>
    );
};

export default story;
