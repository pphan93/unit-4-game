var characters = [
    ["alien",0],
    ["bear",0],
    ["darth",0],
    ["pewpew",0]
]

var newButton
var topText
var bottomText
var imgage
var selected = 0;
var myCharacter = "";
var myCharacterHP;
var myCharacterDmg;
var myCharacterCurrentDmg = 0;
var myDefender = "";
var myDefenderDmg;
var myDefenderHP;
var myDefenderTracker = 0;
var enemiesTracker = characters.length - 1;


function createCharacters(where,currentCharacter,selectStatus) {

    for ( var i = 0; i < characters.length; i++){
        positionArray = characters[i].indexOf(currentCharacter)
        if (positionArray > -1 ){
         charHP = characters[i][1]
            if (selectStatus === 0) {
                characterIdentifer = "neutral"
                onClickCall = "selectCharacter(this)"
            }
            else if (selectStatus === 1 ) {
                characterIdentifer = "selected";
                //onClickCall = "characterSelected(this)";
                myCharacter = currentCharacter;
                myCharacterHP = charHP
            }
            else if (selectStatus === 2) {
                characterIdentifer = "enemies"
                onClickCall = "enemiesSelected(this)"
                //console.log("ene " + currentCharacter)
            }
            else if (selectStatus === 3) {
                characterIdentifer = "defender"
                onClickCall = "defenderSelected(this)"
                onClickCall = ""
                //console.log("ene " + currentCharacter)
                myDefender = currentCharacter;
                myDefenderHP = charHP
                console.log("defender " + myDefenderHP + " "+ myDefender)
            }
        }
    }


        newButton = $("<button/>", {
            "id": currentCharacter + selectStatus,
            "class": "square-button" + " " + characterIdentifer,
            "data-character": currentCharacter,
            onclick: onClickCall
        }).appendTo( "#" + where );

        topText = $("<span/>", {
            "class": "top-text",
            text: "I am a " + currentCharacter
        }).appendTo( "#" + currentCharacter +  selectStatus);

        image = $("<img/>", {
            "class": "small-img",
            src: "./assets/images/" + currentCharacter + ".png"
        }).appendTo( "#" + currentCharacter + selectStatus );

        bottomText = $("<span/>", {
            "class": "button-text characterHP",
            "id": characterIdentifer,
            text: charHP
        }).appendTo( "#" + currentCharacter + selectStatus);

}

function loadCharacters() {

    for (var i = 0; i < characters.length; i++){
        selected = 0;
        //charHP = 100;
        //console.log(characters[])
        
        characters[i][1] = randomGen(150,200);
        //characters[i][2] = randomGen(150,200);
        createCharacters("selectCharacter",characters[i][0],selected)
    }
}

loadCharacters();


function selectCharacter(elem){
    //alert("I've been clicked alien! ");
    if (selected === 0){
        selected = 1;
        var id = $(elem).attr("id");
        id = id.replace(/[0-9]/g, '');
        //myCharacter = id;
        //myCharacterHP = $(elem).text();
        //alert(id);
        myCharacterDmg = randomGen(10,50);
        createCharacters("myCharacter",id,selected)
        moveEnemies(id);

    }



}


function randomGen(min,max) {
    randomnum = Math.floor(Math.random() * (max-min+1)+ min);
    //console.log(randomnum);
    return randomnum;
}

//var testing = initHP();
//console.log(testing)

function moveEnemies(CharSelected) {
    console.log("move: " + CharSelected)
    for (var i = 0; i < characters.length; i++){
            if (characters[i][0] !== CharSelected) {
            console.log(characters[i])
            selected = 2
            createCharacters("myEnemies",characters[i][0],selected)
        }
    }

    clearDiv("#selectCharacter");
}

function clearDiv (divID) {
    $( divID ).remove();
}

function enemiesSelected(elem) {
    var id = $(elem).attr("id");
    if ( myDefenderTracker === 0) {
        clearDiv("#" + id)
        id = id.replace(/[0-9]/g, '');
        myDefender = id;
        moveDefender(myDefender);
        myDefenderTracker = 1;
    }   
}

function moveDefender(defSelected) {
    selected = 3;
    myDefenderDmg = randomGen(10,50);
    createCharacters("myDefender", defSelected, selected);
    console.log (myCharacter + " " + myDefender);
}

function attack() {
    if (myCharacter !== "" && myDefender !== "" && myDefenderTracker != 0 ) {
        myCharacterCurrentDmg = (myCharacterCurrentDmg + myCharacterDmg)

        $("#defender").text(myDefenderHP = myDefenderHP - myCharacterCurrentDmg);
        console.log(myCharacterCurrentDmg)
        if (myDefenderHP < 0 && enemiesTracker > 0){
            clearDiv(".defender")
            enemiesTracker = enemiesTracker - 1;
            console.log("ENE TRACKer:" + enemiesTracker)
            myDefenderTracker = 0;
            if (enemiesTracker <= 0) {
                alert("you win")
            }
        }

        if (enemiesTracker > 0 && myDefenderTracker != 0) {
            $("#selected").text(myCharacterHP = myCharacterHP - myDefenderDmg);
            console.log("Def DMG: " + myDefenderDmg)
            if (myCharacterHP < 0){
                clearDiv(".selected")
                alert("you lose")
                //myDefenderTracker = 0;
            }
        }
    }
}

$(document).ready(function() {
    //var newDiv = $("<img>");
    //$("#alien").on("click", function() {
      //jelly++;
      //alert("I've been clicked on alien! ");
      //newDiv.text("Image testing");
      //newDiv.src ("../../10-CaptainPlanetGame/Unsolved/assets/captain-planet.jpg")
      //$("#image").append('<img id="theImg" src="../../10-CaptainPlanetGame/Unsolved/assets/captain-planet.jpg" />')
      //$("#image").append('<img id="theImg" src="../../10-CaptainPlanetGame/Unsolved/assets/captain-planet_2.jpg" />')
    //});


    $("#attack").on("click", function() {
        attack();
        //jelly++;
        //alert("I've been clicked bear! ");
        //newDiv.text("Image testing");
        //newDiv.src ("../../10-CaptainPlanetGame/Unsolved/assets/captain-planet.jpg")
        //$("#image").append('<img id="theImg" src="../../10-CaptainPlanetGame/Unsolved/assets/captain-planet.jpg" />')
        //$("#image").append('<img id="theImg" src="../../10-CaptainPlanetGame/Unsolved/assets/captain-planet_2.jpg" />')
      });

  });