var checkMateStatus = false;

var divIds = [];

var col = ["a", "b", "c", "d", "e", "f", "g", "h"];

var row = ["1", "2", "3", "4", "5", "6", "7", "8"];

var chessPiecesId =
    ["b-l-r", "b-l-k", "b-l-b", "b-a-queen", "b-a-king", "b-r-b", "b-r-k", "b-r-r",
        "b-1-p", "b-2-p", "b-3-p", "b-4-p", "b-5-p", "b-6-p", "b-7-p", "b-8-p",
        "w-1-p", "w-2-p", "w-3-p", "w-4-p", "w-5-p", "w-6-p", "w-7-p", "w-8-p",
        "w-l-r", "w-l-k", "w-l-b", "w-a-king", "w-a-queen", "w-r-b", "w-r-k", "w-r-r"];

var crossDivId = ["cr1", "cr2", "cr3", "cr4", "cr5", "cr6", "cr7", "cr8", "cr9", "cr10", "cr11", "cr12", "cr13", "cr14", "cr15",
    "cr17", "cr18", "cr19", "cr20", "cr21", "cr22", "cr23", "cr24", "cr25", "cr26", "cr27", "cr28", "cr29", "cr30", "cr31"];

var turn = "w";

var crossAudio = $("#crossSound")[0];

var moveAudio = $("#moveSound")[0];


$(document).ready(function () {
    var count = 0;
    for (var i = 0; i < col.length; i++) {
        for (var j = 0; j < row.length; j++) {
            var tempId = col[i] + row[j];
            divIds[count] = tempId;
            count++;
        }
    }
});

var ChessObject = {
    team: "",
    chessmanId: "",
    chessmanParentIdv: ""
};

$("div > div > div > div > div > div > div").click(function () {
    var chessman = $(this).attr("id");
    var chessmanParent = $(this).parent().attr("id");
    var team = checkTeam(chessman);

    if (!checkMateStatus) {
        if ((checkCross().length > 0) && (team !== ChessObject.team)) {
            var selectedParent = $(this).parent().attr("id");
            var selected = $(this).attr("id");
            var team = checkTeam(selected);

            if ($("#" + selectedParent).hasClass("cross") && (!selected.includes("king"))) {
                moveToCrossDivs(chessman, team);
                crossedChessPiece(selected);
                $("#" + ChessObject.chessmanId).appendTo("#" + selectedParent);
                moveToCrossDivs(chessman, team);
                removeCross();
                removePath();
                findTurn();
            }
        } else {
            removeCross();
            removePath();
            ChessObject.chessmanId = chessman;
            ChessObject.chessmanParentId = chessmanParent;
            ChessObject.team = checkTeam(ChessObject.chessmanId);
            findName(ChessObject.chessmanId);
        }
    } else {
        alert("Game Over!");
    }

});

function checkTeam(id) {
    var details = id.split("-");
    switch (details[0]) {
        case "b":
            return "b";
        case "w":
            return "w";
    }
}

function crossedChessPiece(id) {
    for (var i = 0; i < chessPiecesId.length; i++) {
        if (id === chessPiecesId[i]) {
            chessPiecesId.splice(i, 1);
            crossAudio.play();
            break;
        }
    }
}

function moveToCrossDivs(id, team) {
    if (team === "w") {
        for (var i = 0; i < 15; i++) {
            if ($("#" + crossDivId[i]).children().length === 0) {
                $("#" + id).appendTo($("#" + crossDivId[i]));
                break;
            }
        }

    } else if (team === "b") {
        for (var i = 15; i < crossDivId.length; i++) {
            if ($("#" + crossDivId[i]).children().length === 0) {
                $("#" + id).appendTo($("#" + crossDivId[i]));
                break;
            }
        }
    }

}

$("div > div > div > div > div > div").click(function () {

    var selected = $(this).attr("id");
    if (($("#" + selected).hasClass("path")) && (!selected.includes("king"))) {
        $("#" + ChessObject.chessmanId).appendTo("#" + selected);
        moveAudio.play();
        removeCross();
        removePath();
        findTurn();
    }

});


function findName(id) {
    var details = id.split("-");
    if (turn === ChessObject.team) {
        switch (details[2]) {
            case "p":
                ChessObject.chessman = "pawn";
                pawnPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "r" :
                ChessObject.chessman = "rook";
                rookPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "b":
                ChessObject.chessman = "bishop";
                bishopPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "k":
                ChessObject.chessman = "knight";
                knightPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "king":
                ChessObject.chessman = "king";
                kingPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "q":
                ChessObject.chessman = "queen";
                queenPath(ChessObject.chessmanParentId, ChessObject.team, "queen");
                break;
        }

    } else {
        if ((turn === "w") && (checkCross().length === 0) && (checkPath().length === 0)) {
            alert("White's Turn");
        } else if ((turn === "b") && (checkCross().length === 0) && (checkPath().length === 0)) {
            alert("Black's Turn");
        }
    }
}

