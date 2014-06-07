/**
* repository.js
* A simple lib for creating JavaScript applications using MTV (Model, Template, View) and Repository partners
**/

/**
* Define um repositorio (design partner) abstrato
**/
var BaseRepository = PrototypeClass.extend({
    
    prototype: {
        
        get: function(args, callback){
            return null;
        },
        
        post: function(args, callback){
            return null;
        },
        
        put: function(args, callback) {
            return null;
        },
        
        delete: function(args, callback){
            return null;
        },
        
        /**
        * Factory Method (partner) para acessar comportamentos do objeto
        **/
        _factory: function(args){
            var method = args.method;
            var method_args = args.data;
            var callback = args.callback;
            
            if(method == null || typeof(method) === "undefined") {
                method = "get"; // default method
            }

            if(method_args === null || typeof(method_args) === "undefined") {
                method_args = {};
            }

            this[method](method_args, callback);

        }
    
    }

});


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
         * @param root_path URL principal da API, por exemplo "http://example.com/api/orders"
         * @param async (default === true) Se for true, as chamadas a API (requisoes) serao assincronas, caso for false serao sincronas.
        **/
        initialize: function(args) {        
            this.root_path = args.root_path;
            this.async = args.async;

            if (typeof(this.async) === "undefined"){
                this.async = true;
            }

            if(this.root_path.charAt(this.root_path.length -1) !== "/"){
                this.root_path += "/";
            }

        },

        /**
        * Chama o method GET da API para obter informacao de uma lista de recursos ou de apenas um recurso especifico.
        * @param args.id Se nao for definido, todos os recursos da API serao trazidos como resposta. Caso for definido, apenas o recurso com o ID especificado sera trazido como resposta a chamada da API
        * @param callback A funcao de callback para a chamada. Aceita um argumento, na qual sera a resposta da API
        * @param error_callback A funcao de callback error para a chamada. Aceita um argumento, na qual sera a resposta da API
        **/
        get: function(args, callback, error_callback) {
            var id = args.id;

            if (typeof(id) === "undefined") {
                return this.call({url: "/"}, callback, error_callback);
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
                async = this.async;
            }

            url = this.root_path + url;

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

        },

        /**
        * Factory Method (partner) para o objeto
        **/
        _factory: function(args){
            var method = args.method;
            var method_args = args.data;
            var callback = args.callback;
            var error_callback = args.error_callback;
            
            if(method == null || typeof(method) === "undefined") {
                method = "get"; // default method
            }

            if(method_args === null || typeof(method_args) === "undefined") {
                method_args = {};
            }

            this[method](method_args, callback, error_callback);

        }
    }

});

/**
 * Classe abstrata para criar views
**/
var BaseView = PrototypeClass.extend({
    
    prototype: {
        
        /**
        * Nome do metodo da api a ser executado
        **/
        api: null,

        /**
        * Caso seja necessario, pode ser definido um dicionario em 'data' a ser passado como argumento ao metodo da api.
        **/
        data: null,

        /**
        * Funcao que eh executada antes do metodo da api ser executado.
        * @return Se retornar true, metodo da api eh executado.
        **/
        before: null,

        /**
        * Funcao callback do metodo da api
        * @param response Contem a resposta da execucao do metodo da api
        **/
        callback: null,
        
        /**
        * Funcao callback error do metodo da api
        * @param response Contem a resposta da execucao do metodo da api
        **/
        error_callback: null,

        /**
        * Funcao que eh executada apos o metodo da api
        **/
        after: null,

        /**
        * Repository de onde a view ira requisitar/chamar por dados necessarios para sua renderizacao
        **/
        repository: null,

        /**
        * Renderiza a view
        **/
        render: function(){
            obj = this; // instancia do tipo BaseView

            var before_result = true;

            // funcao que eh executada antes do metodo da api ser executado
            if (obj.before !== null && typeof(obj.before) !== "undefined"){
                before_result = obj.before();
            }
            
            // se for true, metodo da api eh executado
            if(before_result === true){
                
                if(obj.repository !== null && typeof obj.repository !== "undefined"){                
                    obj.repository._factory({
                        method: obj.api,
                        data: obj.data,
                        callback: obj.callback,
                        error_callback: obj.error_callback
                    });
                }

                // funcao que eh executada apos o metodo da api
                if (obj.after !== null && typeof(obj.after) !== "undefined"){
                    obj.after();
                }
            }
        }
    }
});

/**
* Container basico para armazenar views que por sua vez, podem acessar um repositorio
**/
var BaseViewContainer = PrototypeClass.extend({
    
    /**
    * Repositorio do container
    **/
    repository: null,
    
    /**
     * Renderiza uma view
     * @param view_name Nome da view a ser renderizada
     * @param args Argumentos que seram passadas ao construtor/inicializador da view
    **/
    render: function(view_name, args){

        if (args === null || typeof(args) === "undefined"){
            args = {};
        }

        var container = this;        
        var repository = container.repository;
        var view_class = container[view_name];

        obj = view_class.create(args); // instanciando objeto do tipo BaseView
        obj.repository = repository;
        obj.render();

    },
    
});