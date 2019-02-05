var characters = [
    "alien",
    "bear",
    "darth",
    "pewpew"
]

var newButton
var topText
var bottomText
var imgage
var selected = 0;
var myCharacter = "";
var myCharacterHP;
var myDefender = "";
var myDefenderHP;


function createCharacters(where,character,selectStatus,charHP) {
    if (selectStatus === 0) {
        characterIdentifer = "neutral"
        onClickCall = "selectCharacter(this)"
    }
    else if (selectStatus === 1 ) {
        characterIdentifer = "selected"
        onClickCall = "characterSelected(this)"
    }
    else if (selectStatus === 2) {
        characterIdentifer = "enemies"
        onClickCall = "enemiesSelected(this)"
        console.log("ene " + character)
    }
    else if (selectStatus === 3) {
        characterIdentifer = "defender"
        onClickCall = "defenderSelected(this)"
        console.log("ene " + character)
    }


        newButton = $("<button/>", {
            "id": character + selectStatus,
            "class": "square-button" + " " + characterIdentifer,
            onclick: onClickCall
        }).appendTo( "#" + where );

        topText = $("<span/>", {
            "class": "top-text",
            text: "I am a " + character
        }).appendTo( "#" + character +  selectStatus);

        image = $("<img/>", {
            "class": "small-img",
            src: "./assets/images/" + character + ".png"
        }).appendTo( "#" + character + selectStatus );

        bottomText = $("<span/>", {
            "class": "button-text characterHP",
            "id": characterIdentifer,
            text: charHP
        }).appendTo( "#" + character + selectStatus);

}

function loadCharacters() {

    for (var i = 0; i < characters.length; i++){
        selected = 0;
        charHP = 100;
        createCharacters("selectCharacter",characters[i],selected, charHP)
    }
}

loadCharacters();


function selectCharacter(elem){
    //alert("I've been clicked alien! ");
    if (selected === 0){
        selected = 1;
        var id = $(elem).attr("id");
        id = id.replace(/[0-9]/g, '');
        myCharacter = id;
        //alert(id);
        createCharacters("myCharacter",id,selected)
        moveEnemies(id);

    }



}


function moveEnemies(CharSelected) {
    console.log("move: " + CharSelected)
    for (var i = 0; i < characters.length; i++){
            if (characters[i] !== CharSelected) {
            console.log(characters[i])
            selected = 2
            createCharacters("myEnemies",characters[i],selected)
        }
    }

    clearDiv("#selectCharacter");
}

function clearDiv (divID) {
    $( divID ).remove();
}

function enemiesSelected(elem) {
    var id = $(elem).attr("id");
    clearDiv("#" + id)
    id = id.replace(/[0-9]/g, '');
    myDefender = id;
    moveDefender(myDefender);
}

function moveDefender(defSelected) {
    selected = 3;
    createCharacters("myDefender", defSelected, selected)
    console.log (myCharacter + " " + myDefender)
}

function attack() {
    if (myCharacter !== "" && myDefender !== "" ) {
        
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


    $("#bear").on("click", function() {
        //jelly++;
        alert("I've been clicked bear! ");
        //newDiv.text("Image testing");
        //newDiv.src ("../../10-CaptainPlanetGame/Unsolved/assets/captain-planet.jpg")
        //$("#image").append('<img id="theImg" src="../../10-CaptainPlanetGame/Unsolved/assets/captain-planet.jpg" />')
        //$("#image").append('<img id="theImg" src="../../10-CaptainPlanetGame/Unsolved/assets/captain-planet_2.jpg" />')
      });

  });