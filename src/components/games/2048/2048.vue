<template>
<div class="container">
  <div class="heading">
    <h1 class="title">2048</h1>
    <div class="score-container">0</div>
  </div>
  <p class="game-intro">¡Une los numeros y llega a <strong>2048!</strong></p>

  <div class="game-container">
    <div class="game-message">
      <p></p>
      <div class="lower">
        <a id="rt" class="retry-button">Intentalo denuevo</a>
      </div>
    </div>

    <div class="grid-container">
      <div class="grid-row">
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
      </div>
      <div class="grid-row">
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
      </div>
      <div class="grid-row">
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
      </div>
      <div class="grid-row">
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
        <div class="grid-cell"></div>
      </div>
    </div>

    <div class="tile-container">

    </div>
  </div>

</div>

</template>


<script>
    document.addEventListener("DOMContentLoaded", function () {
  // Wait till the browser is ready to render the game (avoids glitches)
  window.requestAnimationFrame(function () {
    var manager = new GameManager(4, KeyboardInputManager, HTMLActuator);
    console.log(manager)
  });
});


function GameManager(size, InputManager, Actuator) {
  this.size         = size; // Size of the grid
  this.inputManager = new InputManager;
  this.actuator     = new Actuator;

  this.startTiles   = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  this.actuator.restart();
  this.setup();
};

// Set up the game
GameManager.prototype.setup = function () {
  this.grid         = new Grid(this.size);

  this.score        = 0;
  this.over         = false;
  this.won          = false;

  // Add the initial tiles
  this.addStartTiles();

  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  this.actuator.actuate(this.grid, {
    score: this.score,
    over:  this.over,
    won:   this.won
  });
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2:down, 3: left
  var self = this;

  if (this.over || this.won) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // up
    1: { x: 1,  y: 0 },  // right
    2: { x: 0,  y: 1 },  // down
    3: { x: -1, y: 0 }   // left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);
          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};



function Grid(size) {
  this.size = size;

  this.cells = [];

  this.build();
}

// Build a grid of the specified size
Grid.prototype.build = function () {
  for (var x = 0; x < this.size; x++) {
    var row = this.cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};


function HTMLActuator() {
  this.tileContainer    = document.getElementsByClassName("tile-container")[0];
  this.scoreContainer   = document.getElementsByClassName("score-container")[0];
  this.messageContainer = document.getElementsByClassName("game-message")[0];

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);

    if (metadata.over) self.message(false); // You lose
    if (metadata.won) self.message(true); // You win!
  });
};

HTMLActuator.prototype.restart = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var element   = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];
  this.applyClasses(element, classes);

  element.textContent = tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(element, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(element, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(element, classes);
  }

  // Put the tile on the board
  this.tileContainer.appendChild(element);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "Ganaste" : "¡Malo ql!"

  // if (ga) ga("send", "event", "game", "end", type, this.score);

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  this.messageContainer.classList.remove("game-won", "game-over");
};



function KeyboardInputManager() {
  this.events = {};

  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.listen = function () {
  var self = this;

  var map = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
    75: 0, // vim keybindings
    76: 1,
    74: 2,
    72: 3
  };

  document.addEventListener("keydown", function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
    var mapped    = map[event.which];

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        self.emit("move", mapped);
      }

      if (event.which === 32) self.restart.bind(self)(event);
    }
  });

  var retry = document.getElementById('rt');
  retry.addEventListener("click", this.restart.bind(this));



  var gameContainer = document.getElementsByClassName("game-container")[0];
  console.log(gameContainer)

};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};





function Tile(position, value) {
  this.x                = position.x;
  this.y                = position.y;
  this.value            = value || 2;

  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
}

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};


</script>




























<style lang="scss" scoped>

// helpers
// Exponent
// From: https://github.com/Team-Sass/Sassy-math/blob/master/sass/math.scss#L36

@function exponent($base, $exponent) {
  // reset value
  $value: $base;
  // positive intergers get multiplied
  @if $exponent > 1 {
    @for $i from 2 through $exponent {
      $value: $value * $base; } }
  // negitive intergers get divided. A number divided by itself is 1
  @if $exponent < 1 {
    @for $i from 0 through -$exponent {
      $value: $value / $base; } }
  // return the last value written
  @return $value;
}

@function pow($base, $exponent) {
  @return exponent($base, $exponent);
}

// Transition mixins
@mixin transition($args...) {
  -webkit-transition: $args;
  -moz-transition: $args;
}

@mixin transition-property($args...) {
  -webkit-transition-property: $args;
  -moz-transition-property: $args;
}

