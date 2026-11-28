import oracledb from "oracledb";
import "dotenv/config";

const {
  ORACLE_HOST,
  ORACLE_PORT,
  ORACLE_SERVICE,
  ORACLE_USER,
  ORACLE_PASSWORD
} = process.env;

const connectString = `${ORACLE_HOST}:${ORACLE_PORT}/${ORACLE_SERVICE}`;

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export async function initPool() {
  await oracledb.createPool({
    user: ORACLE_USER,
    password: ORACLE_PASSWORD,
    connectString,
    poolMin: 1,
    poolMax: 10,
    poolIncrement: 1
  });
}

export async function getConn() {
  return oracledb.getPool().getConnection();
}

export async function closePool() {
  try {
    await oracledb.getPool().close(10);
  } catch { 
    /* pool pode não existir */
  }
}