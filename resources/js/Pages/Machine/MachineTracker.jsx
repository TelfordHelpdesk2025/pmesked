import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import { useState } from "react";
import { Pin, ReceiptText, SaveCheck, Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronsUpDown } from "lucide-react";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Build/read dates purely from local Y/M/D components — avoids the same
// UTC round-trip bug we fixed earlier in Dashboard.jsx. `new Date("2026-06-19")`
// parses as UTC midnight, then .toISOString() converts back to UTC, which
// can silently shift the result by a day depending on timezone.
function calculatePmDue(dateStr, days) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return "";

    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + Number(days));

    const yy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
}

function calculateProgress(checklist) {
    let score = 0;
    if (checklist.grr) score += 20;
    if (checklist.checklist) score += 20;
    if (checklist.report) score += 20;
    if (checklist.backup) score += 20;
    if (checklist.sticker) score += 20;
    return score;
}

// ASSUMPTION: you only told me 100 = "Complete". Filled in reasonable
// labels for the in-between states — change these strings if your backend
// expects something else.
function getStatus(progress) {
    if (progress >= 100) return "Complete";
    if (progress > 0) return "In Progress";
    return "Not Started";
}

const PLATFORM_OPTIONS = [
    "Tray",
    "Turret",
    "G6L",
    "ToolCrib",
    "Non Tnr",
    "Gravity",
];

const CHECKLIST_LABELS = {
    grr: "GRR",
    checklist: "Checklist",
    report: "Report",
    backup: "Backup",
    sticker: "Sticker",
};

