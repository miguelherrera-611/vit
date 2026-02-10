<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Llamar al RoleSeeder primero
        $this->call(RoleSeeder::class);

        // Crear SUPER ADMIN
        $superAdmin = User::create([
            'name' => 'Super Administrador',
            'email' => 'superadmin@vitalistore.com',
            'password' => bcrypt('password'),
        ]);
        $superAdmin->assignRole('super_admin');

        // Crear ADMIN
        $admin = User::create([
            'name' => 'Administrador',
            'email' => 'admin@vitalistore.com',
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole('admin');

        // Crear EMPLEADO de prueba
        $empleado = User::create([
            'name' => 'Empleado Prueba',
            'email' => 'empleado@vitalistore.com',
            'password' => bcrypt('password'),
        ]);
        $empleado->assignRole('empleado');
    }
}
