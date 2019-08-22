'use strict'
const Annotation = require('ecmas-annotations').Annotation;

module.exports = class Route extends Annotation {

    /**
     * The possible targets
     *
     * (Annotation.DEFINITION, Annotation.CONSTRUCTOR, Annotation.PROPERTY, Annotation.METHOD)
     *
     * @type {Array}
     */
    static get targets() { return [Annotation.METHOD,Annotation.DEFINITION,Annotation.PROPERTY] }
    
    init(data) {
        this.annotation='Route'
    }
};