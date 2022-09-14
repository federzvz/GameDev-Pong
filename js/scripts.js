const text = document.getElementById("winnerTag");

(function () {
  self.Board = function (width, height) {
    //Board es el tablero
    this.width = width;
    this.height = height;
    this.playing = false;
    this.game_over = false;
    this.bars = [];
    this.ball = null;
    this.playing = false;
    this.endgame = false;
    this.player1pts = 0;
    this.player2pts = 0;
    this.yasumepuntos = false;
    this.winnerPtsNeed = 10;
  };

  self.Board.prototype = {
    //Prototipiado de la clase Board
    get elements() {
      var elements = this.bars.map(function (bar) {
        return bar;
      });
      elements.push(this.ball);
      return elements;
    },
  };
})();

//Pelota
(function () {
  self.ball = function (x, y, radius, board) {
    //Propiedades de la pelota
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed_y = 0;
    this.speed_x = 4;
    this.board = board;
    board.ball = this;
    this.kind = "circle";
    this.bounce_angle = 0;
    this.max_bounce_angle = Math.PI / 12;
    this.speed = 4;
  };
  self.ball.prototype = {
    //Prototipado de la pelota
    move: function () {
      this.x += this.speed_x * this.direction;
      this.y += this.speed_y;
    },
    get width() {
      return this.radius * 2;
    },
    get height() {
      return this.radius * 2;
    },
    collision: function (bar) {
      //Detecta la colision con una barra que recibe como parametro
      var relative_intersect_y = bar.y + bar.height / 2 - this.y;

      var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

      this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

      this.speed_y = this.speed * -Math.sin(this.bounce_angle);

      this.speed_x = this.speed * Math.cos(this.bounce_angle);

      //Cambiamos la dirección dependiendo de a que lado tocó la barra y aumentamos la velocidad
      if (this.x > this.board.width / 2) {
        this.direction = -1;
        this.speed += 1;
      } else {
        this.direction = 1;
        this.speed += 1;
      }
    },
  };
})();

//Jugadores(Rectangulos)
(function () {
  self.Bar = function (x, y, width, height, board) {
    //Propiedades del jugador
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillStyle = "#555CFC";
    this.board = board;
    this.board.bars.push(this); //Agrega la barra al array de barras del tablero
    this.kind = "rectangle";
    this.speed = 30;
  };

  self.Bar.prototype = {
    //Funciones para mover la barra
    down: function () {
      this.y += this.speed;
    },
    up: function () {
      this.y -= this.speed;
    },
  };
})();

//Tablero
(function () {
  self.BoardView = function (canvas, board) {
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = board;
    this.ctx = canvas.getContext("2d");
  };

  self.BoardView.prototype = {
    //Prototipado del tablero
    clean: function () {
      this.ctx.clearRect(0, 0, this.board.width, this.board.height);
    },
    draw: function () {
      for (var i = this.board.elements.length - 1; i >= 0; i--) {
        var el = this.board.elements[i]; //Obtiene el elemento del array de elementos del tablero y lo dibuja en el canvas
        draw(this.ctx, el);
      }
    },
    checko_collisions: function () {
      for (var i = this.board.bars.length - 1; i >= 0; i--) {
        var bar = this.board.bars[i];
        if (hit(bar, this.board.ball)) {
          this.board.ball.collision(bar);
        }
      }

      this.board.yasumepuntos = false;
    },
    checkGameStatus: function () {
      if (this.board.endgame) {
        //Verifica si el juego termino(Un jugador anota)
        if (
          this.board.player1pts >= this.board.winnerPtsNeed ||
          this.board.player2pts >= this.board.winnerPtsNeed
        ) {
          //Verifica si algun jugador llego al puntaje ganador
          reset(true);
          return;
        }
        reset(false);
      }
    },
    play: function () {
      if (this.board.playing) {
        this.clean();
        this.draw();
        this.checko_collisions();
        this.checkGameStatus();

        //Verifica si la pelota se salio del tablero
        if (bar.y <= 1) bar.y = 1;
        else if (bar.y >= this.board.height - bar.height)
          bar.y = this.board.height - bar.height;
        if (bar2.y <= 1) bar2.y = 1;
        else if (bar2.y >= this.board.height - bar2.height)
          bar2.y = this.board.height - bar2.height - 1;
        this.board.ball.move();

        document.querySelector("#jugador1").innerHTML = this.board.player1pts;
        document.querySelector("#jugador2").innerHTML = this.board.player2pts;
      }
    },
  };

  function hit(paleta, pelota) {
    //Revisa si la pelota colisiona con la paleta
    var hit = false;
    let velocidad = 3;
    if (pelota.x >= this.board.width - pelota.radius) {
      this.board.endgame = true;
      if (!this.board.yasumepuntos) {
        this.board.player1pts += 0.5;
      }
    }

    if (pelota.x <= pelota.radius) {
      this.board.endgame = true;

      if (!this.board.yasumepuntos) {
        this.board.player2pts += 0.5;
      }
    }
    if (pelota.y <= pelota.radius) {
      //Rebota la pelota en la parte superior
      pelota.speed_y = 3;
    } else if (pelota.y >= this.board.height - pelota.radius) {
      //Rebota la pelota en la parte inferior
      pelota.speed_y = -3;
    }

    if (
      //Revisa si la pelota colisiona con la paleta
      pelota.x + pelota.width >= paleta.x &&
      pelota.x < paleta.x + paleta.width
    ) {
      if (
        //Revisa si la pelota colisiona con la paleta
        pelota.y + pelota.height >= paleta.y &&
        pelota.y < paleta.y + paleta.height
      )
        hit = true;
    }
    if (
      //Revisa si la pelota colisiona con la paleta
      pelota.x <= paleta.x &&
      pelota.x + pelota.width >= paleta.x + paleta.width
    ) {
      if (
        //Revisa si la pelota colisiona con la paleta
        pelota.y <= paleta.y &&
        pelota.y + pelota.height >= paleta.y + paleta.height
      ) {
        hit = true;
      }
    } //Revisa si la pelota colisiona con la paleta
    if (
      paleta.x <= pelota.x &&
      paleta.x + paleta.width >= pelota.x + pelota.width
    ) {
      if (
        //Revisa si la pelota colisiona con la paleta
        paleta.y <= pelota.y &&
        paleta.y + paleta.height >= pelota.y + pelota.height
      ) {
        hit = true;
      }
    }
    return hit;
  }

  //Dibuja los elementos del tablero
  function draw(ctx, element) {
    switch (element.kind) {
      case "rectangle":
        ctx.fillRect(element.x, element.y, element.width, element.height);
        ctx.fillStyle = "#D5C306"
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.radius, 0, 7);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = "#F97A2A";
        break;
    }
  }
})();

