<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('machines', function (Blueprint $table) {
            $table->id();
            $table->string('machine')->unique();
            $table->date('done_date')->nullable();
            $table->unsignedInteger('frequency')->default(91); // days
            $table->date('due_date')->nullable();
            $table->string('tech')->nullable();
            $table->string('platform')->nullable();
            $table->text('remarks')->nullable();

            // Checklist items: GRR, Checklist, Report, Backup, Sticker
            $table->boolean('item_a')->default(false);
            $table->boolean('item_b')->default(false);
            $table->boolean('item_c')->default(false);
            $table->boolean('item_d')->default(false);
            $table->boolean('item_e')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('machines');
    }
};
