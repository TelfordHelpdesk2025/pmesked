import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";
import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NewAdmin({ tableData, tableFilters, emp_data }) {
    const [role, setRole] = useState(null);

    function addAdmin(id, name, job_title) {
        if (!role) return;

        router.post(
            route("addAdmin"),
            { id, name, job_title, role }, // ✅ Isinama na ang job_title
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(route("admin"));
                },
            }
        );
    }

    const tableModalClose = (close) => {
        setRole(null);
        close();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manage Administrators" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                    <i className="fa-solid fa-users-between-lines"></i> Employee
                    List
                </h1>
            </div>

            <DataTable
                columns={[
                    { key: "EMPLOYID", label: "ID" },
                    { key: "EMPNAME", label: "Employee Name" },
                    { key: "JOB_TITLE", label: "Job Title" },
                    { key: "DEPARTMENT", label: "Department" },
                ]}
                data={tableData.data}
                meta={{
                    from: tableData.from,
                    to: tableData.to,
                    total: tableData.total,
                    links: tableData.links,
                    currentPage: tableData.current_page,
                    lastPage: tableData.last_page,
                }}
                routeName={route("index_addAdmin")}
                filters={tableFilters}
                rowKey="EMPLOYID"
                showExport={false}
            >
                {(row, close) => (
                    <Dialog
                        open={true}
                        onOpenChange={(open) => {
                            if (!open) {
                                tableModalClose(close);
                            }
                        }}
                    >
                        <DialogContent className="sm:max-w-md bg-white">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <i className="fa-solid fa-id-card text-emerald-500" />
                                    Employee Details
                                </DialogTitle>
                            </DialogHeader>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center gap-2">
                                        <i className="fa-solid fa-id-card text-5xl text-emerald-500" />

                                        <h2 className="text-xl font-bold">
                                            {row.EMPNAME}
                                        </h2>

                                        <p className="text-sm text-muted-foreground">
                                            Employee ID:
                                            <span className="ml-1 font-medium">
                                                {row.EMPLOYID}
                                            </span>
                                        </p>

                                        <div className="w-full space-y-2 pt-3">
                                            <div>
                                                <span className="text-sm text-muted-foreground">
                                                    Job Title
                                                </span>

                                                <div className="mt-1">
                                                    <Badge className="bg-emerald-500">
                                                        {row.JOB_TITLE}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-sm text-muted-foreground">
                                                    Department
                                                </span>

                                                <div className="font-medium">
                                                    {row.DEPARTMENT}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    Assign System Role
                                </label>

                                <Select
                                    value={role ?? ""}
                                    onValueChange={(value) => setRole(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>

                                    <SelectContent className="bg-white">
                                        {emp_data?.emp_role ===
                                            "superadmin" && (
                                            <SelectItem value="superadmin">
                                                Superadmin
                                            </SelectItem>
                                        )}

                                        {["superadmin", "admin"].includes(
                                            emp_data?.emp_role,
                                        ) && (
                                            <SelectItem value="admin">
                                                Admin
                                            </SelectItem>
                                        )}

                                        <SelectItem value="tooling">
                                            Tooling
                                        </SelectItem>

                                        <SelectItem value="pmtech">
                                            PM Tech
                                        </SelectItem>

                                        <SelectItem value="toolcrib">
                                            Toolcrib
                                        </SelectItem>

                                        <SelectItem value="seniortech">
                                            SeniorTech
                                        </SelectItem>

                                        <SelectItem value="enginner">
                                            Engineer
                                        </SelectItem>

                                        <SelectItem value="esd">ESD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {role && (
                                <div className="flex justify-end border-t pt-4">
                                    <Button
                                        onClick={() =>
                                            addAdmin(
                                                row.EMPLOYID,
                                                row.EMPNAME,
                                                row.JOB_TITLE,
                                            )
                                        }
                                        className="bg-emerald-500 hover:bg-emerald-600"
                                    >
                                        <i className="fa-solid fa-user-plus mr-2" />
                                        Add as {role}
                                    </Button>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                )}
            </DataTable>
        </AuthenticatedLayout>
    );
}
