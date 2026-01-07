<?php

namespace App\Http\Controllers\nonTnr;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\GraniteChecklist;
use Illuminate\Support\Facades\Log;


class GraniteController extends Controller
{
    protected $datatable;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }

    public function index(Request $request)
    {
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
}
