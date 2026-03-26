import './EcoBadges.css';

const BADGE_THRESHOLDS = [
    { name: 'Bronze Leaf', icon: '🌿', color: '#cd7f32', threshold: 0 },
    { name: 'Silver Leaf', icon: '🍃', color: '#adb5bd', threshold: 10 },
    { name: 'Gold Leaf', icon: '🌟', color: '#f4a261', threshold: 30 },
    { name: 'Planet Protector', icon: '🌍', color: '#2d6a4f', threshold: 100 },
];

export default function EcoBadges({ totalCarbonSaved = 0 }) {
    return (
        <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--gray-800)', fontWeight: 700 }}>
                🏅 Eco Achievement Badges
            </h3>
            <div className="eco-badges-grid">
                {BADGE_THRESHOLDS.map((b) => {
                    const unlocked = totalCarbonSaved >= b.threshold;
                    return (
                        <div
                            key={b.name}
                            className={`eco-badge-item ${unlocked ? '' : 'eco-badge-locked'}`}
                        >
                            <div className="eco-badge-circle" style={{ background: b.color }}>
                                <span>{b.icon}</span>
                            </div>
                            <span className="eco-badge-name">{b.name}</span>
                            {unlocked ? (
                                <span className="eco-badge-unlock-label">✅ Unlocked</span>
                            ) : (
                                <span className="eco-badge-lock-label">🔒 {b.threshold} kg to unlock</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
