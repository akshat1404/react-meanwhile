import { useEffect, useRef } from 'react';

let mountCount = 0;

const cardStyle = {
  display: 'flex',
  gap: 16,
  alignItems: 'center',
  padding: 16,
  width: 320,
  border: '1px solid #ddd',
  borderRadius: 8,
  background: '#fff',
};

const avatarStyle = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  background: '#8a8fd6',
  flexShrink: 0,
};

/**
 * Mounts exactly once per page load if Meanwhile is behaving —
 * watch the console. If the count climbs every time `loading` toggles,
 * Meanwhile is remounting real children on each cycle.
 */
export function ProfileCard() {
  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    mountCount += 1;
    // eslint-disable-next-line no-console
    console.log(`[ProfileCard] mounted (total mounts: ${mountCount})`);
  }, []);

  return (
    <div style={cardStyle}>
      <div style={avatarStyle} />
      <div>
        <h3 style={{ margin: '0 0 6px' }}>Ada Lovelace</h3>
        <p style={{ margin: 0, color: '#666', maxWidth: 220 }}>
          Mathematician and writer, known for work on Charles Babbage&apos;s
          Analytical Engine.
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#999' }}>
          mounts: {mountCount} · renders: {renderCount.current}
        </p>
      </div>
    </div>
  );
}
