<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class NuevosPermisosSeeder extends Seeder
{
    public function run(): void
    {
        $nuevos = [
            'ver_kardex',
            'ver_cartera',
            'ver_abonos',
            'crear_abonos',
            'ver_reportes_clientes',
            'ver_reportes_rentabilidad',
            'ver_reportes_categorias',
            'ver_reportes_ejecutivo',
        ];

        foreach ($nuevos as $nombre) {
            Permission::firstOrCreate(
                ['name' => $nombre, 'guard_name' => 'web']
            );
        }

        // Asignar todos los permisos al rol admin (por si acaso)
        $admin = Role::where('name', 'admin')->first();
        if ($admin) {
            $admin->givePermissionTo($nuevos);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
