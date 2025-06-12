import { useState } from 'react';
import { emotionScale } from '../data/emotionScale';

function getEmotion(value) {
    return emotionScale.find(e => e.value === value) || emotionScale[emotionScale.length - 1];
}

function MoodSelector({ onSave }) {
    const [sliderValue, setSliderValue] = useState(10);
    const [selectedMoods, setSelectedMoods] = useState([]);
    const [note, setNote] = useState('');

    const currentMood = getEmotion(sliderValue);

    const handleSliderChange = (e) => {
        const val = parseInt(e.target.value);
        setSliderValue(val);
    };

    const handleAddMood = () => {
        const mood = getEmotion(sliderValue);
        // Prevent duplicates
        if (!selectedMoods.some(m => m.label === mood.label)) {
            setSelectedMoods([...selectedMoods, mood]);
        }
    };

    const handleRemoveMood = (label) => {
        setSelectedMoods(selectedMoods.filter(m => m.label !== label));
    };

    const handleSave = () => {
        if (selectedMoods.length === 0) {
            alert('Please add at least one mood.');
            return;
        }

        onSave({
            moods: selectedMoods,
            note
        });

        // Clear after save
        setSelectedMoods([]);
        setNote('');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <div
                style={{
                    backgroundColor: currentMood.color,
                    color: '#fff',
                    padding: '2rem',
                    borderRadius: '1rem',
                    marginBottom: '1rem',
                    transition: 'background-color 0.3s'
                }}
            >
                <h2>How are you feeling today?</h2>
                <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{currentMood.label}</div>
                <input
                    type="range"
                    min="1"
                    max={emotionScale.length}
                    value={sliderValue}
                    onChange={handleSliderChange}
                    style={{ width: '80%' }}
                />
                <div style={{ marginTop: '1rem' }}>
                    <button
                        onClick={handleAddMood}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#fff',
                            color: currentMood.color,
                            border: `2px solid ${currentMood.color}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        + Add Mood
                    </button>
                </div>
            </div>

            {/* Selected Moods */}
            {selectedMoods.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                    {selectedMoods.map((mood) => (
                        <span
                            key={mood.label}
                            style={{
                                display: 'inline-block',
                                backgroundColor: mood.color,
                                color: '#fff',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '999px',
                                margin: '0.25rem',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                            onClick={() => handleRemoveMood(mood.label)}
                            title="Click to remove"
                        >
                            {mood.label} ✕
                        </span>
                    ))}
                </div>
            )}

            {/* Note */}
            <textarea
                placeholder="Want to add a note?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{
                    width: '100%',
                    height: '100px',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    marginBottom: '1rem',
                    fontSize: '1rem'
                }}
            />

            {/* Save */}
            <div>
                <button
                    onClick={handleSave}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#6ec1b3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    Save Entry
                </button>
            </div>
        </div>
    );
}

export default MoodSelector;
