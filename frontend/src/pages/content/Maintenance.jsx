import Maintenance from "../../components/maintenance/Maintenance";
import MaintenanceForm from "../../components/maintenance/MaintenanceForm";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogIcon, DialogTitle } from "../../components/ui/dialog.tsx";
import { Drill } from "lucide-react";
import { useCreateMaintenanceReportMutation } from "../../services/api/maintenanceApi.js";
import { Button } from "../../components/ui/button.tsx";


const MaintenanceReports = (props) => {
    const [open, setOpen] = useState(false)
    const [createReport, {isLoading}] = useCreateMaintenanceReportMutation();

    const handleSubmit = (data) => {
        createReport(data).then((res) => {
            if (!res.error) {
                setOpen(false);
            }
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col">
                <h1>
                    Maintenance
                </h1>
                <div className="flex -mt-2 justify-between gap-2 items-center flex-wrap md:flex-nowrap">
                    <p className="text-gray-500">
                        This is where you can view and add maintenance reports.
                    </p>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <Button variant="outline" type="button" onClick={() => setOpen(true)}>
                            Report Maintenance
                        </Button>
                        <DialogContent>
                            <DialogHeader>
                                <DialogIcon>
                                    <Drill className="w-6 h-6" />
                                </DialogIcon>
                                <DialogTitle>Report Maintenance</DialogTitle>
                                <DialogDescription>Use this form to create a new maintenance report.</DialogDescription>
                            </DialogHeader>
                            <MaintenanceForm mode="add" onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Maintenance />

        </div>
    )
}

export default MaintenanceReports;