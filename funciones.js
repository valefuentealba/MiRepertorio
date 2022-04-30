const { Pool } = require('pg');

const pool = new Pool({
    user: 'valeriafuentealba',
    host: 'localhost',
    database: 'repertorio',
    password: '',
    port: 5432,
    ssl: false,
    idleTimeoutMillis: 5000,
    connTimeoutMillis: 2000,
});


const nuevaCancion = async(parametros) => {
    if (!parametros.includes("")) {
        const query = {
            text: 'INSERT INTO repertorio (cancion, artista, tono) VALUES ($1, $2, $3) returning * ',
            values: parametros,
        };
        try {
            const resultado = await pool.query(query);
            console.log(`Cancion: "${resultado.rows[0].cancion}" fue agregado con exito`);
            return resultado.rows[0];
        } catch (error) {
            console.log('Error al ejecutar la instruccion: ' + error.message);
        }
    }
};

const prepararCancion = async() => {
    const query = {
        text: 'SELECT * FROM repertorio',
    };
    try {
        const resultado = await pool.query(query);
        return resultado;
    } catch (error) {
        console.log(`Error al ejecutar la instruccion: ' + error.message`);
    }
}

const editarCancion = async(parametros) => {
    const query = {
        text: 'UPDATE repertorio SET cancion =$1, artista=$2, tono=$3 WHERE id=$1 returning * ',
        values: parametros,
    };
    try {
        const resultado = await pool.query(query);
        console.log(`Cancion: "${resultado.rows[0].cancion}" fue editado con exito`);
        return resultado.rows[0];
    } catch (error) {
        console.log(`Error al ejecutar la instruccion: ' + error.message`);
    }
};

const eliminarCancion = async(parametros) => {
    try {
        const resultado = await pool.query(`DELETE FROM repertorio WHERE id= ${parametros}`);
        console.log(`Cancion: "${resultado.rows[0].cancion}" fue eliminado con exito`);
        return resultado.rows[0];
    } catch (error) {
        console.log(`Error al ejecutar la instruccion: ' + error.message`);
    }
};

module.exports = { nuevaCancion, prepararCancion, editarCancion, eliminarCancion };