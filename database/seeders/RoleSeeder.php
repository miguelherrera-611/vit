<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Crear roles
        $superAdminRole = Role::create(['name' => 'super_admin']);
        $adminRole = Role::create(['name' => 'admin']);
        $empleadoRole = Role::create(['name' => 'empleado']);

        // Crear permisos
        $permissions = [
            // Permisos de productos
            'ver_productos',
            'crear_productos',
            'editar_productos',
            'eliminar_productos',

            // Permisos de ventas
            'ver_ventas',
            'crear_ventas',
            'anular_ventas',
            'ver_detalle_ventas',

            // Permisos de inventario
            'ver_inventario',
            'ajustar_inventario',
            'ver_movimientos_inventario',

            // Permisos de proveedores
            'ver_proveedores',
            'crear_proveedores',
            'editar_proveedores',
            'eliminar_proveedores',

            // Permisos de reportes
            'ver_reportes_ventas',
            'ver_reportes_inventario',
            'ver_reportes_financieros',
            'exportar_reportes',

            // Permisos de usuarios (SOLO SUPER ADMIN)
            'ver_usuarios',
            'crear_usuarios',
            'editar_usuarios',
            'eliminar_usuarios',
            'cambiar_contraseñas_usuarios',
            'activar_desactivar_usuarios',
            'asignar_roles',

            // Permisos de configuración (SOLO SUPER ADMIN)
            'ver_configuracion_sistema',
            'editar_configuracion_sistema',
            'gestionar_permisos',

            // Dashboard
            'ver_dashboard_super_admin',
            'ver_dashboard_admin',
            'ver_dashboard_empleado',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // SUPER ADMIN - Acceso total a TODO
        $superAdminRole->givePermissionTo(Permission::all());

        // ADMIN - Gestión operativa (sin gestión de usuarios ni roles)
        $adminRole->givePermissionTo([
            // Productos
            'ver_productos',
            'crear_productos',
            'editar_productos',
            'eliminar_productos',

            // Ventas
            'ver_ventas',
            'crear_ventas',
            'anular_ventas',
            'ver_detalle_ventas',

            // Inventario
            'ver_inventario',
            'ajustar_inventario',
            'ver_movimientos_inventario',

            // Proveedores
            'ver_proveedores',
            'crear_proveedores',
            'editar_proveedores',
            'eliminar_proveedores',

            // Reportes
            'ver_reportes_ventas',
            'ver_reportes_inventario',
            'ver_reportes_financieros',
            'exportar_reportes',

            // Dashboard
            'ver_dashboard_admin',
        ]);

        // EMPLEADO - Acceso limitado solo a operaciones básicas
        $empleadoRole->givePermissionTo([
            'ver_productos',
            'ver_ventas',
            'crear_ventas',
            'ver_detalle_ventas',
            'ver_inventario',
            'ver_dashboard_empleado',
        ]);
    }
}
