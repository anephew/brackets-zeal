/**
 * Zeal integration for Brackets
 *
 * @version 1.0.0
 * @copyright © 2014 anephew, http://github.com/anephew
 * @license http://opensource.org/licenses/MIT The MIT License (MIT)
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 2, maxerr: 50, browser: true */
/*global $, define, brackets */


define(function (require, exports, module) {
  
  "use strict";

  // Core modules
  var
    ExtensionUtils    = brackets.getModule("utils/ExtensionUtils"),
    NodeDomain        = brackets.getModule("utils/NodeDomain"),
    KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
    CommandManager    = brackets.getModule("command/CommandManager"),
    EditorManager     = brackets.getModule("editor/EditorManager"),
    DocumentManager   = brackets.getModule("document/DocumentManager"),
    Menus             = brackets.getModule("command/Menus");

  // Variables
  var CMD_ZEAL_SEARCH = "anephew.brackets-zeal";
  var zealDomain = new NodeDomain("zeal", ExtensionUtils.getModulePath(module, "node/ZealDomain"));

  /** 
   *  Process the selected text or word under the cursor
   */
  function handleZealSearch() {
    
    var editor = EditorManager.getActiveEditor();
    var selection = editor.getSelection();
    var lang = DocumentManager.getCurrentDocument().language._id;
    var text = editor.getSelectedText();
    
    // Select a word if not selected
    if (selection.start.ch === selection.end.ch) {
      editor.selectWordAt(editor.getCursorPos());
      text = editor.getSelectedText();
    }
    
    // Check for empty text
    if (!text) {
      editor.displayErrorMessageAtCursor("Place cursor under the word or select any text");
      return;
    }
    
    // Search string
    var searchString = lang + ":" + text;
  
    // Execute node domain
    zealDomain.exec("zealSearch", searchString);
    
  }

  // Register command
  CommandManager.register("LookUp in Zeal", CMD_ZEAL_SEARCH, handleZealSearch);

  // Binding shortcut
  KeyBindingManager.addBinding(CMD_ZEAL_SEARCH, "Ctrl-Alt-Z");
  
  // Context menu
  var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
  contextMenu.addMenuItem(CMD_ZEAL_SEARCH);

});