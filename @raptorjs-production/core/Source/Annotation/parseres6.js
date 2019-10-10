'use strict'

const fs = require('fs')
const StringScanner = require('StringScanner')

const utils = require('ecmas-annotations/lib/utils')
const Metadata = require('ecmas-annotations/lib/metadata')

/**
 * This constructor parses a given file path and returns
 * a Metadata object with information about the file's
 * constructor, methods, properties, etc...
 *
 * @author Aumard Jimmy <jimmy.aumard@gmail.com>
 */
module.exports = class Parser {
  /**
   * foo(){}
   */
  static get T_FUNCTION() {
    return /(static )?(\w+)(.*)\((.*)\)/
  }

  /**
   * foo = 'some variable'
   */
  static get T_PROPERTY() {
    return /(\w+)(.*)= (.*)\n/
  }

  /**
   * class MyClass extends Parent
   */
  static get T_CLASS_DEFINITION() {
    return /(.*)class (\w+)( extends (\w+))?/
  }

  /**
   * constructor(){}
   */
  static get T_CONSTRUCTOR_FUNCTION() {
    return /constructor\((.*?)\)/
  }

  /**
   * Parse the Metadata from a given javascript file path
   *
   * @param {String} path
   * @returns {Metadata}
   */
  parseFile(path) {
    const stat = fs.lstatSync(path)
    if (!stat || !stat.isFile()) {
      return null
    }
    const metadata = this.parseSource(fs.readFileSync(path).toString())
    metadata.path = path
    return metadata
  }

  /**
   * Parse the Metadata from a file content string
   *
   * @param {String} source
   * @returns {Metadata}
   */
  parseSource(source) {

    const metadata = new Metadata()
    const ss = new StringScanner(source)

    let foundConstructor = false
    let className = null

    while (!ss.eos()) {

      const cs = ss.scanUntil(/\/\*\*/)
      if (cs == null) break
      const csp = ss.pointer() - 3
      ss.scanUntil(/\*\/\n/)
      const cep = ss.pointer()
      const comment = source.substring(csp, cep)
      const lineNumber = utils.findLineNumberOfPosition(source, csp)
      const nextLine = ss.scanUntil(/\n/)

      if (nextLine === null || nextLine.trim() == '') {
        metadata.fileComment = comment
        continue
      }

      let match

      // class
      match = nextLine.match(Parser.T_CLASS_DEFINITION)
      if (match != null) {
        metadata.definition = {
          comment: comment,
          line: lineNumber,
          name: match[2]
        }
        className = match[2]
        continue
      }

      if (foundConstructor == false) {

        // function(){}
        match = nextLine.match(Parser.T_CONSTRUCTOR_FUNCTION)

        if (match != null) {

          metadata.constructor = {
            type: Metadata.CONSTRUCTOR_FUNCTION,
            line: lineNumber,
            comment: comment,
            className: className,
            name: 'constructor',
            arguments: match[1] !== '' ? match[1].split(',') : null
          }
          foundConstructor = true
          continue
        }
      }

      // foo: function(){}
      match = nextLine.match(Parser.T_FUNCTION)

      if (match != null) {
        
        metadata.methods.push({
          comment: comment,
          line: lineNumber,
          name: match[2],
          className: className,
          arguments: match[4] !== '' ? match[4].split(',') : null
        })

      }
      else {

        // foo: 'my property'
        match = nextLine.match(Parser.T_PROPERTY)
        if (match != null) {
          metadata.properties.push({
            comment: comment,
            line: lineNumber,
            className: className,
            name: match[1],
            body: match[3]
          })
        }
      }
    }

    return metadata
  }
}
