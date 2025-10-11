import { useEffect, useState } from 'react';

const fields = ['contact', 'company', 'email', 'accounts', 'phone', 'type', 'location', 'priority', 'comments'];

export default function Board() {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(Object.fromEntries(fields.map(f => [f, ''])));

  /* load contacts */
  useEffect(() => { fetch('/api/deals').then(r => r.json()).then(setRows); }, []);

  /* create contact */
  async function createContact(e) {
    e.preventDefault();
    const newRow = await fetch('/api/newDeal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, stage: 'Contact' }), // stage no longer used for columns
    }).then(r => r.json());
    setRows([...rows, newRow]);
    setForm(Object.fromEntries(fields.map(f => [f, ''])));
    setShowForm(false);
  }

  /* inline update */
  async function updateCell(id, field, value) {
    await fetch('/api/updateField', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, field, value }),
    });
    setRows(rows.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  }

  /* delete row */
  async function deleteRow(id) {
    await fetch('/api/deleteDeal', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setRows(rows.filter(r => r.id !== id));
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Contact Manager</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: '6px 12px', fontSize: 14 }}>+ Add Contact</button>
      </div>

      {showForm && (
        <form onSubmit={createContact} style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {fields.map(f => (
            <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})} />
          ))}
          <button type="submit">Create</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr>
            {fields.map(f => <th key={f} style={{ borderBottom: '2px solid #ccc', textAlign: 'left', padding: 8 }}>{f.charAt(0).toUpperCase() + f.slice(1)}</th>)}
            <th style={{ borderBottom: '2px solid #ccc', textAlign: 'left', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              {fields.map(f => (
                <td key={f} style={{ borderBottom: '1px solid #eee', padding: 8 }}>
                  <div contentEditable suppressContentEditableWarning
                        style={{ outline: 'none', minWidth: 90, minHeight: 20 }}
                        onBlur={e => updateCell(r.id, f, e.currentTarget.textContent)}>
                    {r[f] || ''}
                  </div>
                </td>
              ))}
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>
                <button onClick={() => deleteRow(r.id)} style={{ cursor: 'pointer' }}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
