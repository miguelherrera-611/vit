<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabla de categorías PRINCIPALES (Dama, Caballero, Niños, etc.)
        Schema::create('grupos_categoria', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');              // "Dama", "Caballero", "Niños"
            $table->string('imagen')->nullable();  // imagen de portada
            $table->string('descripcion')->nullable();
            $table->string('color')->default('violet'); // para el degradado de fondo
            $table->integer('orden')->default(0);  // para ordenar las tarjetas
            $table->boolean('activo')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // Agregar grupo_id a la tabla categorias (subcategorías)
        Schema::table('categorias', function (Blueprint $table) {
            $table->foreignId('grupo_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('grupos_categoria')
                  ->nullOnDelete();
        });

        // Insertar grupos base: Dama y Caballero
        $ahora = now();
        $grupos = DB::table('grupos_categoria')->insertGetId([
            'nombre'     => 'placeholder', // dummy para obtener IDs
            'created_at' => $ahora,
            'updated_at' => $ahora,
        ]);

        // Resetear y hacer insert correcto
        DB::table('grupos_categoria')->truncate();

        DB::table('grupos_categoria')->insert([
            [
                'nombre'      => 'Dama',
                'descripcion' => 'Ropa y accesorios para dama',
                'color'       => 'pink',
                'orden'       => 1,
                'created_at'  => $ahora,
                'updated_at'  => $ahora,
            ],
            [
                'nombre'      => 'Caballero',
                'descripcion' => 'Ropa y accesorios para caballero',
                'color'       => 'blue',
                'orden'       => 2,
                'created_at'  => $ahora,
                'updated_at'  => $ahora,
            ],
        ]);

        // Asignar grupo_id a las categorías existentes
        $grupoDama      = DB::table('grupos_categoria')->where('nombre', 'Dama')->first();
        $grupoCaballero = DB::table('grupos_categoria')->where('nombre', 'Caballero')->first();

        if ($grupoDama) {
            DB::table('categorias')
              ->where('tipo', 'dama')
              ->update(['grupo_id' => $grupoDama->id]);
        }

        if ($grupoCaballero) {
            DB::table('categorias')
              ->where('tipo', 'caballero')
              ->update(['grupo_id' => $grupoCaballero->id]);
        }
    }

    public function down(): void
    {
        Schema::table('categorias', function (Blueprint $table) {
            $table->dropForeign(['grupo_id']);
            $table->dropColumn('grupo_id');
        });

        Schema::dropIfExists('grupos_categoria');
    }
};
