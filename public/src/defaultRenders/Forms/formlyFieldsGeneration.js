(function(module){
    'use strict';

    module.factory('formlyFieldsGeneration', factory);

    factory.$inject = ["generalPurposePersistence", "halUtils"];

    function factory(generalPurposePersistence, halUtils) {
        return {
            "getFormlyFields" : getFormlyFields,
            "_private": {
                "getSelectChoices": getSelectChoices
            }
        };


        function getSelectChoices(hNode, propertyName) {
            var curiePrefix = halUtils.getCuriePrefixFromPropertyName(propertyName);
            var url = halUtils.getUrlFromCurie(hNode, curiePrefix);
            generalPurposePersistence.get(url).then(function(result){

            })
        }

        function getFieldsForEmbedded(embedded, hNode) {
            var fields = [];
            for(var propertyName in embedded){
                if (embedded.hasOwnProperty(propertyName)) {
                    fields.push({
                        'key': propertyName,
                        'type': 'lx-select', // 'lx-select-multiple'
                        'templateOptions': {
                            'multiple': Array.isArray(embedded[propertyName]), // {{ default: false}}
                            'label': toLabel(propertyName), // default: 'Select'
                            'selected': 'title', // displays current selected property as placeholder
                            'choice': 'title', // dropdown choice display
                            'choices': getSelectChoices(hNode, propertyName),
                            'minLength': 2,
                            'allowClear': true
                        }
                    });
                }
            }
            return fields;
        }
        function getFormlyFields(hNode, hNodeType){
            var fields = [];
            for(var property in hNode){
                if (hNode.hasOwnProperty(property)){
                    switch(property){
                        case "_meta":
                            // do nothing
                            break;
                        case "_links":
                            // do nothing;
                            break;
                        case "_embedded":
                            fields = fields.concat(getFieldsForEmbedded(hNode[property],hNode));
                            break;
                        default: {
                            fields.push(getFieldForProperty(hNode[property], property));
                        }
                    }
                }
            }
            return fields;
        }
        function getFieldForProperty(property, propertyName){
            switch(typeof property){
                case "string":
                    if (property.length <=200){
                        return getTextInput(propertyName);
                    } else {
                        return getTextArea(propertyName);
                    }
                    break;
                case "boolean":
                    return getCheckbox(propertyName);
                case "object":
                    if (property instanceof Date){
                        return getDateTimePicker(propertyName);
                    }
                default:
                    throw new Error("Primitive type " + typeof property + " was unhandled with value of " + property);
            }
        }
        function getDateTimePicker(propertyName){
            return {
                'key': propertyName,
                'type': 'lx-date-picker',
                'templateOptions': {
                    'label': toLabel(propertyName) // acts as a placeholder & label
                }
            };
        }
        function getTextArea(propertyName){
            var field = {
                'key': propertyName,
                'type': 'lx-textarea',
                'templateOptions': {
                    'type': 'text', // html input type values [text, email, password, url, number]
                    'label': toLabel(propertyName) // acts as a placeholder & label
                }
            };
            if (propertyName === "title"){
                field.templateOptions.required = true;
            }
            return field;
        }
        function getTextInput(propertyName){
            var field = {
                'key': propertyName,
                'type': 'lx-input',
                'templateOptions': {
                    'type': 'text', // html input type values [text, email, password, url, number]
                    'label': toLabel(propertyName) // acts as a placeholder & label
                }
            };
            if (propertyName === "title"){
                field.templateOptions.required = true;
            }
            return field;
        }
        function getCheckbox(propertyName){
            return {
                'key': propertyName,
                'type': 'lx-checkbox',
                'templateOptions': {
                    'label': toLabel(propertyName)
                }
            }
        }
        function toLabel(propertyName){
            // If using curie, remove curie prefix
            var colonIndex = propertyName.indexOf(":");
            if (colonIndex >= 0){
                propertyName = propertyName.substr(colonIndex +1);
            }
            // insert a space between lower & upper
            return propertyName.replace(/([a-z,0-9])([A-Z,0-9])/g, '$1 $2')
                // space before last upper in a sequence followed by lower
                .replace(/\b([A-Z,0-9]+)([A-Z])([a-z])/, '$1 $2$3')
                // uppercase the first character
                .replace(/^./, function(str){ return str.toUpperCase(); });
        }
    }
})(angular.module('hNode'));