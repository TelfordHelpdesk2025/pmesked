<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MachineTracker extends Model
{
    protected $fillable = [
        'machine',
        'done_date',
        'frequency',
        'due_date',
        'tech',
        'platform',
        'remarks',
        'item_a',
        'item_b',
        'item_c',
        'item_d',
        'item_e',
    ];

    protected $casts = [
        'done_date' => 'date:Y-m-d',
        'due_date' => 'date:Y-m-d',
        'item_a' => 'boolean',
        'item_b' => 'boolean',
        'item_c' => 'boolean',
        'item_d' => 'boolean',
        'item_e' => 'boolean',
    ];

    // Computed fields are sent to the React page automatically
    protected $appends = ['progress', 'status'];

    public function getProgressAttribute(): float
    {
        $items = [$this->item_a, $this->item_b, $this->item_c, $this->item_d, $this->item_e];
        $checked = count(array_filter($items));

        return round(($checked / 5) * 100);
    }

    public function getStatusAttribute(): string
    {
        if ($this->progress >= 100) {
            return 'Done';
        }

        if ($this->due_date && $this->due_date->isPast()) {
            return 'Overdue';
        }

        return 'Pending';
    }
}
