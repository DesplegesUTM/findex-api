CREATE TABLE usuario (
  id_usuario serial PRIMARY KEY NOT NULL,
  nombre varchar(50),
  apellido varchar(50), 
  fecha_nacimiento date,   
  telefono varchar(15) UNIQUE, -- formato internacional +xx-xxxx...
  id_direccion integer, 
  email varchar(100) UNIQUE NOT NULL,
  contraseña varchar(100) NOT NULL, -- para hash bcrypt, suele ser 60-100 caracteres
  fecha_registro date NOT NULL,
  id_tipo integer, 
  estado boolean NOT NULL
  -- nombre, apellido, fecha_nacimiento, telefono, id_direccion, email, contraseña, fecha_registro, id_tipo, estado
);

CREATE TABLE prestamista (
  id_prestamista integer PRIMARY KEY NOT NULL,
  capital decimal(12,2) NOT NULL, -- 12 dígitos, 2 decimales
  id_rango integer NOT NULL, 
  estado boolean NOT NULL
);

CREATE TABLE prestatario (
  id_prestatario integer PRIMARY KEY NOT NULL,
  nombre_negocio varchar(100) UNIQUE NOT NULL, 
  id_direccion integer NOT NULL,
  ingreso_mensual decimal(12,2) NOT NULL,
  calificacion_crediticia decimal(5,2) NOT NULL,
  estado boolean NOT NULL
);

CREATE TABLE oferta_prestamo (
  id_oferta serial PRIMARY KEY NOT NULL,
  id_prestamista integer NOT NULL,
  codigo_oferta varchar(20) UNIQUE NOT NULL,
  monto decimal(12,2) NOT NULL,
  tasa_interes decimal(5,2) NOT NULL,
  id_frecuencia integer NOT NULL,
  nro_cuotas integer NOT NULL,
  monto_cuota decimal(12,2) NOT NULL,
  fecha_publicacion date NOT NULL,
  estado boolean NOT NULL
);

CREATE TABLE prestamo (
  id_prestamo serial PRIMARY KEY NOT NULL,
  id_oferta integer NOT NULL,
  id_prestatario integer NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_fin date NOT NULL,
  estado boolean NOT NULL
);

CREATE TABLE pago (
  id_pago serial PRIMARY KEY NOT NULL,
  id_prestamo integer NOT NULL,
  fecha_pago date NOT NULL,
  monto_pagado decimal(12,2) NOT NULL,
  id_metodo integer NOT NULL,
  comprobante_url varchar(255) UNIQUE NOT NULL, -- URL máximo recomendado
  estado boolean NOT NULL
  -- id_pago, id_prestamo, fecha_pago, monto_pagado, id_metodo, comprobante_url, estado
);

CREATE TABLE tipo_usuario (
  id_tipo serial PRIMARY KEY NOT NULL,
  tipo varchar(50) UNIQUE NOT NULL,
  estado boolean NOT NULL
);

CREATE TABLE rango (
  id_rango serial PRIMARY KEY NOT NULL,
  rango varchar(50) UNIQUE NOT NULL,
  estado boolean NOT NULL
); 

CREATE TABLE ciudad (
  id_ciudad serial PRIMARY KEY NOT NULL,
  nombre_ciudad varchar(100) UNIQUE NOT NULL,
  estado boolean NOT NULL
);

CREATE TABLE barrio (
  id_barrio serial PRIMARY KEY NOT NULL,
  id_ciudad integer NOT NULL,
  nombre_barrio varchar(100) UNIQUE NOT NULL,
  estado boolean NOT NULL
  -- id_ciudad, nombre_barrio, estado
);

CREATE TABLE direccion (
  id_direccion serial PRIMARY KEY NOT NULL,
  id_barrio integer NOT NULL,
  calle1 varchar(100) UNIQUE NOT NULL,
  calle2 varchar(100) UNIQUE NOT NULL,
  estado boolean NOT NULL
  -- id_barrio, calle1, calle2, estado
);

CREATE TABLE frecuencia_pago (
  id_frecuencia serial PRIMARY KEY NOT NULL,
  frecuencia_pago varchar(50) UNIQUE NOT NULL,
  estado boolean NOT NULL
  -- frecuencia_pago, estado
);

