<?php

namespace App\Http\Controllers\Machine;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class MachineTrackerController extends Controller
{
    protected $datatable;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }

    public function index(Request $request)
{
    $empList = DB::connection('masterlist')
        ->table('employee_masterlist')
        ->where('ACCSTATUS', 1)
        ->where('DEPARTMENT', 'Equipment Engineering')
        ->pluck('EMPNAME');

    $machineList = DB::connection('server25')
        ->table('machine_list')
        ->pluck('machine_num');

    $existingMachines = DB::connection('mysql')
        ->table('machine_tracker')
        ->pluck('machine');

    $newMachines = $machineList->diff($existingMachines);

    $data = $newMachines->map(function ($machine) {
        return [
            'machine' => $machine,
            'progress' => 0,
            'remarks' => 'All activities are pending.',
            'status' => 'No progress yet.',
        ];
    })->toArray();

    // ✅ INSERT NEW MACHINES + HISTORY
    if (!empty($data)) {

        foreach ($data as $row) {

            $id = DB::connection('mysql')
                ->table('machine_tracker')
                ->insertGetId([
                    'machine' => $row['machine'],
                    'progress' => 0,
                    'remarks' => 'All activities are pending.',
                    'status' => 'No progress yet.',
                ]);

            DB::connection('mysql')
                ->table('machine_tracker_history')
                ->insert([
                    'machine_tracker_id' => $id,
                    'machine' => $row['machine'],
                    'remarks' => 'All activities are pending.',
                    'grr' => 0,
                    'checklist' => 0,
                    'report' => 0,
                    'backup' => 0,
                    'sticker' => 0,
                    'progress' => 0,
                    'status' => 'No progress yet.',
                    'action_type' => 'INSERT',
                    'updated_by' => 'Inserted by System',
                ]);
        }
    }

    // 🔥 AUTO DELETE COMPLETED (progress = 100)
    DB::connection('mysql')
        ->table('machine_tracker')
        ->where('progress', 100)
        ->delete();

    $result = $this->datatable->handle(
        $request,
        'mysql',
        'machine_tracker',
        [
            'conditions' => function ($query) {
                return $query->orderBy('status', 'asc');
            },
            'searchColumns' => [
                'machine',
                'pm_date',
                'frequency',
                'pm_due',
                'technician',
                'tech_platform_handle',
                'remarks',
                'status'
            ],
        ]
    );

    if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
        return $result;
    }

    return Inertia::render('Machine/MachineTracker', [
        'tableData' => $result['data'],
        'empList' => $empList,
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

    public function update(Request $request)
    {
        return DB::transaction(function () use ($request) {

            // 1. get current record (for history reference if needed)
            $current = DB::connection('mysql')
                ->table('machine_tracker')
                ->where('id', $request->id)
                ->first();

            // 2. update main table
            DB::connection('mysql')
                ->table('machine_tracker')
                ->where('id', $request->id)
                ->update([
                    'pm_date' => $request->pm_date,
                    'frequency' => $request->frequency,
                    'pm_due' => $request->pm_due,
                    'technician' => $request->technician,
                    'tech_platform_handle' => $request->tech_platform_handle,
                    'remarks' => $request->remarks,

                    'grr' => $request->grr,
                    'checklist' => $request->checklist,
                    'report' => $request->report,
                    'backup' => $request->backup,
                    'sticker' => $request->sticker,

                    'progress' => $request->progress,
                    'status' => $request->status,

                    'updated_by' => session('emp_data')['emp_name'] ?? null,
                    'updated_at' => now(),
                ]);

            // 3. insert history ONLY if update success
            DB::connection('mysql')
                ->table('machine_tracker_history')
                ->insert([
                    'machine_tracker_id' => $request->id,

                    'machine' => $current->machine ?? null,

                    'pm_date' => $request->pm_date,
                    'frequency' => $request->frequency,
                    'pm_due' => $request->pm_due,
                    'technician' => $request->technician,
                    'tech_platform_handle' => $request->tech_platform_handle,
                    'remarks' => $request->remarks,

                    'grr' => $request->grr,
                    'checklist' => $request->checklist,
                    'report' => $request->report,
                    'backup' => $request->backup,
                    'sticker' => $request->sticker,

                    'progress' => $request->progress,
                    'status' => $request->status,

                    'action_type' => 'UPDATE',
                    'updated_by' => session('emp_data')['emp_name'] ?? null,
                ]);

            return back()->with([
                'success' => 'Machine updated successfully.'
            ]);
        });
    }
}
