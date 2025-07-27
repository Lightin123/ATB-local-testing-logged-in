import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { maintenanceReportSchema } from '../../utils/formSchemas';
import { useGetUnitsQuery } from '../../services/appApi';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormGroup,
} from '../ui/form.tsx';
import { Input } from '../ui/input.tsx';
import { Textarea } from '../ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.tsx';
import { Button } from '../ui/button.tsx';
import RentalSelection from '../comboboxes/RentalSelection.jsx';
import { Checkbox } from '../ui/checkbox.tsx';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group.tsx';
import { cn } from '../../utils.ts';

interface MaintenanceReport {
  [key: string]: any;
}

interface Option {
  value: string;
  label: string;
}

interface MaintenanceFormProps {
  mode: 'add' | 'edit';
  defaultValues?: MaintenanceReport;
  onSubmit: (report: MaintenanceReport) => void;
  onCancel: () => void;
  statusOptions: Option[];
  priorityOptions: Option[];
}

const defaultValues: MaintenanceReport = {
  title: '',
  category: '',
  categoryOther: '',
  status: 'OPEN',
  priority: '',
  unitId: undefined,
  notes: '',
  pendingTagRequest: false,
  isHOAIssue: false,
};

export default function MaintenanceForm({
  mode,
  defaultValues: defs,
  onSubmit,
  onCancel,
  statusOptions,
  priorityOptions,
}: MaintenanceFormProps) {
  const { data: units, isLoading: unitsLoading } = useGetUnitsQuery();

  const form = useForm<MaintenanceReport>({
    resolver: zodResolver(maintenanceReportSchema),
    defaultValues: mode === 'edit' && defs ? defs : defaultValues,
  });

  const watchCategory = form.watch('category');

  const handleSubmit = (data: MaintenanceReport) => {
    onSubmit(data);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2">
        <FormGroup useFlex>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchCategory === 'Other' && (
            <FormField
              control={form.control}
              name="categoryOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specify Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </FormGroup>

        <FormGroup useFlex>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem key="none" value="">
                      <div className="h-4" />
                    </SelectItem>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormGroup>

        <FormField
          control={form.control}
          name="unitId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <RentalSelection
                  units={units}
                  selected={Number(field.value)}
                  onSelect={(id) => {
                    form.setValue('unitId', id);
                    form.trigger('unitId');
                  }}
                  className="w-full"
                  isLoading={unitsLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === 'add' ? (
          <FormField
            control={form.control}
            name="pendingTagRequest"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Request HOA?</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v === true)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="pendingTagRequest"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>HOA Review?</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    value={field.value ? 'PENDING' : form.getValues('isHOAIssue') ? 'ISSUE' : undefined}
                    onValueChange={(val) => {
                      if (val === 'PENDING') {
                        field.onChange(true);
                        form.setValue('isHOAIssue', false);
                      } else if (val === 'ISSUE') {
                        field.onChange(false);
                        form.setValue('isHOAIssue', true);
                      } else {
                        field.onChange(false);
                        form.setValue('isHOAIssue', false);
                      }
                    }}
                    className="inline-flex"
                  >
                    <ToggleGroupItem
                      value="PENDING"
                      aria-label="HOA Review"
                      className={cn(
                        'p-2 border border-gray-300 rounded-l-md',
                        field.value ? 'bg-yellow-400 text-white' : 'bg-transparent text-gray-600',
                        'hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400'
                      )}
                    >
                      HOA Review
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="ISSUE"
                      aria-label="Owner Issue"
                      className={cn(
                        'p-2 border border-gray-300 rounded-r-md -ml-px',
                        form.getValues('isHOAIssue') ? 'bg-red-500 text-white' : 'bg-transparent text-gray-600',
                        'hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500'
                      )}
                    >
                      Owner Issue
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} className="resize-y" placeholder="Enter any notes here" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-2 mt-4">
          <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="cta" className="w-full">
            {mode === 'add' ? 'Create Report' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
