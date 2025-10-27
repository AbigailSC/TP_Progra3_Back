USE autoservicio_db;

-- ========================================
-- TIPOS DE PRODUCTOS
-- ========================================
INSERT INTO tipos (nombre)
VALUES ('Remeras'),('Buzos');

-- ========================================
-- USUARIOS (Admins y Staff)
-- ========================================
-- Password para todos: Admin123!

INSERT INTO usuarios (nombre, email, password, admin) VALUES
    ('Juan Administrador', 'admin@autoservicio.com', '$2a$12$Gq2Hu.4U620oWdKaR4TCOub0sLGDQ0gAk4T8z9xk8/hhO1Ojq9OB6', TRUE),
    ('María González', 'maria@autoservicio.com', '$2a$12$Gq2Hu.4U620oWdKaR4TCOub0sLGDQ0gAk4T8z9xk8/hhO1Ojq9OB6', TRUE),
    ('Ana López', 'ana@autoservicio.com', '$2a$12$Gq2Hu.4U620oWdKaR4TCOub0sLGDQ0gAk4T8z9xk8/hhO1Ojq9OB6', TRUE)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- ========================================
-- CLIENTES
-- ========================================
INSERT INTO clientes (nombre, telefono, email) VALUES
    ('Pedro Martínez', '1145678901', 'pedro@email.com'),
    ('Laura Fernández', '1156789012', 'laura@email.com'),
    ('Diego Rodríguez', '1167890123', 'diego@email.com'),
    ('Sofía Ramírez', '1178901234', 'sofia@email.com'),
    ('Martín Castro', '1189012345', 'martin@email.com'),
    ('Lucía Romero', '1190123456', 'lucia@email.com'),
    ('Facundo Torres', '1101234567', 'facundo@email.com'),
    ('Valentina Gómez', '1112345678', 'valentina@email.com'),
    ('Santiago Díaz', '1123456789', 'santiago@email.com'),
    ('Camila Ruiz', '1134567890', NULL)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- ========================================
-- PRODUCTOS - REMERAS (tipo 1)
-- ========================================
INSERT INTO productos (titulo, precio, stock, descripcion, sku, url_image, id_usuario, id_tipo, activo) VALUES
    ('Remera Lisa Negra', 4500.00, 25, 'Remera de algodón 100% talle S a XXL', 'REM-LIS-NEG-001', 'https://picsum.photos/200/200?random=1', 1, 1, TRUE),
    ('Remera Lisa Blanca', 4500.00, 30, 'Remera de algodón 100% talle S a XXL', 'REM-LIS-BLA-001', 'https://picsum.photos/200/200?random=2', 1, 1, TRUE),
    ('Remera Lisa Gris', 4500.00, 28, 'Remera de algodón 100% talle S a XXL', 'REM-LIS-GRI-001', 'https://picsum.photos/200/200?random=3', 1, 1, TRUE),
    ('Remera Estampada Flores', 5200.00, 20, 'Remera con estampado floral', 'REM-EST-FLO-001', 'https://picsum.photos/200/200?random=4', 1, 1, TRUE),
    ('Remera Estampada Rayas', 5000.00, 22, 'Remera a rayas horizontales', 'REM-EST-RAY-001', 'https://picsum.photos/200/200?random=5', 1, 1, TRUE),
    ('Remera Deportiva Nike', 8500.00, 15, 'Remera técnica para deporte', 'REM-DEP-NIK-001', 'https://picsum.photos/200/200?random=6', 2, 1, TRUE),
    ('Remera Deportiva Adidas', 8200.00, 18, 'Remera técnica para deporte', 'REM-DEP-ADI-001', 'https://picsum.photos/200/200?random=7', 2, 1, TRUE),
    ('Remera Oversize Negra', 6800.00, 12, 'Remera corte oversize', 'REM-OVE-NEG-001', 'https://picsum.photos/200/200?random=8', 1, 1, TRUE),
    ('Remera V-Neck Blanca', 4800.00, 25, 'Remera cuello en V', 'REM-VNE-BLA-001', 'https://picsum.photos/200/200?random=9', 1, 1, TRUE),
    ('Remera Manga Larga Negra', 5500.00, 20, 'Remera manga larga básica', 'REM-MLA-NEG-001', 'https://picsum.photos/200/200?random=10', 1, 1, TRUE),
    ('Remera Manga Larga Gris', 5500.00, 18, 'Remera manga larga básica', 'REM-MLA-GRI-001', 'https://picsum.photos/200/200?random=11', 1, 1, TRUE),
    ('Remera Estampada Banda', 6200.00, 15, 'Remera con estampado de banda', 'REM-EST-BAN-001', 'https://picsum.photos/200/200?random=12', 1, 1, TRUE),
    ('Remera Polo Negra', 7500.00, 14, 'Remera tipo polo clásica', 'REM-POL-NEG-001', 'https://picsum.photos/200/200?random=13', 1, 1, TRUE),
    ('Remera Polo Azul', 7500.00, 16, 'Remera tipo polo clásica', 'REM-POL-AZU-001', 'https://picsum.photos/200/200?random=14', 3, 1, TRUE)
