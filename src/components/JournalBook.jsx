import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import './JournalBook.css';

function JournalBook({ entries }) {
    return (
        <div className="book-wrapper">
            <HTMLFlipBook
                width={400}
                height={500}
                showCover={false}
                usePortrait={false}
                drawShadow={true}
                style={{
                    borderRadius: '12px',
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)'
                }}
            >
                {entries.map((entry, idx) => (
                    <div key={idx} className="page">
                        <div className="page-content">
                            <h3>{entry.date}</h3>
                            <p><strong>Mood:</strong> {entry.label}</p>
                            <p><em>{entry.note || 'No note'}</em></p>
                            {entry.reflection && (
                                <>
                                    <hr style={{ margin: '1rem 0' }} />
                                    <p><strong>Copilot Reflection:</strong></p>
                                    <p style={{ fontStyle: 'italic', color: '#444' }}>{entry.reflection}</p>
                                </>
                            )}
                        </div>
                        <div className="page-number">Page {idx + 1}</div>
                    </div>
                ))}

            </HTMLFlipBook>
        </div>
    );
}

export default JournalBook;
