/**
 * Repositorio de API RESTFUL basico.
 *
 * The HTTP request methods are typically designed to affect a given resource in standard ways
 *
 * HTTP Method; Action; examples
 * GET; Obtain information about list of resources; http://example.com/api/orders
 * GET; Obtain information about a resource; http://example.com/api/orders/1
 * POST; Create a new resource from data provided with the request; http://example.com/api/orders
 * PUT; Update a resource from data provided with the request; http://example.com/api/orders/123 (update order #123 from the request)
 * DELETE; Delete a resource; http://example.com/api/orders/123 (delete order #123)
 *
**/
var RESTRepository = BaseRepository.extend ({
    
    prototype: {

        /**
         * Inicializa o repositorio
         * @param _root_path URL principal da API, por exemplo "http://example.com/api/orders"
         * @param _async (default === true) Se for true, as chamadas a API (requisoes) serao assincronas, caso for false serao sincronas.
        **/
        initialize: function(args) {        
            this._root_path = args.root_path;
            this._async = args.async;

            if (typeof this._async === "undefined"){
                this._async = true;
            }

            if(this._root_path.charAt(this._root_path.length -1) !== "/"){
                this._root_path += "/";
            }

        },
        
        /**
        * Chama o method GET da API para obter informacao de uma lista de recursos
        * @param callback A funcao de callback para a chamada. Aceita um argumento, na qual sera a resposta da API
        * @param error_callback A funcao de callback error para a chamada. Aceita um argumento, na qual sera a resposta da API
        **/
        getAll: function(callback, error_callback){
            return this.call({url: "/"}, callback, error_callback);
        },

        /**
        * Chama o method GET da API para obter informacao de um recurso especifico.
        * @param args.id O recurso com o ID especificado sera trazido como resposta a chamada da API
        * @param callback A funcao de callback para a chamada. Aceita um argumento, na qual sera a resposta da API
        * @param error_callback A funcao de callback error para a chamada. Aceita um argumento, na qual sera a resposta da API
        **/
        get: function(args, callback, error_callback) {
            var id = args.id;

            if (typeof(id) === "undefined") {
                return this.getAll(callback, error_callback);
            } else {
                return this.call({url: "/" + id}, callback, error_callback);
            }

        },

        /**
        * Chama o method POST da API para criar um novo recurso.
        * @param args.data Os dados do novo recurso que serao enviados pela requisicao para API
        * @param callback A funcao de callback para a chamada. Aceita um argumento, na qual sera a resposta da API
        * @param error_callback A funcao de callback error para a chamada. Aceita um argumento, na qual sera a resposta da API
        **/
        post: function(args, callback, error_callback) {
            var data = args.data;

            return this.call({url: "/", type: "post", data: data}, callback, error_callback);
        },

        /**
        * Chama o method PUT da API para atualizar um determinado recurso.
        * @param args.id O id do recurso a ser atualizado
        * @param args.data Os dados do recurso a ser atualizado que serao enviados pela requisicao para API
        * @param callback A funcao de callback para a chamada. Aceita um argumento, na qual sera a resposta da API
        * @param error_callback A funcao de callback error para a chamada. Aceita um argumento, na qual sera a resposta da API
        **/
        put: function(args, callback, error_callback) {
            var id = args.id;
            var data = args.data;

            return this.call({url: "/" + id, type: "put", data: data}, callback, error_callback);
        },

        /**
        * Chama o method DELETE da API para remover um determinado recurso.
        * @param args.id O id do recurso a ser removido
        * @param callback A funcao de callback para a chamada. Aceita um argumento, na qual sera a resposta da API
        * @param error_callback A funcao de callback error para a chamada. Aceita um argumento, na qual sera a resposta da API
        **/
        delete: function(args, callback, error_callback) {    
            var id = args.id;

            return this.call({url: "/" + id, type: "delete"}, callback, error_callback);
        },

        /**
        * Chama (requisita) uma url da API
        * @param args.url (default === "") A url da api a ser chamada
        * @param args.type (default === get) Tipo (http method) da chamada: get, post, put, delete
        * @param args.data (opcional) Dicionario de dados a ser enviado pela chamada
        * @param callback (opcional) Funcao de callback a ser executada com a resposta da api
        * @return (if this.async === false) Retorna o resultado da chamada a api
        **/
        call: function(args, callback, error_callback){
            var url = args.url;
            var type = args.type;
            var data = args.data;
            var async = args.async;

            if (typeof(url) === "undefined"){
                url = "";
            } else if (url.charAt(0) === "/"){
                url = url.substring(1, url.length);
            }

            if (typeof(type) === "undefined") {
                type = "get";
            }

            if (typeof(data) === "undefined") {
                data = null;
            } else {
                data = JSON.stringify(data);
            }
    
            if (async === "undefined"){
                async = this._async;
            }

            url = this._root_path + url;

            var request = {
                url: url,
                type: type,
                async: async,
                contentType: "application/json",
                accepts: "application/json",
                cache: false,
                dataType: 'json',
                data: data,
                error: function (jqXHR) {
                    
                    if(error_callback !== null && typeof error_callback !== "undefined"){
                        error_callback(jqXHR);
                    }
                    
                    console.log("ajax error " + jqXHR.status);
                }

            };

            var r;

            $.ajax(request).done(function(reponse){
                r = reponse;

                if (callback !== null && typeof(callback) !== "undefined"){
                    callback(reponse);
                }

            }); 

            // observacao: resultado so existira se a assincronizacao estiver desativada, ou seja, this.async === false
            return r;

        }

    }

});