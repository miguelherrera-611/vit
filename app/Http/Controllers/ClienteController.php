<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClienteController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');

        $query = Cliente::with([
            'ventas' => fn($q) => $q->orderBy('created_at', 'desc'),
            'ventas.detalles.producto',
            'ventas.abonos',
        ])->orderBy('nombre');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre',    'like', "%{$search}%")
                  ->orWhere('telefono', 'like', "%{$search}%")
                  ->orWhere('documento','like', "%{$search}%")
                  ->orWhere('email',    'like', "%{$search}%");
            });
        }

        $clientes = $query->paginate(20)->withQueryString();

        $stats = [
            'total'            => Cliente::count(),
            'activos'          => Cliente::where('activo', true)->count(),
            'con_deudas'       => Cliente::whereHas('ventas', fn($q) => $q->where('estado', 'Pendiente'))->count(),
            'nuevos_este_mes'  => Cliente::whereYear('created_at', now()->year)
                                         ->whereMonth('created_at', now()->month)
                                         ->count(),
        ];

        return Inertia::render('Clientes/Index', [
            'clientes' => $clientes,
            'stats'    => $stats,
            'filters'  => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Clientes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'    => 'required|string|max:255',
            'telefono'  => 'required|string|max:50|unique:clientes,telefono',
            'email'     => 'nullable|email|max:255',
            'documento' => 'nullable|string|max:50',
            'direccion' => 'nullable|string',
            'activo'    => 'boolean',
        ], [
            'telefono.unique' => 'Ya existe un cliente con este número de teléfono.',
        ]);

        $validated['activo'] = $request->boolean('activo', true);

        Cliente::create($validated);

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente creado exitosamente.');
    }

    /**
     * Muestra el detalle de un cliente con su historial de compras.
     */
    public function show(string $id): Response
    {
        $cliente = Cliente::with([
            'ventas' => fn ($q) => $q->orderBy('created_at', 'desc'),
            'ventas.detalles.producto',
            'ventas.abonos',
        ])->findOrFail($id);

        return Inertia::render('Clientes/Show', [
            'cliente' => $cliente,
        ]);
    }

    public function edit(string $id): Response
    {
        $cliente = Cliente::findOrFail($id);

        return Inertia::render('Clientes/Edit', [
            'cliente' => $cliente,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $cliente = Cliente::findOrFail($id);

        $validated = $request->validate([
            'nombre'    => 'required|string|max:255',
            'telefono'  => 'required|string|max:50|unique:clientes,telefono,' . $id,
            'email'     => 'nullable|email|max:255',
            'documento' => 'nullable|string|max:50',
            'direccion' => 'nullable|string',
            'activo'    => 'boolean',
        ], [
            'telefono.unique' => 'Ya existe un cliente con este número de teléfono.',
        ]);

        $validated['activo'] = $request->boolean('activo', true);

        $cliente->update($validated);

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente actualizado exitosamente.');
    }

    public function destroy(Request $request, string $id)
    {
        $request->validate(['password' => 'required|string']);

        if (! \Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $cliente = Cliente::findOrFail($id);

        \App\Models\Papelera::archivar(
            'cliente',
            $cliente,
            $cliente->nombre,
            auth()->user()->name
        );

        $cliente->delete();

        return redirect()->route('clientes.index')
            ->with('success', "Cliente \"{$cliente->nombre}\" movido a la papelera.");
    }
}
