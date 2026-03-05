<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;

/**
 * Añade los permisos que faltan en la BD para que el sistema
 * de permisos de empleados funcione correctamente.
 */
return new class extends Migration
{
    public function up(): void
    {
        $permisosNuevos = [
            'gestionar_clientes',
            'gestionar_papelera',
        ];

        foreach ($permisosNuevos as $nombre) {
            Permission::firstOrCreate([
                'name'       => $nombre,
                'guard_name' => 'web',
            ]);
        }

        // Limpiar caché de Spatie
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function down(): void
    {
        Permission::whereIn('name', ['gestionar_clientes', 'gestionar_papelera'])->delete();
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
};
