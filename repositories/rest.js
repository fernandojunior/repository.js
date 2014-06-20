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
        * URL principal da API
        **/
        _root_path: undefined,
        
        /**
        * Define se as requisicoes serao assincronas ou nao. Default = True
        **/
        _async: true,
        
        /**
         * Inicializa o repositorio
         * @param args.root_path Define a url principal da API
         * @param args.async Se for true, as chamadas a API (requisoes) serao assincronas, caso for false serao sincronas.
        **/
        initialize: function(args) {        
            this._root_path = args.root_path;

            if (typeof args.async !== "undefined"){
                this._async = args.async;
            }

            if(this._root_path.charAt(this._root_path.length -1) !== "/"){
                this._root_path += "/";
            }

        },

        /**
        * Chama o method GET da API para obter informacao de uma lista de recursos
        * @param args.success O callback de sucesso da requisicao. Aceita um argumento, na qual sera a resposta da API
        * @param args.error O callback de erro para a requisicao. Aceita um argumento, na qual sera a resposta da API
        **/
        getAll: function(args){
            return this.request({path: "/", success: args.success, error: args.error});
        },

        /**
        * Chama o method GET da API para obter informacao de um recurso especifico.
        * @param args.data.id O recurso com o ID especificado sera trazido como resposta a chamada da API
        * @param args.success O callback de sucesso da requisicao. Aceita um argumento, na qual sera a resposta da API
        * @param args.error O callback de erro para a requisicao. Aceita um argumento, na qual sera a resposta da API
        **/
        get: function(args) {
            var data = args.data;
            var id = data.id;
            var success = args.success;
            var error = args.error;            

            if (typeof(id) === "undefined") {
                return this.getAll({success: success, error: error});
            } else {
                return this.request({path: "/" + id, success: success, error: error});
            }

        },

        /**
        * Chama o method POST da API para criar um novo recurso.
        * @param args.data Os dados do novo recurso que serao enviados pela requisicao para API
        * @param args.success O callback de sucesso da requisicao. Aceita um argumento, na qual sera a resposta da API
        * @param args.error O callback de erro para a requisicao. Aceita um argumento, na qual sera a resposta da API
        **/
        post: function(args) {
            var data = args.data;
            var success = args.success;
            var error = args.error;

            return this.request({path: "/", type: "post", data: data, success: success, error: error});
        },

        /**
        * Chama o method PUT da API para atualizar um determinado recurso.
        * @param args.data.id O id do recurso a ser atualizado
        * @param args.data... Os dados do recurso a ser atualizado que serao enviados pela requisicao para API
        * @param args.success O callback de sucesso da requisicao. Aceita um argumento, na qual sera a resposta da API
        * @param args.error O callback de erro para a requisicao. Aceita um argumento, na qual sera a resposta da API
        **/
        put: function(args) {
            var data = args.data;
            var id = data.id;
            var success = args.success;
            var error = args.error;

            return this.request({path: "/" + id, type: "put", data: data, success: success, error: error});
        },

        /**
        * Chama o method DELETE da API para remover um determinado recurso.
        * @param args.data.id O id do recurso a ser removido
        * @param args.success O callback de sucesso da requisicao. Aceita um argumento, na qual sera a resposta da API
        * @param args.error O callback de erro para a requisicao. Aceita um argumento, na qual sera a resposta da API
        **/
        delete: function(args) {    
            var data = args.data;
            var id = data.id;
            var success = args.success;
            var error = args.error;

            return this.request({path: "/" + id, type: "delete", success: success, error: error});
        },

        /**
        * Chama (requisita) uma url da API
        * @param args.url (default === "") A url da api a ser chamada
        * @param args.type (default === get) Tipo (http method) da chamada: get, post, put, delete
        * @param args.data (opcional) Dicionario de dados a ser enviado pela chamada
        * @param args.success O callback de sucesso da requisicao. Aceita um argumento, na qual sera a resposta da API
        * @param args.error O callback de erro para a requisicao. Aceita um argumento, na qual sera a resposta da API
        * @return (if this.async === false) Retorna o resultado da chamada a api
        **/
        request: function(args){
            var url = args.path;
            var type = args.type;
            var data = args.data;
            var async = args.async;
            var success = args.success;
            var error = args.error;

            if (typeof url === "undefined"){
                url = "";
            } else if (url.charAt(0) === "/"){
                url = url.substring(1, url.length);
            }

            if (typeof type === "undefined") {
                type = "get";
            }

            if (typeof(data) === "undefined") {
                data = null;
            } else {
                data = JSON.stringify(data);
            }
    
            if (typeof async === "undefined"){
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
                    
                    if(typeof error !== "undefined"){
                        error(jqXHR);
                    }
                    
                    console.log("ajax error " + jqXHR.status);
                }

            };

            var r;

            $.ajax(request).done(function(reponse){
                r = reponse;

                if (typeof success !== "undefined"){
                    success(reponse);
                }

            }); 

            // observacao: resultado so existira se a assincronizacao estiver desativada, ou seja, this.async === false
            return r;

        }

    }

});