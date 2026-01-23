<?php
// Array asociativo de tipos de costos
// Total de tipos de costos: 7
// Generado automáticamente

$tipoCostos = [
    [
        'id' => 1,
        'nombre' => 'MANO DE OBRA',
        'codigo' => 'TC0000000001',
        'estado' => 1
    ],
    [
        'id' => 2,
        'nombre' => 'MATERIALES',
        'codigo' => 'TC0000000002',
        'estado' => 1
    ],
    [
        'id' => 3,
        'nombre' => 'EQUIPO',
        'codigo' => 'TC0000000003',
        'estado' => 1
    ],
    [
        'id' => 4,
        'nombre' => 'SUB-CONTRATOS',
        'codigo' => 'TC0000000004',
        'estado' => 1
    ],
    [
        'id' => 5,
        'nombre' => 'COSTOS AUXILIARES',
        'codigo' => 'TC0000000005',
        'estado' => 1
    ],
    [
        'id' => 6,
        'nombre' => 'GASTO GENERAL',
        'codigo' => 'TC0000000006',
        'estado' => 1
    ],
    [
        'id' => 7,
        'nombre' => 'REPUESTOS, COMBUSTIBLE Y LUBRICANTES',
        'codigo' => 'TC0000000007',
        'estado' => 1
    ]
];

// Función para obtener todos los tipos de costos activos
function obtenerTipoCostosActivos($tipoCostos) {
    return array_filter($tipoCostos, function($tipo) {
        return $tipo['estado'] === 1;
    });
}

// Función para buscar tipo de costo por ID
function buscarTipoCostoPorId($tipoCostos, $id) {
    foreach ($tipoCostos as $tipo) {
        if ($tipo['id'] === $id) {
            return $tipo;
        }
    }
    return null;
}

// Función para buscar tipo de costo por código
function buscarTipoCostoPorCodigo($tipoCostos, $codigo) {
    foreach ($tipoCostos as $tipo) {
        if ($tipo['codigo'] === $codigo) {
            return $tipo;
        }
    }
    return null;
}

// Función para buscar tipo de costo por nombre
function buscarTipoCostoPorNombre($tipoCostos, $nombre) {
    foreach ($tipoCostos as $tipo) {
        if (strtoupper($tipo['nombre']) === strtoupper($nombre)) {
            return $tipo;
        }
    }
    return null;
}

// Función para obtener lista de nombres de tipos de costos
function obtenerNombresTipoCostos($tipoCostos) {
    return array_map(function($tipo) {
        return $tipo['nombre'];
    }, $tipoCostos);
}

// Estadísticas
// echo "Total de tipos de costos: " . count($tipoCostos) . "\n";
// echo "Tipos de costos activos: " . count(obtenerTipoCostosActivos($tipoCostos)) . "\n";

?>
