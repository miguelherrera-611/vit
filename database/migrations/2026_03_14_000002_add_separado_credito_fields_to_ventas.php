<?php
// database/migrations/2026_03_14_000002_add_separado_credito_fields_to_ventas.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->date('fecha_limite')->nullable()->after('notas');
            $table->string('forma_pago')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn('fecha_limite');
        });
    }
};
