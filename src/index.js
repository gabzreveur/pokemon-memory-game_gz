import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { memo } from "react"
import { useState, useEffect, useRef, useContext } from "react";
//ToDo
//Add flip effect
//Order functions to easily escalate this app to use it with different image database
//Add animated elements i.e. https://codepen.io/raubaca/pen/obaZmG
//Improve mobile version

//global variables
let currentPair=[]; let winnerPair=[]; let randomImg=0; let copy=0; let playerScore = new Array(20).fill(0); let player=0; let turns=0; let shuffle=0; let endGame=0;
/*-------------------------------------------------------------------------------------------------------------------*/
// Javascript Functions //
/*-------------------------------------------------------------------------------------------------------------------*/
function reload() {/* Reload page when the game is over*/
  window.location.reload();
}

function fshuffle(){ /*Shuffle pair's DOM elements */
  if(!shuffle){shuffle = document.querySelector('.items');for (var i = shuffle.children.length; i >= 0; i--){shuffle.appendChild(shuffle.children[Math.random() * i | 0]);}}
}

function swinners(){ /*Add "win" class to all pairs that has been already found  */
  for(let winners of winnerPair) {
    document.getElementById(winners).className=" win";
  }
}

function PlayerCounter(){ /*Counts and Stores if a pair has been found*/
  let numberPair = currentPair[0].split('_');
  let numberPair2 = currentPair[1].split('_');
  if(parseInt(numberPair[1])%2){
    if(parseInt(numberPair2[1])===parseInt(numberPair[1])-1){
      playerScore[player]+=1; winnerPair.push(currentPair[0]); winnerPair.push(currentPair[1]);
    }
  }
  else{
    if(parseInt(numberPair2[1])===parseInt(numberPair[1])+1){
      playerScore[player]+=1; winnerPair.push(currentPair[0]); winnerPair.push(currentPair[1]);
    }
  }
}

function printWinner(){/* Finds and add class "winner" to all players with the higher score */
  let max = Math.max(...playerScore);
    const indexesOf = (arr, item) =>
    arr.reduce(
      (acc, v, i) => (v === item && acc.push(i), acc),
    []);
    let pwin = indexesOf(playerScore, max); // [0, 2, 4]

  let wpairs=(document.getElementsByClassName("item").length)/2;
  if(playerScore.reduce((a, b) => a + b, 0) > 0 && playerScore.reduce((a, b) => a + b, 0)===wpairs)
  {
    for(let pwiners of pwin){
      let pwin=pwiners+1;
      document.getElementById('player'+pwin+'').className+=" winner";
      console.log(pwiners);
    }
    endGame=1;
    return(1);
  }
  else{
    return(0);
  }
}
/*-------------------------------------------------------------------------------------------------------------------*/
//React Functions
/*-------------------------------------------------------------------------------------------------------------------*/

function PlayerTurn(props){ /* Renders Player's name & score */
  let currentplayer="";
  if(!endGame){
    props.players==player?currentplayer="current":currentplayer="";
  }
  return(
    <>
    <div>
      <h3 id={"player"+(props.players+1)} class={"players "+ currentplayer} >Player {props.players+1} - {playerScore[props.players] } points</h3>
    </div>
    </>
  );
}

function PokeBall(){ /* Renders an SVG Pokeball for the flipped cards */
  return(
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" style={{position:'absolute', zIndex:'-1'}}>
    	<path d="M 30 50 a 1 1 1 0 1 40 0 h-12.5 a 1 1 1 0 0 -15 0 z" fill="#f00" stroke="#222"></path>
    	<circle cx="50" cy="50" r="5" fill="#222" stroke="#222"></circle>
    	<path d="M 30 50 a 1 1 1 0 0 40 0 h-12.5 a 1 1 1 0 1 -15 0 z" fill="#fff" stroke="#222"></path>
    </svg>
  );
}

const MemoPokeImg = React.memo(PokeImg); /* Memo the PokeImg Images, they are not changing unless there is a change in number of players */
function PokeImg(props) { /* Renders random Images from pokemon.com site from more than 900 different existing pokemons on the website (and the series) */
  if(!copy){
    randomImg = Math.floor(Math.random() * 904)+1;
    randomImg = randomImg>99 ? randomImg : randomImg>9 ? "0"+randomImg : "00"+randomImg; //adding ceros for image db porpuses
    copy=1;
  }
  else{
    randomImg=randomImg;
    copy=0;
  }
    return (
    <img src={"https://assets.pokemon.com/assets/cms2/img/pokedex/detail/"+randomImg+".png" } alt="pokemon" class="img-fluid"/>
    );
}

