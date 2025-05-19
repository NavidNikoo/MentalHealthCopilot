import { useState } from 'react';
import { emotionScale } from '../data/emotionScale';

function getEmotion(value) {
    return emotionScale.find(e => e.value === value) || emotionScale[emotionScale.length - 1];
}

function MoodSelector({ onSelect }) {
    const [sliderValue, setSliderValue] = useState(10);
    const mood = getEmotion(sliderValue); // ✅ ← this defines the variable!

    const handleChange = (e) => {
        const val = parseInt(e.target.value);
        setSliderValue(val);

        const mood = getEmotion(val); // re-get mood after update
        onSelect({
            value: val,
            label: mood.label,
            color: mood.color
        });
    };

    return (
        <div
            style={{
                textAlign: 'center',
                marginTop: '2rem',
                backgroundColor: mood.color,
                color: '#fff',
                padding: '2rem',
                borderRadius: '1rem',
                transition: 'background-color 0.3s'
            }}
        >
            <h2>How are you feeling today?</h2>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{mood.label}</div>
            <input
                type="range"
                min="1"
                max={emotionScale.length}
                value={sliderValue}
                onChange={handleChange}
                style={{ width: '80%' }}
            />
        </div>
    );
}

export default MoodSelector;
