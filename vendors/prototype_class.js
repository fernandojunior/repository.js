/**
* prototype_class.js
* https://github.com/fernandojunior/prototype_class.js
* version 1.0
**/ 
var PrototypeClass = {

    prototype : {
        initialize: function (){
        },

        instanceof: function(cls){       
            return cls.prototype.isPrototypeOf(this);
        }
    },

    create : function(){
        var instance = Object.create(this.prototype);
        instance.initialize.apply(instance, arguments);
        return instance;
    },

    dextend: function(propertyDescriptors){

        if (typeof propertyDescriptors.prototype !== "undefined"
                && typeof propertyDescriptors.prototype.value !== "undefined"){
            propertyDescriptors.prototype.value = Object.create(this.prototype, propertyDescriptors.prototype.value);
        }

        return Object.create(this, propertyDescriptors);

    },

    extend: function(properties){            
        return this.dextend(this.descriptoralize(properties));
    },

    invoke_member: function(obj, memberName, args){
        var member = this.prototype[memberName];
        return member.apply(obj, args);
    },

    invoke_class_member: function(memberName, args){
        var member = this[memberName];
        return member.apply(args);
    },

    super: function(obj, memberName, args){
        var super_class = Object.getPrototypeOf(this);
        return super_class.invoke_member(obj, memberName, args);
    },

    super_class_member: function(memberName, args){
        var super_class = Object.getPrototypeOf(this);
        return super_class.invoke_class_member(memberName, args);
    },

    isPrototypeOf: function(obj){
        return this.prototype.isPrototypeOf(obj);
    },

    descriptoralize: function(class_properties){            

        for(var key in class_properties.prototype){
            class_properties.prototype[key] = { 
                value: class_properties.prototype[key],
                enumerable: true,
                configurable: true,
                writable: true
            }
        }

        for (var key in class_properties){                
            class_properties[key] = {
                value: class_properties[key],
                enumerable: true,
                configurable: true,
                writable: true
            }                
        }

        return class_properties;

    }

};