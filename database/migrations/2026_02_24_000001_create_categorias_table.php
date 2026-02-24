<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categorias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');                          // Ej: "Blusas", "Bermudas"
            $table->string('tipo')->default('custom');        // 'dama' | 'caballero' | 'custom'
            $table->string('imagen')->nullable();             // ruta en storage/public
            $table->string('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
            $table->softDeletes();                            // para papelera
        });

        // Seeder: insertar las categorías base
        DB::table('categorias')->insert([
            // Dama
            ['nombre' => 'Blusas',          'tipo' => 'dama',      'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Vestidos',        'tipo' => 'dama',      'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Pantalones',      'tipo' => 'dama',      'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Faldas',          'tipo' => 'dama',      'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Chaquetas',       'tipo' => 'dama',      'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Sacos',           'tipo' => 'dama',      'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Ropa Interior',   'tipo' => 'dama',      'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Accesorios',      'tipo' => 'dama',      'created_at' => now(), 'updated_at' => now()],
            // Caballero
            ['nombre' => 'Camisas',         'tipo' => 'caballero', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Camisetas',       'tipo' => 'caballero', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Pantalones',      'tipo' => 'caballero', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Bermudas',        'tipo' => 'caballero', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Chaquetas',       'tipo' => 'caballero', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Ropa Interior',   'tipo' => 'caballero', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Accesorios',      'tipo' => 'caballero', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('categorias');
    }
};
