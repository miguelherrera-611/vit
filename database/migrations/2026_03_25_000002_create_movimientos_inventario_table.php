<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimientos_inventario', function (Blueprint $table) {
            $table->id();

            // Producto al que pertenece el movimiento
            $table->foreignId('producto_id')
                ->constrained('productos')
                ->cascadeOnDelete();

            // Quién lo generó
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Tipo de movimiento
            $table->enum('tipo', [
                'venta',        // descuento por venta
                'anulacion',    // reingreso por anulación de venta
                'ajuste_entrada', // ajuste manual de incremento
                'ajuste_salida',  // ajuste manual de decremento
                'inicial',      // stock inicial al crear el producto
            ]);

            // Cantidades
            $table->integer('cantidad');         // positivo = entrada, negativo = salida
            $table->integer('stock_anterior');   // stock antes del movimiento
            $table->integer('stock_nuevo');      // stock después del movimiento

            // Referencia opcional (venta_id si aplica)
            $table->string('referencia_tipo')->nullable();  // 'Venta', 'Ajuste', etc.
            $table->unsignedBigInteger('referencia_id')->nullable();

            // Motivo y observaciones
            $table->string('motivo')->nullable();
            $table->text('observaciones')->nullable();

            $table->timestamps();

            // Índices para consultas frecuentes
            $table->index(['producto_id', 'created_at']);
            $table->index('tipo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimientos_inventario');
    }
};
