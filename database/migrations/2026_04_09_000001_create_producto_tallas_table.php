<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->boolean('maneja_tallas')->default(false)->after('stock_minimo')
                  ->comment('Si true, el stock se maneja por talla en producto_tallas');
        });

        Schema::create('producto_tallas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->cascadeOnDelete();
            $table->string('talla', 20);
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedSmallInteger('orden')->default(0);
            $table->timestamps();
            $table->unique(['producto_id', 'talla']);
        });

        Schema::table('venta_detalles', function (Blueprint $table) {
            $table->string('talla', 20)->nullable()->after('producto_id')
                  ->comment('Talla vendida; null si el producto no maneja tallas');
        });

        Schema::table('pedido_items', function (Blueprint $table) {
            $table->string('talla', 20)->nullable()->after('producto_id')
                  ->comment('Talla pedida; null si el producto no maneja tallas');
        });
    }

    public function down(): void
    {
        Schema::table('pedido_items', fn($t) => $t->dropColumn('talla'));
        Schema::table('venta_detalles', fn($t) => $t->dropColumn('talla'));
        Schema::dropIfExists('producto_tallas');
        Schema::table('productos', fn($t) => $t->dropColumn('maneja_tallas'));
    }
};