CREATE TABLE metodo_pago (
  id_metodo serial PRIMARY KEY NOT NULL,
  metodo varchar(50) UNIQUE NOT NULL,
  estado boolean NOT NULL
  -- metodo, estado
);




--+--------------------------------------------------------+
--|                   CLAVES FORANEAS                      |
 --+--------------------------------------------------------+


# FK EN USUARIO
ALTER TABLE usuario ADD CONSTRAINT fk_tipo_usuario FOREIGN KEY (id_tipo) REFERENCES tipo_usuario(id_tipo);
ALTER TABLE usuario ADD CONSTRAINT fk_direccion_usuario FOREIGN KEY (id_direccion) REFERENCES direccion(id_direccion);

#FK EN PRESTATARIO
ALTER TABLE prestatario ADD CONSTRAINT fk_usuario_prestatario FOREIGN KEY (id_prestatario) REFERENCES usuario(id_usuario) ON DELETE CASCADE;
ALTER TABLE prestatario ADD CONSTRAINT fk_direccion_prestatario FOREIGN KEY (id_direccion) REFERENCES direccion(id_direccion);

# FK EN PRESTAMISTA 
ALTER TABLE prestamista ADD CONSTRAINT fk_usuario_prestamista FOREIGN KEY (id_prestamista) REFERENCES usuario(id_usuario) ON DELETE CASCADE;
ALTER TABLE prestamista ADD CONSTRAINT fk_rango FOREIGN KEY (id_rango) REFERENCES rango(id_rango);

# FK EN OFERTA PRESTAMO
ALTER TABLE oferta_prestamo ADD CONSTRAINT fk_prestamista FOREIGN KEY (id_prestamista) REFERENCES prestamista(id_prestamista);
ALTER TABLE oferta_prestamo ADD CONSTRAINT fk_frecuencia FOREIGN KEY (id_frecuencia) REFERENCES frecuencia_pago(id_frecuencia);

# FK EN PRESTAMO
ALTER TABLE prestamo ADD CONSTRAINT fk_oferta FOREIGN KEY (id_oferta) REFERENCES oferta_prestamo(id_oferta);
ALTER TABLE prestamo ADD CONSTRAINT fk_prestatario FOREIGN KEY (id_prestatario) REFERENCES prestatario(id_prestatario);

# FK EN PAGO
ALTER TABLE pago ADD CONSTRAINT fk_prestamo FOREIGN KEY (id_prestamo) REFERENCES prestamo(id_prestamo) ON DELETE CASCADE;
ALTER TABLE pago ADD CONSTRAINT fk_metodo FOREIGN KEY (id_metodo) REFERENCES metodo_pago(id_metodo);

# FK EN BARRIO
ALTER TABLE barrio ADD CONSTRAINT fk_ciudad FOREIGN KEY (id_ciudad) REFERENCES ciudad(id_ciudad);

# FK EN DIRECCION
ALTER TABLE direccion ADD CONSTRAINT fk_barrio FOREIGN KEY (id_barrio) REFERENCES barrio(id_barrio);





CREATE TABLE solicitud_prestamo (
  id_solicitud serial PRIMARY KEY,
  id_oferta integer NOT NULL,
  id_prestatario integer NOT NULL,
  monto_solicitado decimal(12,2),
  comentario text,
  estado varchar(20) NOT NULL DEFAULT 'pendiente', -- pendiente | aceptada | rechazada
  fecha_creacion timestamp NOT NULL DEFAULT NOW()
);



ALTER TABLE solicitud_prestamo
ADD CONSTRAINT fk_oferta FOREIGN KEY (id_oferta) REFERENCES oferta_prestamo(id_oferta) ON DELETE CASCADE;

ALTER TABLE solicitud_prestamo
ADD CONSTRAINT fk_prestatario FOREIGN KEY (id_prestatario) REFERENCES prestatario(id_prestatario) ON DELETE CASCADE;

