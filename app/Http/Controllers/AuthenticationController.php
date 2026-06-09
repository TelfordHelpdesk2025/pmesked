<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthenticationController extends Controller
{
    public function setSession(Request $request)
    {
        $token = $request->input('queryToken');

        // dd($request->all());

        $currentUser = DB::connection('mysql')
            ->table('auth_sessions')
            ->where('token', $token)
            ->first();


        $isAdmin = DB::connection('mysql')->table('admin')
            ->where('emp_id', $currentUser->emp_id)
            ->first();

        session([
            'emp_data' => [
                'token' => $currentUser->token,
                'emp_id' => $currentUser->emp_id,
                'emp_name' => $currentUser->emp_name,
                'emp_firstname' => $currentUser->emp_firstname,
                'emp_jobtitle' => $currentUser->emp_jobtitle,
                'emp_dept' => $currentUser->emp_dept,
                'emp_prodline' => $currentUser->emp_prodline,
                'emp_station' => $currentUser->emp_station,
                'generated_at' => $currentUser->generated_at,
                'emp_role' => $isAdmin->emp_role ?? null,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        // Kunin emp_id bago mawala session
        $empId = session('emp_data.emp_id') ?? null;

        // Logout user
        Auth::guard('web')->logout();

        // Invalidate current session
        $request->session()->invalidate();

        // Regenerate CSRF token
        $request->session()->regenerateToken();

        // Delete all custom sessions (kung meron kang auth_sessions table)
        if ($empId) {
            DB::connection('mysql')->table('auth_sessions')
                ->where('emp_id', $empId)
                ->delete();
        }

        // Optional: cleanup old sessions

        DB::connection('mysql')->table('auth_sessions')
            ->where('generated_at', '<', now()->subMinutes(30))
            ->where('emp_id', $empId)
            ->delete();

        DB::connection('mysql')->table('auth_sessions')
            ->where('generated_at', '<', now()->subMinutes(30))
            ->where('emp_dept', '!=', 'Equipment Engineering')
            ->delete();


        // Redirect to login page
        return redirect()->route('login');
    }
}
