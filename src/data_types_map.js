const TYPE_MAP = {
    STRING: {type: 'String', isCustom: false},
    CHAR: {type: 'String', isCustom: false},
    TEXT: {type: 'String', isCustom: false},
    TINYINT: {type: 'Int', isCustom: false},
    SMALLINT: {type: 'Int', isCustom: false},
    MEDIUMINT: {type: 'Int', isCustom: false},
    INTEGER: {type: 'Int', isCustom: false},
    BIGINT: {type: 'BigInt', isCustom: true},
    FLOAT: {type: 'Float', isCustom: false},
    TIME: {type: 'Time', isCustom: true},
    DATE: {type: 'Date', isCustom: true},
    DATEONLY: {type: 'Date', isCustom: true},
    BOOLEAN: {type: 'Boolean', isCustom: false},
    DECIMAL: {type: 'Numeric', isCustom: true},
    NUMERIC: {type: 'Numeric', isCustom: true},
    REAL: {type: 'Float', isCustom: false},
    'DOUBLE PRECISION': {type: 'Numeric', isCustom: true},
    DOUBLE: {type: 'Numeric', isCustom: true},
}
module.exports = {
  typeMapper: (type) => TYPE_MAP[type] || {type: 'String', isCustom: false}
};
//             'POSTGRES :    MySQL   :   SQLite   :   MSSQL'
// `
// ABSTRACT :  undefined :  undefined :  undefined :  undefined
// STRING :  [ 'varchar' ] :  [ 'VAR_STRING' ] :  [ 'VARCHAR', 'VARCHAR BINARY' ] :  [ 231, 173 ]
// CHAR :  [ 'char', 'bpchar' ] :  [ 'STRING' ] :  [ 'CHAR', 'CHAR BINARY' ] :  [ 175 ]
// TEXT :  [ 'text' ] :  [ 'BLOB' ] :  [ 'TEXT' ] :  false
// NUMBER :  undefined :  undefined :  undefined :  undefined
// TINYINT :  [ 'int2' ] :  [ 'TINY' ] :  [ 'TINYINT' ] :  [ 30 ]
// SMALLINT :  [ 'int2' ] :  [ 'SHORT' ] :  [ 'SMALLINT' ] :  [ 34 ]
// MEDIUMINT :  undefined :  [ 'INT24' ] :  [ 'MEDIUMINT' ] :  false
// INTEGER :  [ 'int4' ] :  [ 'LONG' ] :  [ 'INTEGER' ] :  [ 38 ]
// BIGINT :  [ 'int8' ] :  [ 'LONGLONG' ] :  [ 'BIGINT' ] :  false
// FLOAT :  undefined :  [ 'FLOAT' ] :  [ 'FLOAT' ] :  [ 109 ]
// TIME :  [ 'time' ] :  [ 'TIME' ] :  [ 'TIME' ] :  [ 41 ]
// DATE :  [ 'timestamptz' ] :  [ 'DATETIME' ] :  [ 'DATETIME' ] :  [ 43 ]
// DATEONLY :  [ 'date' ] :  [ 'DATE' ] :  [ 'DATE' ] :  [ 40 ]
// BOOLEAN :  [ 'bool' ] :  [ 'TINY' ] :  [ 'TINYINT' ] :  [ 104 ]
// NOW :  undefined :  undefined :  undefined :  undefined
// BLOB :  [ 'bytea' ] :  [ 'TINYBLOB', 'BLOB', 'LONGBLOB' ] :  [ 'TINYBLOB', 'BLOB', 'LONGBLOB' ] :  [ 165 ]
// DECIMAL :  [ 'numeric' ] :  [ 'NEWDECIMAL' ] :  [ 'DECIMAL' ] :  [ 106 ]
// NUMERIC :  [ 'numeric' ] :  [ 'NEWDECIMAL' ] :  [ 'DECIMAL' ] :  [ 106 ]
// `
// `
// UUID :  [ 'uuid' ] :  false :  [ 'UUID' ] :  false
// UUIDV1 :  undefined :  undefined :  undefined :  undefined
// UUIDV4 :  undefined :  undefined :  undefined :  undefined
// HSTORE :  [ 'hstore' ] :  undefined :  undefined :  undefined
// JSON :  [ 'json' ] :  [ 'JSON' ] :  [ 'JSON', 'JSONB' ] :  undefined
// JSONB :  [ 'jsonb' ] :  undefined :  undefined :  undefined
// VIRTUAL :  undefined :  undefined :  undefined :  undefined
// ARRAY :  undefined :  undefined :  undefined :  undefined
// ENUM :  [ null ] :  false :  false :  false
// RANGE :  {
//   subtypes: {
//     integer: 'int4range',
//     decimal: 'numrange',
//     date: 'tstzrange',
//     dateonly: 'daterange',
//     bigint: 'int8range'
//   },
//   castTypes: {
//     integer: 'int4',
//     decimal: 'numeric',
//     date: 'timestamptz',
//     dateonly: 'date',
//     bigint: 'int8'
//   }
// } :  undefined :  undefined :  undefined
// REAL :  [ 'float4' ] :  [ 'DOUBLE' ] :  [ 'REAL' ] :  [ 109 ]
// DOUBLE PRECISION :  [ 'float8' ] :  [ 'DOUBLE' ] :  [ 'DOUBLE PRECISION' ] :  [ 109 ]
// DOUBLE :  [ 'float8' ] :  [ 'DOUBLE' ] :  [ 'DOUBLE PRECISION' ] :  [ 109 ]
// GEOMETRY :  [ 'geometry' ] :  [ 'GEOMETRY' ] :  false :  false
// GEOGRAPHY :  [ 'geography' ] :  undefined :  undefined :  undefined
// CIDR :  [ 'cidr' ] :  undefined :  undefined :  undefined
// INET :  [ 'inet' ] :  undefined :  undefined :  undefined
// MACADDR :  [ 'macaddr' ] :  undefined :  undefined :  undefined
// CITEXT :  [ 'citext' ] :  undefined :  undefined :  undefined
// TSVECTOR :  [ 'tsvector' ] :  undefined :  undefined :  undefined
// `