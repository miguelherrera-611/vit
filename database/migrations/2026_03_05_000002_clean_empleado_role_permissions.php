<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

/**
 * Limpia los permisos del rol 'empleado' para que el control
 * sea 100% granular por permisos directos asignados desde el panel.
 * También añade permisos faltantes (gestionar_clientes, gestionar_papelera).
 */
return new class extends Migration
{
    public function up(): void
    {
        // Añadir permisos que faltan en la BD
        $nuevos = ['gestionar_clientes', 'gestionar_papelera'];
        foreach ($nuevos as $nombre) {
            Permission::firstOrCreate(['name' => $nombre, 'guard_name' => 'web']);
        }

        // Quitar TODOS los permisos del rol empleado
        // (el control será solo por permisos directos del usuario)
        $empleadoRole = Role::findByName('empleado');
        if ($empleadoRole) {
            $empleadoRole->syncPermissions([]);
        }

        // Limpiar caché de Spatie
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function down(): void
    {
        // Restaurar permisos base del empleado si se revierte
        $empleadoRole = Role::findByName('empleado');
        if ($empleadoRole) {
            $empleadoRole->syncPermissions([
                'ver_productos', 'ver_ventas', 'crear_ventas',
                'ver_detalle_ventas', 'ver_inventario',
            ]);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
};
