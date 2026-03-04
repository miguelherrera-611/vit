<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            // Agrega precio_compra después de la columna precio
            $table->decimal('precio_compra', 10, 2)->nullable()->default(0)->after('precio');
        });

        // Renombra internamente 'precio' a 'precio_venta' en la semántica del sistema.
        // El campo físico sigue llamándose 'precio' para no romper migraciones antiguas,
        // pero el sistema ahora maneja precio_compra adicionalmente.
        // Si quieres renombrar físicamente la columna descomenta la siguiente línea:
        // Schema::table('productos', fn(Blueprint $t) => $t->renameColumn('precio', 'precio_venta'));
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn('precio_compra');
        });
    }
};
