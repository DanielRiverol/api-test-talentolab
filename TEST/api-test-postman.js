//TEST EN POSTMAN
/**
 * PRUEBAS GET
 */

pm.test("El código de estado es 200 - OK", function () {
    pm.response.to.have.status(200);
});

pm.test("La respuesta es un JSON válido", function () {
    pm.response.to.be.json;
});

// --- Lógica para encontrar el array de usuarios ---
const jsonData = pm.response.json();
let userArray; // Variable para guardar el array de usuarios

// Opción A: La respuesta es el array directamente [ ... ]
if (Array.isArray(jsonData)) {
    console.log("Estructura detectada: Array directo.");
    userArray = jsonData;
} 
// Opción B: La respuesta es un objeto anidado { "usuarios": [ ... ] }
// (Ajusta "usuarios" si tu API usa otra clave como "data" o "items")
else if (jsonData.usuarios && Array.isArray(jsonData.usuarios)) {
    console.log("Estructura detectada: Objeto anidado { usuarios: [...] }.");
    userArray = jsonData.usuarios;
} 
// Opción C: (Común) Un objeto anidado { "data": [ ... ] }
else if (jsonData.data && Array.isArray(jsonData.data)) {
    console.log("Estructura detectada: Objeto anidado { data: [...] }.");
    userArray = jsonData.data;
} else {
    console.log("ERROR: La respuesta no es un array ni contiene una clave conocida con un array.");
}

// --- Pruebas sobre el Array ---

pm.test("El cuerpo de la respuesta contiene un array de usuarios", function() {
    pm.expect(userArray, "No se pudo encontrar un array de usuarios").to.be.an("array");
});

pm.test("El cuerpo de la respuesta contiene un array de usuarios vacio", function() {
    if(userArray.length === 0){
        pm.expect(userArray, "El array de usuarios está vacío").to.have.lengthOf(0);
    }else{
        console.log("Prueba de array vacío omitida: El array de usuarios no está vacío.");
    }
});

pm.test("Si hay usuarios, el primero tiene la estructura correcta", function () {
    // Esta prueba solo se ejecuta si el array no está vacío
    if (userArray && userArray.length > 0) {
        const primerUsuario = userArray[0];
        
        // Verificamos la estructura (schema)
        pm.expect(primerUsuario).to.have.property("_id");
        pm.expect(primerUsuario).to.have.property("nombre");
        pm.expect(primerUsuario).to.have.property("email");
        
        // Verificamos los tipos de dato
        pm.expect(primerUsuario._id).to.be.a("string");
        pm.expect(primerUsuario.nombre).to.be.a("string");
    } else {
        console.log("Prueba de esquema omitida: El array de usuarios está vacío.");
    }
});

pm.test("El tiempo de respuesta es aceptable (menos de 1s)", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});

/**
 * PRUEBAS GET by ID
 */
// --- Pruebas para GET by ID (Obtener un usuario JSON) ---

pm.test("El código de estado es 200 - OK", function () {
    pm.response.to.have.status(200);
});

pm.test("La respuesta es un JSON válido", function () {
    pm.response.to.be.json;
});

// -- Script robusto que maneja 2 tipos de respuesta --
const jsonData = pm.response.json();
const expectedUserID = pm.environment.get("userID");
let usuario; // Declaramos una variable para guardar el objeto usuario

// Comprobamos si la respuesta está anidada (ej: { "usuario": { ... } })
if (jsonData.usuario && jsonData.usuario._id) {
    console.log("Estructura anidada detectada.");
    usuario = jsonData.usuario;
} 
// Comprobamos si la respuesta es directa (ej: { "_id": ... })
else if (jsonData._id) {
    console.log("Estructura directa detectada.");
    usuario = jsonData;
} else {
    console.log("ERROR: No se encontró el objeto de usuario en la respuesta.");
}

pm.test("El _id del usuario es el correcto", function () {
    // Nos aseguramos de que la variable 'usuario' se haya asignado
    pm.expect(usuario, "No se pudo encontrar el objeto de usuario").to.exist; 
    pm.expect(usuario._id).to.eql(expectedUserID);
});

pm.test("El usuario tiene 'nombre' y 'email'", function () {
    pm.expect(usuario).to.have.property("nombre");
    pm.expect(usuario).to.have.property("email");
    pm.expect(usuario.nombre).to.be.a("string");
});
/**
 * PRUEBAS POST
 */

// 1. Prueba: El código de estado es 201 (Created)
//    La creación de un recurso nuevo debería devolver 201.
//    A veces se usa 200 (OK), puedes cambiar el número si tu API usa 200.
pm.test("El código de estado es 201 - Creado", function () {
    pm.response.to.have.status(201);
});

