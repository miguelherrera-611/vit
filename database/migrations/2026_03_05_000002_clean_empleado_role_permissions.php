<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    public function up(): void
    {
        // Añadir permisos que faltan en la BD
        $nuevos = ['gestionar_clientes', 'gestionar_papelera'];
        foreach ($nuevos as $nombre) {
            Permission::firstOrCreate(['name' => $nombre, 'guard_name' => 'web']);
        }

        // Solo limpiar permisos si el rol ya existe
        $empleadoRole = Role::where('name', 'empleado')->first();
        if ($empleadoRole) {
            $empleadoRole->syncPermissions([]);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function down(): void
    {
        $empleadoRole = Role::where('name', 'empleado')->first();
        if ($empleadoRole) {
            $empleadoRole->syncPermissions([
                'ver_productos', 'ver_ventas', 'crear_ventas',
                'ver_detalle_ventas', 'ver_inventario',
            ]);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
};
