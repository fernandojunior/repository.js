/**
* Repositorio de objetos do Parse.org 
* https://parse.com/docs/js_guide
**/
var ParseRepository = Repository.extend({

    prototype: {

       _class: undefined,

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
       getAll: function(args){
           return this.find(null, args.success, args.error);           
       },

       /**
       * Retrieve only a object
       * @param args.id The object ID
       **/
       get: function(args){
           var objectId = args.data.objectId;
           var success = args.success;
           var error = args.error;
           this.first({data: {objectId : objectId}, success: success, error: error});
           return;
       },
       
       /**
       * Update a parse object
       * @param args.id The object ID
       * @param args.data The new data of object
       **/
       put: function(args){
           var data = args.data;
           var objectId = args.data.objectId;
           var success = args.success;
           var error = args.error;

           function get_callback(response){
               response.save(data, {success: success, error: error});
           };

           this.get({data: {objectId : objectId}, success: get_callback, error: error});
           return;
       },

       /**
       * Create a parse object
       * @param data The data of the new object
       **/
       post: function(args) {
           var data = args.data;
           var success = args.success;
           var error = args.error;

           this._create().save(data, {success: success, error: error});
           return;
       },
       
       /**
       * Delete a parse object
       * @param args.id The ID of the object that will be deleted
       **/
       delete: function(args){
           var objectId = args.data.objectId;
           var success = args.success;
           var error = args.error;

           function get_callback(response){
               response.destroy({success: success, error: error});
           };

           this.get({data: {objectId: objectId}, success: get_callback, error: error});
           return;
       },

        /**
        * Find objects
        * @param args The key : value sings
        **/        
       find: function(args){
           var data = args.data;
           var success = args.success;
           var error = args.error;

           var query = this._query();
           for(var key in data){
               query.equalTo(key, data[key]);
           }
           query.find({success: success, error: error});
           return;
       },

        /**
        * Find first object
        * @param args The key : value sings
        **/        
       first: function(args){
           var data = args.data;
           var success = args.success;
           var error = args.error;

           var query = this._query();
           for(var key in data){
               query.equalTo(key, data[key]);
           }           
           query.first({success: success, error: error});
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
   }

});

/**
* Repositorio de usuarios parse. Baseado nas classes especiais Parse.User e Parse.FacebookUtils
**/
ParseRepository.User = ParseRepository.extend({

    prototype: {
        
        _class : Parse.User,

        /**
        * Create a new user. Before, it also checks if both the username and email are unique
        * @param args.username Username
        * @param args.password Encrypeted password
        * @param args.email User email
        * @param args... Any data do you want to save
        **/
        signup : function(args) {
            var data = args.data;
            var success = args.success;
            var error = args.error;

            var user = this._create();
            user.signUp(data, {success: success, error: error});
            return;
        },

        /**
        * Redirect to signup method
        **/
        post : function(args){
            return this.signUp(args);
        },

        /**
        * Log the user in the app. Traditional mode.
        * @param args.username Username
        * @param args.password html input value Encrypted password
        **/
        login : function(args){
            var username = args.data.username;
            var password = args.data.password;
            var success = args.success;
            var error = args.error;

            this._class.logIn(username, password, {success: success, error: error});
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
        current: function(args){
            var success = args.success;
            var error = args.error;

            var current_user = this._class.current();

            if (current_user) {

                if (success !== null && typeof success !== "undefined"){
                    success(current_user);
                }

            } else {

                if (error !== null && typeof error !== "undefined"){
                    error();
                }
            }

            return;
        },

        /**
        * Request a password reset to parse.org
        * @param args.email The user email needed to reset the password
        **/
        reset_password : function(args){
            var email = args.data.email;
            var success = args.success;
            var error = args.error;

            this._class.requestPasswordReset(
                email,
                {success: success, error: error}
            );
            return;
        }
    }

});

/**
* Repositorio de usuarios Facebook. Baseado na classe Parse.FacebookUtils
**/
ParseRepository.FacebookUser = ParseRepository.User.extend({

    prototype: {
        
        _util: Parse.FacebookUtils,
        
        /**
        * @see ParseRepository.FacebookUser.login
        **/
        signup : function(args) {
            return this.login(args);
        },

        /**
        * Redirect to signup method
        **/
        post : function(args){
            return this.login(args);
        },

        /**
        * Login or sign up a user through Facebook
        * @param args.permisions Facebook permissions
        **/
        login: function(args){
            var permissions = args.data.permissions;
            var success = args.success;
            var error = args.error;

            if (typeof permissions === "undefined"){
                permissions = "email";
            }

            function login_callback(response){

                if (!response.existed()) {
                    console.log("User signed up and logged in through Facebook.");
                } else {
                    console.log("User just logged in through Facebook!");
                }

                if (success !== null && typeof success !== "undefined"){
                    success(response);
                }

            };

            this._util.logIn(
                permissions,
                {success: login_callback, error: error}
            );
            return;
        },

        /**
        * Associate an existing Parse.User to a Facebook account
        * @param args.id User ID
        **/
        link: function(args){            
            var objectId = args.data.objectId;
            var permissions = args.data.permissions;
            var success = args.success;
            var error = args.error;

            function get_callback(response){
                if (!this._util.isLinked(response)) {
                    this._util.link(
                        response,
                        permissions,
                        {success: success, error: error}
                    );
                }
            }

            this.get({data: {objectId: objectId}, success: get_callback, error: error});
            return;
        },

        /**
        * Unassociate an existing Parse.User to a Facebook account
        * @param args.id User object ID
        **/
        unlink: function(args){
            var objectId = args.data.objectId;
            var success = args.success;
            var error = args.error;

            function get_callback(response){
                this._util.unlink(
                    response, {success: success, error: error}
                ); 
            }

            this.get({data: {objectId: objectId}, success: get_callback, error: error});
            return;
        },

        /**
        * Login or sign up a user through Facebook (openFB)
        * @see https://github.com/fernandojunior/OpenFB
        * @param args.permisions Facebook permissions
        **/
        loginWithOpenFB: function(args){
            var permissions = args.data.permissions;
            var success = args.success;
            var error = args.error;

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

                    self.login({data: {permissions: authData}, success: success, error: error});

                },
                function(){
                    if (typeof error !== "undefined"){
                        error(arguments);
                    }
                }
            )

            return;
        }

    }

});