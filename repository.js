/**
* repository.js
* A simple lib for creating JavaScript applications using MTV (Model, Template, View) and Repository partners
**/

/**
* Define um repositorio (design partner) abstrato
**/
var Repository = PrototypeClass.extend({
    
    /**
    * Repository Name
    **/
    name: undefined,
    
    prototype: {

        getAll: undefined,

        get: undefined,

        post: undefined,

        put: undefined,

        delete: undefined,
        
        /**
        * Factory Method (design partner) para invocar comportamentos do objeto
        * @param repository Objeto/instancia do tipo Repository
        * @param args.method Nome do metodo a ser invocado
        * @param args.data Dados a serem tratados pelo metodo
        * @param args.success O callback de sucesso do metodo.
        * @param args.error O callback de erro do metodo.
        **/
        factory: function (args) {
            var method = args.method;
            var data = args.data;
            var success = args.success;
            var error = args.error;
            var obj = this;

            if (typeof method === "undefined") {
                method = "get"; // default method
            }

            if (typeof data === "undefined") {
                data = {};
            }

            return obj[method]({data: data, success: success, error: error});
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
        initialize: function (data) {
            this.data = data; // setting the request data
        },

        /**
        * Nome do metodo do repositorio a ser executado. Default = "get"
        **/
        method: "get",

        /**
        * Se necessario, pode ser definido um dicionario 'data' a ser passado como argumento ao metodo do repositorio. Default = {}
        **/
        data: {},

        /**
        * Funcao que eh executada antes do metodo do repositorio ser executado.
        * @return Se retornar true, metodo eh executado.
        **/
        before: undefined,

        /**
        * Funcao callback (sucesso) do metodo do repositorio
        * @param response Contem a resposta da execucao do metodo
        **/
        success: undefined,

        /**
        * Funcao callback error do metodo do repositorio
        * @param response Contem a resposta da execucao do metodo
        **/
        error: undefined,

        /**
        * Funcao que sera sempre executada, se existir
        **/
        finally: undefined,

        /**
        * Repository de onde a view ira requisitar/chamar por dados necessarios para sua renderizacao
        **/
        repository: undefined,

        /**
        * Renderiza a view
        **/
        render: function () {
            var obj = this; // instancia do tipo BaseView

            var before_result = true;

            // funcao que eh executada antes do metodo do repositorio ser executado
            if (typeof obj.before !== "undefined") {
                before_result = obj.before();
            }
            
            // se for true, metodo do repositorio eh executado
            if (before_result === true) {
                if ( typeof obj.repository !== "undefined") {
                    obj.repository.factory(obj);
                }
            }
            
            // funcao que sera sempre executada
            if (typeof obj.finally !== "undefined") {
                obj.finally();
            }

        }
    }
});

/**
* Container (singleton partner base) basico para armazenar views que por sua vez, podem acessar um repositorio
**/
var Views = PrototypeClass.extend({
    
    /**
    * Repositorio do container
    **/
    repository: undefined,
    
    /**
    * Mustache templates root path
    **/
    template_path: undefined,

    /**
    * Renderiza um template, a partir do template_path, utilizando o Mustache e jQuery.
    **/
    render_template: function (template_name, data) {
        
        var url = this.template_path + template_name + ".mustache", template;
        $.ajax({url: url, async: false, success: function (data) { template = data; }});
        return Mustache.render(template, data);
    },

    /**
     * Renderiza uma view
     * @param view_name Nome da view a ser renderizada
     * @param args Argumentos que seram passadas ao construtor/inicializador da view
    **/
    render: function (view_name, args) {

        if (args === null || typeof args === "undefined") {
            args = {};
        }

        var container = this;
        var repository = container.repository;
        var view_class = container[view_name];

        var obj = view_class.create(args); // instanciando objeto do tipo BaseView
        obj.repository = repository;
        obj.render();

    },
    
    /**
    * Armazena as views
    **/
    objects: {},

    /**
    * Registra um container
    * @param name nome do container
    * @param child_properties Container, na qual, eh uma classe extendida de Views
    **/
    register: function (name, child_properties) {
        this.objects[name] = Views.extend(child_properties);
    },

    get: function (name) {
        return this.objects[name];
    }
    

});