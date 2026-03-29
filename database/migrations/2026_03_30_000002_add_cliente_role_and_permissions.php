<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    public function up(): void
    {
        // Crear rol cliente
        $clienteRole = Role::firstOrCreate([
            'name'       => 'cliente',
            'guard_name' => 'web',
        ]);

        // Permisos específicos del cliente
        $permisos = [
            'ver_catalogo',
            'gestionar_carrito',
            'crear_pedidos',
            'ver_mis_pedidos',
            'confirmar_entrega',
        ];

        foreach ($permisos as $nombre) {
            $permiso = Permission::firstOrCreate([
                'name'       => $nombre,
                'guard_name' => 'web',
            ]);
            $clienteRole->givePermissionTo($permiso);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function down(): void
    {
        $permisos = [
            'ver_catalogo',
            'gestionar_carrito',
            'crear_pedidos',
            'ver_mis_pedidos',
            'confirmar_entrega',
        ];

        Permission::whereIn('name', $permisos)->delete();

        $role = Role::where('name', 'cliente')->first();
        if ($role) $role->delete();

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
};
