var ReferenciaView = require('../views/referencia'),
	ReferenciaModel = require('../models/dataAccess'),
	moment = require('moment');

var Referencia = function(conf){
	this.conf = conf || {};

	this.view = new ReferenciaView();
	this.model = new ReferenciaModel({ parameters : this.conf.parameters});

	this.response = function(){
		this[this.conf.funcionalidad](this.conf.req,this.conf.res,this.conf.next);
	}
}

//obtiene el trabajo de la cita
//Cita.prototype.get_trabajo_data = function(req, res, next){
Referencia.prototype.get_referencia = function(req, res, next){
	//Objeto que almacena la respuesta
	var object = {};
	//Objeto que envía los parámetros
	var params = {}; 
	//Referencia a la clase para callback
	var self = this;

	//Asigno a params el valor de mis variables
	/*params.name = 'documento';
	//params.value = req.params.data;
	params.value = req.query.documento;
	params.type = 3;  //1: int; 3: varchar*/

	var params = [{name: 'serie', value: req.query.serie, type: self.model.types.STRING},
                  {name: 'folio', value: req.query.folio, type: self.model.types.STRING},
                  {name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT},
                  {name: 'tipo', value: req.query.tipo, type: self.model.types.INT},
                  {name: 'idCliente', value: req.query.idCliente, type: self.model.types.INT}];

	
	//this.model.get('SEL_REFERENCIA',params,function(error,result){
	this.model.get('SEL_REFERENCIA_SP',params,function(error,result){
		//Callback
		object.error = error;
		object.result = result[0];
		console.log(result);
		
		self.view.see(res, object);
		/*self.view.expositor(res, {
            error: error,
            result: result
        });*/
	});
}

module.exports = Referencia;