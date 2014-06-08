/**
* Repositorio de objetos do Parse.org 
* https://parse.com/docs/js_guide
**/
var ParseRepository = BaseRepository.extend({

   prototype: {
       
       /**
       * Inicializa o repositorio
       * @param args.class_name Nome da classe do Parse
       **/
       initialize: function (args){
           this._class_name = args.class_name;           
           this._parseObject = Parse.Object.extend(this._class_name);
       },
       
       /**
       * Cria uma query do Parse
       **/
       _query: function(){
           return new Parse.Query(this._parseObject);
       },
       
       getAll: function(callback, error_callback){
           var query = this._query();
    
            query.find({
                success: function(response){
                    console.log("retrived resources");
                    console.log(JSON.stringify(response));
                    
                    if (callback !== null && typeof callback !== "undefined"){
                        callback(response);
                    }    
                    
                },
                error: function (error){
                    console.log("did not retry the resources");

                    if (error_callback !== null && typeof error_callback !== "undefined"){
                        error_callback(error);
                    }

                }
            });
           
           return;
           
       },
        
       get: function(args, callback, error_callback){

           var id = args.id;

           if (typeof(id) === "undefined") {
               return this.index(callback, error_callback);
           } 
           
           var query = this._query();
    
           query.get(id, {
               success: function(response){
                   console.log("retrived resource");
                   console.log(JSON.stringify(response));

                   if (callback !== null && typeof callback !== "undefined"){
                       callback(response);
                   }

               },
               error: function (error){
                   console.log("did not retry the resource");

                   if (error_callback !== null && typeof error_callback !== "undefined"){
                       error_callback(error);
                   }                   
               }
           });
           
           return;

       },
        
       put: function(args, callback, error_callback){
           var id = args.id;
           var data = args.data;
           
           var query = this._query();
           
           query.get(id, {
               success: function(response){                
                
                   response.save(data, {
                       success: function(response) {
                           console.log("updated");
                           console.log(JSON.stringify(response));
                       },
                       error: function(error){
                           console.log("did not update");
                       }
                   });
                
               },
               error: function (error){
                   console.log("did not retry the resoruce");
               }
           });
           
           return;
           
       },
        
       post: function(args, callback, error_callback) {
           var data = args.data;           
           
           var obj = new this._parseObject();
            
           obj.save(data, {
               success: function(response) {
                   console.log("posted");
                   console.log(JSON.stringify(response));
               },
               error: function(error){
                   console.log("did not post");
               }
           });
           
           return;
       },
       
       postFile: function(args, callback, error_callback){
           
           var name = args.name;
           var ext = args.ext;
           var content_type = args.content_type;
           var file_upload_control = args.file_upload_control;
           
           console.log(name + ext + " " + content_type);
           
           if (file_upload_control.files.length > 0) {
               
               var file = file_upload_control.files[0];
               var parseFile = new Parse.File(name + ext, file, content_type);

               parseFile.save().then(
                   function(response){
                       console.log("file saved");
                       console.log(response.url());
                       if (callback !== null && typeof callback !== "undefined"){
                           callback();
                       }
                    },
                   function(error){
                       console.log("did not  saved");
                       if (error_callback !== null && typeof error_callback !== "undefined"){
                           error_callback(error);
                       }
                   }
               );
            }
           
           return;
       
       },
       
       delete: function(args, callback, error_callback){
           var id = args.id;
           
           var query = this._query();
           
           query.get(id, {
               success: function(response){
                   
                   var obj = response;
                
                   obj.destroy({
                       success: function(obj) {
                           console.log("deleted");
                       },
                       error: function(obj, error){
                           console.log("did not delete");
                       }
                   });                
               },
               error: function (error){
                   console.log("did not retry the resoruce");
               }
           });
           
           return;
       },
    
   }
    
})