<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NonTnrMachine extends Model
{
    protected $connection = 'server25';
    protected $table = 'machine_non_tnr_list';
}
