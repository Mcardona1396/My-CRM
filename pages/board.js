import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const stages = ['Lead', 'Demo', 'Proposal', 'Won', 'Lost'];

export default function Board() {
  const [deals, setDeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: '', title: '', value: '', closeDate: '' });

  /* load deals */
  useEffect(() => {
    fetch('/api/deals').then(r => r.json()).then(setDeals);
  }, []);

  /* create deal */
  async function createDeal(e) {
    e.preventDefault();
    const newDeal = await fetch('/api/newDeal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then(r => r.json());
    setDeals([...deals, newDeal]);
    setForm({ company: '', title: '', value: '', closeDate: '' });
    setShowForm(false);
  }

  /* delete deal */
  async function deleteDeal(id) {
    await fetch('/api/deleteDeal', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setDeals(deals.filter(d => d.id !== id));
  }

  /* drag move */
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newDeals = Array.from(deals);
    const [moved] = newDeals.splice(result.source.index, 1);
    moved.stage = result.destination.droppableId;
    setDeals(newDeals);
    fetch('/api/move', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: moved.id, stage: result.destination.droppableId }) });
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Pipeline Board</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: '6px 12px', fontSize: 14 }}>+ Add Deal</button>
      </div>

      {showForm && (
        <form onSubmit={createDeal} style={{ marginBottom: 20, display: 'flex', gap: 8 }}>
          <input placeholder="Company" required value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
          <input placeholder="Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <input placeholder="Value $" required type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} />
          <input required type="date" value={form.closeDate} onChange={e => setForm({...form, closeDate: e.target.value})} />
          <button type="submit">Create</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: 12 }}>
          {stages.map(s => (
            <Droppable key={s} droppableId={s}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} style={{ background: '#f3f4f6', padding: 12, minWidth: 180, borderRadius: 8 }}>
                  <strong>{s}</strong>
                  {deals.filter(d => d.stage === s).map((d, i) => (
                    <Draggable key={d.id} draggableId={d.id} index={i}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ background: '#fff', padding: 8, marginTop: 8, borderRadius: 4, ...provided.draggableProps.style }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <div>{d.title}</div>
                              <div style={{ fontWeight: 'bold' }}>${(d.value / 1000).toFixed(0)}k</div>
                            </div>
                            <button onClick={() => deleteDeal(d.id)} style={{ marginLeft: 8, cursor: 'pointer' }}>×</button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
