/**
  List of live games
**/
var React = require('react');
var Teams = require('../constants/NFL_Teams.json');

var LiveGameListing = React.createClass({

  propTypes: {
    nextStep: React.PropTypes.func.isRequired,
    friend: React.PropTypes.string.isRequired
  },

  getInitialState() {
    this.getLiveGames();
    return {
      games: undefined
    };
  },

  getLiveGames: function() {
    var r = this;
    var data = $.ajax({
      url: 'http://localhost:8000/nfl-t1/2016/REG/1/schedule.json?api_key=kkapenthwjg6gh22f9yb64v6', 
      type: 'GET',
      dataType: 'json',
      success: function(response) {    
        var games = response.games;
        var activeGameArray = [];
        for (var game in games) {
          if (games[game].status == 'inprogress') {
            var home = Teams.find((el) => el.abr === games[game].home) || {};
            var away = Teams.find((el) => el.abr === games[game].away) || {};

            activeGameArray.push({
              gid: games[game].id,
              home: home.city + " " + home.name,
              away: away.city + " " + away.name
            });
          }
        }
        r.setState({games: activeGameArray});
      }
    });
  },

  generateNext: function(gameId) {
    return () => this.props.nextStep(gameId);
  },

  render: function() {
    var gameList = [];
    var games = this.state.games;

    if (!games) {
      gameList.push(<img id="loader" src="./images/loader.gif" key="loader" />);
    } else {
      for (let i = 0; i < games.length; i++) {
        gameList.push(
          <div className="livegame" onClick={this.generateNext(games[i].gid)} key={i}>{games[i].home} vs {games[i].away}</div>
        );
      }
    }

    return (
      <div id="live-game-list">
        {gameList}
      </div>
    );
  }
});

module.exports = LiveGameListing;