function Pair(props) { /* Renders pairs DOM calling Pokemon images and pokeballs, it also take clicks and interact with them (change turns, flip cards, save selections )*/
  const pairsnum = props.pairIn;
  let bgcolor = props.pairIn%2 ? "#FF8800,#FFDE00": "#001ad7, #3b4cca"; //changing bg color
    //state flipped
      const [flipped, flipCard] = useState(1);
    useEffect(() => {
        // Update the document title using the browser API
        setTimeout(()=>{
          fshuffle();
          currentPair.length===0 ? flipCard(0) : console.log("not");
        }, 1000);
        swinners();
        if(currentPair.length===2){
          setTimeout(()=>{
            flipCard(0);
          }, 1000);
        }

        printWinner();
      });

    function handleChange(event) {
          // Here, we invoke the callback with the new value
          if(!endGame){
            props.onChange(event.currentTarget.id);
            if(turns<1){ turns++;}else{ turns=0;player++;
          }
          }
      }

      const handleClick = event => {
      const cardId = event.currentTarget.id;

      if(currentPair.length<2){
        currentPair.push(cardId);
      }
      else{
        currentPair=[];
        currentPair.push(cardId);
      }
      flipCard(1);
      PlayerCounter();
    };


    return (
        <div class="item col-2">
          <div  id={"pair_"+pairsnum} onClick={handleChange} class={ "main" } style={{border : '2px solid black'/*, display: 'inline-flex'*/, position: 'relative' }}>
            <PokeBall />
            <div onClick={handleClick}  id={"imgpair_"+pairsnum}  class={'flipped'+flipped+''} style={{  background : 'radial-gradient('+bgcolor+''}}>
              <MemoPokeImg render={props.players} />
            </div>
          </div>
        </div>
    );
}

function Board(props) { /* Renders the main board - maps all players name and scores + maps all pokemon pairs */
  const playersnum = props.players;
  let playersnumr=Array.from(Array(playersnum).keys())
  const pairsnum = props.pairs*2;
  let pairsnumr=Array.from(Array(pairsnum).keys())
  const [turn, setTurn] = React.useState("");

  function handleChange(changeTurn) {
       setTurn(changeTurn);
     }

     playersnumr.length==player ? player=0 : console.log("Playing");
     return (
       <>
          <div id="board" >
          <div style={{opacity:''+printWinner()+'', textAlign:'center'}}>
            <button class={"btn btn-outline-warning bi bi-arrow-repeat"} onClick={() =>reload() }> RESTART GAME</button>
          </div>

          {playersnumr.map((players) => <PlayerTurn players={players}   />)}
          <div class="items row g-0">
          {pairsnumr.map((pair) => <Pair pairIn={pair} onChange={handleChange} players={playersnum}/>)}
          </div>
          </div>
        </>
  );
}

function Selection(props){ /* Renders a selection, helping the user to choose the number of pairs for the game */
  const [nspairs, setPairs] = useState(0);
  if(!nspairs){
    return(
      <>
        <div id="qpairs" >
            <h5>Choose the Number of Pairs ?</h5> <div class="row selection"><button onClick={() => setPairs(1)} class={"col-2 btn btn-outline-warning"}>1</button><button onClick={() => setPairs(2)}  class={"col-2 btn btn-outline-warning"}>2</button><button onClick={() => setPairs(3)}  class={"col-2 btn btn-outline-warning"}>3</button><button onClick={() => setPairs(4)}  class={"col-2 btn btn-outline-warning"}>4</button><button onClick={() => setPairs(5)}  class={"col-2 btn btn-outline-warning"}>5</button><button onClick={() => setPairs(6)}  class={"col-2 btn btn-outline-warning"}>6</button><button onClick={() => setPairs(7)}  class={"col-2 btn btn-outline-warning"}>7</button><button onClick={() => setPairs(8)}  class={"col-2 btn btn-outline-warning"}>8</button><button onClick={() => setPairs(9)}  class={"col-2 btn btn-outline-warning"}>9</button><button onClick={() => setPairs(10)} class={"col-2 btn btn-outline-warning"}>10</button><button onClick={() => setPairs(11)} class={"col-2 btn btn-outline-warning"}>11</button><button onClick={() => setPairs(12)} class={"col-2 btn btn-outline-warning"}>12</button>
        </div>
      </div>
      </>
    );
  }
  else{return(<Board pairs={nspairs} players={props.selplayers}  />);}
}

function Instructions(){ /*Renders Instructions section - Player may read instructions and choose #players and #pairs for the next game*/
    const [nsplayers, setPlayers] = useState(0);
    if(!nsplayers){
    return(
      <>
      <div>
          <div id="qplayers" >
            <h5>Choose the Number of Players </h5>
            <div class="row selection"><button onClick={() => setPlayers(1)} class={"col btn btn-outline-warning"} >1</button><button onClick={() => setPlayers(2)}  class={"col btn   btn-outline-warning"} >2</button><button onClick={() => setPlayers(3)}  class={"col btn   btn-outline-warning"} >3</button><button onClick={() => setPlayers(4)}  class={"col btn   btn-outline-warning"} >4</button><button onClick={() => setPlayers(5)} class={"col btn   btn-outline-warning"}  >5</button></div>
          </div>
      </div>
      </>
    );
  }
  else{
    return(  <Selection selplayers={nsplayers} /> );
  }
}

class Game extends React.Component {/* Renders main component */
  render() {
    return (
      <div>
      <h1>Amélie's Memory Game</h1>
      <Instructions />
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