--+--------------------------------------------------------+
--|      HASTA AQUI LA CREACION DE LA BASE DE DATOS        |
--+--------------------------------------------------------+


-- TIPO DE USUARIO
INSERT INTO tipo_usuario (tipo, estado) VALUES
('Prestamista', true),
('Prestatario', true);

-- CIUDADES
INSERT INTO ciudad (nombre_ciudad, estado) VALUES
('Quito', true),
('Guayaquil', true);

-- BARRIOS
INSERT INTO barrio (id_ciudad, nombre_barrio, estado) VALUES
(1, 'Centro', true),
(1, 'Norte', true),
(1, 'Sur', true),
(2, 'Este', true),
(2, 'Oeste', true);

-- DIRECCIONES
INSERT INTO direccion (id_barrio, calle1, calle2, estado) VALUES
(1, 'Av. Colon', 'Av. 10 de Agosto', true),
(2, 'Av. Amazonas', 'Av. Patria', true),
(3, 'Av. Maldonado', 'Av. Mariscal Sucre', true),
(4, 'Av. Francisco de Orellana', 'Av. Kennedy', true),
(5, 'Av. Del Bombero', 'Via a la Costa', true),
(1, 'Calle Vargas', 'Calle Bolívar', true),
(2, 'Calle Eloy Alfaro', 'Calle 6 de Diciembre', true),
(3, 'Calle Pedro Vicente Maldonado', 'Calle Loja', true),
(4, 'Calle Portete', 'Calle Juan Tanca Marengo', true),
(5, 'Calle Daule', 'Calle Gomez Rendon', true);

-- USUARIOS
INSERT INTO usuario (nombre, apellido, fecha_nacimiento, telefono, id_direccion, email, contraseña, fecha_registro, id_tipo, estado) VALUES
('Carlos', 'Romero', '1983-11-15', '0998592486', 1, 'carlos.romero36@gmail.com', 'ef92b778bafe771e...', '2024-01-21', 1, true),
('Valeria', 'Garcia', '1992-06-02', '0992959338', 2, 'valeria.garcia82@yahoo.com', 'ef92b778bafe771e...', '2023-03-27', 1, false),
('Pedro', 'Gomez', '1998-10-10', '0962421816', 3, 'pedro.gomez26@hotmail.com', 'ef92b778bafe771e...', '2024-07-12', 1, true),
('Ana', 'Sanchez', '1996-08-17', '0918563665', 4, 'ana.sanchez4@yahoo.com', 'ef92b778bafe771e...', '2022-09-08', 1, true),
('Sofia', 'Perez', '2004-05-21', '0941236694', 5, 'sofia.perez67@hotmail.com', 'ef92b778bafe771e...', '2022-01-19', 1, false),
('Diego', 'Lopez', '1999-12-19', '0937190151', 6, 'diego.lopez77@gmail.com', 'ef92b778bafe771e...', '2024-10-16', 1, true),
('Lucia', 'Rodriguez', '1991-09-25', '0998038989', 7, 'lucia.rodriguez45@yahoo.com', 'ef92b778bafe771e...', '2024-11-30', 1, true),
('Juan', 'Gomez', '1984-10-05', '0953547752', 8, 'juan.gomez40@gmail.com', 'ef92b778bafe771e...', '2022-05-14', 1, false),
('Luis', 'Romero', '1985-07-30', '0982768547', 9, 'luis.romero99@yahoo.com', 'ef92b778bafe771e...', '2023-06-02', 1, true),
('Maria', 'Martinez', '2001-03-03', '0983282853', 10, 'maria.martinez87@hotmail.com', 'ef92b778bafe771e...', '2024-12-03', 1, true),
('Pedro', 'Romero', '1982-02-15', '0972806044', 1, 'pedro.romero38@hotmail.com', 'ef92b778bafe771e...', '2023-02-21', 2, true),
('Ana', 'Rodriguez', '1987-08-01', '0912227535', 2, 'ana.rodriguez10@gmail.com', 'ef92b778bafe771e...', '2022-06-23', 2, false),
('Sofia', 'Sanchez', '1990-06-08', '0992090820', 3, 'sofia.sanchez58@gmail.com', 'ef92b778bafe771e...', '2023-11-22', 2, true),
('Carlos', 'Garcia', '1993-04-29', '0962804184', 4, 'carlos.garcia1@gmail.com', 'ef92b778bafe771e...', '2023-01-09', 2, true),
('Valeria', 'Lopez', '1995-11-11', '0962542725', 5, 'valeria.lopez95@hotmail.com', 'ef92b778bafe771e...', '2024-03-13', 2, false),
('Juan', 'Garcia', '1981-01-20', '0927262021', 6, 'juan.garcia80@yahoo.com', 'ef92b778bafe771e...', '2023-04-28', 2, true),
('Lucia', 'Martinez', '1989-07-13', '0981237452', 7, 'lucia.martinez10@hotmail.com', 'ef92b778bafe771e...', '2024-06-09', 2, true),
('Luis', 'Lopez', '2000-10-30', '0950048440', 8, 'luis.lopez93@hotmail.com', 'ef92b778bafe771e...', '2024-04-17', 2, false),
('Maria', 'Perez', '1994-12-08', '0927588904', 9, 'maria.perez59@hotmail.com', 'ef92b778bafe771e...', '2023-09-11', 2, true),
('Diego', 'Sanchez', '2003-08-19', '0932453284', 10, 'diego.sanchez93@gmail.com', 'ef92b778bafe771e...', '2024-08-27', 2, true);

