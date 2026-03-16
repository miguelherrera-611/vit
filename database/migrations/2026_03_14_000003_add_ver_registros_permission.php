<?php
// database/migrations/2026_03_14_000003_add_ver_registros_permission.php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    public function up(): void
    {
        $permiso = Permission::firstOrCreate([
            'name'       => 'ver_registros',
            'guard_name' => 'web',
        ]);

        // Asignarlo al rol admin automáticamente
        $adminRole = Role::findByName('admin');
        if ($adminRole && !$adminRole->hasPermissionTo('ver_registros')) {
            $adminRole->givePermissionTo($permiso);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function down(): void
    {
        Permission::where('name', 'ver_registros')->delete();
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
};
