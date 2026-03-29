<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();

            // Relación con el usuario cliente (puede ser null si no tiene cuenta)
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Número de pedido único (ej: PED-000001)
            $table->string('numero_pedido')->unique();

            // ── Datos de envío ──────────────────────────────────────
            $table->string('nombre_receptor');
            $table->string('telefono_receptor');
            $table->string('ciudad');
            $table->string('direccion');
            $table->text('indicaciones')->nullable(); // notas adicionales de entrega

            // ── Pago ────────────────────────────────────────────────
            $table->enum('metodo_pago', [
                'Nequi',
                'Daviplata',
                'Bancolombia',
                'Davivienda',
            ]);
            $table->string('comprobante_pago')->nullable(); // ruta al archivo adjunto

            // ── Totales ─────────────────────────────────────────────
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);

            // ── Estado del pedido ───────────────────────────────────
            $table->enum('estado', [
                'revision',      // cliente envió comprobante, admin debe verificar
                'aprobado',      // admin verificó el pago
                'envio_curso',   // admin marcó como enviado
                'entregado',     // cliente confirmó recepción
                'rechazado',     // admin rechazó (pago inválido, etc.)
                'cancelado',     // cancelado por el cliente o admin
            ])->default('revision');

            // ── Notas internas del admin ────────────────────────────
            $table->text('notas_admin')->nullable();

            // ── Correo del cliente (por si no tiene cuenta) ─────────
            $table->string('email_cliente')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'estado']);
            $table->index('estado');
        });

        // Tabla de ítems del pedido
        Schema::create('pedido_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained('pedidos')->cascadeOnDelete();
            $table->foreignId('producto_id')
                ->nullable()
                ->constrained('productos')
                ->nullOnDelete();

            // Snapshot del producto al momento del pedido
            $table->string('nombre_producto');
            $table->integer('cantidad');
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->string('imagen_producto')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedido_items');
        Schema::dropIfExists('pedidos');
    }
};
