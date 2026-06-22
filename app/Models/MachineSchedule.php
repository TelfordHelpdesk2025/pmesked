<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MachineSchedule extends Model
{
    protected $table = 'machine_scheduler_tbl';

    protected $connection = 'mysql';

    protected $fillable = [
        'machine_num',
        'title',
        'start_datetime',
        'end_datetime',
        'workweek',
        'remarks'
    ];
}
