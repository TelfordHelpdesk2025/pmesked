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

export default function Admin({ tableData, tableFilters, emp_data }) {
    const [role, setRole] = useState(null);

    function removeAdmin(id) {
        router.post(
            route("removeAdmin"),
            { id },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log("Admin removed");
                },
            }
        );
    }

    function changeRole(id) {
        if (!role) return;

        router.patch(
            route("changeAdminRole"),
            { id, role },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log("Admin role changed");
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
            <Head title="Manage PM Personnel" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                    <i className="fa-solid fa-users"></i> PM Personnel
                </h1>

                {(["superadmin", "admin", "engineer"].includes(
                    emp_data?.emp_role,
                ) ||
                    (["pmtech"].includes(emp_data?.emp_role) &&
                        ["1742"].includes(emp_data?.emp_id))) && (
                    <div>
                        <Button
                            onClick={() =>
                                router.get(
                                    route("index_addAdmin"),
                                    {},
                                    { preserveScroll: true },
                                )
                            }
                            className="flex items-center bg-gray-500 text-white hover:bg-gray-700/90"
                        >
                            <i className="fa-solid fa-user-plus" />
                            Add New
                        </Button>
                    </div>
                )}
            </div>

            <DataTable
                columns={[
                    { key: "emp_id", label: "ID" },
                    { key: "emp_name", label: "Employee Name" },
                    { key: "emp_jobtitle", label: "Job Title" },
                    { key: "emp_role", label: "Role" },
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
                routeName={route("admin")}
                filters={tableFilters}
                rowKey="emp_id"
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
                                    <i className="fa-solid fa-users-gear text-primary" />
                                    Employee Details
                                </DialogTitle>
                            </DialogHeader>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center gap-2">
                                        <i className="fa-solid fa-user-circle text-5xl text-primary" />

                                        <h2 className="text-xl font-bold">
                                            {row.emp_name}
                                        </h2>

                                        <p className="text-sm text-muted-foreground">
                                            ID:{" "}
                                            <span className="font-medium">
                                                {row.emp_id}
                                            </span>
                                        </p>

                                        <div>
                                            <span className="text-sm text-muted-foreground">
                                                Current Role
                                            </span>

                                            <div className="mt-1">
                                                <Badge className="bg-green-500">
                                                    {row.emp_role}
                                                </Badge>
                                            </div>
                                        </div>

                                        <p className="text-sm text-muted-foreground">
                                            Job Title:{" "}
                                            <span className="font-medium text-foreground">
                                                {row.emp_jobtitle}
                                            </span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {["superadmin", "admin", "engineer"].includes(
                                emp_data?.emp_role,
                            ) &&
                                !row.emp_role.includes("superadmin") && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">
                                                Update Role
                                            </label>

                                            <Select
                                                defaultValue={row.emp_role}
                                                onValueChange={(value) =>
                                                    setRole(value)
                                                }
                                            >
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>

                                                <SelectContent className="bg-white">
                                                    {emp_data?.emp_role ===
                                                        "superadmin" && (
                                                        <SelectItem value="superadmin">
                                                            Superadmin
                                                        </SelectItem>
                                                    )}

                                                    {[
                                                        "superadmin",
                                                        "admin",
                                                    ].includes(
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

                                                    <SelectItem value="esd">
                                                        ESD
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex justify-end gap-2 border-t pt-4">
                                            <Button
                                                onClick={() =>
                                                    changeRole(row.emp_id)
                                                }
                                                className="bg-blue-500 text-white hover:bg-blue-600"
                                            >
                                                <i className="fa-solid fa-rotate" />
                                                Update Role
                                            </Button>

                                            <Button
                                                onClick={() =>
                                                    removeAdmin(row.emp_id)
                                                }
                                                className="bg-red-500 text-white hover:bg-red-600"
                                            >
                                                <i className="fa-solid fa-user-slash" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                )}
                        </DialogContent>
                    </Dialog>
                )}
            </DataTable>
        </AuthenticatedLayout>
    );
}
