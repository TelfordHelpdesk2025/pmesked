
import { usePage, Link } from "@inertiajs/react";
import {
    LayoutDashboard,
    ClipboardCheck,
    CalendarDays,
    FileCheck,
    ClipboardList,
    Fan,
    ListChecks,
    BadgeCheck,
    Users,
    Square,
    FileText,
    CheckSquare,
    List,
    Table2,
    Pin,
} from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";

import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";

function NavItem({ href, label, Icon }) {
    return (
        <Button
            asChild
            variant="ghost"
            className="w-full justify-start"
        >
            <Link href={href}>
                <Icon className="mr-2 h-4 w-4" />
                {label}
            </Link>
        </Button>
    );
}

function NavGroup({ label, Icon, links }) {
    return (
        <Collapsible>
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="ml-6 space-y-1 pt-1">
                {links.map((link) => (
                    <NavItem
                        key={link.label}
                        href={link.href}
                        label={link.label}
                        Icon={Square}
                    />
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}

export default function NavLinks() {
    const { emp_data } = usePage().props;

    console.log("emp_data", emp_data);

    const role = emp_data?.emp_role;
    const empId = String(emp_data?.emp_id ?? "");

    const isPMRole = [
        "pmtech",
        "toolcrib",
        "seniortech",
        "engineer",
    ].includes(role);

    const isESDOrEngineer = [
        "esd",
        "engineer",
    ].includes(role);

    const menus = [
        {
            type: "item",
            label: "Dashboard",
            icon: LayoutDashboard,
            href: route("dashboard"),
        },

        // {
        //     type: "item",
        //     label: "PM/Cal Tracker",
        //     icon: Pin,
        //     href: route("machines-tracker.index"),
        // },

        isPMRole && {
            type: "group",
            label: "TNR",
            icon: FileCheck,
            links: [
                {
                    type: "item",
                    label: "Granite Checklist",
                    icon: ClipboardCheck,
                    href: route("non-tnr.granite"),
                },
                {
                    label: "TNR Checklist",
                    href: route("tnr.schedulerTable"),
                },
                {
                    label: "TNR Calibration Report",
                    href: route("calibration.calibrationReport"),
                },
            ],
        },

        role === "seniortech" && {
            type: "item",
            label: "TNR Mass Approved",
            icon: ListChecks,
            href: route("tnr.massApproved"),
        },

        isPMRole && {
            type: "group",
            label: "Non-TNR",
            icon: ClipboardList,
            links: [
                {
                    label: "Checklist",
                    href: route("non-tnr-checklists.index"),
                },
                {
                    label: "Calibration Report",
                    href: route("calibration.calibrationReportNontnr"),
                },
                {
                    label: "Bake Calibration Report",
                    href: route("bake.calibration.index"),
                },
            ],
        },

        role === "seniortech" && {
            type: "item",
            label: "Non-TNR Mass Approved",
            icon: BadgeCheck,
            href: route("non_tnr.mass.index"),
        },

        isPMRole && {
            type: "group",
            label: "Air Ionizer",
            icon: Fan,
            links: [
                {
                    label: "Checklist",
                    href: route("ionizer.index"),
                },
                {
                    label: "DTHM Calibration Report",
                    href: route("calibration.IonizerCalibrationReport"),
                },
                {
                    label: "DTHM",
                    href: route("calibration.dthm.index"),
                },
            ],
        },

        role === "seniortech" && {
            type: "item",
            label: "Ionizer Mass Approved",
            icon: CheckSquare,
            href: route("ionizer.mass.index"),
        },

        role === "esd" && {
            type: "item",
            label: "DTHM",
            icon: List,
            href: route("calibration.dthm.index"),
        },

        empId === "1788" && {
            type: "item",
            label: "Bake Calibration Report",
            icon: FileText,
            href: route("bake.calibration.index"),
        },

        isESDOrEngineer && {
            type: "group",
            label: "TNR Mass Approved",
            icon: FileCheck,
            links: [
                {
                    label: "TNR Checklist",
                    href: route("tnr.massApproved"),
                },
                {
                    label: "TNR Calibration Report",
                    href: route("calibration.tnr.mass.approval"),
                },
            ],
        },

        isESDOrEngineer && {
            type: "group",
            label: "Non-TNR Mass Approved",
            icon: ClipboardList,
            links: [
                {
                    label: "Non-TNR Checklist",
                    href: route("non_tnr.mass.index"),
                },
                {
                    label: "Non-TNR Calibration Report",
                    href: route("calibration.non-tnr.mass.approval"),
                },
            ],
        },

        isESDOrEngineer && {
            type: "group",
            label: "Ionizer Mass Approved",
            icon: Fan,
            links: [
                {
                    label: "Ionizer Checklist",
                    href: route("ionizer.mass.index"),
                },
                {
                    label: "DTHM Calibration Report",
                    href: route("ionizer.ionizer.mass.approval"),
                },
            ],
        },

        ["1742", "1788"].includes(empId) && {
            type: "item",
            label: "TNR PM Checklist Items",
            icon: List,
            href: route("calibration.index"),
        },

        ["17807", "1788"].includes(empId) && {
            type: "item",
            label: "Ionizer Checklist Items",
            icon: Table2,
            href: route("ionizer-items.index"),
        },

        ["1088", "1788", "1638"].includes(empId) && {
            type: "item",
            label: "Non-TNR Checklist Items",
            icon: Table2,
            href: route("non-tnr-items.index"),
        },

        (["superadmin", "admin", "engineer"].includes(role) ||
            (role === "pmtech" && empId === "1742")) && {
            type: "item",
            label: "PM Personnel",
            icon: Users,
            href: route("admin"),
        },
    ].filter(Boolean);

    return (
        <ScrollArea className="h-full">
            <nav className="space-y-1 p-2">
                {menus.map((menu) =>
                    menu.type === "group" ? (
                        <NavGroup
                            key={menu.label}
                            label={menu.label}
                            Icon={menu.icon}
                            links={menu.links}
                        />
                    ) : (
                        <NavItem
                            key={menu.label}
                            href={menu.href}
                            label={menu.label}
                            Icon={menu.icon}
                        />
                    ),
                )}
            </nav>
        </ScrollArea>
    );
}
