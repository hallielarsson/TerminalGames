
function MakeFolder(folderName, contentArray ){
  if (typeof (contentArray) === "undefined"){
    contentArray = [];
  }
  return { name: folderName, contents: contentArray };
}

var commands = {
  let : function(app, params){
    key = params[0];
    val = params[1];
    var ud = app.userdata;
    ud[key] = val;
    return key + " = " + ud[key];
  },
  get : function(app, params){
    var ud = app.userdata;
    key = params[0];
    return ud[key];
  },
  cls : function(app){
    app.terminalHistory = [];
  }
}

var vue = new Vue({
  el: "#app",
  data: {
    terminal: "",
    termIndex: 0,
    terminalHistory: [],
    commandHistory: [],
    prompt: "$:",
    commands: commands,
    userdata: {},
    user: {
      username: "steve",
    },
    drive: MakeFolder("/", [
      MakeFolder("users",[
        MakeFolder("steve"),
        MakeFolder("alice"),
        MakeFolder("crum"),
      ]),
      MakeFolder("logs"),
      MakeFolder("network"),
    ]),
  },
  methods: {
    execute: function(){
      this.termIndex = 0;
      var terminal = this.terminal;
      console.log(this.terminal);
      var response = this.parse(terminal);
      this.terminalHistory.push(terminal);
      this.commandHistory.push(terminal);
      this.terminalHistory.push(response);
      this.terminal = "";
    },
    lastCommand: function() {
      this.termIndex += 1;
      var historySize = this.commandHistory.length;
      if(this.termIndex >= historySize){
        this.termIndex =  historySize;
      }
      this.terminal = this.commandHistory[historySize - this.termIndex];
    },
    nextCommand: function() {
      this.termIndex -= 1;
      var historySize = this.commandHistory.length;
      if(this.termIndex <= 1){
        this.termIndex =  1;
      }
      this.terminal = this.commandHistory[historySize - this.termIndex];
    },
    parse: function(text){
      var re=/^([a-z]\w+) ?(.*)$/g;
      var commandArgs = re.exec(text);
      if(!commandArgs){
        return "text not understood:" + text;
      }
      var funcName = commandArgs[1];
      var func = this.commands[funcName];
      if(!func){
        return "command " + funcName + " not found.";
      }
      try{
        console.log(commandArgs[2].split(' '));
        return func(this, commandArgs[2].split(' '));

      } catch(e){
        return "Error: " + e.message;
      }
    },
  },
});
