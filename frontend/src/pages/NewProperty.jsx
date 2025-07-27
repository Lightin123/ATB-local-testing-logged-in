import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormGroup } from '../components/ui/form.tsx';
import { Input } from '../components/ui/input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.tsx';
import { Button } from '../components/ui/button.tsx';
import { useCreatePropertyMutation, useGetOwnersQuery, useGetTenantsQuery } from '../services/appApi';

export default function NewProperty() {
  const role = useSelector(state => state.authSlice.userInfo?.role);
  const navigate = useNavigate();
  const { data: ownersData } = useGetOwnersQuery();
  const { data: tenantsData } = useGetTenantsQuery();
  const [createProperty, { isLoading }] = useCreatePropertyMutation();

  const form = useForm({
    defaultValues: {
      title: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      units: [
        {
          unitNumber: '',
          ownerId: '',
          tenantId: '',
          newOwner: { firstName: '', lastName: '', email: '', phone: '' }
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'units' });

  const onSubmit = async values => {
    const body = {
      title: values.title,
      street: values.street,
      city: values.city,
      state: values.state,
      zip: values.zip,
      country: values.country,
      units: values.units.map(u => {
        const unit = { unitNumber: u.unitNumber };
        unit.owner = u.ownerId === 'new'
          ? { newOwner: { ...u.newOwner } }
          : { ownerId: Number(u.ownerId) };
        if (u.tenantId) unit.tenant = { tenantId: Number(u.tenantId) };
        return unit;
      })
    };

    try {
      const res = await createProperty(body).unwrap();
      const id = res?.data?.id || res?.data?.data?.id;
      if (id) navigate(`/properties/${id}`);
      else navigate('/properties');
    } catch (err) {
      // toast handled in api layer
    }
  };

  if (role !== 'ADMIN') return <Navigate to="/" replace />;

  const owners = ownersData?.data || ownersData;
  const tenants = tenantsData?.data || tenantsData;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Create Property</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Property Info</h2>
            <FormGroup useFlex>
              <FormField control={form.control} name="title" rules={{ required: 'Required' }} render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </FormGroup>
            <FormGroup useFlex>
              <FormField control={form.control} name="street" rules={{ required: 'Required' }} render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Street *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="city" rules={{ required: 'Required' }} render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </FormGroup>
            <FormGroup useFlex>
              <FormField control={form.control} name="state" rules={{ required: 'Required' }} render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>State *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="zip" rules={{ required: 'Required' }} render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>ZIP *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="country" rules={{ required: 'Required' }} render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Country *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </FormGroup>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Units</h2>
              <Button type="button" variant="outline" onClick={() => append({ unitNumber: '', ownerId: '', tenantId: '', newOwner: { firstName: '', lastName: '', email: '', phone: '' } })}>
                Add Unit
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit #</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  const ownerVal = form.watch(`units.${index}.ownerId`);
                  return (
                    <TableRow key={field.id}>
                      <TableCell className="w-32">
                        <FormField control={form.control} name={`units.${index}.unitNumber`} rules={{ required: 'Required' }} render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </TableCell>
                      <TableCell>
                        <FormField control={form.control} name={`units.${index}.ownerId`} rules={{ required: 'Required' }} render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select owner" />
                                </SelectTrigger>
                                <SelectContent>
                                  {owners?.map(o => (
                                    <SelectItem key={o.id} value={String(o.id)}>{o.firstName} {o.lastName}</SelectItem>
                                  ))}
                                  <SelectItem value="new">+ New Owner</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        {ownerVal === 'new' && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <FormField control={form.control} name={`units.${index}.newOwner.firstName`} rules={{ validate: v => ownerVal === 'new' ? (v ? true : 'Required') : true }} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="First Name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name={`units.${index}.newOwner.lastName`} rules={{ validate: v => ownerVal === 'new' ? (v ? true : 'Required') : true }} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Last Name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name={`units.${index}.newOwner.email`} rules={{ validate: v => ownerVal === 'new' ? (v ? true : 'Required') : true }} render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormControl>
                                  <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name={`units.${index}.newOwner.phone`} render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormControl>
                                  <Input placeholder="Phone" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <FormField control={form.control} name={`units.${index}.tenantId`} render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select value={field.value || ''} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select tenant" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  {tenants?.map(t => (
                                    <SelectItem key={t.id} value={String(t.id)}>{t.firstName} {t.lastName}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </TableCell>
                      <TableCell>
                        {fields.length > 1 && (
                          <Button type="button" variant="ghost" onClick={() => remove(index)}>
                            Remove
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Button type="submit" variant="cta" className="mt-4" isLoading={isLoading}>
            Create Property
          </Button>
        </form>
      </Form>
    </div>
  );
}
