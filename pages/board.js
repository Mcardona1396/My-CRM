import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const stages = ['Lead', 'Demo', 'Proposal', 'Won', 'Lost'];

export default function Board() {
  const [deals, setDeals] = useState([
    { id: '1', title: 'Acme Corp', value: 12000, stage: 'Lead' },
    { id: '2', title: 'Globex', value: 8000, stage: 'Demo' },
  ]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newDeals = Array.from(deals);
    const [moved] = newDeals.splice(result.source.index, 1);
    moved.stage = result.destination.droppableId;
    setDeals(newDeals);
  };

  return (
    <div style={{padding: 40, fontFamily: 'sans-serif'}}>
      <h1>Pipeline Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{display: 'flex', gap: 12}}>
          {stages.map(s => (
            <Droppable key={s} droppableId={s}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}
                     style={{background: '#f3f4f6', padding: 12, minWidth: 180, borderRadius: 8}}>
                  <strong>{s}</strong>
                  {deals.filter(d => d.stage === s).map((d, i) => (
                    <Draggable key={d.id} draggableId={d.id} index={i}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                             style={{background: '#fff', padding: 8, marginTop: 8, borderRadius: 4, ...provided.draggableProps.style}}>
                          <div>{d.title}</div>
                          <div style={{fontWeight: 'bold'}}>${(d.value / 1000).toFixed(0)}k</div>
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
};
