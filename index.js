const fs = require("fs");
const luamin = require("lua-format")

fs.readFile("input.lua", "utf8", (err, data) => {
    var code = luamin.Beautify(data, {
        RenameVariables: false,
        RenameGlobals: false,
        SolveMath: true,
        Indentation: '\t'
    })
    var lines = code.split("\n");

    var returnLine;
    var functionData;

    for (var i = 0; i < lines.length; i++) {
        if (lines[i].includes("return '';")) {
            returnLine = i;
            break;
        }
    }

    for (var i = returnLine; i >= 0; i--) {
        if (lines[i].includes("local function")) {
            functionData = lines[i];

            break;
        }
    }

    var functionName = functionData.match(/local function\s+(\w+)/)[1];
    var constantLoop, constantLoopL;

    for (var i = 0; i < lines.length; i++) {
        if (lines[i].includes(functionName + "()")) {
            constantLoopL = i;
            constantLoop = lines[i]

            break;
        }
    }

    var targetValue = constantLoop.split(" = ")[0].slice(-1);
    var targetLine;

    for (var i = constantLoopL; i < lines.length; i++) {
        if (lines[i].includes(" = " + targetValue)) {
            targetLine = i;

            break;
        }
    }

    lines.splice(targetLine + 1, 0, "print(" + targetValue + ")");

    fs.writeFile("output.lua", lines.join("\n"), () => {});
});