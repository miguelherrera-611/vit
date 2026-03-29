<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Crear tabla abonos si no existe
        if (!Schema::hasTable('abonos')) {
            Schema::create('abonos', function (Blueprint $table) {
                $table->id();
                $table->foreignId('venta_id')->constrained('ventas')->cascadeOnDelete();
                $table->decimal('monto', 10, 2);
                $table->string('forma_pago', 50)->default('Efectivo');
                $table->foreignId('empleado_id')->nullable()->constrained('users')->nullOnDelete();
                $table->text('observaciones')->nullable();
                $table->enum('tipo_movimiento', ['abono_normal', 'ajuste'])
                    ->default('abono_normal')
                    ->comment('abono_normal = pago del cliente, ajuste = corrección auditada por admin');
                $table->timestamps();
            });
        } else {
            // Si ya existe, solo agregar la columna si falta
            if (!Schema::hasColumn('abonos', 'tipo_movimiento')) {
                Schema::table('abonos', function (Blueprint $table) {
                    $table->enum('tipo_movimiento', ['abono_normal', 'ajuste'])
                        ->default('abono_normal')
                        ->after('observaciones')
                        ->comment('abono_normal = pago del cliente, ajuste = corrección auditada por admin');
                });
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('abonos', 'tipo_movimiento')) {
            Schema::table('abonos', function (Blueprint $table) {
                $table->dropColumn('tipo_movimiento');
            });
        }
    }
};
