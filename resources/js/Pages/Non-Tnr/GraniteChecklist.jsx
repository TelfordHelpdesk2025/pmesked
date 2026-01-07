import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import { useState, useEffect } from "react";


export default function GraniteChecklist({ tableData, tableFilters, emp_data }) {
    const [showModal, setShowModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);


    // Header form state
    // Helper function para i-format ang date sa MM/DD/YYYY
const formatDateMMDDYYYY = (date) => {
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // month starts from 0
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
};

// Current date
const today = new Date();
const formattedToday = formatDateMMDDYYYY(today);

// 1 year from now
const nextYear = new Date();
nextYear.setFullYear(today.getFullYear() + 1);
const formattedNextYear = formatDateMMDDYYYY(nextYear);

const [formData, setFormData] = useState({
    equipment: "",
    control_no: "",
    serial_no: "",
    performed_by: emp_data?.emp_name || "",
    date_performed: formattedToday,  // current date MM/DD/YYYY
    due_date: formattedNextYear,     // 1 year from now MM/DD/YYYY
});


    // Checklist table state
    const [checklist, setChecklist] = useState([
        { no: 1, item: "Top table", req: "Clean / No Dirt / No scratch", activity: "A, B", actual: "", freq: "A", remarks: "" },
        { no: 2, item: "Loose Screw", req: "No loose screw", activity: "D", actual: "", freq: "A", remarks: "" },
        { no: 3, item: "Rotation of Plate", req: "Rotate at 180 Degree", activity: "E", actual: "", freq: "A", remarks: "" },
        { no: 4, item: "Table Footings", req: "Fix / Stable", activity: "A, B, E, H", actual: "", freq: "A", remarks: "" },
    ]);

    // Flatness table state
    const [flatness, setFlatness] = useState([
        { no: 1, point: "POINT 1", required: "0.0 ±0.005mm", actual: "", result: "", remarks: "" },
        { no: 2, point: "POINT 2", required: "0.0 ±0.005mm", actual: "", result: "", remarks: "" },
        { no: 3, point: "POINT 3", required: "0.0 ±0.005mm", actual: "", result: "", remarks: "" },
        { no: 4, point: "POINT 4", required: "0.0 ±0.005mm", actual: "", result: "", remarks: "" },
        { no: 5, point: "MAX-MIN", required: "0.0 ±0.005mm", actual: "", result: "", remarks: "" },
    ]);

    // Close modal on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setShowModal(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    // Header input handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Checklist cell handler
    const handleChecklistChange = (index, field, value) => {
        const updated = [...checklist];
        updated[index][field] = value;
        setChecklist(updated);
    };

    // Flatness cell handler
    const handleFlatnessChange = (index, field, value) => {
        const updated = [...flatness];
        updated[index][field] = value;

        // Optionally calculate Pass/Fail based on required vs actual
        if (field === "actual") {
            const required = parseFloat(updated[index].required.split(" ")[0]);
            const actualVal = parseFloat(value) || 0;
            updated[index].result = Math.abs(actualVal - required) <= 0.005 ? "Pass" : "Fail";
        }

        setFlatness(updated);
    };

    // Save function
const handleSave = (e) => {
    e.preventDefault();

    // Required: equipment field check
    if (!formData.equipment) {
        alert("Equipment field is required");
        return;
    }

    // Prepare payload
    const payload = {
        ...formData,
        procedure_specs: JSON.stringify(checklist),
        flatness_inspection: JSON.stringify(flatness),
    };

    // Submit using Inertia router.post
    router.post(route("store.granite"), payload, {
        onSuccess: () => {
            setShowModal(false);
            alert("✅ Granite checklist saved successfully!");

            // Reset header form
            setFormData({
                equipment: "",
                control_no: "",
                serial_no: "",
                performed_by: "",
                date_performed: "",
                due_date: "",
            });

            // Reset checklist and flatness tables
            setChecklist(checklist.map(item => ({ ...item, actual: "", remarks: "" })));
            setFlatness(flatness.map(item => ({ ...item, actual: "", result: "", remarks: "" })));
        },
        onError: (errors) => {
            console.error("Validation or server error:", errors);
            alert("❌ Error saving checklist. Check console for details.");
        },
    });
};

// Action buttons kasama ang Edit
const dataWithAction = tableData.data.map((r) => ({
  ...r,
  action: (
    <div className="flex gap-2">
      {/* View Button */}
      <button
  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
  onClick={() => {
    setSelectedReport(r);
    setViewModal(true);
  }}
>
  <i className="fas fa-eye"></i> View
</button>

    </div>
  ),
}));



    return (
        <AuthenticatedLayout>
            <Head title="Granite Checklist" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                    <i className="fa-regular fa-gem"></i> Granite Table
                </h1>

                <button
                    className="text-white bg-emerald-500 btn hover:bg-emerald-700"
                    onClick={() => setShowModal(true)}
                >
                    <i className="fa-solid fa-plus"></i> New Granite
                </button>
            </div>

            <DataTable
                columns={[
                    { key: "equipment", label: "Equipment" },
                    { key: "control_no", label: "Control No." },
                    { key: "serial_no", label: "Serial No" },
                    { key: "performed_by", label: "Performed By" },
                    { key: "date_performed", label: "Date Performed" },
                    { key: "due_date", label: "Due Date" },
                    { key: "action", label: "Action"},
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
                routeName={route("non-tnr.granite")}
                filters={tableFilters}
                rowKey="id"
                showExport={false}
            />

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowModal(false)}
                    />

                    <div className="relative bg-white w-[60vw] h-[95vh] rounded-none shadow-xl flex flex-col">
                        {/* Header */}
                        <div className="flex justify-end items-center p-4 border-b">
                            <button
                                className="text-red-500 hover:text-red-700 font-bold"
                                onClick={() => setShowModal(false)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="p-6 text-black text-sm font-sans">
                                {/* Title */}
                                <div className="text-center mb-4">
                                    <h1 className="text-3xl font-bold text-orange-700">GRANITE TABLE</h1>
                                    <h2 className="text-lg">PREVENTIVE MAINTENANCE CHECKLIST</h2>
                                </div>

                                {/* Header Inputs */}
                                <table className="w-half border border-black mb-4">
                                    <tbody>
                                        {[
                                            { label: "MACHINE NUMBER", name: "equipment" },
                                            { label: "CONTROL NUMBER", name: "control_no" },
                                            { label: "SERIAL NUMBER", name: "serial_no" },
                                            { label: "PERFORMED BY", name: "performed_by" },
                                            { label: "DATE PERFORMED", name: "date_performed" },
                                            { label: "DUE DATE", name: "due_date" },
                                        ].map((field, i) => (
                                            <tr key={i}>
                                                <td className="border border-black px-2 py-1 font-semibold w-1/3">{field.label} :</td>
                                                <td className="border border-black px-2 py-1">
                                                    <input
                                                        type="text"
                                                        name={field.name}
                                                        value={formData[field.name]}
                                                        onChange={handleChange}
                                                        className="w-full border px-1 py-1 border-gray-400 rounded-md"
                                                        readOnly={["performed_by", "date_performed", "due_date"].includes(field.name)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <p className="font-semibold mb-2">REFERENCE PM PROCEDURE SPECIFICATION : TFP05-001</p>

                                {/* Checklist Table */}
                                <table className="w-full border border-black mb-4">
                                    <thead>
                                        <tr className="font-semibold text-center">
                                            <th className="border border-black">NO.</th>
                                            <th className="border border-black">ASSEMBLY ITEM</th>
                                            <th className="border border-black">REQUIREMENTS</th>
                                            <th className="border border-black">ACTIVITY</th>
                                            <th className="border border-black">ACTUAL</th>
                                            <th className="border border-black">FREQ</th>
                                            <th className="border border-black">REMARKS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {checklist.map((row, i) => (
                                            <tr key={i}>
                                                <td className="border border-black text-center">{row.no}</td>
                                                <td className="border border-black">{row.item}</td>
                                                <td className="border border-black">{row.req}</td>
                                                <td className="border border-black text-center">{row.activity}</td>
                                                <td className="border border-black px-1">
                                                    <input
                                                        type="text"
                                                        value={row.actual}
                                                        onChange={(e) => handleChecklistChange(i, "actual", e.target.value)}
                                                        className="w-full border px-1 py-1 border-gray-400 rounded-md"
                                                    />
                                                </td>
                                                <td className="border border-black text-center px-1">
                                                   {row.freq}
                                                </td>
                                                <td className="border border-black px-1">
                                                    <input
                                                        type="text"
                                                        value={row.remarks}
                                                        onChange={(e) => handleChecklistChange(i, "remarks", e.target.value)}
                                                        className="w-full border px-1 py-1 border-gray-400 rounded-md"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Flatness Table */}
                                <h3 className="text-center font-bold mb-2">FLATNESS INSPECTION DETAILS</h3>
                                <table className="w-full border border-black mb-4">
                                    <thead>
                                        <tr className="font-semibold text-center">
                                            <th className="border border-black">NO.</th>
                                            <th className="border border-black">FLATNESS CHECK (Granite Grade B)</th>
                                            <th className="border border-black">IMAGE REFERENCE</th>
                                            <th className="border border-black">REQUIRED VALUE</th>
                                            <th className="border border-black">ACTUAL</th>
                                            <th className="border border-black">RESULT (Pass / Fail)</th>
                                            <th className="border border-black">REMARKS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {flatness.map((row, i) => (
                                            <tr key={i}>
                                                <td className="border border-black text-center">{row.no}</td>
                                                <td className="border border-black">{row.point}</td>
                                                {i === 0 && (
                                                    <td className="border border-black text-center align-middle" rowSpan={5}>
                                                        <img src="/images/granite_image.png" alt="Granite Flatness Reference" className="mx-auto h-28 object-contain"/>
                                                    </td>
                                                )}
                                                <td className="border border-black text-center">{row.required}</td>
                                                <td className="border border-black px-1">
                                                    <input
                                                        type="text"
                                                        value={row.actual}
                                                        onChange={(e) => handleFlatnessChange(i, "actual", e.target.value)}
                                                        className="w-full border px-1 py-1 border-gray-400 rounded-md"
                                                    />
                                                </td>
                                                <td className="border border-black text-center px-1">
                                                    <input
                                                        type="text"
                                                        value={row.result}
                                                        onChange={(e) => handleFlatnessChange(i, "result", e.target.value)}
                                                        className="w-full border px-1 py-1 text-center border-gray-400 rounded-md"
                                                    />
                                                </td>
                                                <td className="border border-black px-1">
                                                    <input
                                                        type="text"
                                                        value={row.remarks}
                                                        onChange={(e) => handleFlatnessChange(i, "remarks", e.target.value)}
                                                        className="w-full border px-1 py-1 border-gray-400 rounded-md"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Legend */}
                                <div className="text-xs">
                                    <p><strong>LEGEND:</strong> M = Monthly; Q = Quarterly; S = Semi-Annually; A = Annually</p>
                                    <p><strong>ACTIVITY CODE:</strong> A-Check; B-Clean; C-Lubricate; D-Adjust; E-Align; F-Calibrate; G-Modify; H-Repair; I-Replace; J-Refill; K-Drain; L-Measure; M-Scan/Disk Defragment; N-Change Oil; NA-Not Applicable</p>
                                    <p className="text-right mt-2">TELFORD SVC. PHILS., INC. — Maint-75 (Rev.1)</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 p-4 border-t">
                            <button
                                className="text-white bg-red-500 btn hover:bg-red-700"
                                onClick={() => setShowModal(false)}
                            >
                                <i className="fa-solid fa-xmark"></i> Cancel
                            </button>
                            <button
                                className="text-white bg-green-600 btn hover:bg-green-700"
                                onClick={handleSave}
                            >
                                <i className="fa-solid fa-save"></i> Save Checklist
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/*** View Modal **/}
{viewModal && selectedReport && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/50"
      onClick={() => setViewModal(false)}
    />

    <div className="relative bg-white w-[60vw] h-[95vh] shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex justify-end items-center p-4 border-b">
        
        <button
          className="text-red-500 hover:text-red-700 font-bold"
          onClick={() => setViewModal(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
       <div className="p-6 text-black text-sm font-sans">
  {/* Title */}
  <div className="text-center mb-4">
    <h1 className="text-3xl font-bold text-orange-700">
      GRANITE TABLE
    </h1>
    <h2 className="text-lg">
      PREVENTIVE MAINTENANCE CHECKLIST
    </h2>
  </div>

  {/* Header */}
  <table className="w-half border border-black mb-4">
    <tbody>
      {[
        ["MACHINE NUMBER", selectedReport.equipment],
        ["CONTROL NUMBER", selectedReport.control_no],
        ["SERIAL NUMBER", selectedReport.serial_no],
        ["PERFORMED BY", selectedReport.performed_by],
        ["DATE PERFORMED", selectedReport.date_performed],
        ["DUE DATE", selectedReport.due_date],
      ].map(([label, value], i) => (
        <tr key={i}>
          <td className="border border-black px-2 py-1 font-semibold w-1/3">
            {label} :
          </td>
          <td className="border border-black px-2 py-1">
            {value || "\u00A0"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  <p className="font-semibold mb-2">
    REFERENCE PM PROCEDURE SPECIFICATION : TFP05-001
  </p>

  {/* Checklist */}
  <table className="w-full border border-black mb-4">
    <thead>
      <tr className="font-semibold text-center">
        <th className="border border-black">NO.</th>
        <th className="border border-black">ASSEMBLY ITEM</th>
        <th className="border border-black">REQUIREMENTS</th>
        <th className="border border-black">ACTIVITY</th>
        <th className="border border-black">ACTUAL</th>
        <th className="border border-black">FREQ</th>
        <th className="border border-black">REMARKS</th>
      </tr>
    </thead>
    <tbody>
      {JSON.parse(selectedReport.procedure_specs || "[]").map((row, i) => (
        <tr key={i}>
          <td className="border border-black text-center">{i + 1}</td>
          <td className="border border-black">{row.item}</td>
          <td className="border border-black">{row.req}</td>
          <td className="border border-black text-center">{row.activity}</td>
          <td className="border border-black">{row.actual}</td>
          <td className="border border-black text-center">{row.freq}</td>
          <td className="border border-black">{row.remarks}</td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Flatness */}
  <h3 className="text-center font-bold mb-2">
    FLATNESS INSPECTION DETAILS
  </h3>

  <table className="w-full border border-black mb-4">
    <thead>
      <tr className="font-semibold text-center">
        <th className="border border-black">NO.</th>
        <th className="border border-black">
          FLATNESS CHECK (Granite Grade B)
        </th>
        <th className="border border-black">IMAGE REFERENCE</th>
        <th className="border border-black">REQUIRED VALUE</th>
        <th className="border border-black">ACTUAL</th>
        <th className="border border-black">
          RESULT (Pass / Fail)
        </th>
        <th className="border border-black">REMARKS</th>
      </tr>
    </thead>
    <tbody>
      {JSON.parse(selectedReport.flatness_inspection || "[]")
        .slice(0, 4)
        .map((row, i) => (
          <tr key={i}>
            <td className="border border-black text-center">{row.no}</td>
            <td className="border border-black">{row.point}</td>

            {i === 0 && (
              <td
                className="border border-black text-center align-middle"
                rowSpan={5}
              >
                <img
                  src="/images/granite_image.png"
                  className="mx-auto h-28 object-contain"
                />
              </td>
            )}

            <td className="border border-black text-center">
              {row.required}
            </td>
            <td className="border border-black">{row.actual}mm</td>
            <td className="border border-black text-center">{row.result}</td>
            <td className="border border-black">{row.remarks}</td>
          </tr>
        ))}

      {/* MAX - MIN */}
      {JSON.parse(selectedReport.flatness_inspection || "[]")
        .slice(4, 5)
        .map((row, i) => (
          <tr key={i}>
            <td className="border border-black text-center">5</td>
            <td className="border border-black">
              FLATNESS (MAX - MIN)
            </td>
            <td className="border border-black text-center">
              {row.required}
            </td>
            <td className="border border-black">{row.actual}mm</td>
            <td className="border border-black text-center">{row.result}</td>
            <td className="border border-black">{row.remarks}</td>
          </tr>
        ))}
    </tbody>
  </table>

{/* Verification */}
<div className="flex justify-end">
  <table className="w-1/2 mb-4 text-sm">

  <tbody>
    <tr>
      {/* Left title */}
      <td
        className="border-r border-black font-semibold text-center align-middle"
        rowSpan={3}
      >
        VERIFIED BY:
      </td>

      {/* Right rows */}
      <td className="border border-black px-3 py-2">
        Technician: {selectedReport.senior_tech || "Pending..."}
      </td>
    </tr>

    <tr>
      <td className="border border-black px-3 py-2">
        QA: {selectedReport.qa_sign || "Pending..."}
      </td>
    </tr>

    <tr>
      <td className="border border-black px-3 py-2">
        Second Eye Verifier: {selectedReport.second_eye_verifier || "Pending..."}
      </td>
    </tr>
  </tbody>
</table>
</div>


 {/* Legend */}
<table className="w-full border border-black text-xs">
  <tbody>
    <tr>
      <td className="border border-black font-semibold w-1/5 px-2 py-1">
        LEGEND
      </td>
      <td className="border border-black px-2 py-1">
        M = Monthly; Q = Quarterly; S = Semi-Annually; A = Annually
      </td>
    </tr>

    <tr>
      <td className="border border-black font-semibold px-2 py-1">
        ACTIVITY CODE
      </td>
      <td className="border border-black px-2 py-1">
        A-Check; B-Clean; C-Lubricate; D-Adjust; E-Align; F-Calibrate;
        G-Modify; H-Repair; I-Replace; J-Refill; K-Drain; L-Measure;
        M-Scan/Disk Defragment; N-Change Oil; NA-Not Applicable
      </td>
    </tr>

    <tr>
      <td
        className="border border-black px-2 py-1 text-right font-semibold"
        colSpan={2}
      >
        TELFORD SVC. PHILS., INC. — Maint-75 (Rev.1)
      </td>
    </tr>
  </tbody>
</table>

</div>

      </div>

      {/* Footer */}
      <div className="flex justify-end p-4 border-t">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={() => setViewModal(false)}
        >
          <i className="fa fa-close"></i> Close
        </button>
      </div>
    </div>
  </div>
)}

        </AuthenticatedLayout>
    );
}
