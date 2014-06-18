/**
* repository.js
* A simple lib for creating JavaScript applications using MTV (Model, Template, View) and Repository partners
**/

/**
* Define um repositorio (design partner) abstrato
**/
var BaseRepository = PrototypeClass.extend({
    
    /**
    * Repository Name
    **/
    name: null,
    
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
            var method_data = args.data;
            var callback = args.success;
            var error_callback = args.error;

            if(method == null || typeof(method) === "undefined") {
                method = "get"; // default method
            }

            if(method_data === null || typeof(method_data) === "undefined") {
                method_data = {};
            }

            this[method](method_data, callback, error_callback);

        }

    }

});

/**
 * Classe abstrata para criar views
**/
var BaseView = PrototypeClass.extend({
    
    prototype: {
        
        /**
        * View initializer
        * @param data See BaseView#data
        **/
        initialize: function(data) {
            this.data = data; // setting the request data
        },
        
        /**
        * Nome do metodo do repositorio a ser executado
        **/
        method: null,

        /**
        * Caso seja necessario, pode ser definido um dicionario 'data' a ser passado como argumento ao metodo do repositorio.
        **/
        data: null,

        /**
        * Funcao que eh executada antes do metodo do repositorio ser executado.
        * @return Se retornar true, metodo eh executado.
        **/
        before: null,

        /**
        * Funcao callback (sucesso) do metodo do repositorio
        * @param response Contem a resposta da execucao do metodo
        **/
        success: null,
        
        /**
        * Funcao callback error do metodo do repositorio
        * @param response Contem a resposta da execucao do metodo
        **/
        error: null,

        /**
        * Funcao que sera sempre executada, se existir
        **/
        finally: null,

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

            // funcao que eh executada antes do metodo do repositorio ser executado
            if (obj.before !== null && typeof(obj.before) !== "undefined"){
                before_result = obj.before();
            }
            
            // se for true, metodo do repositorio eh executado
            if(before_result === true){                
                if(obj.repository !== null && typeof obj.repository !== "undefined"){
                    obj.repository._factory({
                        method: obj.method,
                        data: obj.data,
                        success: obj.success,
                        error: obj.error
                    });
                }                
            }
            
            // funcao que sera sempre executada
            if (obj.finally !== null && typeof(obj.finally) !== "undefined"){
                obj.finally();
            }

        }
    }
});

/**
* Container (singleton partner base) basico para armazenar views que por sua vez, podem acessar um repositorio
**/
var BaseViewContainer = PrototypeClass.extend({
    
    /**
    * Mustache templates root path
    **/
    template_path: null,
    
    /**
    * Renderiza um template, a partir do template_path, utilizando o Mustache e jQuery.
    **/
    render_template: function(template_name, data){
        
        var url = this.template_path + template_name + ".mustache", template;
        $.ajax({url: url, async: false, success: function (data) { template = data; }});
        return Mustache.render(template, data);
    },
    
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