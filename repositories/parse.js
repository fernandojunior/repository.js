/**
* Repositorio de objetos do Parse.org 
* https://parse.com/docs/js_guide
**/
var ParseRepository = Repository.extend({
    
    /**
    * repository name
    **/
    name: null,

    prototype: {
       
       /**
       * Repository initializer
       * @param args.class_name Parse class name or
       * @param args.class Parse class. If setted then class_name not needed
       **/
       initialize: function (args){
           
           if (args){           
               this._class_name = args.class_name;
               this._class = args.class;

               if (typeof this._class_name !== "undefined"){
                   this._class = Parse.Object.extend(this._class_name);
               }
           }
           
       },
       
       /**
       * Parse query object for the class
       **/
       _query: function(){
           return new Parse.Query(this._class);
       },
       
       /**
       * Create a parse object
       **/
       _create: function(){
           return new this._class();
       },
       
       /**
       * Retrieve all objects
       **/
       getAll: function(callback, error_callback){           
           return this.find(null, callback, error_callback);           
       },
        
       /**
       * Retrieve only a object
       * @param args.id The object ID
       **/
       get: function(args, callback, error_callback){
           var id = args.id;
           this.first({objectId : id}, callback, error_callback);
           return;
       },
       
       /**
       * Update a parse object
       * @param args.id The object ID
       * @param args.data The new data of object
       **/
       put: function(args, callback, error_callback){
           var id = args.id;
           var data = args.data;           

           function get_callback(response){
               response.save(data, {success: callback, error: error_callback});
           };

           this.get({id : args.id}, get_callback, error_callback);
           return;
       },

       /**
       * Create a parse object
       * @param data The data of the new object
       **/
       post: function(args, callback, error_callback) {
           var data = args;           
           this._create().save(data, {success: callback, error: error_callback});
           return;
       },
       
       /**
       * Delete a parse object
       * @param args.id The ID of the object that will be deleted
       **/
       delete: function(args, callback, error_callback){
           var id = args.id;
       
           function get_callback(response){
               response.destroy({success: callback, error: error_callback});
           };

           this.get({id: id}, get_callback, error_callback);
           return;
       },

        /**
        * Find objects
        * @param args The key : value sings
        **/        
       find: function(args, callback, error_callback){           
           var query = this._query();
           for(var key in args){
               query.equalTo(key, args[key]);
           }
           query.find({success: callback, error: error_callback});
           return;
       },
       
        /**
        * Find first object
        * @param args The key : value sings
        **/        
       first: function(args, callback, error_callback){           
           var query = this._query();
           for(var key in args){
               query.equalTo(key, args[key]);
           }           
           query.first({success: callback, error: error_callback});
           return;
       },

    },

    /**
    * Upload a file to parse
    * @param args.name filename
    * @param args.ext file extension
    * @param args.content_type The file content type
    * @param args.file_upload_control $("#id")[0] or document.getElementById("id")
    **/
    uploadFile: function(args, callback, error_callback){ 
        var name = args.name;
        var ext = args.ext;
        var content_type = args.content_type;
        var file_upload_control = args.file_upload_control;

        if (file_upload_control.files.length > 0) {

            var file = file_upload_control.files[0];
            var parseFile = new Parse.File(name + ext, file, content_type);
            
            parseFile.save().then(
                function(response){
                    console.log("Sucess: The file was uploaded");
                    console.log(response.url());
                    if (callback !== null && typeof callback !== "undefined"){
                        callback();
                    }
                },
                function(error){
                    console.log("Error: The file was not uploaded");
                    if (error_callback !== null && typeof error_callback !== "undefined"){
                        error_callback(error);
                    }
                }
            );
        }

        return;
   },
       
   /**
   * Handler a callback
   **/
   handler: function(callback){
       return function(){
           if (callback !== null && typeof callback !== "undefined"){
               if (arguments.length === 1)               
                   callback(arguments[0]);
               else 
                   callback(arguments);
           }
       }
   },

   /**
   * Repository objects dictionary for global use
   **/
   g: {},
       
   /**
   * Create and register a ParseRepository (child) in global g.
   **/
   register: function(){       
       if (name === null){
           console.log("Repository name is not defined");
       } else if (this === ParseRepository){
           console.log("Wrong type of Parse Repository");
       } else {
           ParseRepository.g[this.name] = this.create();
       }
   }
       
});

