<?php

use App\Http\Controllers\ionizer\IonizerMassApprovedController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

$app_name = env('APP_NAME', '');

Route::redirect('/', "/$app_name");

Route::prefix($app_name)->middleware(AuthMiddleware::class)->group(function () {


    Route::get('/ionizer/mass-approve', [IonizerMassApprovedController::class, 'index'])->name('ionizer.mass.index');
    Route::post('/ionizer/tech-verify', [IonizerMassApprovedController::class, 'techVerify'])->name('ionizer.tech.verify');
    Route::post('/ionizer/qa-verify', [IonizerMassApprovedController::class, 'qaVerify'])->name('ionizer.qa.verify');
});
