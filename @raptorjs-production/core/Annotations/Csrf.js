'use strict'
const Annotation = require('ecmas-annotations').Annotation;

module.exports = class Csrf extends Annotation {

    /**
     * The possible targets
     *
     * (Annotation.DEFINITION, Annotation.METHOD)
     *
     * @type {Array}
     */
    static get targets() { return [Annotation.METHOD, Annotation.DEFINITION] }
    
    init(data) {
        
        this.annotation = 'Csrf'
    }
};