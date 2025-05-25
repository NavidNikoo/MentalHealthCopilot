import React from 'react';
import characters from '../data/characters';
import './CharacterSelect.css';

function CharacterSelect({ onChoose }) {
    const handleSelect = (char) => {
        onChoose(char); // Pass the whole character object
    };

    return (
        <div className="character-select-container">
            <h2 className="character-heading">Choose Your Copilot</h2>
            <div className="character-grid">
                {characters.map((char) => (
                    <div key={char.id} className="character-card" onClick={() => handleSelect(char)}>
                        <img src={char.avatar} alt={char.name} className="character-avatar" />
                        <h3>{char.name}</h3>
                        <p className="character-role">{char.role}</p>
                        <p className="character-bio">{char.bio}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default CharacterSelect;
