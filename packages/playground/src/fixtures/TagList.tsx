const tags = ['react', 'skeleton', 'loading-state', 'dx', 'oss'];
const showExtra = true;

const tagStyle = {
  display: 'inline-block',
  padding: '4px 10px',
  marginRight: 8,
  marginBottom: 8,
  background: '#eef0ff',
  color: '#3b3fb5',
  borderRadius: 999,
  fontSize: 13,
};

export function TagList() {
  return (
    <div style={{ width: 320, background: '#fff', padding: 12 }}>
      {tags.map((tag) => (
        <span key={tag} style={tagStyle}>
          #{tag}
        </span>
      ))}
      {showExtra && <span style={tagStyle}>#and-more</span>}
    </div>
  );
}