// Keyframe animations
@mixin keyframes($animation-name) {
  @-webkit-keyframes $animation-name {
    @content;
  }
  @-moz-keyframes $animation-name {
    @content;
  }
  @keyframes $animation-name {
    @content;
  }
}

@mixin animation($str) {
  -webkit-animation: #{$str};
  -moz-animation: #{$str};
}

@mixin animation-fill-mode($str) {
  -webkit-animation-fill-mode: #{$str};
  -moz-animation-fill-mode: #{$str};
}

// Media queries
@mixin smaller($width) {
  @media screen and (max-width: $width) {
    @content;
  }
}



// main.scss
$field-width: 300px;
$grid-spacing: 15px;
$grid-row-cells: 4;
$tile-size: ($field-width - $grid-spacing * ($grid-row-cells + 1)) / $grid-row-cells;
$tile-border-radius: 3px;

$text-color: #776E65;
$bright-text-color: #f9f6f2;

$tile-color: #eee4da;
$tile-gold-color: #edc22e;
$tile-gold-glow-color: lighten($tile-gold-color, 15%);

$game-container-background: #bbada0;

$transition-speed: 100ms;

body{
    background: #faf8ef;
}

.container {
  position: absolute;
  top: 60px;
  left: 20px;

  background: #faf8ef;
  color: $text-color;
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
  font-size: 18px;
}

.heading:after {
  content: "";
  display: block;
  clear: both;
}

h1.title {
  font-size: 80px;
  font-weight: bold;
  margin: 0;
  display: block;
  float: left;
}

@include keyframes(move-up) {
  0% {
    top: 25px;
    opacity: 1;
  }

  100% {
    top: -50px;
    opacity: 0;
  }
}

.score-container {
  $height: 25px;

  position: relative;
  float: right;
  background: $game-container-background;
  padding: 15px 25px;
  font-size: $height;
  height: $height;
  line-height: $height - 22px;
  font-weight: bold;
  border-radius: 3px;
  color: white;
  margin-top: 8px;

  &:after {
    position: absolute;
    width: 100%;
    top: 10px;
    left: 0;
    text-transform: uppercase;
    font-size: 13px;
    line-height: 13px;
    text-align: center;
    color: $tile-color;
  }

  .score-addition {
    opacity:0;
    position: absolute;
    right: 30px;
    color: red;
    font-size: $height;
    line-height: $height;
    font-weight: bold;
    color: rgba($text-color, .9);
    z-index: 100;
    @include animation(move-up 600ms ease-in);
    @include animation-fill-mode(both);
  }
}

p {
  margin-top: 0;
  margin-bottom: 10px;
  line-height: 1.65;
}

a {
  color: $text-color;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}

strong {
  &.important {
    text-transform: uppercase;
  }
}

hr {
  border: none;
  border-bottom: 1px solid lighten($text-color, 40%);
  margin-top: 20px;
  margin-bottom: 30px;
}

.container {
  width: $field-width;
  margin: 0 auto;
}

@include keyframes(fade-in) {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

// Game field mixin used to render CSS at different width
@mixin game-field {
  .game-container {
    margin-top: 40px;
    position: relative;
    padding: $grid-spacing;

    cursor: default;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;

    background: $game-container-background;
    border-radius: $tile-border-radius * 2;
    width: $field-width;
    height: $field-width;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    .game-message {
      display: none;

      position: absolute;
      top: 00;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba($tile-color, .5);
      z-index: 100;

      text-align: center;

      p {
        font-size: 60px;
        font-weight: bold;
        height: 60px;
        line-height: 60px;
        margin-top: 102px;
        // height: $field-width;
        // line-height: $field-width;
      }

      .lower {
        display: block;
        margin-top: 59px;
      }

      a {
        display: inline-block;
        background: darken($game-container-background, 20%);
        border-radius: 3px;
        padding: 0 20px;
        text-decoration: none;
        color: $bright-text-color;
        height: 40px;
        line-height: 42px;
        margin-left: 9px;
        // margin-top: 59px;
      }

      @include animation(fade-in 800ms ease $transition-speed * 12);
      @include animation-fill-mode(both);

      &.game-won {
        background: rgba($tile-gold-color, .5);
        color: $bright-text-color;
      }

      &.game-won, &.game-over {
        display: block;
      }
    }
  }

  .grid-container {
    position: absolute;
    z-index: 1;
  }

  .grid-row {
    margin-bottom: $grid-spacing;

    &:last-child {
      margin-bottom: 0;
    }

    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }

  .grid-cell {
    width: $tile-size;
    height: $tile-size;
    margin-right: $grid-spacing;
    float: left;

    border-radius: $tile-border-radius;

    background: rgba($tile-color, .35);

    &:last-child {
      margin-right: 0;
    }
  }

  .tile-container {
    position: absolute;
    z-index: 2;
  }

  .tile {
    width: $tile-size;
    height: $tile-size;
    line-height: $tile-size + 10px;

    // Build position classes
    @for $x from 1 through $grid-row-cells {
      @for $y from 1 through $grid-row-cells {
        &.tile-position-#{$x}-#{$y} {
          position: absolute;
          left: round(($tile-size + $grid-spacing) * ($x - 1));
          top: round(($tile-size + $grid-spacing) * ($y - 1));
        }
      }
    }
  }
}

