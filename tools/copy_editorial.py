# -*- coding: utf-8 -*-
"""
Copy editorial de la landing: el gancho, el área y los «momentos» de cada
título, indexados por el número de fila del Excel.

Este es el único archivo que hay que tocar cuando entra una lista nueva:
escribir un gancho por título y asignarle área y momentos. Si un título se
queda sin gancho, la ficha sigue funcionando (solo pierde la frase de venta).

El gancho es la promesa en una línea: qué se lleva el lector si abre el libro.
Segunda persona, entre 6 y 14 palabras, sin adjetivos de folleto.
"""

# Claves de los «momentos». Deben coincidir con src/data/taxonomy.ts.
MOOD_KEYS = ("entender", "aprobar", "cuidar", "cuerpo", "escapar", "justicia")

HOOKS = {
    1: "Antes de que existieran las bibliotecas, alguien tuvo que imaginarlas.",
    2: "El futuro no está adelante. Está en todo lo que decidimos olvidar.",
    3: "Si vives agotado y no sabes por qué, aquí está la respuesta.",
    4: "La guerra terminó. Sus estructuras siguen gobernando.",
    5: "No eres malo con el dinero: nadie te explicó cómo piensas con él.",
    6: "Deja de memorizar fórmulas y empieza a ver el mecanismo.",
    7: "La química general por fin encaja, capítulo tras capítulo.",
    8: "Todo lo demás se sostiene aquí. Por eso se llama central.",
    9: "La vida entera, de la célula al ecosistema, en un solo hilo.",
    10: "La bioquímica que sí conecta con el paciente que verás mañana.",
    11: "El tratado con el que aprendieron a pensar generaciones de médicos.",
    12: "De la molécula al diagnóstico sin perder el hilo una sola página.",
    13: "Nueve meses explicados célula por célula.",
    14: "Tu espalda no está rota. Está esperando que la muevas bien.",
    15: "La referencia que decide qué fármaco, cuánto y por qué.",
    16: "Cómo tu cuerpo libra, ahora mismo, una guerra que nunca ves.",
    17: "La obra que nombra lo que sí llega a la consulta en Latinoamérica.",
    18: "Aprende a escuchar a un paciente que todavía no sabe explicarse.",
    19: "Todo lo que se mueve obedece a estas páginas.",
    20: "Antes de construir algo que resista, entiende por qué no cae.",
    21: "Técnica, fuerza y respiración: el agua deja de ser resistencia.",
    22: "Vuelve a Panem justo cuando todo estaba por romperse.",
    23: "Antes de ser tirano, Snow también tuvo miedo.",
    24: "Un trato falso, un escándalo real y un amor que nadie planeó.",
    25: "Él lo tenía todo calculado. Ella no estaba en el plan.",
    26: "El año en que Harry descubre que el pasado también persigue.",
    27: "El torneo donde la infancia se acaba de golpe.",
    28: "Donde todo empieza: una carta, un andén, otra vida.",
    29: "Cuando nadie te cree, resistir se vuelve un acto de fe.",
    30: "Un libro anotado, una verdad enterrada y un final que duele.",
    31: "Sin escuela, sin refugio, sin adultos. Solo el final.",
    32: "Algo muy antiguo despertó bajo el colegio.",
    33: "«Solo hechos», dijeron. Dickens demuestra a qué precio.",
    34: "Abres el primer capítulo y ya no vas a poder dormir.",
    35: "Una mujer, un desierto y una vida que nunca fue la prevista.",
    36: "El Ebro, hora a hora, sin héroes y sin consuelo.",
    37: "La primera novela de Cervantes: la que casi nadie ha leído.",
    38: "Allende vuelve a escribir mujeres que no piden permiso.",
    39: "La última voz de García Márquez, breve y desconcertante.",
    40: "El primer piso del edificio jurídico. Sin esto, nada se sostiene.",
    41: "El vocabulario con el que se piensa una carrera entera.",
    42: "El material con el que se aprueba lo que de verdad da miedo.",
    43: "La Constitución que se escribió y la que de verdad se aplica.",
}


def _spread(mapping: dict[str, list[int]]) -> dict[int, str]:
    return {i: name for name, ids in mapping.items() for i in ids}


AREAS = _spread({
    "Ensayo y pensamiento": [1, 2, 3],
    "Sociedad y política": [4],
    "Economía y decisiones": [5],
    "Ciencias exactas": [6, 7, 8, 9],
    "Ciencias de la salud": [10, 11, 12, 13, 15, 16, 17, 18],
    "Bienestar y deporte": [14, 21],
    "Ingeniería": [19, 20],
    "Literatura y ficción": list(range(22, 40)),
    "Derecho": [40, 41, 42, 43],
})

_MOOD_MAP = {
    "entender": [1, 2, 3, 4, 5, 43],
    "aprobar": [6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 40, 41, 42],
    "cuidar": [10, 11, 12, 13, 14, 15, 16, 17, 18],
    "cuerpo": [14, 21],
    "escapar": list(range(22, 40)),
    "justicia": [4, 40, 41, 42, 43],
}

MOODS: dict[int, list[str]] = {}
for _key in MOOD_KEYS:
    for _id in _MOOD_MAP[_key]:
        MOODS.setdefault(_id, []).append(_key)

# Los cinco que abren la sección «Destacados».
FEATURED = (1, 3, 5, 39, 43)