// 2. Prueba: La respuesta es un JSON válido
//    Verifica que lo que devuelve el servidor se puede entender como JSON.
pm.test("La respuesta es un JSON válido", function () {
    pm.response.to.be.json;
});

// 3. Prueba: La respuesta contiene los datos del usuario
//    Asumiendo que la API devuelve el usuario creado.
pm.test("La respuesta incluye 'mensaje' de confirmación  y 'cv url'", function () {
    // Convertimos la respuesta JSON en un objeto de JavaScript
    const jsonData = pm.response.json();
    
    // Verificamos que el objeto tiene las propiedades 'nombre' y 'email'
    pm.expect(jsonData).to.have.property("mensaje");
    pm.expect(jsonData).to.have.property("cv");
    
    // También podríamos verificar el valor, si quisiéramos
    // pm.expect(jsonData.nombre).to.eql("pablo martinez");
});

// 4. Prueba: El tiempo de respuesta es aceptable
//    Es bueno para asegurar que la API no sea demasiado lenta.
pm.test("El tiempo de respuesta es menor a 800ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(800);
});

// --- GUARDAR VARIABLES ---

// --- (Ajustado) Guardar el ID del usuario en una variable ---
// Pega esto en los tests de tu solicitud POST (Crear Usuario)

pm.test("Guardar el ID del usuario en una variable", function () {
    const jsonData = pm.response.json();
    
    // Asumimos que la respuesta del POST tiene la misma estructura
    // que la del PUT: { mensaje: "...", usuario: { ... } }
    if (jsonData.usuario && jsonData.usuario._id) { 
        // Guardamos el '_id' de dentro del objeto 'usuario'
        pm.environment.set("userID", jsonData.usuario._id);
        console.log("ID de usuario guardado: " + jsonData.usuario._id);
    } else {
        console.log("No se pudo encontrar 'jsonData.usuario._id' para guardar.");
    }
});

/** 
 * PRUEBAS PUT
*/

// 1. Prueba: El código de estado es 200 (OK)
pm.test("El código de estado es 200 - OK", function () {
    pm.response.to.have.status(200);
});

// 2. Prueba: La respuesta es un JSON válido
pm.test("La respuesta es un JSON válido", function () {
    pm.response.to.be.json;
});

// 3. Prueba: La respuesta tiene la estructura esperada ("mensaje" y "usuario")
pm.test("La respuesta tiene 'mensaje' y 'usuario'", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("mensaje");
    pm.expect(jsonData).to.have.property("usuario");
});

// 4. Prueba: El mensaje de éxito es correcto
pm.test("El mensaje de éxito es correcto", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.mensaje).to.eql("Usuario actualizado correctamente");
});

// 5. Prueba: La respuesta contiene el 'nombre' actualizado
pm.test("El usuario devuelto contiene el 'nombre' actualizado", function () {
    const jsonData = pm.response.json();
    
    // NOTA: ¡Asegúrate de que este valor coincida con el que enviaste
    // en la pestaña "Body" de tu solicitud PUT!
    pm.expect(jsonData.usuario.nombre).to.eql("Pablo Martinez (Actualizado)");
});

// 6. Prueba: El usuario devuelto tiene un '_id'
pm.test("El usuario devuelto tiene un '_id'", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.usuario).to.have.property("_id");
    pm.expect(jsonData.usuario._id).to.not.be.empty; // Verificamos que no esté vacío
});

// 7. Prueba: El tiempo de respuesta es aceptable
pm.test("El tiempo de respuesta es menor a 800ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(800);
});

/**
 * PRUEBAS DELETE
 */

// 1. Prueba: El código de estado es 200 (OK)
//    (Algunas APIs usan 204 No Content, pero si hay mensaje, suele ser 200)
pm.test("El código de estado es 200 - OK", function () {
    pm.response.to.have.status(200);
});

// 2. Prueba: La respuesta es un JSON válido
pm.test("La respuesta es un JSON válido", function () {
    pm.response.to.be.json;
});

// 3. Prueba: La respuesta contiene un mensaje de éxito
//    Asumimos una respuesta como: { "mensaje": "Usuario eliminado" }
pm.test("La respuesta contiene un mensaje de eliminación", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("mensaje");
    
    // Puedes ser más específico si sabes el mensaje exacto
    pm.expect(jsonData.mensaje).to.eql("Usuario eliminado correctamente");
});

// 4. Prueba (Opcional): Limpiar la variable
//    Ya que el usuario fue borrado, no querremos usar este ID de nuevo.
pm.test("Limpiar la variable userID del entorno", function () {
    pm.environment.unset("userID");
    console.log("userID fue limpiado.");
});