-- RANGOS
INSERT INTO rango (rango, estado) VALUES
('Platino', true),
('Oro', true),
('Diamante', true);

-- PRESTAMISTAS (id_usuario del 1 al 10)
INSERT INTO prestamista (id_prestamista, capital, id_rango, estado) VALUES
(1, 5000.00, 1, true),
(2, 3000.00, 2, true),
(3, 7000.00, 3, true),
(4, 2500.00, 2, true),
(5, 17000.00, 3, true),
(6, 18000.00, 1, true),
(7, 12000.00, 1, true),
(8, 1000.00, 2, true),
(9, 2000.00, 1, true),
(10, 14000.00, 1, true);

-- PRESTATARIOS (id_usuario del 11 al 20)
INSERT INTO prestatario (id_prestatario, nombre_negocio, id_direccion, ingreso_mensual, calificacion_crediticia, estado) VALUES
(11, 'Tienda La Esperanza', 6, 1200.00, 7.5, true),
(12, 'CyberTec', 7, 1800.00, 8.2, true),
(13, 'Panadería Don Pan', 8, 950.00, 6.9, true),
(14, 'Ferretería El Tornillo', 9, 2400.00, 8.7, true),
(15, 'Oro Verde', 10, 1500.00, 7.0, true),
(16, 'Tres Hermanos', 3, 1500.00, 7.0, true),
(17, 'Economaxi', 5, 1500.00, 7.0, true),
(18, 'El trigo Manaba', 6, 1500.00, 7.0, true),
(19, 'Comisarito Pepe', 9, 1500.00, 7.0, true),
(20, 'Papelería y Más', 2, 1500.00, 7.0, true);

-- FRECUENCIA DE PAGO
INSERT INTO frecuencia_pago (frecuencia_pago, estado) VALUES
('Diaria', true),
('Semanal', true),
('Quincenal', true),
('Mensual', true);

-- OFERTAS DE PRÉSTAMO (orden desde id 1 al 7)
INSERT INTO oferta_prestamo (id_prestamista, monto, tasa_interes, id_frecuencia, nro_cuotas, monto_cuota, fecha_publicacion, estado) VALUES
(2, 1000.00, 5.00, 4, 12, 95.00, '2025-05-01', true),
(4, 1500.00, 4.50, 2, 6, 270.00, '2025-05-02', true),
(6, 800.00, 6.00, 1, 30, 30.00, '2025-05-03', true),
(8, 500.00, 3.50, 3, 10, 55.00, '2025-05-04', true),
(10, 2000.00, 4.00, 4, 8, 260.00, '2025-05-05', true),
(1, 2000.00, 4.00, 4, 8, 260.00, '2025-05-05', true),
(3, 2000.00, 4.00, 4, 8, 260.00, '2025-05-05', true);

