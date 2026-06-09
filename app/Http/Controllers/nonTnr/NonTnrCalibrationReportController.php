<?php

namespace App\Http\Controllers\nonTnr;

use App\Http\Controllers\Controller;
use App\Models\NonTnrMachine;
use App\Models\NonTnrCalibrationReport;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class NonTnrCalibrationReportController extends Controller
{
    // 📌 Inertia page (UI)
    public function index()
    {
        $reports = NonTnrCalibrationReport::query()
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        $machines = NonTnrMachine::select('*')
            ->whereNotNull('machine_num')
            ->where('machine_num', '!=', '')
            ->whereIn('remarks', ['Active', 'ACTIVE', 'active'])
            ->whereIn('pmnt_no', function ($query) {
                $query->select('pmnt_no')
                    ->from('machine_non_tnr_list')
                    ->groupBy('pmnt_no')
                    ->havingRaw('COUNT(*) = 1');
            })
            ->distinct()
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Calibration/NonTnrCalibrationReport', [
            'reports' => $reports,
            'machines' => $machines,
            'filters' => request()->all('search', 'sortBy', 'sortDirection'),
            'empData' => [
                'emp_id'   => session('emp_data')['emp_id'] ?? null,
                'emp_name' => session('emp_data')['emp_name'] ?? null,
                'emp_jobtitle' => session('emp_data')['emp_jobtitle'] ?? null
            ],
        ]);
    }

    // 📌 API: List (for DataTable / API use)
    public function list()
    {
        return response()->json(
            NonTnrCalibrationReport::orderBy('id', 'desc')->get()
        );
    }

    // 📌 Store
    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment' => 'required|string',
            'model' => 'nullable|string',
            'serial' => 'nullable|string',
            'control_no' => 'nullable|string',
            'manufacturer' => 'nullable|string',
            'calibration_date' => 'required|string',
            'calibration_due' => 'nullable|string',
            'performed_by' => 'required|string',
            'temperature' => 'nullable|string',
            'relative_humidity' => 'nullable|string',
            'specs' => 'nullable|string',
            'report_no' => 'nullable|string',
            'cal_interval' => 'nullable|string',
            'cal_std_use' => 'nullable|array',
            'cal_details' => 'nullable|array',
        ]);

        NonTnrCalibrationReport::create($validated);

        return redirect()->back()->with('success', 'nOn-TNR Calibration Report saved successfully!');
    }


    // 📌 Show
    public function show(NonTnrCalibrationReport $NonTnrCalibrationReport)
    {
        return response()->json($NonTnrCalibrationReport);
    }

    // 📌 Update
    public function update(Request $request, NonTnrCalibrationReport $NonTnrCalibrationReport)
    {
        $data = $this->validateData($request);
        $NonTnrCalibrationReport->update($data);

        return response()->json($NonTnrCalibrationReport);
    }

    // 📌 Delete
    public function destroy($id)
    {
        // Gamit ang custom connection/table
        DB::connection('mysql')->table('calibration_report_list_non_tnr')->where('id', $id)->delete();

        // Return Inertia redirect para hindi mag-error
        return redirect()->back()->with('success', '✅ Report removed successfully!!');
    }

    // 📌 Validation rules (shared by store & update)
    protected function validateData(Request $request)
    {
        return $request->validate([
            'equipment' => 'required|string|max:255',
            'model' => 'nullable|string|max:255',
            'serial' => 'nullable|string|max:255',
            'manufacturer' => 'nullable|string|max:255',
            'control_no' => 'nullable|string|max:255',
            'calibration_date' => 'nullable|string|max:255',
            'calibration_due' => 'nullable|string|max:255',
            'performed_by' => 'nullable|string|max:255',
            'temperature' => 'nullable|string|max:255',
            'relative_humidity' => 'nullable|string|max:255',
            'specs' => 'nullable|string|max:255',
            'report_no' => 'nullable|string|max:255',
            'cal_interval' => 'nullable|string|max:255',

            // ✅ allow arrays
            'cal_std_use' => 'nullable|array',
            'cal_details' => 'nullable|array',
        ]);
    }

    public function verifyQA(NonTnrCalibrationReport $report)
    {
        $report->qa_sign = session('emp_data')['emp_name'] ?? null;
        $report->qa_sign_date = now();
        $report->save();

        return back()->with([
            'success' => 'Report verified by QA!',
            'updatedReport' => $report
        ]);
    }

    public function verifyReviewer(NonTnrCalibrationReport $report)
    {
        $report->review_by = session('emp_data')['emp_name'] ?? null;
        $report->review_date = now();
        $report->save();

        return back()->with([
            'success' => 'Report verified by Reviewer!',
            'updatedReport' => $report
        ]);
    }

    public function viewPdf($id)
    {
        $calibration = NonTnrCalibrationReport::findOrFail($id);

        $cal_std_use = $calibration->cal_std_use ? json_decode($calibration->cal_std_use, true) : [];
        $cal_details = $calibration->cal_details ? json_decode($calibration->cal_details, true) : [];

        $pdf = Pdf::loadView('pdf.calibration', [
            'report'  => $calibration,
            'calibration'  => $calibration,
            'cal_std_use'  => $cal_std_use,
            'cal_details'  => $cal_details,
        ]);

        return $pdf->stream("calibration_$id.pdf");
    }
}
