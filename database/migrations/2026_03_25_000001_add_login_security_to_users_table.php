<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Contador de intentos fallidos consecutivos
            $table->unsignedTinyInteger('intentos_fallidos')
                ->default(0)
                ->after('activo');

            // Timestamp hasta cuando está bloqueada la cuenta
            // NULL = no bloqueada
            $table->timestamp('bloqueado_hasta')
                ->nullable()
                ->after('intentos_fallidos');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['intentos_fallidos', 'bloqueado_hasta']);
        });
    }
};
