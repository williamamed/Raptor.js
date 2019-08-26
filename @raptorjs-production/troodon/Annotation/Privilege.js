'use strict'
const Annotation = require('ecmas-annotations').Annotation;

class Privilege extends Annotation{
    /**
     * The possible targets
     *
     * (Annotation.DEFINITION, Annotation.CONSTRUCTOR, Annotation.PROPERTY, Annotation.METHOD)
     *
     * @type {Array}
     */
    static get targets() { return [Annotation.METHOD,Annotation.DEFINITION] }
    
    init(data) {
        this.annotation='Privilege'
    }
}
module.exports=Privilege;