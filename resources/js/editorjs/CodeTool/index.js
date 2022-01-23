/**
 * Index for Editor.js
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license MIT
 * @version 2.0.0
 */

/* global PasteEvent */

/**
 * Code Tool for the Editor.js allows to include code examples in your articles.
 */
class Index {
  /**
   * Allow to press Enter inside the Index textarea
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * @typedef {object} CodeData — plugin saved data
   * @property {string} code - previously saved plugin code
   */

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} options - tool constricting options
   * @param {CodeData} options.data — previously saved plugin code
   * @param {object} options.config - user config for Tool
   * @param {object} options.api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api;

    this.placeholder = this.api.i18n.t(config.placeholder || Index.DEFAULT_PLACEHOLDER);

    this.CSS = {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      wrapper: 'ce-code',
      textarea: 'ce-code__textarea',
      select: 'ce-code__languagecode'
    };

    this.languageList = [
      {name:"Select Language", code:""},{name: "HTML", code: "html"},{name: 'Edge', code: 'edge'},{name: "CSS", code: "css"},{name: "JavaScript", code: "js"},{name: "ABAP", code: "abap"},{name: "Augmented Backus-Naur form", code: "abnf"},{name: "ActionScript", code: "actionscript"},{name: "Ada", code: "ada"},{name: "AL", code: "al"},{name: "ANTLR4", code: "antlr4"},{name: "Apache Configuration", code: "apacheconf"},{name: "APL", code: "apl"},{name: "AppleScript", code: "applescript"},{name: "AQL", code: "aql"},{name: "Arduino", code: "arduino"},{name: "ARFF", code: "arff"},{name: "AsciiDoc", code: "asciidoc"},{name: "6502 Assembly", code: "asm6502"},{name: "ASP.NET (C#)", code: "aspnet"},{name: "AutoHotkey", code: "autohotkey"},{name: "AutoIt", code: "autoit"},{name: "Bash", code: "bash"},{name: "BASIC", code: "basic"},{name: "Batch", code: "batch"},{name: "BBcode", code: "bbcode"},{name: "Bison", code: "bison"},{name: "Backus–Naur form", code: "bnf"},{name: "Brainfuck", code: "brainfuck"},{name: "BrightScript", code: "brightscript"},{name: "Bro", code: "bro"},{name: "C", code: "c"},{name: "Concurnas", code: "concurnas"},{name: "C#", code: "csharp"},{name: "C++", code: "cpp"},{name: "CIL", code: "cil"},{name: "CoffeeScript", code: "coffeescript"},{name: "CMake", code: "cmake"},{name: "Clojure", code: "clojure"},{name: "Crystal", code: "crystal"},{name: "Content-Security-Policy", code: "csp"},{name: "CSS Extras", code: "css-extras"},{name: "D", code: "d"},{name: "Dart", code: "dart"},{name: "DAX", code: "dax"},{name: "Diff", code: "diff"},{name: "DNS zone file", code: "dns-zone-file"},{name: "Docker", code: "docker"},{name: "Extended Backus–Naur form", code: "ebnf"},{name: "Eiffel", code: "eiffel"},{name: "EJS", code: "ejs"},{name: "Elixir", code: "elixir"},{name: "Elm", code: "elm"},{name: "Embedded Lua templating", code: "etlua"},{name: "ERB", code: "erb"},{name: "Erlang", code: "erlang"},{name: "Excel Formula", code: "xlsx"},{name: "F#", code: "fsharp"},{name: "Factor", code: "factor"},{name: "Firestore security rules", code: "firestore-security-rules"},{name: "Flow", code: "flow"},{name: "Fortran", code: "fortran"},{name: "FreeMarker Template Language", code: "ftl"},{name: "G-code", code: "gcode"},{name: "GDScript", code: "gdscript"},{name: "GEDCOM", code: "gedcom"},{name: "Gherkin", code: "gherkin"},{name: "Git", code: "git"},{name: "GLSL", code: "glsl"},{name: "GameMaker Language", code: "gml"},{name: "Go", code: "go"},{name: "GraphQL", code: "graphql"},{name: "Groovy", code: "groovy"},{name: "Haml", code: "haml"},{name: "Handlebars", code: "handlebars"},{name: "Haskell", code: "haskell"},{name: "Haxe", code: "haxe"},{name: "HCL", code: "hcl"},{name: "HLSL", code: "hlsl"},{name: "HTTP", code: "http"},{name: "HTTP Public-Key-Pins", code: "hpkp"},{name: "HTTP Strict-Transport-Security", code: "hsts"},{name: "IchigoJam", code: "ichigojam"},{name: "Icon", code: "icon"},{name: "Structured Text (IEC 61131-3)", code: "iecst"},{name: "Inform 7", code: "inform7"},{name: "Ini", code: "ini"},{name: "Io", code: "io"},{name: "J", code: "j"},{name: "Java", code: "java"},{name: "JavaDoc", code: "javadoc"},{name: "JavaDoc-like", code: "javadoclike"},{name: "Java stack trace", code: "javastacktrace"},{name: "Jinja2", code: "jinja2"},{name: "Jolie", code: "jolie"},{name: "JQ", code: "jq"},{name: "JSDoc", code: "jsdoc"},{name: "JS Extras", code: "js-extras"},{name: "JS Templates", code: "js-templates"},{name: "JSON", code: "json"},{name: "JSONP", code: "jsonp"},{name: "JSON5", code: "json5"},{name: "Julia", code: "julia"},{name: "Keyman", code: "keyman"},{name: "Kotlin", code: "kotlin"},{name: "LaTeX", code: "latex"},{name: "Latte", code: "latte"},{name: "Less", code: "less"},{name: "LilyPond", code: "lilypond"},{name: "Liquid", code: "liquid"},{name: "Lisp", code: "lisp"},{name: "LiveScript", code: "livescript"},{name: "LLVM IR", code: "llvm"},{name: "LOLCODE", code: "lolcode"},{name: "Lua", code: "lua"},{name: "Makefile", code: "makefile"},{name: "Markdown", code: "markdown"},{name: "Markup templating", code: "markup-templating"},{name: "MATLAB", code: "matlab"},{name: "MEL", code: "mel"},{name: "Mizar", code: "mizar"},{name: "Monkey", code: "monkey"},{name: "MoonScript", code: "moonscript"},{name: "N1QL", code: "n1ql"},{name: "N4JS", code: "n4js"},{name: "Nand To Tetris HDL", code: "nand2tetris-hdl"},{name: "NASM", code: "nasm"},{name: "NEON", code: "neon"},{name: "nginx", code: "nginx"},{name: "Nim", code: "nim"},{name: "Nix", code: "nix"},{name: "NSIS", code: "nsis"},{name: "Objective-C", code: "objectivec"},{name: "OCaml", code: "ocaml"},{name: "OpenCL", code: "opencl"},{name: "Oz", code: "oz"},{name: "PARI/GP", code: "parigp"},{name: "Parser", code: "parser"},{name: "Pascal", code: "pascal"},{name: "Pascaligo", code: "pascaligo"},{name: "PC-Axis", code: "pcaxis"},{name: "PeopleCode", code: "peoplecode"},{name: "Perl", code: "perl"},{name: "PHP", code: "php"},{name: "PHPDoc", code: "phpdoc"},{name: "PHP Extras", code: "php-extras"},{name: "PL/SQL", code: "plsql"},{name: "PowerQuery", code: "powerquery"},{name: "PowerShell", code: "powershell"},{name: "Processing", code: "processing"},{name: "Prolog", code: "prolog"},{name: ".properties", code: "properties"},{name: "Protocol Buffers", code: "protobuf"},{name: "Pug", code: "pug"},{name: "Puppet", code: "puppet"},{name: "Pure", code: "pure"},{name: "PureBasic", code: "purebasic"},{name: "Python", code: "python"},{name: "Q (kdb+ database)", code: "q"},{name: "QML", code: "qml"},{name: "Qore", code: "qore"},{name: "R", code: "r"},{name: "Racket", code: "racket"},{name: "React JSX", code: "jsx"},{name: "React TSX", code: "tsx"},{name: "Ren'py", code: "renpy"},{name: "Reason", code: "reason"},{name: "Regex", code: "regex"},{name: "reST (reStructuredText)", code: "rest"},{name: "Rip", code: "rip"},{name: "Roboconf", code: "roboconf"},{name: "Robot Framework", code: "robotframework"},{name: "Ruby", code: "ruby"},{name: "Rust", code: "rust"},{name: "SAS", code: "sas"},{name: "Sass (Sass)", code: "sass"},{name: "Sass (Scss)", code: "scss"},{name: "Scala", code: "scala"},{name: "Scheme", code: "scheme"},{name: "Shell session", code: "shell-session"},{name: "Smalltalk", code: "smalltalk"},{name: "Smarty", code: "smarty"},{name: "Solidity (Ethereum)", code: "solidity"},{name: "Solution file", code: "solution-file"},{name: "Soy (Closure Template)", code: "soy"},{name: "SPARQL", code: "sparql"},{name: "Splunk SPL", code: "splunk-spl"},{name: "SQF: Status Quo Function (Arma 3)", code: "sqf"},{name: "SQL", code: "sql"},{name: "Stylus", code: "stylus"},{name: "Swift", code: "swift"},{name: "TAP", code: "tap"},{name: "Tcl", code: "tcl"},{name: "Textile", code: "textile"},{name: "TOML", code: "toml"},{name: "Template Toolkit 2", code: "tt2"},{name: "Turtle", code: "turtle"},{name: "Twig", code: "twig"},{name: "TypeScript", code: "typescript"},{name: "T4 Text Templates (C#)", code: "t4-cs"},{name: "T4 Text Templates (VB)", code: "t4-vb"},{name: "T4 templating", code: "t4-templating"},{name: "UnrealScript", code: "unrealscript"},{name: "Vala", code: "vala"},{name: "VB.Net", code: "vbnet"},{name: "Velocity", code: "velocity"},{name: "Verilog", code: "verilog"},{name: "VHDL", code: "vhdl"},{name: "vim", code: "vim"},{name: "Visual Basic", code: "visual-basic"},{name: "WarpScript", code: "warpscript"},{name: "WebAssembly", code: "wasm"},{name: "Wiki markup", code: "wiki"},{name: "Xeora", code: "xeora"},{name: "XML doc (.net)", code: "xml-doc"},{name: "Xojo (REALbasic)", code: "xojo"},{name: "XQuery", code: "xquery"},{name: "YAML", code: "yaml"},{name: "Zig", code: "zig"}
    ]

    this.nodes = {
      holder: null,
      textarea: null,
      picker: null,
    };

    this.data = {
      code: data.code || '',
      languageCode: data.languageCode || ''
    };

    this.nodes.holder = this.drawView();
  }

  /**
   * Create Tool's view
   *
   * @returns {HTMLElement}
   * @private
   */
  drawView() {
    let wrapper = document.createElement('div'),
      textarea = document.createElement('textarea'),
      picker = document.createElement('select');

    for (let language in this.languageList){
      let option = document.createElement("option");
      option.text = this.languageList[language].name;
      option.value = this.languageList[language].code;
      picker.appendChild(option);
    }

    wrapper.classList.add(this.CSS.baseClass, this.CSS.wrapper);
    picker.classList.add(this.CSS.select);
    textarea.classList.add(this.CSS.textarea, this.CSS.input);
    textarea.textContent = this.data.code;
    picker.value = this.data.languageCode;

    textarea.placeholder = this.placeholder;

    wrapper.appendChild(picker);
    wrapper.appendChild(textarea);

    this.nodes.textarea = textarea;
    this.nodes.picker = picker;

    return wrapper;
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement} this.nodes.holder - Code's wrapper
   * @public
   */
  render() {
    return this.nodes.holder;
  }

  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} codeWrapper - Index's wrapper, containing textarea with code
   * @returns {CodeData} - saved plugin code
   * @public
   */
  save(codeWrapper) {
    return {
      code: codeWrapper.querySelector('textarea').value,
      languageCode: codeWrapper.querySelector("select").value
    };
  }

  /**
   * onPaste callback fired from Editor`s core
   *
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste(event) {
    const content = event.detail.data;

    this.data = {
      code: content.textContent,
    };
  }

  /**
   * Returns Tool`s data from private property
   *
   * @returns {CodeData}
   */
  get data() {
    return this._data;
  }

  /**
   * Set Tool`s data to private property and update view
   *
   * @param {CodeData} data - saved tool data
   */
  set data(data) {
    this._data = data;

    if (this.nodes.textarea) {
      this.nodes.textarea.textContent = data.code;
    }

    if(this.nodes.picker) {
      this.nodes.picker.value = data.languageCode;
    }
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: '<svg width="14" height="14" viewBox="0 -1 14 14" xmlns="http://www.w3.org/2000/svg" > <path d="M3.177 6.852c.205.253.347.572.427.954.078.372.117.844.117 1.417 0 .418.01.725.03.92.02.18.057.314.107.396.046.075.093.117.14.134.075.027.218.056.42.083a.855.855 0 0 1 .56.297c.145.167.215.38.215.636 0 .612-.432.934-1.216.934-.457 0-.87-.087-1.233-.262a1.995 1.995 0 0 1-.853-.751 2.09 2.09 0 0 1-.305-1.097c-.014-.648-.029-1.168-.043-1.56-.013-.383-.034-.631-.06-.733-.064-.263-.158-.455-.276-.578a2.163 2.163 0 0 0-.505-.376c-.238-.134-.41-.256-.519-.371C.058 6.76 0 6.567 0 6.315c0-.37.166-.657.493-.846.329-.186.56-.342.693-.466a.942.942 0 0 0 .26-.447c.056-.2.088-.42.097-.658.01-.25.024-.85.043-1.802.015-.629.239-1.14.672-1.522C2.691.19 3.268 0 3.977 0c.783 0 1.216.317 1.216.921 0 .264-.069.48-.211.643a.858.858 0 0 1-.563.29c-.249.03-.417.076-.498.126-.062.04-.112.134-.139.291-.031.187-.052.562-.061 1.119a8.828 8.828 0 0 1-.112 1.378 2.24 2.24 0 0 1-.404.963c-.159.212-.373.406-.64.583.25.163.454.342.612.538zm7.34 0c.157-.196.362-.375.612-.538a2.544 2.544 0 0 1-.641-.583 2.24 2.24 0 0 1-.404-.963 8.828 8.828 0 0 1-.112-1.378c-.009-.557-.03-.932-.061-1.119-.027-.157-.077-.251-.14-.29-.08-.051-.248-.096-.496-.127a.858.858 0 0 1-.564-.29C8.57 1.401 8.5 1.185 8.5.921 8.5.317 8.933 0 9.716 0c.71 0 1.286.19 1.72.574.432.382.656.893.671 1.522.02.952.033 1.553.043 1.802.009.238.041.458.097.658a.942.942 0 0 0 .26.447c.133.124.364.28.693.466a.926.926 0 0 1 .493.846c0 .252-.058.446-.183.58-.109.115-.281.237-.52.371-.21.118-.377.244-.504.376-.118.123-.212.315-.277.578-.025.102-.045.35-.06.733-.013.392-.027.912-.042 1.56a2.09 2.09 0 0 1-.305 1.097c-.2.323-.486.574-.853.75a2.811 2.811 0 0 1-1.233.263c-.784 0-1.216-.322-1.216-.934 0-.256.07-.47.214-.636a.855.855 0 0 1 .562-.297c.201-.027.344-.056.418-.083.048-.017.096-.06.14-.134a.996.996 0 0 0 .107-.396c.02-.195.031-.502.031-.92 0-.573.039-1.045.117-1.417.08-.382.222-.701.427-.954z" /> </svg>',
      title: 'Code',
    };
  }

  /**
   * Default placeholder for Index's textarea
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_PLACEHOLDER() {
    return 'Write or Paste Code here';
  }

  /**
   *  Used by Editor.js paste handling API.
   *  Provides configuration to handle CODE tag.
   *
   * @static
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: [ 'pre' ],
    };
  }

  /**
   * Automatic sanitize config
   *
   * @returns {{code: boolean}}
   */
  static get sanitize() {
    return {
      code: true, // Allow HTML tags
    };
  }
}

module.exports = Index;
