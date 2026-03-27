<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Registro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    /**
     * Permisos disponibles para asignar a empleados.
     * DEBEN coincidir exactamente con los nombres en la tabla `permissions` de la BD.
     */
    private function permisosDisponibles(): array
    {
        return [
            // Productos
            ['key' => 'ver_productos',      'label' => 'Ver Productos'],
            ['key' => 'crear_productos',    'label' => 'Crear Productos'],
            ['key' => 'editar_productos',   'label' => 'Editar Productos'],
            ['key' => 'eliminar_productos', 'label' => 'Eliminar Productos'],

            // Inventario
            ['key' => 'ver_inventario',     'label' => 'Ver Inventario'],
            ['key' => 'ajustar_inventario', 'label' => 'Ajustar Inventario'],
            ['key' => 'ver_kardex',         'label' => 'Ver Kardex de Productos'],

            // Ventas
            ['key' => 'ver_ventas',         'label' => 'Ver Ventas'],
            ['key' => 'crear_ventas',       'label' => 'Crear Ventas'],
            ['key' => 'anular_ventas',      'label' => 'Anular Ventas'],
            ['key' => 'ver_cartera',        'label' => 'Ver Cartera / Deudas'],

            // Abonos
            ['key' => 'ver_abonos',         'label' => 'Ver Abonos'],
            ['key' => 'crear_abonos',       'label' => 'Registrar Abonos'],

            // Clientes
            ['key' => 'gestionar_clientes',    'label' => 'Gestionar Clientes'],

            // Proveedores
            ['key' => 'ver_proveedores',       'label' => 'Ver Proveedores'],
            ['key' => 'crear_proveedores',     'label' => 'Crear Proveedores'],
            ['key' => 'editar_proveedores',    'label' => 'Editar Proveedores'],

            // Reportes
            ['key' => 'ver_reportes_ventas',        'label' => 'Reportes de Ventas'],
            ['key' => 'ver_reportes_inventario',    'label' => 'Reportes de Inventario'],
            ['key' => 'ver_reportes_financieros',   'label' => 'Reportes Financieros'],
            ['key' => 'ver_reportes_clientes',      'label' => 'Reportes de Clientes'],
            ['key' => 'ver_reportes_rentabilidad',  'label' => 'Reportes de Rentabilidad'],
            ['key' => 'ver_reportes_categorias',    'label' => 'Reportes por Categoría'],
            ['key' => 'ver_reportes_ejecutivo',     'label' => 'Reporte Ejecutivo'],

            // Categorías
            ['key' => 'gestionar_categorias', 'label' => 'Gestionar Categorías'],

            // Papelera
            ['key' => 'gestionar_papelera',   'label' => 'Gestionar Papelera'],

            // Registros
            ['key' => 'ver_registros',        'label' => 'Ver Registros de Actividad'],
        ];
    }

    /**
     * Permisos predeterminados para el rol Empleado/Vendedor.
     * Basados en RF-03, RF-04, RF-05 del documento de requisitos.
     * Representan las funciones mínimas que todo empleado necesita para operar.
     *
     * Se exponen al frontend para que el botón "Permisos predeterminados"
     * los marque automáticamente en el formulario de creación/edición.
     */
    public function permisosDefaultEmpleado(): array
    {
        return [
            // Ver catálogo — RF-04.1 "Empleado busca producto"
            'ver_productos',

            // Inventario en solo lectura — RF-03 "Consulta de inventario (solo lectura)"
            'ver_inventario',

            // Ventas — RF-04.1 rol principal del empleado/vendedor
            'ver_ventas',
            'crear_ventas',

            // Clientes — RF-05.1 "Registro de Clientes (Empleado/Admin)"
            'gestionar_clientes',

            // Abonos — RF-05.2 "Gestión de Abonos (Empleado/Admin)"
            'ver_abonos',
            'crear_abonos',

            // Cartera — necesario para ver deudas al registrar abonos — RF-05.3
            'ver_cartera',

            // Proveedores solo lectura — útil al consultar info de productos
            'ver_proveedores',

            // Reporte de ventas propias del día — RF-04.4
            'ver_reportes_ventas',
        ];
    }

    public function index(): Response
    {
        $usuarios = User::with('roles', 'permissions')
            ->orderBy('name')
            ->get()
            ->map(fn($u) => [
                'id'               => $u->id,
                'name'             => $u->name,
                'email'            => $u->email,
                'rol'              => $u->roles->first()?->name ?? 'sin_rol',
                'permisos'         => $u->getAllPermissions()->pluck('name')->toArray(),
                'activo'           => $u->activo,
                'bloqueado'        => $u->estaBloqueado(),
                'intentos_fallidos'=> $u->intentos_fallidos,
                'bloqueado_hasta'  => $u->bloqueado_hasta?->format('d/m/Y H:i'),
                'created_at'       => $u->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Usuarios/Create', [
            'permisos_disponibles' => $this->permisosDisponibles(),
            'permisos_default'     => $this->permisosDefaultEmpleado(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'rol'      => 'required|in:admin,empleado',
            'permisos' => 'array',
        ], [
            'email.unique'        => 'Ya existe un usuario con este correo.',
            'password.min'        => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed'  => 'Las contraseñas no coinciden.',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'activo'   => true,
        ]);

        $user->assignRole($validated['rol']);

        // Asignar permisos solo si es empleado y vienen permisos seleccionados
        if ($validated['rol'] === 'empleado' && !empty($validated['permisos'])) {
            $permisosValidos = Permission::whereIn('name', $validated['permisos'])
                ->where('guard_name', 'web')
                ->pluck('name')
                ->toArray();

            $user->syncPermissions($permisosValidos);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Registro::registrar(
            'crear',
            'usuarios',
            "Usuario \"{$user->name}\" ({$validated['rol']}) creado por " . auth()->user()->name,
            $user
        );

        return redirect()->route('usuarios.index')
            ->with('success', "Usuario \"{$user->name}\" creado exitosamente.");
    }

    public function edit(string $id): Response
    {
        $user = User::with('roles', 'permissions')->findOrFail($id);

        return Inertia::render('Usuarios/Edit', [
            'usuario' => [
                'id'       => $user->id,
                'name'     => $user->name,
                'email'    => $user->email,
                'rol'      => $user->roles->first()?->name ?? 'empleado',
                'permisos' => $user->getDirectPermissions()->pluck('name')->toArray(),
            ],
            'permisos_disponibles' => $this->permisosDisponibles(),
            'permisos_default'     => $this->permisosDefaultEmpleado(),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $user     = User::findOrFail($id);
        $anterior = ['name' => $user->name, 'email' => $user->email, 'rol' => $user->roles->first()?->name];

        $rules = [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $id,
            'rol'      => 'required|in:admin,empleado',
            'permisos' => 'array',
        ];

        if ($request->filled('password')) {
            $rules['password'] = 'string|min:8|confirmed';
        }

        $validated = $request->validate($rules, [
            'email.unique'       => 'Ya existe un usuario con este correo.',
            'password.min'       => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ]);

        $user->name  = $validated['name'];
        $user->email = $validated['email'];

        if ($request->filled('password')) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();
        $user->syncRoles([$validated['rol']]);

        if ($validated['rol'] === 'empleado') {
            $permisos = $validated['permisos'] ?? [];

            if (!empty($permisos)) {
                $permisosValidos = Permission::whereIn('name', $permisos)
                    ->where('guard_name', 'web')
                    ->pluck('name')
                    ->toArray();
                $user->syncPermissions($permisosValidos);
            } else {
                $user->syncPermissions([]);
            }
        } else {
            $user->syncPermissions([]);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Registro::registrar(
            'editar',
            'usuarios',
            "Usuario \"{$user->name}\" editado por " . auth()->user()->name,
            $user,
            $anterior
        );

        return redirect()->route('usuarios.index')
            ->with('success', "Usuario \"{$user->name}\" actualizado exitosamente.");
    }

    public function destroy(Request $request, string $id)
    {
        $request->validate(['password' => 'required|string']);

        if (!Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        if (auth()->id() == $id) {
            return back()->withErrors(['password' => 'No puedes eliminar tu propio usuario.']);
        }

        $user   = User::findOrFail($id);
        $nombre = $user->name;

        Registro::registrar(
            'eliminar',
            'usuarios',
            "Usuario \"{$nombre}\" eliminado permanentemente por " . auth()->user()->name
        );

        $user->delete();

        return redirect()->route('usuarios.index')
            ->with('success', "Usuario \"{$nombre}\" eliminado permanentemente.");
    }

    public function toggleActivo(string $id)
    {
        if (auth()->id() == $id) {
            return back()->withErrors(['error' => 'No puedes desactivarte a ti mismo.']);
        }

        $user         = User::findOrFail($id);
        $user->activo = !($user->activo ?? true);
        $user->save();

        $estado = $user->activo ? 'activado' : 'desactivado';

        Registro::registrar(
            $estado,
            'usuarios',
            "Usuario \"{$user->name}\" {$estado} por " . auth()->user()->name,
            $user
        );

        return back()->with('success', "Usuario \"{$user->name}\" {$estado}.");
    }

    // ── DESBLOQUEAR cuenta bloqueada por intentos fallidos ────────

    public function desbloquear(string $id)
    {
        if (auth()->id() == $id) {
            return back()->withErrors(['error' => 'No puedes desbloquearte a ti mismo desde aquí.']);
        }

        $user = User::findOrFail($id);

        if (!$user->estaBloqueado()) {
            return back()->with('success', "El usuario \"{$user->name}\" no está bloqueado.");
        }

        $user->desbloquear();

        Registro::registrar(
            'desbloquear',
            'usuarios',
            "Usuario \"{$user->name}\" desbloqueado manualmente por " . auth()->user()->name
            . " (tenía {$user->intentos_fallidos} intentos fallidos).",
            $user
        );

        return back()->with('success', "Usuario \"{$user->name}\" desbloqueado correctamente.");
    }
}
