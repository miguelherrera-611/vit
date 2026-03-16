<?php
// app/Http/Controllers/RegistroController.php

namespace App\Http\Controllers;

use App\Models\Registro;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegistroController extends Controller
{
    public function index(Request $request): Response
    {
        $modulo  = $request->get('modulo', '');
        $accion  = $request->get('accion', '');
        $usuario = $request->get('usuario', '');
        $desde   = $request->get('desde', '');
        $hasta   = $request->get('hasta', '');

        $query = Registro::with('user')->orderByDesc('created_at');

        if ($modulo)  $query->where('modulo', $modulo);
        if ($accion)  $query->where('accion', $accion);
        if ($usuario) $query->where('user_name', 'like', "%{$usuario}%");
        if ($desde)   $query->whereDate('created_at', '>=', $desde);
        if ($hasta)   $query->whereDate('created_at', '<=', $hasta);

        $registros = $query->paginate(30)->through(fn($r) => [
            'id'               => $r->id,
            'user_name'        => $r->user_name,
            'user_rol'         => $r->user_rol,
            'accion'           => $r->accion,
            'modulo'           => $r->modulo,
            'descripcion'      => $r->descripcion,
            'modelo_tipo'      => $r->modelo_tipo,
            'modelo_id'        => $r->modelo_id,
            'ip'               => $r->ip,
            'created_at'       => $r->created_at->format('d/m/Y H:i:s'),
            'datos_anteriores' => $r->datos_anteriores,
            'datos_nuevos'     => $r->datos_nuevos,
        ]);

        $modulos  = Registro::distinct()->pluck('modulo')->sort()->values();
        $acciones = Registro::distinct()->pluck('accion')->sort()->values();

        return Inertia::render('Registros/Index', [
            'registros' => $registros,
            'modulos'   => $modulos,
            'acciones'  => $acciones,
            'filtros'   => compact('modulo', 'accion', 'usuario', 'desde', 'hasta'),
        ]);
    }
}
