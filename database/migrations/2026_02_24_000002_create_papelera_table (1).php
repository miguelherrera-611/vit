<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('papelera', function (Blueprint $table) {
            $table->id();
            $table->string('tipo');                // 'producto' | 'cliente' | 'proveedor' | 'venta' | 'categoria'
            $table->unsignedBigInteger('modelo_id'); // ID del registro eliminado
            $table->json('datos');                 // snapshot completo del registro en JSON
            $table->string('nombre_display');      // Texto legible para mostrar en UI
            $table->string('eliminado_por')->nullable(); // nombre del usuario que eliminó
            $table->timestamp('eliminado_at')->useCurrent();
            $table->timestamp('purgar_at')->useCurrent();  // eliminado_at + 30 días
            $table->timestamps();

            $table->index(['tipo', 'modelo_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('papelera');
    }
};
