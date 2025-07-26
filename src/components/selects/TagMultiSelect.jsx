import { useState } from 'react';

const OPTIONS = [
  { id: 1, name: 'General' },
  { id: 2, name: 'Plumbing' },
  { id: 3, name: 'Electrical' }
];

export default function TagMultiSelect({ values = [], onChange }) {
  const [tags] = useState(OPTIONS);

  const toggle = id => {
    const newVals = values.includes(id)
      ? values.filter(v => v !== id)
      : [...values, id];
    onChange(newVals);
  };

  return (
    <div className="flex flex-col gap-1">
      {tags.map(t => (
        <label key={t.id} className="flex items-center gap-1">
          <input type="checkbox" checked={values.includes(t.id)} onChange={() => toggle(t.id)} />
          {t.name}
        </label>
      ))}
    </div>
  );
}
