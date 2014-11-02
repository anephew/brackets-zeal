/**
 * Zeal integration for Brackets
 *
 * @version 1.0.1
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
    KeyEvent          = brackets.getModule("utils/KeyEvent"),
    CommandManager    = brackets.getModule("command/CommandManager"),
    EditorManager     = brackets.getModule("editor/EditorManager"),
    DocumentManager   = brackets.getModule("document/DocumentManager"),
    Menus             = brackets.getModule("command/Menus"),
    ModalBar          = brackets.getModule("widgets/ModalBar").ModalBar;

  // Commands id
  var CMD_ZEAL_SEARCH = "anephew.zeal-search";
  var CMD_ZEAL_BAR = "anephew.zeal-bar";
  
  var zealDomain = new NodeDomain("zeal", ExtensionUtils.getModulePath(module, "node/ZealDomain"));

  /** 
   *  Process the selected text or word under the cursor
   */
  function handleZealSearch() {
    
    var
      editor    = EditorManager.getActiveEditor(),
      selection = editor.getSelection(),
      lang      = DocumentManager.getCurrentDocument().language._id,
      text      = editor.getSelectedText();
    
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

    // Execute Zeal
    zealDomain.exec("zealSearch", lang + ":" + text);
    
  }
  
  /**
  *  Quick bar fo custom search in Zeal
  */
  function handleZealBar() {
    
    var
      html    = "LookUp in Zeal <input type='text' id='searchZealBar' placeholder='docset:string' style='width: 15em' /><button id='searchZealBar-btn' class='btn no-focus' disabled>Go</button>",
      modal   = new ModalBar(html, true),
      $input  = $("#searchZealBar"),
      $button = $("#searchZealBar-btn");
    
    // Check for empty input, bind ENTER key
    $input.on("input keydown", function (e) {
      $button.prop("disabled", $(this).val() !== "" ? false : true);
      if (e.keyCode === KeyEvent.DOM_VK_RETURN) {
        $button.triggerHandler("click");
      }
    });
   
    // Execute Zeal
    $button.click(function () {
      zealDomain.exec("zealSearch", $input.val());
    });
    
  }

  // Register commands
  CommandManager.register("LookUp in Zeal", CMD_ZEAL_SEARCH, handleZealSearch);
  CommandManager.register("Quick Zeal", CMD_ZEAL_BAR, handleZealBar);

  // Binding shortcuts
  KeyBindingManager.addBinding(CMD_ZEAL_SEARCH, "Ctrl-Alt-Z");
  KeyBindingManager.addBinding(CMD_ZEAL_BAR, "Ctrl-Shift-Z");
  
  // Context menu
  var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
  contextMenu.addMenuItem(CMD_ZEAL_SEARCH);

});