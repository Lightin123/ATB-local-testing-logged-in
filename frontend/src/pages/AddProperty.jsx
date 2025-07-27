import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePropertyMutation, useGetOwnersQuery } from '../services/appApi';

export default function AddProperty() {
  const navigate = useNavigate();
  const { data: ownersList } = useGetOwnersQuery();
  const [createProperty] = useCreatePropertyMutation();
  const [form, setForm] = useState({
    title: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [units, setUnits] = useState([{ unitNumber: '', ownerId: '', isNewOwner: false, ownerFields: {} }]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const addUnit = () => setUnits([...units, { unitNumber: '', ownerId: '', isNewOwner: false, ownerFields: {} }]);
  const removeUnit = idx => setUnits(units.filter((_, i) => i !== idx));

  const updateUnit = (idx, key, value) => {
    const copy = [...units];
    copy[idx][key] = value;
    setUnits(copy);
  };

  const submit = async e => {
    e.preventDefault();
    const payload = {
      ...form,
      units: units.map(u =>
        u.isNewOwner
          ? { unitNumber: u.unitNumber, owners: { create: [u.ownerFields] } }
          : { unitNumber: u.unitNumber, owners: { connect: [{ id: Number(u.ownerId) }] } }
      )
    };
    const res = await createProperty(payload).unwrap();
    const id = res?.id || res?.data?.id;
    if (id) navigate(`/properties/${id}`);
  };

  return (
    <form onSubmit={submit} className="p-4 space-y-4">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border p-1" />
      <input name="street" value={form.street} onChange={handleChange} placeholder="Street" className="border p-1" />
      <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="border p-1" />
      <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="border p-1" />
      <input name="zip" value={form.zip} onChange={handleChange} placeholder="Zip" className="border p-1" />
      <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="border p-1" />
      {units.map((u, idx) => (
        <div key={idx} className="border p-2 space-y-1">
          <input value={u.unitNumber} onChange={e => updateUnit(idx, 'unitNumber', e.target.value)} placeholder="Unit #" className="border p-1" />
          <select value={u.ownerId} onChange={e => updateUnit(idx, 'ownerId', e.target.value)} className="border p-1">
            <option value="">Select owner</option>
            {ownersList?.map(o => (
              <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>
            ))}
            <option value="new">+ New Owner</option>
          </select>
          {u.ownerId === 'new' && (
            <div className="space-y-1">
              <input placeholder="First Name" onChange={e => updateUnit(idx, 'ownerFields', { ...u.ownerFields, firstName: e.target.value })} className="border p-1" />
              <input placeholder="Last Name" onChange={e => updateUnit(idx, 'ownerFields', { ...u.ownerFields, lastName: e.target.value })} className="border p-1" />
              <input placeholder="Email" onChange={e => updateUnit(idx, 'ownerFields', { ...u.ownerFields, email: e.target.value })} className="border p-1" />
              <input placeholder="Phone" onChange={e => updateUnit(idx, 'ownerFields', { ...u.ownerFields, phone: e.target.value })} className="border p-1" />
            </div>
          )}
          <button type="button" onClick={() => removeUnit(idx)}>Remove Unit</button>
        </div>
      ))}
      <button type="button" onClick={addUnit}>Add Unit</button>
      <button type="submit">Create Property</button>
    </form>
  );
}
