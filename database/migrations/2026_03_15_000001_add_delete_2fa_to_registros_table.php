<?php
// database/migrations/2026_03_15_000001_add_delete_2fa_to_registros_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('registros', function (Blueprint $table) {
            $table->string('delete_code', 6)->nullable()->after('ip');
            $table->timestamp('delete_code_expires_at')->nullable()->after('delete_code');
        });
    }

    public function down(): void
    {
        Schema::table('registros', function (Blueprint $table) {
            $table->dropColumn(['delete_code', 'delete_code_expires_at']);
        });
    }
};
