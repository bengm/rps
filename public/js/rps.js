RPS = new Backbone.Marionette.Application();
 
RPS.addRegions({
  playRegion: "#playRegion",
  resultRegion: "#resultRegion",
  historyRegion: "#historyRegion"
});

RPS.Game = Backbone.Model.extend({

  initialize: function(){
    if (!this.get('opponentMove')) {
      this.set('opponentMove', ["Rock","Paper","Scissors"][Math.floor(Math.random()*3)] );  
    }
    var original_time = this.get('time');

    if (original_time) {
      this.set('time', new Date(original_time) ); // use the existing time as a date (vs string)
    } else {
      this.set('time', new Date() );
    }
    this.scoreRound();
    this.setIconValues();
    this.showRound();
  },

  displayTime: function() {
    if ( this.get('time') instanceof Date ) {
      return (this.get('time').getMonth()+1) + "/" + this.get('time').getDate() + " " + this.get('time').getHours() + ":" + this.get('time').getMinutes() + ", " + this.get('time').getSeconds();
    } else {
      return "";
    }
  },



  scoreRound: function(){
    // figure out if we won or lost
    var result = "Loss";
    var moves  = this.get('playerMove') + "-" + this.get('opponentMove');
    var winningMoves = ["Rock-Scissors","Paper-Rock", "Scissors-Paper"];
    var tieMoves     = ["Rock-Rock",    "Paper-Paper","Scissors-Scissors"];
    var isWin = ($.inArray(moves,winningMoves) > -1 );
    var isTie = ($.inArray(moves,tieMoves)     > -1 );
    if (isWin) {
      result = "Win";
    } else if (isTie) {
      result = "Tie";
    } 
    this.set('result',result);
    this.set('resultIcon',{Win:"smile",Tie:"meh",Loss:"frown"}[result]);
  },

  showRound: function(){
    var resultView = new RPS.GameView({template:'#resultTemplate',model:this, tagName:'div'});
    RPS.resultRegion.show(resultView);
  },

  setIconValues: function() {
    this.set('playerMoveIcon',   this.iconName(this.get('playerMove'))   );
    this.set('opponentMoveIcon', this.iconName(this.get('opponentMove')) );
  },
  iconName: function(move){
    return {Rock: "lemon", Paper: "file-text-alt", Scissors: "cut"}[move];
  }

});
RPS.Games = Backbone.Collection.extend({
  model: RPS.Game,
  url: '/games'
});

RPS.PlayView = Backbone.Marionette.ItemView.extend({
  
  template: "#playTemplate",
 
  events: {
    'click button#playRock'    : 'playRock',
    'click button#playPaper'   : 'playPaper',
    'click button#playScissors': 'playScissors'
  },

  play: function(move) {
    var newGame = new RPS.Game({playerMove: move});
    this.collection.add(newGame);
    newGame.save(); 
  },

  playRock:     function(){ this.play('Rock');     },
  playPaper:    function(){ this.play('Paper');    },
  playScissors: function(){ this.play('Scissors'); }

});

RPS.GameView = Backbone.Marionette.ItemView.extend({
  template: "#gameTemplate",
  tagName:  'tr',
  serializeData: function(){
    return {
      "time":             this.model.get('time'),
      "playerMove":       this.model.get('playerMove'),
      "opponentMove":     this.model.get('opponentMove'),
      "displayTime":      this.model.displayTime(),
      "result":           this.model.get('result'),
      "resultIcon":       this.model.get('resultIcon'),
      "playerMoveIcon":   this.model.get('playerMoveIcon'),
      "opponentMoveIcon": this.model.get('opponentMoveIcon')
    }
  },
  initialize: function(){
    this.$el.addClass("result-" + this.model.get('result'));
  }
});

RPS.GamesView = Backbone.Marionette.CompositeView.extend({
  tagName: "table",
  className: "table table-bordered table-striped table-hover",
  id: "games",
  template: "#gamesTemplate",
  itemView: RPS.GameView,
  appendHtml: function(collectionView, itemView) {
    collectionView.$("tbody").prepend(itemView.el);
  }
});

RPS.addInitializer(function(options){
  var gamesView = new RPS.GamesView({
    collection: options.games
  });
  var playView = new RPS.PlayView({
    collection: options.games
  });
  
  RPS.playRegion.show(playView)
  RPS.historyRegion.show(gamesView);
});


// Start the Application & bootstrap the data
$(document).ready(function(){
  RPS.games = new RPS.Games();
  RPS.games.fetch(); // get data from server
  RPS.start({games: RPS.games});
});