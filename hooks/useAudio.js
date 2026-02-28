import { useState, useEffect, useRef } from "react";

export default function useAudio() {
    const [volume, setVolume] = useState(0.5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [soundOpen, setSoundOpen] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio('https://ice3.somafm.com/fluid-128-mp3');
        // live radio stream — loop not applicable
        audioRef.current.volume = volume;
        return () => {
            audioRef.current?.pause();
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    return { volume, setVolume, isPlaying, setIsPlaying, soundOpen, setSoundOpen };
}
