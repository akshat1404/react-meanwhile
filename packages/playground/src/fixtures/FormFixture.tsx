const fieldStyle = { display: 'flex', flexDirection: 'column' as const, gap: 4 };
const labelStyle = { fontSize: 13, color: '#444' };
const inputStyle = { padding: '6px 8px', border: '1px solid #ccc', borderRadius: 4, width: 260 };

export function FormFixture() {
  return (
    <form
      style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320, background: '#fff', padding: 16 }}
      onSubmit={(e) => e.preventDefault()}
    >
      <div style={fieldStyle}>
        <label style={labelStyle} htmlFor="name">
          Full name
        </label>
        <input id="name" style={inputStyle} defaultValue="Ada Lovelace" readOnly />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle} htmlFor="email">
          Email
        </label>
        <input id="email" style={inputStyle} defaultValue="ada@example.com" readOnly />
      </div>
      <button type="submit" style={{ padding: '8px 12px', width: 100 }}>
        Save
      </button>
    </form>
  );
}
