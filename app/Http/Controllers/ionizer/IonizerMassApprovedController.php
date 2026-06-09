<?php

namespace App\Http\Controllers\ionizer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\IonizerChecklist;
use Illuminate\Support\Facades\Auth;

class IonizerMassApprovedController extends Controller
{
    // Main table view
    // public function index(Request $request)
    // {
    //     $ionizerReports = IonizerChecklist::orderByDesc('created_at')
    //         ->get();

    //     // Decode JSON fields para siguradong array
    //     $ionizerReports->transform(function ($report) {
    //         $report->check_item = is_string($report->check_item)
    //             ? json_decode($report->check_item, true) ?? []
    //             : ($report->check_item ?? []);

    //         $report->verification_reading = is_string($report->verification_reading)
    //             ? json_decode($report->verification_reading, true) ?? []
    //             : ($report->verification_reading ?? []);

    //         $report->std_use_verification = is_string($report->std_use_verification)
    //             ? json_decode($report->std_use_verification, true) ?? []
    //             : ($report->std_use_verification ?? []);

    //         return $report;
    //     });

    //     // dd($ionizerReports);

    //     return Inertia::render('Ionizer/MassApprovalIonizerChecklist', [
    //         'ionizerReports' => $ionizerReports,
    //         'empData' => [
    //             'emp_id' => session('emp_data')['emp_id'] ?? null,
    //             'emp_name' => session('emp_data')['emp_name'] ?? null,
    //             'emp_jobtitle' => session('emp_data')['emp_jobtitle'] ?? null,
    //             'emp_role' => session('emp_data')['emp_role'] ?? null,
    //         ],
    //     ]);
    // }

    public function index()
    {
        $empData = session('emp_data');
        $role = $empData['emp_jobtitle'] ?? null;

        // QUERY BUILDER (DO NOT CALL get() YET)
        $query = IonizerChecklist::orderByDesc('created_at');

        /**
         * ROLE: TECHNICIANS (waiting for tech_sign)
         */
        if (in_array($role, [
            'Senior Equipment Technician',
            'Equipment Technician 1',
            'Equipment Technician 2',
            'Equipment Technician 3',
            'PM Technician 1',
            'PM Technician 2',
            'Equipment Engineer',
            'Supervisor - Equipment Technician',
            'Senior Equipment Engineer',
            'Sr. Equipment Engineer',
            'Equipment Engineering Section Head',
            'Section Head - Equipment Engineering',
        ])) {
            $query->where(function ($q) {
                $q->whereNull('tech_sign')
                    ->orWhere('tech_sign', '');
            });

            /**
             * ROLE: QA / ESD (tech signed but waiting QA sign)
             */
        } elseif (in_array($role, [
            'ESD Technician 1',
            'ESD Technician 2',
            'Senior QA Engineer',
            'DIC Clerk 1',
        ])) {
            $query->where(function ($q) {
                $q->whereNotNull('tech_sign')
                    ->where('tech_sign', '!=', '');
            })->where(function ($q) {
                $q->whereNull('qa_sign')
                    ->orWhere('qa_sign', '');
            });
        }

        /**
         * EXECUTE QUERY
         */
        $ionizerReports = $query->get();

        /**
         * SAFE JSON DECODER HELPER (inline version)
         */
        $ionizerReports->transform(function ($report) {

            $report->check_item = is_string($report->check_item)
                ? json_decode($report->check_item, true) ?? []
                : ($report->check_item ?? []);

            $report->verification_reading = is_string($report->verification_reading)
                ? json_decode($report->verification_reading, true) ?? []
                : ($report->verification_reading ?? []);

            $report->std_use_verification = is_string($report->std_use_verification)
                ? json_decode($report->std_use_verification, true) ?? []
                : ($report->std_use_verification ?? []);

            return $report;
        });

        return Inertia::render('Ionizer/MassApprovalIonizerChecklist', [
            'ionizerReports' => $ionizerReports,
            'empData' => $empData,
        ]);
    }



    // Technician bulk verify
    public function techVerify(Request $request)
    {
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return response()->json(['success' => false, 'message' => 'No reports selected.']);
        }

        IonizerChecklist::whereIn('id', $ids)->update([
            'tech_sign' => session('emp_data')['emp_name'] ?? null,
            'tech_sign_date' => now(),
        ]);

        return redirect()->back()->with('success', 'Technician verification complete.');
    }

    // QA bulk verify
    public function qaVerify(Request $request)
    {
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return response()->json(['success' => false, 'message' => 'No reports selected.']);
        }

        IonizerChecklist::whereIn('id', $ids)->update([
            'qa_sign' => session('emp_data')['emp_name'] ?? null,
            'qa_sign_date' => now(),
        ]);

        return redirect()->back()->with('success', 'QA verification complete.');
    }

    // PDF download (optional)
    public function downloadPDF($id)
    {
        $report = IonizerChecklist::findOrFail($id);

        // Placeholder — integrate your PDF export here
        return response()->download(storage_path("app/public/pdf/ionizer_report_{$id}.pdf"));
    }
}
