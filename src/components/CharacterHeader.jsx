import React from 'react';
import './CharacterHeader.css';

function CharacterHeader({ character }) {
    if (!character) return null;

    return (
        <div className="character-header">
            <img src={character.avatar} alt={character.name} className="character-header-avatar" />
            <div className="character-header-info">
                <h3>{character.name}</h3>
                <p>{character.role}</p>
            </div>
        </div>
    );
}

export default CharacterHeader;
