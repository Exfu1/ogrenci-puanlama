import { useState, useEffect, useRef } from 'react';

export default function ScoreInput({ criteria, score, maxScore, onChange }) {
    const [inputValue, setInputValue] = useState(score.toString());
    const [isAnimating, setIsAnimating] = useState(false);
    const sliderRef = useRef(null);

    useEffect(() => {
        setInputValue(score.toString());
    }, [score]);

    // Slider progress güncelle
    useEffect(() => {
        if (sliderRef.current) {
            const progress = (score / maxScore) * 100;
            sliderRef.current.style.setProperty('--progress', `${progress}%`);
        }
    }, [score, maxScore]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            const clamped = Math.max(0, Math.min(maxScore, numValue));
            onChange(clamped);
        }
    };

    const handleInputBlur = () => {
        const numValue = parseInt(inputValue, 10);
        if (isNaN(numValue) || inputValue === '') {
            setInputValue(score.toString());
        } else {
            const clamped = Math.max(0, Math.min(maxScore, numValue));
            setInputValue(clamped.toString());
            onChange(clamped);
        }
    };

    const handleIncrement = () => {
        if (score < maxScore) {
            triggerAnimation();
            onChange(score + 1);
            triggerVibration();
        }
    };

    const handleDecrement = () => {
        if (score > 0) {
            triggerAnimation();
            onChange(score - 1);
            triggerVibration();
        }
    };

    const handleSliderChange = (e) => {
        onChange(parseInt(e.target.value, 10));
    };

    const triggerAnimation = () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const triggerVibration = () => {
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    };

    const percentage = Math.round((score / maxScore) * 100);

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 animate-slide-up">
            {/* Başlık */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{criteria.icon}</span>
                    <span className="text-white font-medium">{criteria.name}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className={`text-2xl font-bold transition-all ${isAnimating ? 'animate-pulse-score text-indigo-400' : 'text-white'}`}>
                        {score}
                    </span>
                    <span className="text-slate-400 text-sm">/ {maxScore}</span>
                </div>
            </div>

            {/* Yüzde göstergesi */}
            <div className="mb-4">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="text-right mt-1">
                    <span className="text-xs text-slate-400">%{percentage}</span>
                </div>
            </div>

            {/* Kontroller */}
            <div className="flex items-center gap-3">
                {/* - Butonu */}
                <button
                    onClick={handleDecrement}
                    disabled={score <= 0}
                    className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white text-2xl font-bold transition-all active:scale-95"
                >
                    −
                </button>

                {/* Sayı Input */}
                <input
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    min={0}
                    max={maxScore}
                    className="w-16 h-12 rounded-xl bg-slate-900 border-2 border-slate-600 focus:border-indigo-500 text-white text-center text-xl font-bold outline-none transition-all"
                />

                {/* + Butonu */}
                <button
                    onClick={handleIncrement}
                    disabled={score >= maxScore}
                    className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white text-2xl font-bold transition-all active:scale-95"
                >
                    +
                </button>

                {/* Slider */}
                <div className="flex-1 px-2">
                    <input
                        ref={sliderRef}
                        type="range"
                        min={0}
                        max={maxScore}
                        value={score}
                        onChange={handleSliderChange}
                        className="w-full h-8"
                    />
                </div>
            </div>
        </div>
    );
}