/**
* Repositorio de usuarios parse. Baseado nas classes especiais Parse.User e Parse.FacebookUtils
**/
ParseRepository.User = ParseRepository.extend({

    name: "user",

    prototype: {
        
        _class : Parse.User,

        /**
        * Create a new user. Before, it also checks if both the username and email are unique
        * @param args.username Username
        * @param args.password Encrypeted password
        * @param args.email User email
        * @param args... Any data do you want to save
        **/
        signup : function(args, callback, error_callback) {            
            var data = args;
            var user = this._create();
            user.signUp(data, {success: callback, error: error_callback});
            return;
        },

        /**
        * Redirect to signup method
        **/
        post : function(args, callback, error_callback){
            return this.signUp(args, callback, error_callback);
        },

        /**
        * Log the user in the app. Traditional mode.
        * @param args.username Username
        * @param args.password html input value Encrypted password
        **/
        login : function(args, callback, error_callback){
            var username = args.username;
            var password = args.password;            

            this._class.logIn(
                username,
                password,
                {success: callback, error: error_callback}
            );
            return;
        },

        /**
        * Log out the current user
        **/
        logout: function (){
            this._class.logOut();
        },
        
        /**
        * Get the current user that is logged in the session (localStorage).
        **/
        current: function(callback, error_callback){
            var current_user = this._class.current();

            if (current_user) {

                console.log("getting current user");

                if (callback !== null && typeof callback !== "undefined"){
                    callback(current_user);
                }

            } else {

                console.log("User is not logged in.");

                if (error_callback !== null && typeof error_callback !== "undefined"){
                    error_callback();
                }
            }

            return;
        },

        /**
        * Request a password reset to parse.org
        * @param args.email The user email needed to reset the password
        **/
        reset_password : function(args, callback, error_callback){
            var email = args.email;            
            this._class.requestPasswordReset(
                email,
                {success: callback, error: error_callback}
            );
            return;
        }
    }

});

/**
* Repositorio de usuarios Facebook. Baseado na classe Parse.FacebookUtils
**/
ParseRepository.FacebookUser = ParseRepository.User.extend({
    
    name: "facebook_user",

    prototype: {
        
        _util: Parse.FacebookUtils,
        
        /**
        * @see ParseRepository.FacebookUser.login
        **/
        signup : function(args, callback, error_callback) {
            return this.login(args, callback, error_callback);
        },

        /**
        * Redirect to signup method
        **/
        post : function(args, callback, error_callback){
            return this.login(args, callback, error_callback);
        },

        /**
        * Login or sign up a user through Facebook
        * @param args.permisions Facebook permissions
        **/
        login: function(args, callback, error_callback){
            
            if (typeof args === "undefined"){
                args = {};
            }

            var permissions = args.permissions;
            
            if (typeof permissions === "undefined"){
                permissions = "email";
            }

            function login_callback(response){

                if (!response.existed()) {
                    console.log("User signed up and logged in through Facebook.");
                } else {
                    console.log("User just logged in through Facebook!");
                }

                if (callback !== null && typeof callback !== "undefined"){
                    callback(response);
                }

            };

            this._util.logIn(
                permissions, 
                {success: login_callback, error: error_callback}
            );
            return;
        },

        /**
        * Associate an existing Parse.User to a Facebook account
        * @param args.id User ID
        **/
        link: function(args, callback, error_callback){            
            var id = args.id;
            var permissions = args.permissions;
            
            function get_callback(response){
                if (!this._util.isLinked(response)) {
                    this._util.link(
                        response,
                        permissions,
                        {success: callback, error: error_callback}
                    );
                }
            }
            
            this.get({id: id}, get_callback, error_callback);
            return;
        },

        /**
        * Unassociate an existing Parse.User to a Facebook account
        * @param args.id User object ID
        **/
        unlink: function(args, callback, error_callback){
            var id = args.id;

            function get_callback(response){
                this._util.unlink(
                    response, {success: callback, error: error_callback}
                );                
            }

            this.get({id: id}, get_callback, error_callback);
            return;
        },

        /**
        * Login or sign up a user through Facebook (openFB)
        * @see https://github.com/fernandojunior/OpenFB
        * @param args.permisions Facebook permissions
        **/
        loginWithOpenFB: function(permissions, callback, error_callback){

            if (typeof permissions === "undefined"){
                permissions = "email";
            }

            if (typeof openFB === "undefined"){
                console.log("openFB was not loaded. See https://github.com/fernandojunior/OpenFB");
                return;
            }

            var self = this;

            openFB.login(
                permissions, 
                function(response){

                    console.log("Logged in with openFB.");

                    // setting the auth data for parse login
                    var authData = {
                        id: response.auth_response.user_id,
                        access_token: response.auth_response.access_token,
                        expiration_date: new Date(response.auth_response.expires_in * 1000 +
                                                  (new Date()).getTime()).toJSON()
                    };
                    
                    self.login({permissions: authData}, callback, error_callback);

                },
                function(error){
                    if (typeof error_callback !== "undefined"){
                        error_callback(error);
                    }
                }
            )

            return;
        }

    }

});

ParseRepository.User.register();
ParseRepository.FacebookUser.register();