function pawnPath(currentPos, team, from) {
    if (from !== "check") {
        removeCross();
        removePath();
    }
    var count = 0;
    if ((currentPos !== null) && (currentPos !== undefined)) {

        var x = currentPos.substr(0, 1);
        var y = currentPos.substr(1, 1);

        var xIndex = getXIndex(x);
        var yIndex = getYIndex(y);

        if (team === "w") {
            for (var j = 0; j < row.length; j++) {
                if ((y === "2")) {
                    if ($("#" + x + "3").children().length === 0) {
                        $("#" + x + "3").addClass("path");
                        if ($("#" + x + "4").children().length === 0) {
                            $("#" + x + "4").addClass("path");
                        }
                    }
                } else {
                    var content = $("div > div > div > div > div > div > div").attr("id");
                    if ((content !== null) && (content !== undefined)) {
                        if ((count < 1) && ($("#" + x + (row[yIndex + 1])).children().length === 0)) {
                            $("#" + x + (row[yIndex + 1])).addClass("path");
                            removeCross();
                            count++;
                        }
                    }
                }

                if ($("#" + col[xIndex + 1] + row[yIndex + 1]).children().length > 0) {
                    var id = $("#" + col[xIndex + 1] + row[yIndex + 1]).children().attr("id");
                    var team = checkTeam(id);
                    if (team === "b") {
                        $("#" + col[xIndex + 1] + row[yIndex + 1]).addClass("cross");
                        removePath();
                    }
                }
                if ($("#" + col[xIndex - 1] + row[yIndex + 1]).children().length > 0) {
                    var id = $("#" + col[xIndex - 1] + row[yIndex + 1]).children().attr("id");
                    var team = checkTeam(id);
                    if (team === "b") {
                        $("#" + col[xIndex - 1] + row[yIndex + 1]).addClass("cross");
                    }
                }
            }

        } else {
            for (var j = row.length; j > 0; j--) {
                if (y === "7") {
                    if ($("#" + x + "6").children().length === 0) {
                        $("#" + x + "6").addClass("path");
                        if ($("#" + x + "5").children().length === 0) {
                            $("#" + x + "5").addClass("path");
                            removeCross();
                        }
                    }
                } else {
                    var content = $("div > div > div > div > div > div > div").attr("id");
                    if ((content !== null) && (content !== undefined)) {
                        if ((count < 1) && ($("#" + x + (row[yIndex - 1])).children().length === 0)) {
                            $("#" + x + (row[yIndex - 1])).addClass("path");
                            count++;
                        }
                    }
                }
                if ($("#" + col[xIndex + 1] + row[yIndex - 1]).children().length > 0) {
                    var id = $("#" + col[xIndex + 1] + row[yIndex - 1]).children().attr("id");
                    var team = checkTeam(id);
                    if (team === "w") {
                        $("#" + col[xIndex + 1] + row[yIndex - 1]).addClass("cross");
                        removePath();
                    }
                }
                if ($("#" + col[xIndex - 1] + row[yIndex - 1]).children().length > 0) {
                    var id = $("#" + col[xIndex - 1] + row[yIndex - 1]).children().attr("id");
                    var team = checkTeam(id);
                    if (team === "w") {
                        $("#" + col[xIndex - 1] + row[yIndex - 1]).addClass("cross");
                    }
                }
            }
        }
    }
}

