import React, { useState } from 'react'
import MaintenanceList from '../components/maintenance/MaintenanceList'
import MaintenanceForm from '../components/maintenance/MaintenanceForm'
import { Dialog, DialogTrigger, DialogContent } from '@radix-ui/react-dialog'
import { useCreateMaintenanceReportMutation, useUpdateMaintenanceReportMutation } from '../services/appApi'
import { MaintenanceStatus, Priority } from '../utils/magicNumbers.jsx'

interface MaintenanceReport {
  [key: string]: any;
}

export default function MaintenancePage() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [current, setCurrent] = useState<MaintenanceReport | null>(null)

  const [createMaintenance] = useCreateMaintenanceReportMutation()
  const [updateMaintenance] = useUpdateMaintenanceReportMutation()
  const statusOptions = Object.entries(MaintenanceStatus).map(([value, label]) => ({
    value,
    label: label as string,
  }))
  const priorityOptions = Object.entries(Priority).map(([value, label]) => ({
    value,
    label: label as string,
  }))

  const openAdd = () => {
    setMode('add')
    setCurrent(null)
    setIsOpen(true)
  }

  const openEdit = (report: MaintenanceReport) => {
    setMode('edit')
    setCurrent(report)
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)

  const handleSubmit = (data: MaintenanceReport) => {
    if (mode === 'add') {
      createMaintenance(data).unwrap().then(close)
    } else {
      updateMaintenance({ id: current!.id, ...data }).unwrap().then(close)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Maintenance</h1>
        <button onClick={openAdd} className="btn">
          Report Maintenance
        </button>
      </div>

      <MaintenanceList
        onEdit={openEdit}
        onDelete={id => {}}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button style={{ display: 'none' }} />
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <MaintenanceForm
            mode={mode}
            defaultValues={current ?? undefined}
            onSubmit={handleSubmit}
            onCancel={close}
            statusOptions={statusOptions}
            priorityOptions={priorityOptions}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
