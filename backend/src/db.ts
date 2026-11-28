/* Autor: Gabriel André Cogo Fernandes*/

import oracledb from "oracledb";
import "dotenv/config";

const {
  ORACLE_HOST,
  ORACLE_PORT,
  ORACLE_SERVICE,
  ORACLE_USER,
  ORACLE_PASSWORD
} = process.env;

const connectString = `${ORACLE_HOST || "localhost"}:${ORACLE_PORT || "1521"}/${ORACLE_SERVICE || "XEPDB1"}`;
// Define o formato de retorno das consultas como objeto
try {
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
} catch (e) {
  // Ignora caso ocorra antes do carregamento do driver
}

/**
 * Inicializa o pool de conexões. 
 * Caso o banco ainda não esteja criado ou configurado, avisa no console em vez de quebrar o app.
 */
export async function initPool() {
  try {
    await oracledb.createPool({
      user: ORACLE_USER || "system",
      password: ORACLE_PASSWORD || "",
      connectString: connectString || "localhost:1521/XEPDB1",
      poolMin: 1,
      poolMax: 10,
      poolIncrement: 1
    });
    console.log("Pool de conexões Oracle criado com sucesso.");
  } catch (erro) {
    console.warn("Aviso: Não foi possível conectar ao Oracle no momento. Verifique se o banco está ativo e se o .env está configurado.");
    console.warn("Detalhe do erro:", (erro as any).message);
  }
}

export async function getConn() {
  const pool = oracledb.getPool();
  return pool.getConnection();
}

export async function closePool() {
  try {
    await oracledb.getPool().close(10);
  } catch {
    /* ignora se o pool não existir */
  }
}