var sql = require('mssql'),
    config = {};

//configuración genérica para modelo de acceso a datos
var DataAccess = function(config){
  //Inicializamos el objeto config
  this.config = config || {};
  //Inicializamos la conexión
  connectionString = {
    user: this.config.parameters.SQL_user,
    password: this.config.parameters.SQL_password,
    server: this.config.parameters.SQL_server, // You can use 'localhost\\instance' to connect to named instance 
    database: this.config.parameters.SQL_database,
    connectionTimeout: this.config.parameters.SQL_connectionTimeout
  };

  this.types = {
        INT: sql.Int,
        DECIMAL: sql.Decimal(18, 2),
        STRING: sql.VarChar(8000),
        DATE: sql.DateTime,
        BIT: sql.bit
    }
  
  this.connection = new sql.Connection(connectionString);

};


//HTTPSServer methods
DataAccess.prototype.get = function(stored,params,callback){
    
    var self = this.connection;
    this.connection.connect(function(err) {
      // Stored Procedure   
      var request = new sql.Request(self);

      // Add inputs
        if(params.length > 0){
            params.forEach(function(param) {
                request.input(param.name, param.type, param.value);
            });
        }

      // request.output('output_parameter', sql.VarChar(50));
      request.execute(stored)
            .then(function(recordsets) {
                callback(null, recordsets[0]);
            }).catch(function(err) {
                callback(err);
            });

    });
};

//método post
DataAccess.prototype.post = function (objParams, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure 
        var request = new sql.Request(self);
        request.input('idUnidad', sql.Numeric(18, 0), objParams.idUnidad);
        request.input('idTaller', sql.Numeric(18, 0), objParams.idTaller);
        request.input('fecha', sql.VarChar(20), objParams.fecha);
        request.input('observacion', sql.VarChar(250), objParams.observacion);
        request.input('idUsuario', sql.Numeric(18, 0), objParams.idUsuario);

        request.execute('INS_CITA_SP', function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                console.log('Error al realizacion la insercción: ' + params + ' mensaje: ' + err);
            }
        });

    });
};


module.exports = DataAccess; 