<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    /**
     * Dashboard para Super Admin
     */
    public function superadmin(): View
    {
        return view('dashboards.superadmin');
    }

    /**
     * Dashboard para Admin
     */
    public function admin(): View
    {
        return view('dashboards.admin');
    }

    /**
     * Dashboard para Empleado
     */
    public function empleado(): View
    {
        return view('dashboards.empleado');
    }
}