//Reinicia el juego
function reset(hard) {
  pelotax = this.board.width / 2;
  pelotay = this.board.height / 2;
  ball.speed_y = 0;
  ball.speed_x = 3;
  ball.speed = 3;
  ball.x = 350;
  ball.y = 180;
  bar.x = 20;
  bar.y = this.board.height / 2 - bar.height / 2;
  bar2.x = this.board.width - bar2.width - 20;
  bar2.y = this.board.height / 2 - bar2.height / 2;
  this.board.endgame = false;

  if (hard) {
    bar.x = 20;
    bar.y = this.board.height / 2 - bar.height / 2;

    bar2.x = this.board.width - bar2.width - 20;
    bar2.y = this.board.height / 2 - bar2.height / 2;

    if (this.board.player1pts >= this.board.winnerPtsNeed) {
      text.innerHTML =
        "El jugador 1 ha ganado, presiona F5 para volver a jugar";
    } else {
      text.innerHTML =
        "El jugador 2 ha ganado, presiona F5 para volver a jugar";
    }
    this.board.endgame = true;
  }
}

//Creacion de los objetos del juego
var board = new Board(800, 400);
var bar = new Bar(20, 100, 20, 100, board);
var bar2 = new Bar(740, 100, 20, 100, board);
var canvas = document.getElementById("canvas", board);
var board_view = new BoardView(canvas, board);
var ball = new ball(350, 180, 10, board);

document.addEventListener("keydown", function (ev) {
  if (ev.keyCode == 38) {
    //Arriba
    ev.preventDefault();
    bar2.up();
  } else if (ev.keyCode == 40) {
    //Abajo
    ev.preventDefault();
    bar2.down();
  } else if (ev.keyCode == 87) {
    //W Arriba
    ev.preventDefault();
    bar.up();
  } else if (ev.keyCode == 83) {
    //s Abajo
    ev.preventDefault();
    bar.down();
  } else if (ev.keyCode == 32) {
    //PAUSA CON SPACE
    ev.preventDefault();
    startGame();
  }
});

if (!this.board.endgame) {
  window.requestAnimationFrame(controller);
  board_view.draw();
  setTimeout(function () {
    ball.direction = -1;
  });
}
function controller() {
  board_view.play();
  window.requestAnimationFrame(controller);
}

function startGame() {
  board.playing = !board.playing;
  //change play/pause button text with id playBtnTag
  if (board.playing) {
    document.getElementById("playBtnTag").innerHTML = "Pause";
  }
  if (!board.playing) {
    document.getElementById("playBtnTag").innerHTML = "Play";
  }
}
