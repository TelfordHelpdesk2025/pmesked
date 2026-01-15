<?php

namespace App\Http\Controllers\nonTnr;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\GraniteChecklist;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class GraniteController extends Controller
{
    protected $datatable;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }

    public function index(Request $request)
    {

        $machines = DB::connection('server25')
            ->table('machine_list')
            ->select('machine_num', 'pmnt_no', 'serial', 'platform', 'machine_type')
            ->where('platform', 'Like', '%granite%')
            ->where('machine_type', 'Like', '%granite%')
            ->whereNotNull('machine_num')
            ->where('machine_num', '!=', '')
            ->where('machine_num', '!=', 'N/A')
            ->distinct()
            ->orderBy('platform', 'asc')
            ->get();



        $result = $this->datatable->handle(
            $request,
            'server201',
            'granite_tbl',
            [
                'searchColumns' => ['equipment', 'control_no', 'serial_no', 'performed_by', 'date_performed', 'due_date'],
            ]
        );

        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        return Inertia::render('Non-Tnr/GraniteChecklist', [
            'tableData' => $result['data'],
            'machines' => $machines,
            'tableFilters' => $request->only([
                'search',
                'perPage',
                'sortBy',
                'sortDirection',
                'start',
                'end',
                'dropdownSearchValue',
                'dropdownFields',
            ]),
        ]);
    }

    public function store(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'equipment' => 'required|string|max:45',
            'control_no' => 'nullable|string|max:45',
            'serial_no' => 'nullable|string|max:45',
            'performed_by' => 'nullable|string|max:45',
            'date_performed' => 'nullable|string|max:45',
            'due_date' => 'nullable|string|max:45',
            'procedure_specs' => 'nullable|string',
            'flatness_inspection' => 'nullable|string',
        ]);

        try {
            // Create using Eloquent model
            DB::connection('server201')->table('granite_tbl')->insert($validated);

            // Inertia-friendly redirect
            return redirect()->route('non-tnr.granite')
                ->with('success', 'Granite checklist saved successfully!');
        } catch (\Exception $e) {
            Log::error('Error saving granite checklist: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to save granite checklist: ' . $e->getMessage());
        }
    }

    public function verify(Request $request, $id)
    {
        $request->validate([
            'field' => 'required|string|in:senior_tech,qa_sign,second_eye_verifier',
            'verified_by' => 'required|string',
            'role' => 'required|string',
        ]);

        $granite = DB::connection('server201')->table('granite_tbl')->where('id', $id)->first();
        if (!$granite) {
            return response()->json(['message' => 'Granite record not found.'], 404);
        }

        $field = $request->field;
        $role = $request->role;

        // Role validation rules
        $allowedRoles = [
            'senior_tech' => ['pmtech', 'toolcrib', 'seniortech', 'tooling'],
            'qa_sign' => ['esd'],
            'second_eye_verifier' => ['engineer'],
        ];

        if (!in_array($role, $allowedRoles[$field])) {
            return response()->json(['message' => 'You are not authorized to verify this field.'], 403);
        }

        // Sequential verification
        if ($field === 'qa_sign' && empty($granite->senior_tech)) {
            return response()->json(['message' => 'Senior Tech verification required first.'], 400);
        }

        if ($field === 'second_eye_verifier' && (empty($granite->senior_tech) || empty($granite->qa_sign))) {
            return response()->json(['message' => 'Senior Tech and QA verification required first.'], 400);
        }

        // Update verification
        DB::connection('server201')->table('granite_tbl')
            ->where('id', $id)
            ->update([
                $field => $request->verified_by,
                $field . '_date_sign' => now(),
            ]);

        return response()->json([
            'message' => 'Verified successfully',
            'field' => $field,
            'verified_by' => $request->verified_by,
            'verified_at' => now(),
        ]);
    }

    public function pdf($id)
    {
        $granite = DB::connection('server201')
            ->table('granite_tbl')
            ->where('id', $id)
            ->first();

        if (!$granite || empty($granite->second_eye_verifier)) {
            abort(403);
        }

        $procedureSpecs = json_decode($granite->procedure_specs, true) ?? [];
        $flatness = json_decode($granite->flatness_inspection, true) ?? [];

        return Pdf::loadView('pdf.granite-checklist', compact(
            'granite',
            'procedureSpecs',
            'flatness'
        ))->setPaper('A4')->stream('granite.pdf');
    }
}
