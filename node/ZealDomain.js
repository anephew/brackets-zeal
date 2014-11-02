/**
 * Zeal domain
 *
 * @package Zeal
 * @version 1.0.1
 * @copyright © 2014 anephew, http://github.com/anephew
 * @license http://opensource.org/licenses/MIT The MIT License (MIT)
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 2, maxerr: 50, browser: true */
/*global $, define, require, exports, brackets */


(function () {

  "use strict";

  var child_process = require("child_process");
  
  /**
   * Pass the request to Zeal
   * @param {String} str string
   */
  function cmdZealSearch(str) {
    child_process.exec("zeal --query '" + str + "'", function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  }

  /**
   * Initialize domain.
   */
  function init(domainManager) {
    
    if (!domainManager.hasDomain("zeal")) {
      domainManager.registerDomain("zeal", {
        major: 0,
        minor: 1
      });
    }
    
    domainManager.registerCommand(
      "zeal", // domain name
      "zealSearch", // command name
      cmdZealSearch, // command handler function
      false, // this command is synchronous in Node
      "Pass the request to Zeal",
      [{
        name: "search", // parameters
        type: "string",
        description: "Search string"
      }]
    );
    
  }

  // Load the domain
  exports.init = init;

}());