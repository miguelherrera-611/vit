<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar caché primero
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ── Crear roles ──────────────────────────────────────────────
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin']);
        $adminRole      = Role::firstOrCreate(['name' => 'admin']);
        $empleadoRole   = Role::firstOrCreate(['name' => 'empleado']);

        // ── Crear TODOS los permisos del sistema ─────────────────────
        $permissions = [
            // Productos
            'ver_productos',
            'crear_productos',
            'editar_productos',
            'eliminar_productos',

            // Inventario
            'ver_inventario',
            'ajustar_inventario',
            'ver_movimientos_inventario',

            // Ventas
            'ver_ventas',
            'crear_ventas',
            'anular_ventas',
            'ver_detalle_ventas',

            // Clientes
            'gestionar_clientes',

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

            // Categorías
            'gestionar_categorias',

            // Papelera
            'gestionar_papelera',

            // Usuarios (solo admin/super_admin)
            'ver_usuarios',
            'crear_usuarios',
            'editar_usuarios',
            'eliminar_usuarios',
            'activar_desactivar_usuarios',
            'asignar_roles',

            // Dashboard
            'ver_dashboard_super_admin',
            'ver_dashboard_admin',
            'ver_dashboard_empleado',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // ── SUPER ADMIN: acceso total ────────────────────────────────
        $superAdminRole->syncPermissions(Permission::all());

        // ── ADMIN: acceso operativo completo ─────────────────────────
        $adminRole->syncPermissions([
            'ver_productos', 'crear_productos', 'editar_productos', 'eliminar_productos',
            'ver_inventario', 'ajustar_inventario', 'ver_movimientos_inventario',
            'ver_ventas', 'crear_ventas', 'anular_ventas', 'ver_detalle_ventas',
            'gestionar_clientes',
            'ver_proveedores', 'crear_proveedores', 'editar_proveedores', 'eliminar_proveedores',
            'ver_reportes_ventas', 'ver_reportes_inventario', 'ver_reportes_financieros', 'exportar_reportes',
            'gestionar_categorias',
            'gestionar_papelera',
            'ver_usuarios', 'crear_usuarios', 'editar_usuarios', 'eliminar_usuarios',
            'activar_desactivar_usuarios', 'asignar_roles',
            'ver_dashboard_admin',
        ]);

        // ── EMPLEADO: SIN permisos por defecto ───────────────────────
        // Los permisos se asignan individualmente desde el panel de usuarios.
        // Esto permite control granular total por cada empleado.
        $empleadoRole->syncPermissions([]);
    }
}
