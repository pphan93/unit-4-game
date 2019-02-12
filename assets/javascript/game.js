var characters = [
    ["anakin", 0],
    ["dooku", 0],
    ["luke", 0],
    ["obiwan", 0]
];

var newButton;
var topText;
var bottomText;
var imgage;
var selected = 0; //indentifer where the characters are located (mycharacter, defenders, enemies, or neutral)
var myCharacter = ""; //indentify who player character is
var myCharacterHP; //current hp
var myCharacterOrgHP; //initial hp - for hp bar (calculate on the percentage for the width (100%)
var myCharacterDmg; //initial dmg
var myCharacterCurrentDmg = 0; //current dmg - the damage increase
var myDefender = ""; //the defender player fighting against
var myDefenderDmg;
var myDefenderHP;
var myDefenderOrgHP;
var myDefenderTracker = 0;
var enemiesTracker = characters.length - 1; //keep track on how many enemies are left see if player win
var facing; //direction of the character use for image (facing left or right depend on if player select defender)
var attackCompleted = true; //prevent user from pressing attack/reset button before the animation of attack is completed


function createCharacters(where, currentCharacter, selectStatus) {

    for (var i = 0; i < characters.length; i++) {
        positionArray = characters[i].indexOf(currentCharacter);
        if (positionArray > -1) {
            charHP = characters[i][1];
            if (selectStatus === 0) {
                characterIdentifer = "neutral";
                onClickCall = "selectCharacter(this)";
                buttomCharacters();
            } else if (selectStatus === 1) {
                characterIdentifer = "selected";
                myCharacter = currentCharacter;
                myCharacterHP = charHP;
                facing = "right";
                $("#myCharName").text(currentCharacter);
                $("#selected").text(charHP);
                myCharacterOrgHP = charHP;
                fighter();
            } else if (selectStatus === 2) {
                characterIdentifer = "enemies";
                onClickCall = "enemiesSelected(this)";
                buttomCharacters();
            } else if (selectStatus === 3) {
                characterIdentifer = "defender";
                onClickCall = "";
                myDefender = currentCharacter;
                myDefenderHP = charHP;
                facing = "left";
                $("#myDefName").text(currentCharacter);
                $("#defender").text(charHP);
                myDefenderOrgHP = charHP;
                hpReset(".defhealthBarValue");
                fighter();
            }
        }
    }

    //For bottom row - "select player"
    function buttomCharacters() {
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

    //fighting arena area
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
    for (var i = 0; i < characters.length; i++) {

        selected = 0; //nuetral - no character have been selected
        characters[i][1] = randomGen(150, 200); //generate random HP for each characters
        createCharacters("selectCharacter", characters[i][0], selected);
    }
}

function selectCharacter(elem) {
    if (selected === 0) {
        selected = 1; //selected character
        var id = $(elem).attr("id");
        id = id.replace(/[0-9]/g, '');
        myCharacterDmg = randomGen(10, 20);
        createCharacters("myCharacter", id, selected);
        moveEnemies(id);

    }
}


function randomGen(min, max) {
    randomnum = Math.floor(Math.random() * (max - min + 1) + min);
    return randomnum;
}

function moveEnemies(CharSelected) {
    for (var i = 0; i < characters.length; i++) {
        if (characters[i][0] !== CharSelected) {
            selected = 2;
            createCharacters("myEnemies", characters[i][0], selected);
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
        clearDiv("#" + id);
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
}

function attack() {
    if (myCharacter !== "" && myDefender !== "" && myDefenderTracker != 0 && attackCompleted) {
        attackCompleted = false;
        moveAttacker("myCharacter");
        attackEnemies();
        setTimeout(moveAttackerBack, 1000, "myCharacter");

        if (enemiesTracker > 0 && myDefenderTracker != 0) {
            setTimeout(function () {
                moveAttacker("myDefender");
                attackPlayer();

            }, 2000);
            setTimeout(function () {
                moveAttackerBack("myDefender");
                attackCompleted = true;
            }, 3000);

        }
    }

}

function attackEnemies() {
    myCharacterCurrentDmg = (myCharacterCurrentDmg + myCharacterDmg);
    myDefenderHP = myDefenderHP - myCharacterCurrentDmg;
    $("#defender").text(myDefenderHP);
    lightSaberSound();
    $("#dmgdefender").text(myCharacterCurrentDmg + "DMG");
    hpReduce(".defhealthBarValue", myDefenderHP, myDefenderOrgHP);
    if (myDefenderHP < 0 && enemiesTracker > 0) {
        attackCompleted = true;
        clearDiv(".defender");
        enemiesTracker = enemiesTracker - 1;
        myDefenderTracker = 0;
        if (enemiesTracker <= 0) {
            outputStatus("YOU WIN");
        }
    }


}

function attackPlayer() {
    myCharacterHP = myCharacterHP - myDefenderDmg;
    lightSaberSound();
    $("#dmgselected").text(myDefenderDmg + "DMG");
    hpReduce(".myHealthBarValue", myCharacterHP, myDefenderOrgHP);
    $("#selected").text(myCharacterHP);
    if (myCharacterHP <= 0) {
        clearDiv(".selected");
        outputStatus("YOU LOSE");
    }

}

function moveAttackerBack(who) {

    if (who == "myCharacter") {
        $('#myCharacter').css({
            'right': '',
            'left': '0'
        });
    } else {
        $('#myDefender').css({
            'right': '20px',
            'left': ''
        });

        resetDMG();

    }
}

function moveAttacker(who) {
    if (who == "myCharacter") {
        $('#myCharacter').css({
            'right': '7em',
            'left': 'auto'
        });
    } else {
        $('#myDefender').css({
            'left': '7em',
            'right': 'auto'
        });

    }
}

function resetGame() {
    if (attackCompleted) {
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

        outputStatus("");

        $("#myCharName").text("Player 1");
        $("#myDefName").text("Player 2");
        $("#myCharacter,#myDefender,#selectCharacter,#myEnemies,#selected,#defender").empty();
        hpReset(".healthBarValue");


        $("<div />", {
            "id": "selectCharacter",
        }).appendTo(".charactersLocation");

        $("<div />", {
            "id": "myEnemies",
        }).appendTo(".charactersLocation");

        loadCharacters();
    }
}


function resetDMG() {
    $("#dmgdefender").text("");
    $("#dmgselected").text("");
}

function lightSaberSound() {
    var light = $("#lightsaber");
    light.get(0).play();
    light.prop("volume", 0.1);
}

function outputStatus(message) {
    $(".status").text(message);
}

function hpReduce(charHPBar, amt, charTotalHP) {
    $(charHPBar).css('width', ((amt / charTotalHP) * 100) + '%');
}

function hpReset(charHPBar) {
    $(charHPBar).css('width', '100%');
}

function playMusic() {
    $("#backgroundMusic").get(0).play();
}


$(document).ready(function () {

    playMusic();

    loadCharacters();

    setTimeout(
        function () {

            $(".star-wars-intro").css("z-index", "-1");
        }, 4000
    );

    $("#attack").on("click", function () {
        attack();
    });

    $("#reset").on("click", function () {
        resetGame();
    });

});