<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Producto;
use App\Models\Cliente;
use App\Models\Proveedor;
use App\Models\Venta;
use App\Models\VentaDetalle;
use App\Models\User;
use Carbon\Carbon;

class DatosEjemploSeeder extends Seeder
{
    public function run(): void
    {
        // ========================================
        // 1. PRODUCTOS DE ROPA (30 productos)
        // ========================================
        $productos = [
            // ===== DAMA - BLUSAS (5) =====
            ['nombre' => 'Blusa Manga Larga Satín', 'categoria' => 'Dama - Blusas', 'precio' => 89000, 'stock' => 25, 'descripcion' => 'Blusa elegante en satín, cuello en V, disponible en varios colores'],
            ['nombre' => 'Blusa Campesina Bordada', 'categoria' => 'Dama - Blusas', 'precio' => 75000, 'stock' => 30, 'descripcion' => 'Blusa estilo campesino con bordados artesanales'],
            ['nombre' => 'Blusa Sin Mangas Lino', 'categoria' => 'Dama - Blusas', 'precio' => 65000, 'stock' => 20, 'descripcion' => 'Blusa fresca de lino para clima cálido'],
            ['nombre' => 'Blusa Transparencias Encaje', 'categoria' => 'Dama - Blusas', 'precio' => 95000, 'stock' => 15, 'descripcion' => 'Blusa con detalles de encaje y transparencias'],
            ['nombre' => 'Blusa Cuello Alto Básica', 'categoria' => 'Dama - Blusas', 'precio' => 55000, 'stock' => 40, 'descripcion' => 'Blusa básica de cuello alto, varios colores'],

            // ===== DAMA - VESTIDOS (5) =====
            ['nombre' => 'Vestido Midi Flores', 'categoria' => 'Dama - Vestidos', 'precio' => 150000, 'stock' => 12, 'descripcion' => 'Vestido midi con estampado floral, corte en A'],
            ['nombre' => 'Vestido Largo Fiesta', 'categoria' => 'Dama - Vestidos', 'precio' => 280000, 'stock' => 8, 'descripcion' => 'Vestido largo elegante para ocasiones especiales'],
            ['nombre' => 'Vestido Corto Casual', 'categoria' => 'Dama - Vestidos', 'precio' => 95000, 'stock' => 18, 'descripcion' => 'Vestido corto casual para uso diario'],
            ['nombre' => 'Vestido Cóctel Negro', 'categoria' => 'Dama - Vestidos', 'precio' => 220000, 'stock' => 10, 'descripcion' => 'Vestido negro tipo cóctel, corte ajustado'],
            ['nombre' => 'Vestido Maxi Bohemio', 'categoria' => 'Dama - Vestidos', 'precio' => 180000, 'stock' => 14, 'descripcion' => 'Vestido largo estilo bohemio con vuelo'],

            // ===== DAMA - PANTALONES (5) =====
            ['nombre' => 'Jean Skinny Tiro Alto', 'categoria' => 'Dama - Pantalones', 'precio' => 120000, 'stock' => 30, 'descripcion' => 'Jean ajustado tiro alto, strech'],
            ['nombre' => 'Pantalón Palazzo Lino', 'categoria' => 'Dama - Pantalones', 'precio' => 98000, 'stock' => 22, 'descripcion' => 'Pantalón palazzo ancho en lino'],
            ['nombre' => 'Jean Mom Fit', 'categoria' => 'Dama - Pantalones', 'precio' => 135000, 'stock' => 25, 'descripcion' => 'Jean corte mom fit vintage'],
            ['nombre' => 'Pantalón Pinzas Formal', 'categoria' => 'Dama - Pantalones', 'precio' => 110000, 'stock' => 20, 'descripcion' => 'Pantalón formal de pinzas para oficina'],
            ['nombre' => 'Pantalón Deportivo Jogger', 'categoria' => 'Dama - Pantalones', 'precio' => 75000, 'stock' => 35, 'descripcion' => 'Pantalón deportivo tipo jogger'],

            // ===== DAMA - FALDAS (3) =====
            ['nombre' => 'Falda Midi Plisada', 'categoria' => 'Dama - Faldas', 'precio' => 85000, 'stock' => 18, 'descripcion' => 'Falda midi con pliegues'],
            ['nombre' => 'Falda Lápiz Negra', 'categoria' => 'Dama - Faldas', 'precio' => 70000, 'stock' => 25, 'descripcion' => 'Falda lápiz negra clásica'],
            ['nombre' => 'Falda Corta Jean', 'categoria' => 'Dama - Faldas', 'precio' => 65000, 'stock' => 20, 'descripcion' => 'Falda corta en tela jean'],

            // ===== DAMA - SACOS (2) =====
            ['nombre' => 'Blazer Clásico Entallado', 'categoria' => 'Dama - Sacos', 'precio' => 180000, 'stock' => 15, 'descripcion' => 'Blazer formal entallado'],
            ['nombre' => 'Saco Tejido Oversize', 'categoria' => 'Dama - Sacos', 'precio' => 120000, 'stock' => 12, 'descripcion' => 'Saco tejido amplio estilo oversize'],

            // ===== CABALLERO - CAMISAS (4) =====
            ['nombre' => 'Camisa Manga Larga Lisa', 'categoria' => 'Caballero - Camisas', 'precio' => 95000, 'stock' => 35, 'descripcion' => 'Camisa formal lisa, varios colores'],
            ['nombre' => 'Camisa Cuadros Leñador', 'categoria' => 'Caballero - Camisas', 'precio' => 85000, 'stock' => 28, 'descripcion' => 'Camisa de cuadros estilo leñador'],
            ['nombre' => 'Camisa Lino Playa', 'categoria' => 'Caballero - Camisas', 'precio' => 110000, 'stock' => 20, 'descripcion' => 'Camisa fresca de lino'],
            ['nombre' => 'Camisa Slim Fit Rayas', 'categoria' => 'Caballero - Camisas', 'precio' => 105000, 'stock' => 22, 'descripcion' => 'Camisa ajustada con rayas verticales'],

            // ===== CABALLERO - CAMISETAS/POLOS (3) =====
            ['nombre' => 'Camiseta Básica Algodón', 'categoria' => 'Caballero - Camisetas', 'precio' => 45000, 'stock' => 50, 'descripcion' => 'Camiseta básica 100% algodón'],
            ['nombre' => 'Polo Manga Corta', 'categoria' => 'Caballero - Camisetas', 'precio' => 65000, 'stock' => 40, 'descripcion' => 'Polo clásico con cuello'],
            ['nombre' => 'Camiseta Estampada', 'categoria' => 'Caballero - Camisetas', 'precio' => 55000, 'stock' => 35, 'descripcion' => 'Camiseta con estampado gráfico'],

            // ===== CABALLERO - PANTALONES (3) =====
            ['nombre' => 'Jean Clásico Recto', 'categoria' => 'Caballero - Pantalones', 'precio' => 140000, 'stock' => 30, 'descripcion' => 'Jean corte recto clásico'],
            ['nombre' => 'Pantalón Chino Beige', 'categoria' => 'Caballero - Pantalones', 'precio' => 120000, 'stock' => 25, 'descripcion' => 'Pantalón chino formal'],
            ['nombre' => 'Jean Slim Fit Negro', 'categoria' => 'Caballero - Pantalones', 'precio' => 150000, 'stock' => 28, 'descripcion' => 'Jean ajustado negro'],

            // ===== CABALLERO - BERMUDAS (2) =====
            ['nombre' => 'Bermuda Jean', 'categoria' => 'Caballero - Bermudas', 'precio' => 75000, 'stock' => 30, 'descripcion' => 'Bermuda en tela jean'],
            ['nombre' => 'Bermuda Deportiva', 'categoria' => 'Caballero - Bermudas', 'precio' => 60000, 'stock' => 35, 'descripcion' => 'Bermuda deportiva con bolsillos'],

            // ===== CABALLERO - SACOS (1) =====
            ['nombre' => 'Saco Sport Casual', 'categoria' => 'Caballero - Sacos', 'precio' => 220000, 'stock' => 12, 'descripcion' => 'Saco sport para ocasiones casuales'],
        ];

        foreach ($productos as $producto) {
            Producto::create([
                'nombre' => $producto['nombre'],
                'descripcion' => $producto['descripcion'],
                'categoria' => $producto['categoria'],
                'precio' => $producto['precio'],
                'stock' => $producto['stock'],
                'stock_minimo' => 5,
                'codigo_barras' => 'ROD' . rand(10000, 99999),
                'activo' => true,
            ]);
        }

        // ========================================
        // 2. CLIENTES (20 clientes)
        // ========================================
        $clientes = [
            ['nombre' => 'María Fernanda García', 'email' => 'maria.garcia@email.com', 'telefono' => '3101234567', 'tipo' => 'VIP'],
            ['nombre' => 'Ana Lucía Martínez', 'email' => 'ana.martinez@email.com', 'telefono' => '3209876543', 'tipo' => 'Regular'],
            ['nombre' => 'Laura Sofía Rodríguez', 'email' => 'laura.rodriguez@email.com', 'telefono' => '3112345678', 'tipo' => 'Regular'],
            ['nombre' => 'Carolina Díaz', 'email' => 'carolina.diaz@email.com', 'telefono' => '3156789012', 'tipo' => 'VIP'],
            ['nombre' => 'Valentina Cruz', 'email' => 'valentina.cruz@email.com', 'telefono' => '3187654321', 'tipo' => 'Regular'],
            ['nombre' => 'Sandra Torres', 'email' => 'sandra.torres@email.com', 'telefono' => '3223456789', 'tipo' => 'Regular'],
            ['nombre' => 'Patricia Vargas', 'email' => 'patricia.vargas@email.com', 'telefono' => '3134567890', 'tipo' => 'VIP'],
            ['nombre' => 'Liliana Rojas', 'email' => 'liliana.rojas@email.com', 'telefono' => '3198765432', 'tipo' => 'Regular'],
            ['nombre' => 'Claudia Reyes', 'email' => 'claudia.reyes@email.com', 'telefono' => '3245678901', 'tipo' => 'Regular'],
            ['nombre' => 'Gloria Medina', 'email' => 'gloria.medina@email.com', 'telefono' => '3167890123', 'tipo' => 'Mayorista'],
            ['nombre' => 'Carlos Andrés López', 'email' => 'carlos.lopez@email.com', 'telefono' => '3108765432', 'tipo' => 'Regular'],
            ['nombre' => 'Juan Pablo Pérez', 'email' => 'juan.perez@email.com', 'telefono' => '3203456789', 'tipo' => 'VIP'],
            ['nombre' => 'Luis Fernando Gómez', 'email' => 'luis.gomez@email.com', 'telefono' => '3119876543', 'tipo' => 'Regular'],
            ['nombre' => 'Diego Ramírez', 'email' => 'diego.ramirez@email.com', 'telefono' => '3154567890', 'tipo' => 'Regular'],
            ['nombre' => 'Jorge Castro', 'email' => 'jorge.castro@email.com', 'telefono' => '3182345678', 'tipo' => 'Regular'],
            ['nombre' => 'Fernando Ortiz', 'email' => 'fernando.ortiz@email.com', 'telefono' => '3226789012', 'tipo' => 'VIP'],
            ['nombre' => 'Andrés Silva', 'email' => 'andres.silva@email.com', 'telefono' => '3135678901', 'tipo' => 'Regular'],
            ['nombre' => 'Héctor Muñoz', 'email' => 'hector.munoz@email.com', 'telefono' => '3193456789', 'tipo' => 'Regular'],
            ['nombre' => 'Ricardo Morales', 'email' => 'ricardo.morales@email.com', 'telefono' => '3247890123', 'tipo' => 'Mayorista'],
            ['nombre' => 'Pedro Sánchez', 'email' => 'pedro.sanchez@email.com', 'telefono' => '3168901234', 'tipo' => 'Regular'],
        ];

        foreach ($clientes as $cliente) {
            Cliente::create([
                'nombre' => $cliente['nombre'],
                'email' => $cliente['email'],
                'telefono' => $cliente['telefono'],
                'documento' => rand(10000000, 99999999),
                'tipo' => $cliente['tipo'],
                'direccion' => 'Calle ' . rand(1, 100) . ' # ' . rand(1, 50) . '-' . rand(1, 99),
                'activo' => true,
            ]);
        }

        // ========================================
        // 3. PROVEEDORES (10 proveedores de ropa)
        // ========================================
        $proveedores = [
            ['nombre' => 'Textiles La Concordia', 'empresa' => 'Textiles La Concordia SAS', 'email' => 'ventas@laconcordia.com'],
            ['nombre' => 'Confecciones del Valle', 'empresa' => 'Confecciones Valle Ltda', 'email' => 'pedidos@confecvallle.com'],
            ['nombre' => 'Moda Urbana Distribuciones', 'empresa' => 'Moda Urbana SAS', 'email' => 'info@modaurbana.com'],
            ['nombre' => 'Importadora Fashion Style', 'empresa' => 'Fashion Style Import', 'email' => 'ventas@fashionstyle.com'],
            ['nombre' => 'Textilera Nacional', 'empresa' => 'Textilera Nacional SA', 'email' => 'contacto@texnacional.com'],
            ['nombre' => 'Confecciones Premium', 'empresa' => 'Premium Textil Ltda', 'email' => 'ventas@premium.com'],
            ['nombre' => 'Distribuidora Moda Total', 'empresa' => 'Moda Total SAS', 'email' => 'pedidos@modatotal.com'],
            ['nombre' => 'Textiles del Pacífico', 'empresa' => 'Pacífico Textil SA', 'email' => 'info@pacifico.com'],
            ['nombre' => 'Confecciones Elegance', 'empresa' => 'Elegance Fashion SAS', 'email' => 'ventas@elegance.com'],
            ['nombre' => 'Importadora Textil Global', 'empresa' => 'Global Textil Import', 'email' => 'contacto@globaltextil.com'],
        ];

        foreach ($proveedores as $proveedor) {
            Proveedor::create([
                'nombre' => $proveedor['nombre'],
                'empresa' => $proveedor['empresa'],
                'email' => $proveedor['email'],
                'telefono' => '601' . rand(2000000, 9999999),
                'documento' => '900' . rand(100000, 999999),
                'direccion' => 'Carrera ' . rand(1, 50) . ' # ' . rand(1, 100) . '-' . rand(1, 99),
                'sitio_web' => 'www.' . strtolower(str_replace(' ', '', $proveedor['nombre'])) . '.com',
                'activo' => true,
            ]);
        }

        // ========================================
        // 4. VENTAS (50 ventas)
        // ========================================
        $user = User::first();
        $clientesIds = Cliente::pluck('id')->toArray();
        $productosDisponibles = Producto::all();

        for ($i = 0; $i < 50; $i++) {
            $fechaVenta = Carbon::now()->subDays(rand(0, 30));
            
            $venta = Venta::create([
                'cliente_id' => $clientesIds[array_rand($clientesIds)],
                'user_id' => $user->id,
                'numero_venta' => 'V-' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                'subtotal' => 0,
                'impuesto' => 0,
                'descuento' => 0,
                'total' => 0,
                'estado' => 'Completada',
                'metodo_pago' => ['Efectivo', 'Tarjeta', 'Transferencia'][rand(0, 2)],
                'created_at' => $fechaVenta,
                'updated_at' => $fechaVenta,
            ]);

            $numProductos = rand(1, 4);
            $subtotalVenta = 0;

            for ($j = 0; $j < $numProductos; $j++) {
                $producto = $productosDisponibles->random();
                $cantidad = rand(1, 2);
                $precioUnitario = $producto->precio;
                $subtotal = $precioUnitario * $cantidad;

                VentaDetalle::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                    'subtotal' => $subtotal,
                ]);

                $subtotalVenta += $subtotal;
            }

            $impuesto = $subtotalVenta * 0.19;
            $descuento = rand(0, 1) ? ($subtotalVenta * 0.05) : 0;
            $total = $subtotalVenta + $impuesto - $descuento;

            $venta->update([
                'subtotal' => $subtotalVenta,
                'impuesto' => $impuesto,
                'descuento' => $descuento,
                'total' => $total,
            ]);
        }

        $this->command->info('✅ Datos de ejemplo de ROPA creados exitosamente!');
        $this->command->info('   - 30 Productos de Ropa (Dama/Caballero)');
        $this->command->info('   - 20 Clientes');
        $this->command->info('   - 10 Proveedores de textiles');
        $this->command->info('   - 50 Ventas con detalles');
    }
}
