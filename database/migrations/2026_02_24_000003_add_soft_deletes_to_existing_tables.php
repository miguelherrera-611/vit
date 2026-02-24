<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Agrega soft deletes a las tablas que aún no lo tienen.
 * Ejecutar DESPUÉS de que ya existan las tablas.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Productos
        if (Schema::hasTable('productos') && !Schema::hasColumn('productos', 'deleted_at')) {
            Schema::table('productos', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        // Clientes
        if (Schema::hasTable('clientes') && !Schema::hasColumn('clientes', 'deleted_at')) {
            Schema::table('clientes', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        // Proveedores
        if (Schema::hasTable('proveedores') && !Schema::hasColumn('proveedores', 'deleted_at')) {
            Schema::table('proveedores', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    public function down(): void
    {
        Schema::table('productos',   fn ($t) => $t->dropSoftDeletes());
        Schema::table('clientes',    fn ($t) => $t->dropSoftDeletes());
        Schema::table('proveedores', fn ($t) => $t->dropSoftDeletes());
    }
};
