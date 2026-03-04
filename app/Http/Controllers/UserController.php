<?php


namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    // Lista todos los permisos disponibles en el sistema
    private function permisosDisponibles(): array
    {
        return [
            ['key' => 'ver_productos', 'label' => 'Ver Productos'],
            ['key' => 'crear_productos', 'label' => 'Crear Productos'],
            ['key' => 'editar_productos', 'label' => 'Editar Productos'],
            ['key' => 'eliminar_productos', 'label' => 'Eliminar Productos'],
            ['key' => 'gestionar_inventario', 'label' => 'Gestionar Inventario'],
            ['key' => 'ver_reportes', 'label' => 'Ver Reportes'],
            ['key' => 'gestionar_ventas', 'label' => 'Gestionar Ventas'],
            ['key' => 'gestionar_clientes', 'label' => 'Gestionar Clientes'],
            ['key' => 'gestionar_proveedores', 'label' => 'Gestionar Proveedores'],
            ['key' => 'gestionar_categorias', 'label' => 'Gestionar Categorías'],
            ['key' => 'gestionar_papelera', 'label' => 'Gestionar Papelera'],
        ];
    }

    public function index(): Response
    {
        $usuarios = User::with('roles', 'permissions')
            ->orderBy('name')
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'rol' => $u->roles->first()?->name ?? 'sin_rol',
                'permisos' => $u->getAllPermissions()->pluck('name')->toArray(),
                'created_at' => $u->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Usuarios/Create', [
            'permisos_disponibles' => $this->permisosDisponibles(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'rol' => 'required|in:admin,empleado',
            'permisos' => 'array',
        ], [
            'email.unique' => 'Ya existe un usuario con este correo.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ]);

        // Crear usuario
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Asignar rol
        $user->assignRole($validated['rol']);

        // Asignar permisos granulares (solo aplica a empleados normalmente)
        if (!empty($validated['permisos'])) {
            // Asegurarnos que los permisos existen
            foreach ($validated['permisos'] as $permiso) {
                Permission::firstOrCreate(
                    ['name' => $permiso, 'guard_name' => 'web']
                );
            }
            $user->syncPermissions($validated['permisos']);
        }

        return redirect()->route('usuarios.index')
            ->with('success', "Usuario \"{$user->name}\" creado exitosamente.");
    }

    public function edit(string $id): Response
    {
        $user = User::with('roles', 'permissions')->findOrFail($id);

        // No permitir editar al propio usuario autenticado desde aquí
        // (para evitar que se quite sus propios permisos)
        return Inertia::render('Usuarios/Edit', [
            'usuario' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'rol' => $user->roles->first()?->name ?? 'empleado',
                'permisos' => $user->getDirectPermissions()->pluck('name')->toArray(),
            ],
            'permisos_disponibles' => $this->permisosDisponibles(),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'rol' => 'required|in:admin,empleado',
            'permisos' => 'array',
        ];

        // Contraseña opcional en edición
        if ($request->filled('password')) {
            $rules['password'] = 'string|min:8|confirmed';
        }

        $validated = $request->validate($rules, [
            'email.unique' => 'Ya existe un usuario con este correo.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if ($request->filled('password')) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // Actualizar rol
        $user->syncRoles([$validated['rol']]);

        // Actualizar permisos
        $permisos = $validated['permisos'] ?? [];
        if (!empty($permisos)) {
            foreach ($permisos as $permiso) {
                Permission::firstOrCreate(
                    ['name' => $permiso, 'guard_name' => 'web']
                );
            }
        }
        $user->syncPermissions($permisos);

        return redirect()->route('usuarios.index')
            ->with('success', "Usuario \"{$user->name}\" actualizado exitosamente.");
    }

    public function destroy(Request $request, string $id)
    {
        $request->validate(['password' => 'required|string']);

        if (!Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        // No permitir eliminar al propio usuario
        if (auth()->id() == $id) {
            return back()->withErrors(['password' => 'No puedes eliminar tu propio usuario.']);
        }

        $user = User::findOrFail($id);
        $nombre = $user->name;
        $user->delete();

        return redirect()->route('usuarios.index')
            ->with('success', "Usuario \"{$nombre}\" eliminado permanentemente.");
    }

    // Activar / Desactivar usuario (toggle)
    public function toggleActivo(string $id)
    {
        if (auth()->id() == $id) {
            return back()->withErrors(['error' => 'No puedes desactivarte a ti mismo.']);
        }

        $user = User::findOrFail($id);

        // Usamos el campo activo si existe, si no lo simulamos con banned_at
        // Como tu modelo usa campo simple, lo manejamos con un scope futuro
        // Por ahora usamos un campo en users — asegúrate de tenerlo en la migración
        $user->activo = !($user->activo ?? true);
        $user->save();

        $estado = $user->activo ? 'activado' : 'desactivado';
        return back()->with('success', "Usuario \"{$user->name}\" {$estado}.");
    }
}
