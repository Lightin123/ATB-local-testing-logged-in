import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetPropertyByIdQuery,
  propertyApi,
} from '../services/api/propertyApi.ts';
import { useDispatch, useSelector } from 'react-redux';
import { useGenerateOverwriteCodeMutation } from '../services/api/adminApi.js';
import RentalUnitsTable from '../components/RentalUnitsTable.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog.tsx';
import { Input } from '../components/ui/input.tsx';
import { Button } from '../components/ui/button.tsx';
import { Checkbox } from '../components/ui/checkbox.tsx';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const userRole = useSelector(s => s.authSlice.userInfo?.role);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [allUnits, setAllUnits] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [generateCode] = useGenerateOverwriteCodeMutation();
  const [editingOwner, setEditingOwner] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  const {
    data: property,
    isLoading,
    error,
  } = useGetPropertyByIdQuery(id, { skip: !id });

  useEffect(() => {
    if (editingOwner) {
      setFormData({
        firstName: editingOwner.firstName || '',
        lastName: editingOwner.lastName || '',
        email: editingOwner.email || '',
        phone: editingOwner.phone || '',
      });
    }
  }, [editingOwner]);

  if (!id || isLoading) return <div>Loading property details…</div>;
  if (error) return <div>Error loading property</div>;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!editingOwner) return;
    await fetch(`/api/users/${editingOwner.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    dispatch(propertyApi.util.invalidateTags([{ type: 'Property', id: property.id }]));
    setEditingOwner(null);
  }

  async function handleGenerate(e) {
    e.preventDefault();
    const payload = allUnits
      ? { propertyId: property.id, allUnits: true }
      : { unitIds: selectedUnits };
    const res = await generateCode(payload).unwrap().catch(() => null);
    if (res) setGenerated(res);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{property.title}</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Units</h2>
        <RentalUnitsTable
          units={property.units}
          showPropertyColumn={false}
          setEditingOwner={setEditingOwner}
        />
      </section>

      {userRole === 'ADMIN' && (
        <>
          <Button onClick={() => { setGenerateOpen(true); setGenerated(null); }}>Generate Overwrite Code</Button>
          <Dialog open={generateOpen} onOpenChange={o => { setGenerateOpen(o); if(!o) setGenerated(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Overwrite Code</DialogTitle>
              </DialogHeader>
              {generated ? (
                <div className="space-y-2">
                  <p className="font-mono text-lg">{generated.code}</p>
                  <p>Expires {new Date(generated.expiresAt).toLocaleDateString()}</p>
                </div>
              ) : (
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="au" checked={allUnits} onCheckedChange={v => setAllUnits(!!v)} />
                    <label htmlFor="au">All Units</label>
                  </div>
                  {!allUnits && (
                    <select multiple value={selectedUnits} onChange={e => setSelectedUnits(Array.from(e.target.selectedOptions).map(o => o.value))} className="w-full border p-2">
                      {property.units.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.unitIdentifier || u.unitNumber || `Unit ${u.id}`}
                        </option>
                      ))}
                    </select>
                  )}
                  <DialogFooter>
                    <Button type="submit">Generate</Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}

      <Dialog open={!!editingOwner} onOpenChange={o => !o && setEditingOwner(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Owner</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="First Name"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="Last Name"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