-- PRÉSTAMOS (ofertas de id 1 al 7)
INSERT INTO prestamo (id_oferta, id_prestatario, fecha_inicio, fecha_fin, estado) VALUES
(9, 13, '2025-05-01', '2026-05-01', true),
(10, 16, '2025-05-02', '2025-11-02', true),
(11, 20, '2025-05-03', '2025-06-02', true),
(12, 12, '2025-05-04', '2025-09-04', true),
(13, 17, '2025-05-05', '2025-12-05', true),
(14, 18, '2025-05-05', '2026-01-05', true),
(15, 19, '2025-05-05', '2025-12-05', true);



SELECT 
  u.id_usuario,
  u.nombre,
  u.apellido,
  u.fecha_nacimiento,
  u.telefono,
  u.email,
  u.fecha_registro,
  tu.tipos AS tipo_usuario,
  d.calle1,
  d.calle2,
  b.nombre_barrio,
  c.nombre_ciudad,
  -- Prestamista
  p.capital AS capital_prestamista,
  r.rangos AS rango_prestamista,
  -- Oferta de préstamos si es prestamista
  op.id_oferta,
  op.monto AS monto_ofertado,
  op.tasa_interes,
  op.nro_cuotas,
  op.monto_cuota,
  fp.frecuencia_pago,
  -- Prestatario
  pt.nombre_negocio,
  pt.ingreso_mensual,
  pt.calificacion_crediticia,
  -- Préstamos tomados si es prestatario
  pr.id_prestamo,
  pr.fecha_inicio,
  pr.fecha_fin,
  -- Pagos hechos
  pa.id_pago,
  pa.fecha_pago,
  pa.monto_pagado,
  mp.metodo AS metodo_pago,
  pa.comprobante_url
FROM usuario u
JOIN tipo_usuario tu ON u.id_tipo = tu.id_tipo
JOIN direccion d ON u.id_direccion = d.id_direccion
JOIN barrio b ON d.id_barrio = b.id_barrio
JOIN ciudad c ON b.id_ciudad = c.id_ciudad
LEFT JOIN prestamista p ON u.id_usuario = p.id_prestamista
LEFT JOIN rango r ON p.id_rango = r.id_rango
LEFT JOIN oferta_prestamo op ON p.id_prestamista = op.id_prestamista
LEFT JOIN frecuencia_pago fp ON op.id_frecuencia = fp.id_frecuencia
LEFT JOIN prestatario pt ON u.id_usuario = pt.id_prestatario
LEFT JOIN prestamo pr ON pt.id_prestatario = pr.id_prestatario
LEFT JOIN pago pa ON pr.id_prestamo = pa.id_prestamo
LEFT JOIN metodo_pago mp ON pa.id_metodo = mp.id_metodo
WHERE u.id_usuario = 2;




SELECT 
  u.id_usuario,
  u.nombre,
  u.apellido,
  u.fecha_nacimiento,
  u.telefono,
  u.email,
  u.fecha_registro,
  tu.tipos AS tipo_usuario,
  u.estado AS usuario_activo,
  d.calle1,
  d.calle2,
  b.nombre_barrio,
  c.nombre_ciudad,
  p.capital AS capital_prestamista,
  r.rangos AS rango_prestamista,
  p.estado AS prestamista_activo,
  pt.nombre_negocio,
  pt.ingreso_mensual,
  pt.calificacion_crediticia,
  pt.estado AS prestatario_activo

FROM usuario u
JOIN tipo_usuario tu ON u.id_tipo = tu.id_tipo
JOIN direccion d ON u.id_direccion = d.id_direccion
JOIN barrio b ON d.id_barrio = b.id_barrio
JOIN ciudad c ON b.id_ciudad = c.id_ciudad
LEFT JOIN prestamista p ON u.id_usuario = p.id_prestamista
LEFT JOIN rango r ON p.id_rango = r.id_rango
LEFT JOIN prestatario pt ON u.id_usuario = pt.id_prestatario
WHERE u.estado=TRUE;


SELECT id_usuario from usuario where id_tipo=3