// VARIABLES GLOBALES
let bgColor, yoyoColor, cuerdaColor;
let yoyoPos, yoyoVel, yoyoAcc;
let topSpeed = 20
let radio = 100;
let rotacion = 0;
let floatingTexts = [];
let num_floating_texts = 20;
let text_content = "it's yo-yo time!";

// Variables para la pantalla de carga (Splash Screen)
let introStartTime; 
let introDuration = 5000;
let fadeTime = 1000;    
let isIntroFinished = false; 
let introAlpha = 255; 

// Ya no necesitamos 'fontPixel' ni 'fontArea'
// let fontPixel, fontArea; 

// YOYO. hice muchas elipses para que en vez de ser el yoyo literal, sea como si el yoyo fuese transparente y se viera la cuerda enrollada sobre el juguete
function yoyo(x, y, tamaño) {
  push();
  translate(x, y);
  rotate(rotacion);
  translate(-200, -200);
  ellipse(200, 200, 200, 200);
  ellipse(195, 195, 200, 200);
  ellipse(205, 210, 200, 200);
  ellipse(210, 190, 200, 200);
  pop();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(random(255), random(255), random(255));
  yoyoColor = color(random(255), random(255), random(255));
  cuerdaColor = color(random(255), random(255), random(255));

  yoyoPos = createVector(width / 2, height / 2);
  yoyoVel = createVector(0, 0);
  yoyoAcc = createVector(0, 0);

  introStartTime = millis();

  // for de los textos
  for (let i = 0; i < num_floating_texts; i++) {
    floatingTexts.push(new FloatingText());
  }
}

// FÍSICAS DEL YOYO (P5.vector)
function updateYoyo() {
  let mouse = createVector(mouseX, mouseY);
  let dir = p5.Vector.sub(mouse, yoyoPos);
  dir.normalize();
  dir.mult(0.5);
  yoyoAcc = dir;
  yoyoVel.add(yoyoAcc);
  yoyoVel.limit(topSpeed);
  yoyoPos.add(yoyoVel);

  // rebote del yoyo en los bordes del lienzo
  if (yoyoPos.x > width - radio) {
    yoyoPos.x = width - radio;
    yoyoVel.x *= -0.8;
  } else if (yoyoPos.x < radio) {
    yoyoPos.x = radio;
    yoyoVel.x *= -0.8;
  }

  if (yoyoPos.y > height - radio) {
    yoyoPos.y = height - radio;
    yoyoVel.y *= -0.8;
  } else if (yoyoPos.y < radio) {
    yoyoPos.y = radio;
    yoyoVel.y *= -0.8;
  }
}

function draw() {
  // -----------------------------------------------------
  // 1. DIBUJAR LA SIMULACIÓN
  // -----------------------------------------------------
  if (isIntroFinished) {
    background(bgColor);
    stroke(yoyoColor);
    noFill();
    strokeWeight(7);

    // Texto, yoyó y cuerda
    for (let i = 0; i < floatingTexts.length; i++) {
      floatingTexts[i].move();
      floatingTexts[i].show();
    }
    updateYoyo();
    rotacion += yoyoVel.mag() * 0.05;
    stroke(cuerdaColor);
    let p1_x = yoyoPos.x + (radio * sin(rotacion));
    let p1_y = yoyoPos.y - (radio * cos(rotacion));
    let p2_x = mouseX;
    let p2_y = mouseY;
    let p3_x = width / 2;
    let p3_y = -100;
    line(p1_x, p1_y, p2_x, p2_y);
    line(p2_x, p2_y, p3_x, p3_y);
    stroke(yoyoColor);
    yoyo(yoyoPos.x, yoyoPos.y, 150);
  }

  // -----------------------------------------------------
  // 2. LÓGICA DE LA PANTALLA DE CARGA Y FUNDIDO
  // -----------------------------------------------------
  if (!isIntroFinished) {
    
    let elapsedTime = millis() - introStartTime;
    let timeToFade = introDuration - fadeTime;

    // A. Fase de visualización (primeros 4 segundos)
    if (elapsedTime < timeToFade) {
      background('#CF122A'); 
      introAlpha = 255; 
    } 
    
    // B. Fase de fundido (último segundo: 4 a 5 segundos)
    else if (elapsedTime >= timeToFade && elapsedTime < introDuration) {
      
      introAlpha = map(elapsedTime, timeToFade, introDuration, 255, 0);
      
      background(bgColor);
      
      fill(207, 18, 42, introAlpha); 
      rect(0, 0, width, height);

    } 
    
    // C. Fase final (Transición)
    else {
      isIntroFinished = true; 
      return; 
    }
    
    // -----------------------------------------------------
    // DIBUJAR TEXTO DE LA INTRO (Solo si no ha terminado)
    // -----------------------------------------------------
    
    textAlign(CENTER, CENTER);
    
    // Texto principal: Práctica de programación creativa
    push();
    // USAMOS FUENTES DE SISTEMA DIRECTAMENTE
    textSize(40); 
    fill(255, introAlpha); 
    text("Práctica de programación creativa", width / 2, height / 2 - 20);
    pop();

    // Texto secundario: ¡Disfruta!
    push();
    // USAMOS FUENTES DE SISTEMA DIRECTAMENTE
    textSize(20); 
    fill(255, introAlpha); 
    text("Recarga la página para cambiar los colores. ¡Disfruta!", width / 2, height / 2 + 30);
    pop();
  }
}

// class del texto, movimiento y dibujo del mismo
class FloatingText {
  constructor() {
    this.x = random(width, width * 1.5);
    this.y = random(height);
    this.speed = random(0.8, 1.8);
    this.color = color(random(255), random(255), random(255), 200);
    this.size = random(20, 40);
  }
  show() {
    push();
    fill(this.color);
    noStroke();
    textSize(this.size);
    textAlign(LEFT, CENTER);
    text(text_content, this.x, this.y);
    pop();
  }

  move() {
    this.x = this.x - this.speed;

    if (this.x < -200) {
      this.x = width + 200;
      this.y = random(height);
      this.speed = random(0.8, 1.8);
    }
  }
}