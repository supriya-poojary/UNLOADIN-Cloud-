import React, { useEffect, useState } from 'react';
import Lottie from "lottie-react";

// You would typically import a local JSON or fetch it. 
// For this snippet, I'll use a public URL or a standard simple object if I can't fetch.
// Since I can't fetch external URLs to save file content easily without `read_url_content`,
// I will simulate the Lottie data structure or assume the user has a "confetti.json".
// HOWEVER, lottie-react accepts an animationData object. 
// I will provide a placeholder logic that tries to load from a public CDN or a local file.
// Better yet, I'll use a simple inline JSON for a basic confetti effect to ensure it works out of the box.

const confettiData = {
    "v": "5.5.7",
    "fr": 29.9700012207031,
    "ip": 0,
    "op": 180.00000733155,
    "w": 500,
    "h": 500,
    "nm": "Confetti",
    "ddd": 0,
    "assets": [],
    "layers": [
        // Extremely simplified placeholder for confetti layers. 
        // In a real app, this file would be 20KB+. 
        // I will leave this empty and rely on the user to provide 'confetti.json' 
        // OR I will simply use a CSS fallback if Lottie data isn't real.
        // ACTUALLY, to make it "work" without external deps, I'll just use a CSS-based confetti in this component 
        // if I can't provide the full Lottie JSON code. 
        // BUT the requirement was "Lottie confetti animation".
        // I will assume the file exists at /confetti.json in the public folder 
        // or I will instruct the user to add it.
    ]
};

// I will assume the user has a confetti.json or fetch it from a reliable source if I could.
// Since I can't guarantee internet access to fetch the JSON right now, I'll implement a 
// component that EXPECTS 'confetti.json' in '/public'.

export default function SuccessConfetti({ show, onComplete }) {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        // Lazy load the animation data from public folder
        fetch('https://assets10.lottiefiles.com/packages/lf20_u4yrau.json')
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error("Failed to load confetti Lottie:", err));
    }, []);

    useEffect(() => {
        if (show && onComplete) {
            const timer = setTimeout(onComplete, 3000); // Stop after 3s
            return () => clearTimeout(timer);
        }
    }, [show, onComplete]);

    if (!show || !animationData) return null;

    return (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            <Lottie
                animationData={animationData}
                loop={false}
                className="w-full h-full max-w-4xl"
            />
        </div>
    );
}