// End of game-field mixin
@include game-field;

.tile {
  border-radius: $tile-border-radius;

  background: $tile-color;
  text-align: center;
  font-weight: bold;
  z-index: 10;

  font-size: 20px;

  @include transition($transition-speed ease-in-out);
  @include transition-property(top, left);

  $base: 2;
  $exponent: 1;
  $limit: 11;

  // Colors for all 11 states, false = no special color
  $special-colors: false false, // 2
                   false false, // 4
                   #f78e48 true, // 8
                   #fc5e2e true, // 16
                   #ff3333 true, // 32
                   #ff0000 true, // 64
                   false true, // 128
                   false true, // 256
                   false true, // 512
                   false true, // 1024
                   false true; // 2048

  // Build tile colors
  @while $exponent <= $limit {
    $power: pow($base, $exponent);

    &.tile-#{$power} {
      // Calculate base background color
      $gold-percent: ($exponent - 1) / ($limit - 1) * 100;
      $mixed-background: mix($tile-gold-color, $tile-color, $gold-percent);

      $nth-color: nth($special-colors, $exponent);

      $special-background: nth($nth-color, 1);
      $bright-color: nth($nth-color, 2);

      @if $special-background {
        $mixed-background: mix($special-background, $mixed-background, 55%);
      }

      @if $bright-color {
        color: $bright-text-color;
      }

      // Set background
      background: $mixed-background;

      // Add glow
      $glow-opacity: max($exponent - 4, 0) / ($limit - 4);

      @if not $special-background {
        box-shadow: 0 0 30px 10px rgba($tile-gold-glow-color, $glow-opacity / 1.8),
                    inset 0 0 0 1px rgba(white, $glow-opacity / 3);
      }

      // Adjust font size for bigger numbers
      @if $power >= 100 and $power < 1000 {
        font-size: 20px;

        // Media queries placed here to avoid carrying over the rest of the logic
        @include smaller(480px) {
          font-size: 25px;
        }
      } @else if $power >= 1000 {
        font-size: 20px;

        @include smaller(480px) {
          font-size: 15px;
        }
      }
    }

    $exponent: $exponent + 1;
  }
}

@include keyframes(appear) {
  0% {
    opacity: 0;
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
  }

  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
  }
}

.tile-new {
  @include animation(appear 200ms ease $transition-speed);
  @include animation-fill-mode(both);
}

@include keyframes(pop) {
  0% {
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
  }

  50% {
    -webkit-transform: scale(1.2);
    -moz-transform: scale(1.2);
  }

  100% {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
  }
}

.tile-merged {
  z-index: 20;
  @include animation(pop 200ms ease $transition-speed);
  @include animation-fill-mode(both);
}

.game-intro {
  margin-bottom: 0;
}

.game-explanation {
  margin-top: 50px;
}

@include smaller(480px) {
  // Redefine variables for smaller screens
  $field-width: 280px;
  $grid-spacing: 10px;
  $grid-row-cells: 4;
  $tile-size: ($field-width - $grid-spacing * ($grid-row-cells + 1)) / $grid-row-cells;
  $tile-border-radius: 3px;

  html, body {
    font-size: 15px;
  }

  body {
    margin: 20px 0;
    padding: 0 20px;
  }

  h1.title {
    font-size: 50px;
  }

  .container {
    width: $field-width;
    margin: 0 auto;
  }

  .score-container {
    margin-top: 0;
  }

  .heading {
    margin-bottom: 10px;
  }

  // Render the game field at the right width
  @include game-field;

  .game-container {
    margin-top: 20px;
  }

  // Rest of the font-size adjustments in the tile class
  .tile {
    font-size: 35px;
  }

  .game-message {
    p {
      font-size: 30px !important;
      height: 30px !important;
      line-height: 30px !important;
      margin-top: 90px !important;
    }

    .lower {
      margin-top: 30px !important;
    }
  }
}

</style>