export default function MachineTracker({
    tableData,
    tableFilters,
    emp_data,
    empList,
}) {
    const [selectedRow, setSelectedRow] = useState(null);

    const [pmDate, setPmDate] = useState("");
    const [frequency, setFrequency] = useState("91");
    const [technician, setTechnician] = useState("");
    const [platform, setPlatform] = useState("");
    const [remarks, setRemarks] = useState("");
    const [checklist, setChecklist] = useState({
        grr: false,
        checklist: false,
        report: false,
        backup: false,
        sticker: false,
    });

    const progress = calculateProgress(checklist);
    const status = getStatus(progress);
    const pmDue = calculatePmDue(pmDate, frequency);
    const [techOpen, setTechOpen] = useState(false);
    const [originalChecklist, setOriginalChecklist] = useState({});

    function openModal(row) {
        setSelectedRow(row);
        setPmDate(row.pm_date || "");
        setFrequency(row.frequency || "91");
        setTechnician(row.technician || "");
        setPlatform(row.tech_platform_handle || "");
        setRemarks(row.remarks || "");

        const initialChecklist = {
            grr: !!row.grr,
            checklist: !!row.checklist,
            report: !!row.report,
            backup: !!row.backup,
            sticker: !!row.sticker,
        };

        setChecklist(initialChecklist);
        setOriginalChecklist(initialChecklist); // ✅ IMPORTANT
    }

    const hasChecklistChanges = Object.keys(checklist).some(
        (key) => checklist[key] !== originalChecklist[key],
    );

    function closeModal() {
        setSelectedRow(null);
    }

    function saveChanges() {
        router.patch(
            route("machine-tracker.update"),
            {
                // NOTE: using `selectedRow.id` to match `rowKey="id"` on
                // the table below. The previous version sent `emp_id`,
                // which was almost certainly wrong for a machine record —
                // switch this back only if `emp_id` really is this table's
                // primary key.
                id: selectedRow.id,
                pm_date: pmDate,
                frequency,
                pm_due: pmDue,
                technician,
                tech_platform_handle: platform,
                remarks,
                grr: checklist.grr,
                checklist: checklist.checklist,
                report: checklist.report,
                backup: checklist.backup,
                sticker: checklist.sticker,
                progress,
                status,
            },
            {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            },
        );
    }

    function removeMachine(id) {
        router.post(
            route("machine-tracker.delete"),
            { id },
            { preserveScroll: true, onSuccess: () => closeModal() },
        );
    }

    const canCreate =
        ["superadmin", "admin", "engineer"].includes(emp_data?.emp_role) ||
        (emp_data?.emp_role === "seniortech" && emp_data?.emp_id === "1742");

    const canManage = ["superadmin", "admin", "engineer"].includes(
        emp_data?.emp_role,
    );

    const isAdmin = emp_data?.emp_role === "admin";

    function isLocked(progress) {
        return !isAdmin && Number(progress) !== 0;
    }

    function formatDateMDY(dateStr) {
        if (!dateStr) return "";

        const [year, month, day] = dateStr.split("-");

        if (!year || !month || !day) return dateStr;

        return `${month}/${day}/${year}`;
    }

const dataWithAction = tableData.data.map((item) => ({
    ...item,

    pm_date: formatDateMDY(item.pm_date),
    pm_due: formatDateMDY(item.pm_due),

    ...(item.frequency != null &&
        item.frequency !== "" && {
            frequency: `${item.frequency} Days`,
        }),

    status: (
        <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
            ${
                item.status === "Complete"
                    ? "bg-green-100 text-green-700"
                    : item.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
            }`}
        >
            {item.status}
        </span>
    ),

    progress: (
        <div className="min-w-[120px]">
            <div className="flex justify-between text-xs mb-1">
                <span>{item.progress}%</span>
            </div>

            <Progress value={Number(item.progress || 0)} />
        </div>
    ),

    action: (
        <div className="flex gap-2">
            <Button
                className="bg-blue-500 hover:bg-blue-600 rounded text-white px-3 py-2"
                size="sm"
                onClick={() => openModal(item)}
            >
                <Eye className="h-4 w-4" />
            </Button>
        </div>
    ),
}));

    return (
        <AuthenticatedLayout>
            <Head title="PM/Cal Tracker" />

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="flex items-center gap-2 text-2xl font-bold">
                    <Pin className="h-6 w-6" />
                    PM/Cal Tracker
                </h1>
            </div>

            {/* DATATABLE */}
            <DataTable
                columns={[
                    { key: "machine", label: "Machine" },
                    { key: "pm_date", label: "PM Date" },
                    { key: "frequency", label: "Frequency" },
                    { key: "pm_due", label: "PM Due Date" },
                    { key: "technician", label: "Assigned Technician" },
                    { key: "tech_platform_handle", label: "Tech Handled" },
                    { key: "status", label: "Status" },
                    { key: "progress", label: "Progress" },
                    { key: "action", label: "Action" },
                ]}
                data={dataWithAction}
                meta={{
                    from: tableData.from,
                    to: tableData.to,
                    total: tableData.total,
                    links: tableData.links,
                    currentPage: tableData.current_page,
                    lastPage: tableData.last_page,
                }}
                routeName={route("machines-tracker.index")}
                filters={tableFilters}
                rowKey="id"
                showExport={false}
            />

            {/* MODAL */}
            <Dialog
                open={!!selectedRow}
                onOpenChange={(open) => !open && closeModal()}
            >
                <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto bg-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ReceiptText className="h-5 w-5" />
                            Machine Details
                        </DialogTitle>
                    </DialogHeader>

                    {selectedRow && (
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                {/* Machine — read-only, never editable */}
                                <div>
                                    <Label className="text-xs font-semibold uppercase text-gray-500">
                                        Machine
                                    </Label>
                                    <Input
                                        value={selectedRow.machine || ""}
                                        readOnly
                                        className="mt-1 bg-gray-50"
                                    />
                                </div>

                                {/* PM Date */}
                                <div>
                                    <Label className="text-xs font-semibold uppercase text-gray-500">
                                        PM Date
                                    </Label>
                                    <Input
                                        type="date"
                                        value={pmDate}
                                        onChange={(e) =>
                                            setPmDate(e.target.value)
                                        }
                                        disabled={isLocked(
                                            selectedRow.progress,
                                        )}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Frequency */}
                                <div>
                                    <Label className="text-xs font-semibold uppercase text-gray-500">
                                        Frequency
                                    </Label>
                                    <Select
                                        value={frequency}
                                        onValueChange={setFrequency}
                                        disabled={isLocked(
                                            selectedRow.progress,
                                        )}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-y-auto bg-white">
                                            <SelectItem value="28">
                                                Monthly (4 Weeks)
                                            </SelectItem>
                                            <SelectItem value="91">
                                                Quarterly (13 Weeks)
                                            </SelectItem>
                                            <SelectItem value="182">
                                                Semi-Annual (26 Weeks)
                                            </SelectItem>
                                            <SelectItem value="364">
                                                Annual (52 Weeks)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* PM Due — auto-calculated, live preview */}
                                <div>
                                    <Label className="text-xs font-semibold uppercase text-gray-500">
                                        PM Due (auto-calculated)
                                    </Label>
                                    <Input
                                        type="date"
                                        value={pmDue}
                                        readOnly
                                        className="pointer-events-none border-none"
                                    />
                                </div>

                                {/* Technician */}
                                <div>
                                    <Label className="text-xs font-semibold uppercase text-gray-500">
                                        Assigned Technician
                                    </Label>

                                    <Popover
                                        open={techOpen}
                                        onOpenChange={setTechOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="w-full justify-between mt-1"
                                                disabled={isLocked(
                                                    selectedRow.progress,
                                                )}
                                            >
                                                {technician ||
                                                    "Select technician"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-full p-0 bg-white">
                                            <Command>
                                                <CommandInput placeholder="Search technician..." />

                                                <CommandEmpty>
                                                    No technician found.
                                                </CommandEmpty>

                                                <CommandGroup className="max-h-60 overflow-y-auto">
                                                    {empList?.map((name) => (
                                                        <CommandItem
                                                            key={name}
                                                            value={name}
                                                            onSelect={(
                                                                value,
                                                            ) => {
                                                                setTechnician(
                                                                    value,
                                                                );
                                                                setTechOpen(
                                                                    false,
                                                                );
                                                            }}
                                                            className="cursor-pointer hover:bg-gray-200"
                                                        >
                                                            <Check
                                                                className={`mr-2 h-4 w-4 ${
                                                                    technician ===
                                                                    name
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                }`}
                                                            />
                                                            {name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Tech Platform Handle */}
                                <div>
                                    <Label className="text-xs font-semibold uppercase text-gray-500">
                                        Tech Handled
                                    </Label>
                                    <Select
                                        value={platform}
                                        onValueChange={setPlatform}
                                        disabled={isLocked(
                                            selectedRow.progress,
                                        )}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select platform" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-y-auto bg-white">
                                            {PLATFORM_OPTIONS.map((p) => (
                                                <SelectItem key={p} value={p}>
                                                    {p}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Checklist -> auto Status + Progress */}
                                <div>
                                    <Label className="text-xs font-semibold uppercase text-gray-500">
                                        Completion Checklist
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {Object.keys(checklist).map((key) => (
                                            <label
                                                key={key}
                                                className="flex gap-2 items-center text-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checklist[key]}
                                                    onChange={(e) =>
                                                        setChecklist({
                                                            ...checklist,
                                                            [key]: e.target
                                                                .checked,
                                                        })
                                                    }
                                                />
                                                {CHECKLIST_LABELS[key]}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Live Status + Progress bar */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">
                                            Status: {status}
                                        </span>
                                        <span className="text-gray-500">
                                            {progress}%
                                        </span>
                                    </div>
                                    <Progress value={progress} />
                                </div>

                                {/* Remarks */}
                                <div>
                                    <Label className="text-xs font-semibold uppercase text-gray-500">
                                        Remarks
                                    </Label>
                                    <Textarea
                                        value={remarks}
                                        onChange={(e) =>
                                            setRemarks(e.target.value)
                                        }
                                        placeholder="Add remarks..."
                                        className="mt-1"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    {canCreate && (
                                        <Button
                                            className="bg-red-500 hover:bg-red-600 text-white"
                                            onClick={() =>
                                                removeMachine(selectedRow.id)
                                            }
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button
                                        className={`bg-emerald-500 hover:bg-emerald-600 text-white ${
                                            !hasChecklistChanges
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                        onClick={saveChanges}
                                        disabled={!hasChecklistChanges}
                                    >
                                        <SaveCheck className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
