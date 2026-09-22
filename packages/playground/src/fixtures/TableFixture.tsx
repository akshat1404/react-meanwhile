const rows = [
  { name: 'Widget A', qty: 12, price: '$4.00' },
  { name: 'Widget B', qty: 3, price: '$9.50' },
  { name: 'Widget C', qty: 27, price: '$1.25' },
];

export function TableFixture() {
  return (
    <table style={{ borderCollapse: 'collapse', width: 320, background: '#fff' }}>
      <thead>
        <tr>
          <th style={cellStyle}>Name</th>
          <th style={cellStyle}>Qty</th>
          <th style={cellStyle}>Price</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td style={cellStyle}>{row.name}</td>
            <td style={cellStyle}>{row.qty}</td>
            <td style={cellStyle}>{row.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const cellStyle = {
  border: '1px solid #ddd',
  padding: '6px 10px',
  textAlign: 'left' as const,
};
