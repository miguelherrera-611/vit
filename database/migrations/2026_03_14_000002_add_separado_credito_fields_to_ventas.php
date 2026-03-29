<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->date('fecha_limite')->nullable()->after('notas');
            $table->decimal('saldo_pendiente', 10, 2)->default(0)->after('fecha_limite');
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn(['fecha_limite', 'saldo_pendiente']);
        });
    }
};
