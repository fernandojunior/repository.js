/**
* repository.js
* A simple lib for creating JavaScript applications using MTV (Model, Template, View) and Repository partners
**/

/**
* Define um repositorio (design partner) abstrato
**/
var BaseRepository = PrototypeClass.extend({
    
    prototype: {
        
        getAll: function(callback, error_callback){
            return null;
        },
        
        get: function(args, callback, error_callback){
            return null;
        },
        
        post: function(args, callback, error_callback){
            return null;
        },
        
        put: function(args, callback, error_callback) {
            return null;
        },
        
        delete: function(args, callback, error_callback){
            return null;
        },
        
        /**
        * Factory Method (partner) para acessar comportamentos do objeto
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
* Container (singleton partner base) basico para armazenar views que por sua vez, podem acessar um repositorio
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