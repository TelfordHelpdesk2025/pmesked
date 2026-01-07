<?php

use App\Http\Controllers\General\AdminController;
use App\Http\Controllers\General\ProfileController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\nonTnr\GraniteController;

$app_name = env('APP_NAME', '');

Route::redirect('/', "/$app_name");

Route::prefix($app_name)->middleware(AuthMiddleware::class)->group(function () {
  Route::get("/granite-index", [GraniteController::class, 'index'])->name('non-tnr.granite');
  Route::post("/granite-save", [GraniteController::class, 'store'])->name('store.granite');
  Route::post("/granite-verify/{id}", [GraniteController::class, 'verify'])->name('verify.granite');

  Route::get('/granite/{id}/pdf', [GraniteController::class, 'pdf'])
    ->name('granite.pdf');
});
