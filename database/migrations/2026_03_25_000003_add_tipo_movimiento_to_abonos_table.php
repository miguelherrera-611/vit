<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('abonos', function (Blueprint $table) {
            $table->enum('tipo_movimiento', ['abono_normal', 'ajuste'])
                ->default('abono_normal')
                ->after('observaciones')
                ->comment('abono_normal = pago del cliente, ajuste = corrección auditada por admin');
        });
    }

    public function down(): void
    {
        Schema::table('abonos', function (Blueprint $table) {
            $table->dropColumn('tipo_movimiento');
        });
    }
};
