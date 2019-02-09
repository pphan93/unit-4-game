var characters = [
    ["anakin",0],
    ["dooku",0],
    ["luke",0],
    ["obiwan",0]
]

var newButton
var topText
var bottomText
var imgage
var selected = 0;
var myCharacter = "";
var myCharacterHP;
var myCharacterOrgHP;
var myCharacterDmg;
var myCharacterCurrentDmg = 0;
var myDefender = "";
var myDefenderDmg;
var myDefenderHP;
var myDefenderOrgHP;
var myDefenderTracker = 0;
var enemiesTracker = characters.length - 1;
var facing;


function createCharacters(where,currentCharacter,selectStatus) {

    for ( var i = 0; i < characters.length; i++){
        positionArray = characters[i].indexOf(currentCharacter)
        if (positionArray > -1 ){
         charHP = characters[i][1]
            if (selectStatus === 0) {
                characterIdentifer = "neutral"
                onClickCall = "selectCharacter(this)"
                buttomCharacters();
            }
            else if (selectStatus === 1 ) {
                characterIdentifer = "selected";
                //onClickCall = "characterSelected(this)";
                myCharacter = currentCharacter;
                myCharacterHP = charHP;
                facing = "right";
                $("#myCharName").text(currentCharacter);
                $("#selected").text(charHP);
                myCharacterOrgHP = charHP;
                fighter();
            }
            else if (selectStatus === 2) {
                characterIdentifer = "enemies"
                onClickCall = "enemiesSelected(this)"
                //console.log("ene " + currentCharacter)
                buttomCharacters();
            }
            else if (selectStatus === 3) {
                characterIdentifer = "defender"
                onClickCall = "defenderSelected(this)"
                onClickCall = ""
                //console.log("ene " + currentCharacter)
                myDefender = currentCharacter;
                myDefenderHP = charHP
                facing = "left";
                $("#myDefName").text(currentCharacter);
                $("#defender").text(charHP);
                myDefenderOrgHP = charHP;
                hpReset(".defhealthBarValue")
                fighter();
                console.log("defender " + myDefenderHP + " "+ myDefender)
            }
        }
    }

    function buttomCharacters() {
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
            src: "./assets/images/" + currentCharacter +"_left" + ".gif"
        }).appendTo( "#" + currentCharacter + selectStatus );

        bottomText = $("<span/>", {
            "class": "button-text characterHP",
            "id": characterIdentifer,
            text: charHP
        }).appendTo( "#" + currentCharacter + selectStatus);
    }

    function fighter() {
        newButton = $("<button/>", {
            "id": currentCharacter + selectStatus,
            "class": characterIdentifer,
            "data-character": currentCharacter,
            onclick: onClickCall
        }).appendTo( "#" + where );

        topText = $("<span/>", {
            "class": "top-text",
            "id" : "dmg" + characterIdentifer,
            text: ""
        }).appendTo( "#" + currentCharacter +  selectStatus);

        image = $("<img/>", {
            "class": "fighter-img",
            src: "./assets/images/" + currentCharacter + "_"+facing + ".gif"
        }).appendTo( "#" + currentCharacter + selectStatus );
    }

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
        myCharacterDmg = randomGen(10,20);
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

        myDefenderHP = myDefenderHP - myCharacterCurrentDmg
        $("#defender").text(myDefenderHP);
        $("#dmgdefender").text(myCharacterCurrentDmg + " DMG TAKEN");
        hpReduce(".defhealthBarValue",myDefenderHP,myDefenderOrgHP)
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
            myCharacterHP = myCharacterHP - myDefenderDmg
            $("#dmgselected").text(myDefenderDmg + " DMG TAKEN");
            hpReduce(".myHealthBarValue",myCharacterHP,myDefenderOrgHP)
            $("#selected").text(myCharacterHP);
            console.log("Def DMG: " + myDefenderDmg)
            if (myCharacterHP <= 0){
                clearDiv(".selected")
                alert("you lose")
                //myDefenderTracker = 0;
            }
        }
    }
}

function hpReduce (charHPBar,amt,charTotalHP) {
        $(charHPBar).css('width', ((amt / charTotalHP) * 100) + '%' )
}

function hpReset (charHPBar) {
    $(charHPBar).css('width', '100%' )
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