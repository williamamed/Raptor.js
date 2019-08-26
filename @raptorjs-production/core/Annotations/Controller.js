'use strict'
const Annotation = require('ecmas-annotations').Annotation;

module.exports = class Controller extends Annotation {

    /**
     * The possible targets
     *
     * (Annotation.DEFINITION, Annotation.METHOD)
     *
     * @type {Array}
     */
    static get targets() { return [Annotation.DEFINITION] }
    
    init(data) {
        
        this.annotation = 'Controller'
    }
};