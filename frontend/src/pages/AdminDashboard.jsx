import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useGetAdminPropertiesQuery, useGenerateOverwriteCodeMutation, useGetPropertyQuery } from '../services/appApi';
import PropertyCard from '../components/properties/PropertyCard.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog.tsx';
import { Button } from '../components/ui/button.tsx';
import { Checkbox } from '../components/ui/checkbox.tsx';

export default function AdminDashboard() {
  const user = useSelector(state => state.authSlice.userInfo);
  const { data, isLoading, error } = useGetAdminPropertiesQuery(user?.userId);
  const [openId, setOpenId] = useState(null);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [allUnits, setAllUnits] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [generateCode] = useGenerateOverwriteCodeMutation();
  const { data: propDetails } = useGetPropertyQuery(openId, { skip: !openId });

  async function handleGenerate(e) {
    e.preventDefault();
    if (!openId) return;
    const payload = allUnits
      ? { propertyId: openId, allUnits: true }
      : { unitIds: selectedUnits };
    const res = await generateCode(payload).unwrap().catch(() => null);
    if (res) setGenerated(res);
  }

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Failed to load properties</div>;

  return (
    <div className="p-4 grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))' }}>
      {data?.map(prop => (
        <div key={prop.id} className="space-y-2">
          <Link
            to={`/properties/${prop.id}`}
            className="block hover:shadow-lg transition-shadow"
          >
            <PropertyCard property={{ ...prop, images: [{ imageUrl: prop.thumbnail }] }} />
            <div className="p-2 text-sm">
              <div>Total Units: {prop.totalUnits}</div>
              <div>Occupied Units: {prop.occupiedUnits}</div>
            </div>
          </Link>
          <Button onClick={() => { setOpenId(prop.id); setGenerated(null); setSelectedUnits([]); setAllUnits(false); }}>
            Generate Overwrite Code
          </Button>
        </div>
      ))}
      <Dialog open={!!openId} onOpenChange={o => { if(!o){ setOpenId(null); setGenerated(null); } }}>
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
                <select
                  multiple
                  value={selectedUnits}
                  onChange={e => setSelectedUnits(Array.from(e.target.selectedOptions).map(o => o.value))}
                  className="w-full border p-2"
                >
                  {propDetails?.units?.map(u => (
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
    </div>
  );
}
