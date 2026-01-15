<?php

namespace App\Http\Controllers\Ionizer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dthm;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class DthmController extends Controller
{
    public function index(Request $request)
    {

        $dthmList = DB::connection('server201')
            ->table('dthm_inventory_tbl')
            ->whereNotNull('eqpmnt_description')
            ->where('eqpmnt_description', '<>', '')
            ->whereNotIn('location', ['-', 'N/A'])
            ->whereNotNull('ip_address')
            ->where('ip_address', '<>', '-')
            ->whereRaw("LOWER(status) = ?", ['active'])
            ->orderBy('eqpmnt_control_no', 'asc')
            ->distinct()
            ->get();
        //


        $records = Dthm::orderBy('id', 'desc')->paginate(10);

        return Inertia::render('Calibration/DthmPage', [
            'records' => $records,
            'dthmList' => $dthmList,
            'filters' => $request->all(),
            'empData' => [
                'emp_id' => session('emp_data')['emp_id'] ?? null,
                'emp_name' => session('emp_data')['emp_name'] ?? null,
                'emp_jobtitle' => session('emp_data')['emp_jobtitle'] ?? null,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'control_no' => 'required|string|max:45',
            'ip_address' => 'required|string|max:45',
            'location' => 'required|string|max:45',
            'performed_by' => 'required|string|max:45',
            'cal_date' => 'required|string|max:45',
            'cal_due' => 'required|string|max:45',
            'recording_interval' => 'required|string|max:45',
            'temp_offset' => 'required|string|max:45',
            'rh_offset' => 'required|string|max:45',
            'sample_frequency' => 'required|string|max:45',
            'master_temp' => 'required|string|max:45',
            'master_humidity' => 'required|string|max:45',
            'test_temp' => 'required|string|max:45',
            'test_humidity' => 'required|string|max:45',
            'expand_temp' => 'required|string|max:45',
            'expand_humidity' => 'required|string|max:45',
            'qa_sign' => 'nullable|string|max:45',
            'qa_sign_date' => 'nullable|string|max:45',
        ]);

        $validated['created_at'] = now();
        $validated['updated_at'] = now();

        Dthm::create($validated);

        $control_no = $request->input('control_no');

        // DB::connection('server201')
        //     ->table('dthm_inventory_tbl')
        //     ->where('eqpmnt_control_no', $control_no)
        //     ->update([
        //         'eqpmnt_cal_date' => $validated['cal_date'],
        //         'eqpmnt_cal_due' => $validated['cal_due']
        //     ]);

        return redirect()->back()->with('success', '✅ Record added successfully!');
    }

    public function qaVerify(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:dthm_tbl,id',
        ]);

        $record = Dthm::findOrFail($request->id);

        $record->update([
            'qa_sign' => session('emp_data')['emp_name'] ?? 'QA',
            'qa_sign_date' => now()->format('m/d/Y h:i A'),
        ]);

        // return response()->json([
        //     'success' => true,
        //     'message' => 'QA verification completed.',
        // ]);
        return redirect()->back()->with('success', 'Calibration Report saved successfully!');
    }

    public function generatePdf($id)
    {
        // ✅ Get the calibration record
        $record = Dthm::findOrFail($id);

        // ✅ Pass data to the PDF view
        $pdf = Pdf::loadView('pdf.dthm', [
            'record' => $record
        ])->setPaper('A4', 'portrait');

        // ✅ Output (download or stream)
        return $pdf->stream('Thermohygrometer_Calibration_' . $record->control_no . '.pdf');
    }
}
