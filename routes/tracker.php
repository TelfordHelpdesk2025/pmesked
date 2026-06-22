<?php

use App\Http\Controllers\Machine\MachineTrackerController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

$app_name = env('APP_NAME', '');

Route::redirect('/', "/$app_name");

Route::prefix($app_name)->middleware(AuthMiddleware::class)->group(function () {


Route::get('/machines/tracker', [MachineTrackerController::class, 'index'])->name('machines-tracker.index');
Route::patch('/machines/tracker/update',[MachineTrackerController::class, 'update'])->name('machine-tracker.update');
Route::delete('/machines/tracker/{machine}', [MachineTrackerController::class, 'destroy'])->name('machines-tracker.destroy');
});
