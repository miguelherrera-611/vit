<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ventas: filtrar por estado y rango de fechas (reportes, dashboard)
        Schema::table('ventas', function (Blueprint $table) {
            $table->index('estado',     'ventas_estado_index');
            $table->index('created_at', 'ventas_created_at_index');
        });

        // productos: catálogo siempre filtra activo=1 y por categoría
        Schema::table('productos', function (Blueprint $table) {
            $table->index('activo',    'productos_activo_index');
            $table->index('categoria', 'productos_categoria_index');
        });

        // clientes: búsqueda por nombre en abonos/ventas
        Schema::table('clientes', function (Blueprint $table) {
            $table->index('nombre', 'clientes_nombre_index');
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropIndex('ventas_estado_index');
            $table->dropIndex('ventas_created_at_index');
        });

        Schema::table('productos', function (Blueprint $table) {
            $table->dropIndex('productos_activo_index');
            $table->dropIndex('productos_categoria_index');
        });

        Schema::table('clientes', function (Blueprint $table) {
            $table->dropIndex('clientes_nombre_index');
        });
    }
};