ON DUPLICATE KEY UPDATE titulo=titulo;

-- ========================================
-- PRODUCTOS - BUZOS (tipo 2)
-- ========================================
INSERT INTO productos (titulo, precio, stock, descripcion, sku, url_image, id_usuario, id_tipo, activo) VALUES
    ('Buzo Canguro Negro', 12500.00, 18, 'Buzo con capucha y bolsillo delantero', 'BUZ-CAN-NEG-001', 'https://picsum.photos/200/200?random=15', 1, 2, TRUE),
    ('Buzo Canguro Gris', 12500.00, 20, 'Buzo con capucha y bolsillo delantero', 'BUZ-CAN-GRI-001', 'https://picsum.photos/200/200?random=16', 1, 2, TRUE),
    ('Buzo Canguro Azul', 12500.00, 15, 'Buzo con capucha y bolsillo delantero', 'BUZ-CAN-AZU-001', 'https://picsum.photos/200/200?random=17', 1, 2, TRUE),
    ('Buzo sin Capucha Negro', 10500.00, 22, 'Buzo cuello redondo básico', 'BUZ-SIN-NEG-001', 'https://picsum.photos/200/200?random=18', 1, 2, TRUE),
    ('Buzo sin Capucha Gris', 10500.00, 24, 'Buzo cuello redondo básico', 'BUZ-SIN-GRI-001', 'https://picsum.photos/200/200?random=19', 1, 2, TRUE),
    ('Buzo con Cierre Negro', 13500.00, 14, 'Buzo con cierre frontal y capucha', 'BUZ-CIE-NEG-001', 'https://picsum.photos/200/200?random=20', 1, 2, TRUE),
    ('Buzo con Cierre Azul', 13500.00, 12, 'Buzo con cierre frontal y capucha', 'BUZ-CIE-AZU-001', 'https://picsum.photos/200/200?random=21', 1, 2, TRUE),
    ('Buzo Deportivo Nike', 18500.00, 10, 'Buzo técnico para deporte', 'BUZ-DEP-NIK-001', 'https://picsum.photos/200/200?random=22', 1, 2, TRUE),
    ('Buzo Deportivo Adidas', 17800.00, 12, 'Buzo técnico para deporte', 'BUZ-DEP-ADI-001', 'https://picsum.photos/200/200?random=23', 1, 2, TRUE),
    ('Buzo Oversize Negro', 14500.00, 10, 'Buzo corte oversize con capucha', 'BUZ-OVE-NEG-001', 'https://picsum.photos/200/200?random=24', 1, 2, TRUE),
    ('Buzo Estampado Banda', 15200.00, 8, 'Buzo con estampado de banda', 'BUZ-EST-BAN-001', 'https://picsum.photos/200/200?random=25', 1, 2, TRUE),
    ('Buzo Crewneck Gris', 11800.00, 16, 'Buzo cuello redondo clásico', 'BUZ-CRE-GRI-001', 'https://picsum.photos/200/200?random=26', 1, 2, TRUE)
ON DUPLICATE KEY UPDATE titulo=titulo;