function rookPath(currentPos, team, from) {

    if (from !== "queen") {
        removeCross();
        removePath();
    }

    var pathArray = [];
    var crossArray = [];
    var check = [];
    var content = $("div > div > div > div > div > div > div").attr("id");

    if ((content !== null) && (content !== undefined)) {
        if ((currentPos !== null) && (currentPos !== undefined)) {

            var x = currentPos.substr(0, 1);
            var y = currentPos.substr(1, 1);

            var xIndex = getXIndex(x);
            var yIndex = getYIndex(y);

            for (var i = xIndex + 1; i < row.length; i++) {

                if ($("#" + col[i] + row[yIndex]).children().length === 0) {
                    pathArray.push($("#" + col[i] + row[yIndex]).attr("id"));
                }
                if ($("#" + col[i] + row[yIndex]).children().length > 0) {
                    if (checkTeam($("#" + col[i] + row[yIndex]).children().attr("id")) !== team) {

                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            }

            for (var i = xIndex - 1; i > -1; i--) {

                if ($("#" + col[i] + row[yIndex]).children().length === 0) {
                    pathArray.push($("#" + col[i] + row[yIndex]).attr("id"));
                }
                if ($("#" + col[i] + row[yIndex]).children().length > 0) {
                    if (checkTeam($("#" + col[i] + row[yIndex]).children().attr("id")) !== team) {

                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            }

            for (var i = yIndex + 1; i < col.length; i++) {

                if ($("#" + col[xIndex] + row[i]).children().length === 0) {
                    pathArray.push($("#" + col[xIndex] + row[i]).attr("id"));
                }
                if ($("#" + col[xIndex] + row[i]).children().length > 0) {

                    if (checkTeam($("#" + col[xIndex] + row[i]).children().attr("id")) !== team) {

                        if (from !== "check") {
                            crossArray.push($("#" + col[xIndex] + row[i]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[xIndex] + row[i]).children().attr("id").includes("king")) {
                                check.push($("#" + col[xIndex] + row[i]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            }

            for (var i = yIndex - 1; i > -1; i--) {
                if ($("#" + col[xIndex] + row[i]).children().length === 0) {
                    pathArray.push($("#" + col[xIndex] + row[i]).attr("id"));
                }
                if ($("#" + col[xIndex] + row[i]).children().length > 0) {
                    if (checkTeam($("#" + col[xIndex] + row[i]).children().attr("id")) !== team) {

                        if (from !== "check") {
                            crossArray.push($("#" + col[xIndex] + row[i]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[xIndex] + row[i]).children().attr("id").includes("king")) {
                                check.push($("#" + col[xIndex] + row[i]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            }
        }
        if (from !== "check") {
            colorCrossPath(crossArray);
            colorPath(pathArray);
        } else {
            return check;
        }
    }
}

function bishopPath(currentPos, team, from) {

    if (from !== "queen") {
        removeCross();
        removePath();
    }

    var pathArray = [];
    var crossArray = [];
    var check = [];

    var content = $("div > div > div > div > div > div > div").attr("id");

    if ((content !== null) && (content !== undefined)) {
        if ((currentPos !== null) && (currentPos !== undefined)) {
            var x = currentPos.substr(0, 1);
            var y = currentPos.substr(1, 1);

            var xIndex = getXIndex(x);
            var yIndex = getYIndex(y);


            var count = 1;
            for (var i = xIndex + 1; i < col.length; i++) {

                if ($("#" + col[i] + row[yIndex + count]).children().length === 0) {
                    pathArray.push($("#" + col[i] + row[yIndex + count]).attr("id"));
                }
                if ($("#" + col[i] + row[yIndex + count]).children().length > 0) {
                    if (checkTeam($("#" + col[i] + row[yIndex + count]).children().attr("id")) !== team) {
                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex + count]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex + count]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex + count]).attr("id"));
                                break;
                            }
                        }

                    } else {
                        break;
                    }
                }
                count++;
            }
            count = 1;

            for (var i = xIndex - 1; i > -1; i--) {

                if ($("#" + col[i] + row[yIndex + count]).children().length === 0) {
                    pathArray.push($("#" + col[i] + row[yIndex + count]).attr("id"));
                }
                if ($("#" + col[i] + row[yIndex + count]).children().length > 0) {
                    if (checkTeam($("#" + col[i] + row[yIndex + count]).children().attr("id")) !== team) {
                        //crossArray.push($("#" + col[i] + row[yIndex + count]).attr("id"));
                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex + count]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex + count]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex + count]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
                count++;
            }
            count = 1;

            for (var i = xIndex + 1; i < row.length; i++) {
                if ($("#" + col[i] + row[yIndex - count]).children().length > 0) {
                    if (checkTeam($("#" + col[i] + row[yIndex - count]).children().attr("id")) !== team) {
                        crossArray.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex - count]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                } else {
                    pathArray.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                }
                count++;
            }

            count = 1;

            for (var i = xIndex - 1; i > -1; i--) {
                if ($("#" + col[i] + row[yIndex - count]).children().length > 0) {
                    if (checkTeam($("#" + col[i] + row[yIndex - count]).children().attr("id")) !== team) {
                        crossArray.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex - count]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                } else {
                    pathArray.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                }
                count++;
            }
        }
    }
    if (from === "queen") {
        var detailsArray = [crossArray, pathArray];
        return detailsArray;

    } else {
        if (from !== "check") {
            colorCrossPath(crossArray);
            colorPath(pathArray);
        } else {
            return check;
        }
    }
}

function queenPath(currentPos, team, from) {
    rookPath(ChessObject.chessmanParentId, ChessObject.team, from);
    bishopPath(ChessObject.chessmanParentId, ChessObject.team, from);
}

function kingPath(currentPos, team, from) {
    removeCross();
    removePath();
    var pathArray = [];
    var crossArray = [];
    var check = [];

    var content = $("div > div > div > div > div > div > div").attr("id");

    if ((content !== null) && (content !== undefined)) {
        if ((currentPos !== null) && (currentPos !== undefined)) {
            var x = currentPos.substr(0, 1);
            var y = currentPos.substr(1, 1);
            var xIndex = getXIndex(x);
            var yIndex = getYIndex(y);
            for (var i = 0; i < divIds.length; i++) {
                var tempX = divIds[i].substr(0, 1);
                var tempY = divIds[i].substr(1, 1);
                var newX = getXIndex(tempX);
                var newY = getYIndex(tempY);

                if ((Math.abs(newX - xIndex) <= 1) && (Math.abs(newY - yIndex) <= 1)) {
                    if ($("#" + divIds[i]).children().length > 0) {
                        if (checkTeam($("#" + divIds[i]).children().attr("id")) !== team) {
                            if (from !== "check") {
                                crossArray.push($("#" + divIds[i]).attr("id"));

                            } else {
                                if ($("#" + divIds[i]).children().attr("id").includes("king")) {
                                    check.push($("#" + divIds[i]).attr("id"));
                                    break;
                                }
                            }
                        }
                    }
                    if ($("#" + divIds[i]).children().length === 0) {
                        pathArray.push($("#" + divIds[i]).attr("id"));
                    }
                }
            }
            if (from !== "check") {
                colorCrossPath(crossArray);
                colorPath(pathArray);
            } else {
                return check;
            }
        }
    }
}
$(".images").addClass("images-responsive");

function knightPath(currentPos, team, from) {
    removeCross();
    removePath();

    var pathArray = [];
    var crossArray = [];
    var check = [];

    var content = $("div > div > div > div > div > div > div").attr("id");

    if ((content !== null) && (content !== undefined)) {
        if ((currentPos !== null) && (currentPos !== undefined)) {
            var x = currentPos.substr(0, 1);
            var y = currentPos.substr(1, 1);

            var xIndex = getXIndex(x);
            var yIndex = getYIndex(y);

            for (var i = 0; i < divIds.length; i++) {
                var tempX = divIds[i].substr(0, 1);
                var tempY = divIds[i].substr(1, 1);

                var newX = getXIndex(tempX);
                var newY = getYIndex(tempY);

                if (((Math.abs(xIndex - newX) === 1) && ((Math.abs(yIndex - newY)) === 2)) | (((Math.abs(xIndex - newX)) === 2) && ((Math.abs(yIndex - newY)) === 1))) {
                    if ($("#" + divIds[i]).children().length > 0) {
                        if (checkTeam($("#" + divIds[i]).children().attr("id")) !== team) {
                            if (from !== "check") {
                                crossArray.push($("#" + divIds[i]).attr("id"));

                            } else {
                                if ($("#" + divIds[i]).children().attr("id").includes("king")) {
                                    check.push($("#" + divIds[i]).attr("id"));
                                    break;
                                }
                            }
                        }
                    }
                    if ($("#" + divIds[i]).children().length === 0) {
                        pathArray.push($("#" + divIds[i]).attr("id"));
                    }
                }
            }
        }
        if (from !== "check") {
            colorCrossPath(crossArray);
            colorPath(pathArray);
        } else {
            return check;
        }

    }
}

function colorPath(path) {
    for (var i = 0; i < path.length; i++) {
        $("#" + path[i]).addClass("path");
    }
}

function colorCrossPath(cross) {
    for (var i = 0; i < cross.length; i++) {
        $("#" + cross[i]).addClass("cross");
    }
}

function getXIndex(x) {
    for (var i = 0; i < col.length; i++) {
        if (x === col[i]) {
            return i;
        }
    }
}

function getYIndex(y) {
    for (var i = 0; i < row.length; i++) {
        if (y === row[i]) {
            return i;
        }
    }
}

function removePath() {
    for (var i = 0; i < divIds.length; i++) {
        $("#" + divIds[i]).removeClass("path");
    }
}


function removeCross() {
    for (var i = 0; i < divIds.length; i++) {
        $("#" + divIds[i]).removeClass("cross");
    }
}

function checkCross() {
    var count = 0;
    var crossArray = new Array();
    for (var i = 0; i < divIds.length; i++) {
        if ($("#" + divIds[i]).hasClass("cross")) {
            crossArray.push(divIds[i]);
            count++;
        }
    }
    return crossArray;
}

function checkPath() {

    var count = 0;
    var pathArray = new Array();
    for (var i = 0; i < divIds.length; i++) {
        if ($("#" + divIds[i]).hasClass("cross")) {
            pathArray.push(divIds[i]);
            count++;
        }
    }
    return pathArray;
}

function findTurn() {
    if (turn === "w") {
        turn = "b";
    } else {
        turn = "w";
    }
}
