const items = [
  { title: 'Short item', body: 'One line of text.' },
  {
    title: 'A longer item',
    body: 'This one wraps across a couple of lines because the description is noticeably longer than the others.',
  },
  { title: 'Medium item', body: 'A bit more than one line, maybe two.' },
];

export function VariableHeightList() {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((item) => (
        <li key={item.title} style={{ background: '#fff', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>
          <strong>{item.title}</strong>
          <p style={{ margin: '4px 0 0', color: '#666' }}>{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
