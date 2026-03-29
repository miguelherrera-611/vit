<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Columnas faltantes en ventas ──────────────────────────
        Schema::table('ventas', function (Blueprint $table) {
            if (!Schema::hasColumn('ventas', 'pagado')) {
                $table->decimal('pagado', 10, 2)->default(0)->after('total');
            }
            if (!Schema::hasColumn('ventas', 'tipo_venta')) {
                $table->string('tipo_venta', 20)->default('Contado')->after('metodo_pago');
            }
            if (!Schema::hasColumn('ventas', 'forma_pago')) {
                $table->string('forma_pago', 50)->nullable()->after('tipo_venta');
            }
        });

        // ── Columna faltante en clientes ──────────────────────────
        Schema::table('clientes', function (Blueprint $table) {
            if (!Schema::hasColumn('clientes', 'saldo_total')) {
                $table->decimal('saldo_total', 10, 2)->default(0)->after('activo');
            }
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $cols = [];
            foreach (['pagado', 'tipo_venta', 'forma_pago'] as $col) {
                if (Schema::hasColumn('ventas', $col)) $cols[] = $col;
            }
            if ($cols) $table->dropColumn($cols);
        });

        Schema::table('clientes', function (Blueprint $table) {
            if (Schema::hasColumn('clientes', 'saldo_total')) {
                $table->dropColumn('saldo_total');
            }
        });
    }
};
