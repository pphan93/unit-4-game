var characters = [
    ["anakin", 0],
    ["dooku", 0],
    ["luke", 0],
    ["obiwan", 0]
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


function createCharacters(where, currentCharacter, selectStatus) {

    for (var i = 0; i < characters.length; i++) {
        positionArray = characters[i].indexOf(currentCharacter)
        if (positionArray > -1) {
            charHP = characters[i][1]
            if (selectStatus === 0) {
                characterIdentifer = "neutral"
                onClickCall = "selectCharacter(this)"
                buttomCharacters();
            }
            else if (selectStatus === 1) {
                characterIdentifer = "selected";
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
                buttomCharacters();
            }
            else if (selectStatus === 3) {
                characterIdentifer = "defender"
                onClickCall = ""
                myDefender = currentCharacter;
                myDefenderHP = charHP
                facing = "left";
                $("#myDefName").text(currentCharacter);
                $("#defender").text(charHP);
                myDefenderOrgHP = charHP;
                hpReset(".defhealthBarValue")
                fighter();
            }
        }
    }

    function buttomCharacters() {

        newDiv = $("<div />", {
            "id": where
        }).appendTo(".charactersLocation");

        newButton = $("<button/>", {
            "id": currentCharacter + selectStatus,
            "class": "square-button" + " " + characterIdentifer,
            "data-character": currentCharacter,
            onclick: onClickCall
        }).appendTo("#" + where);

        topText = $("<span/>", {
            "class": "top-text",
            text: "I am a " + currentCharacter
        }).appendTo("#" + currentCharacter + selectStatus);

        image = $("<img/>", {
            "class": "small-img",
            src: "./assets/images/" + currentCharacter + "_left" + ".gif"
        }).appendTo("#" + currentCharacter + selectStatus);

        bottomText = $("<span/>", {
            "class": "button-text characterHP",
            "id": characterIdentifer,
            text: charHP
        }).appendTo("#" + currentCharacter + selectStatus);
    }

    function fighter() {
        newButton = $("<button/>", {
            "id": currentCharacter + selectStatus,
            "class": characterIdentifer,
            "data-character": currentCharacter,
            onclick: onClickCall
        }).appendTo("#" + where);

        topText = $("<span/>", {
            "class": "top-text",
            "id": "dmg" + characterIdentifer,
            text: ""
        }).appendTo("#" + currentCharacter + selectStatus);

        image = $("<img/>", {
            "class": "fighter-img " + characterIdentifer,
            src: "./assets/images/" + currentCharacter + "_" + facing + ".gif"
        }).appendTo("#" + currentCharacter + selectStatus);
    }

}

function loadCharacters() {
    console.log("loadCharacter")
    for (var i = 0; i < characters.length; i++) {

        selected = 0;
        //charHP = 100;
        //console.log(characters[])

        characters[i][1] = randomGen(150, 200);
        //characters[i][2] = randomGen(150,200);
        createCharacters("selectCharacter", characters[i][0], selected)
    }
}

function selectCharacter(elem) {
    //alert("I've been clicked alien! ");
    if (selected === 0) {
        selected = 1;
        var id = $(elem).attr("id");
        id = id.replace(/[0-9]/g, '');
        //myCharacter = id;
        //myCharacterHP = $(elem).text();
        //alert(id);
        myCharacterDmg = randomGen(10, 20);
        createCharacters("myCharacter", id, selected)
        moveEnemies(id);

    }
}


function randomGen(min, max) {
    randomnum = Math.floor(Math.random() * (max - min + 1) + min);
    return randomnum;
}

function moveEnemies(CharSelected) {
    console.log("move: " + CharSelected)
    for (var i = 0; i < characters.length; i++) {
        if (characters[i][0] !== CharSelected) {
            console.log(characters[i])
            selected = 2
            createCharacters("myEnemies", characters[i][0], selected)
        }
    }

    clearDiv("#selectCharacter");
}

function clearDiv(divID) {
    $(divID).remove();
}

function enemiesSelected(elem) {
    var id = $(elem).attr("id");
    if (myDefenderTracker === 0) {
        clearDiv("#" + id)
        id = id.replace(/[0-9]/g, '');
        myDefender = id;
        moveDefender(myDefender);
        myDefenderTracker = 1;
    }
}

function moveDefender(defSelected) {
    selected = 3;
    myDefenderDmg = randomGen(10, 50);
    createCharacters("myDefender", defSelected, selected);
    console.log(myCharacter + " " + myDefender);
}

function attack() {
    if (myCharacter !== "" && myDefender !== "" && myDefenderTracker != 0) {

        moveAttacker("myCharacter");
        attackEnemies();
        setTimeout(moveAttackerBack, 1000, "myCharacter");

        if (enemiesTracker > 0 && myDefenderTracker != 0) {
            setTimeout(function () {
                moveAttacker("myDefender")
                attackPlayer()

            }, 2000);
            setTimeout(moveAttackerBack, 3000, "myDefender");
        }
    }

}

function attackEnemies() {
    myCharacterCurrentDmg = (myCharacterCurrentDmg + myCharacterDmg)
    myDefenderHP = myDefenderHP - myCharacterCurrentDmg
    $("#defender").text(myDefenderHP);
    lightSaberSound()
    $("#dmgdefender").text(myCharacterCurrentDmg + "DMG");
    hpReduce(".defhealthBarValue", myDefenderHP, myDefenderOrgHP)
    console.log(myCharacterCurrentDmg)
    if (myDefenderHP < 0 && enemiesTracker > 0) {
        clearDiv(".defender")
        enemiesTracker = enemiesTracker - 1;
        console.log("ENE TRACKer:" + enemiesTracker)
        myDefenderTracker = 0;
        if (enemiesTracker <= 0) {
            alert("you win")
        }
    }


}

function attackPlayer() {
    myCharacterHP = myCharacterHP - myDefenderDmg
    lightSaberSound()
    $("#dmgselected").text(myDefenderDmg + "DMG");
    hpReduce(".myHealthBarValue", myCharacterHP, myDefenderOrgHP)
    $("#selected").text(myCharacterHP);
    console.log("Def DMG: " + myDefenderDmg)
    if (myCharacterHP <= 0) {
        clearDiv(".selected")
        alert("you lose")
    }

}

function moveAttackerBack(who) {

    if (who == "myCharacter") {
        $('#myCharacter').css({
            'right': '',
            'left': '0'
        });
    }
    else {
        $('#myDefender').css({
            'right': '20px',
            'left': ''
        });

        resetDMG();

    }
}

function moveAttacker(who) {
    console.log("here");
    if (who == "myCharacter") {
        console.log("test");
        $('#myCharacter').css({
            'right': '7em',
            'left': 'auto'
        });
    }
    else {
        $('#myDefender').css({
            'left': '7em',
            'right': 'auto'
        });

    }
}

function resetGame() {
    selected = 0;
    myCharacter = "";
    myCharacterHP = 0;
    myCharacterOrgHP = 0;
    myCharacterDmg = 0;
    myCharacterCurrentDmg = 0;
    myDefender = "";
    myDefenderDmg = 0;
    myDefenderHP = 0;
    myDefenderOrgHP = 0;
    myDefenderTracker = 0;
    enemiesTracker = characters.length - 1;

    $("#myCharName").text("Player 1");
    $("#myDefName").text("Player 1");
    $("#myCharacter,#myDefender,#selectCharacter,#myEnemies,#selected,#defender").empty();

    loadCharacters();
}


function resetDMG() {
    $("#dmgdefender").text("");
    $("#dmgselected").text("");
}

function lightSaberSound() {
    var light = $("#lightsaber")
    $("#lightsaber").get(0).play();
    light.volume = .5;
}


function hpReduce(charHPBar, amt, charTotalHP) {
    $(charHPBar).css('width', ((amt / charTotalHP) * 100) + '%')
}

function hpReset(charHPBar) {
    $(charHPBar).css('width', '100%')
}

$(document).ready(function () {

    loadCharacters();

    setTimeout(
        function () {
            $(".star-wars-intro").css("z-index", "-1");
        }
        , 4000
    )

    $("#attack").on("click", function () {
        attack();
    });

    $("#reset").on("click", function () {
        alert("test")
        resetGame();
    });

});