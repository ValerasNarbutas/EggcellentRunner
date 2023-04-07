import * as React from "react";
import { useRef, useEffect } from 'react';
import runnerImage from '../assets/runner.png';
import obstacleImage from '../assets/egg.png';
import obstacleCollisionImage from '../assets/brokenEgg.png';

class Runner {
  x: number;
  y: number;
  width: number;
  height: number;
  speedY: number;
  gravity: number;
  image: HTMLImageElement;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 60;
    this.speedY = 0;
    this.gravity = 0.5;

    // Load the runnerImage image
    this.image = new Image();
    this.image.src = runnerImage;
  }

  // Draw the runner using the image
  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.speedY;
    this.speedY += this.gravity;
  }
}

class Ground {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(y: number) {
    this.x = 0;
    this.y = y;
    this.width = 800;
    this.height = 10;
  }
}

class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  private defaultImage: HTMLImageElement;
  private collisionImage: HTMLImageElement;
  private image: HTMLImageElement;

  constructor(x: number, y: number, speed: number, image: HTMLImageElement, defaultImage: HTMLImageElement,
    collisionImage: HTMLImageElement) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 60;
    this.speed = speed;
    this.image = image;

    this.defaultImage = new Image();
    this.defaultImage.src = obstacleImage;

    this.collisionImage = new Image();
    this.collisionImage.src = obstacleCollisionImage;

    this.image = new Image();
    this.image.src = obstacleImage;


  }

  changeImageOnCollision() {
    this.image = this.collisionImage;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  update() {
    this.x -= this.speed;
  }
}

const RunnerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    let score = 0;
    let collision = false;
    let collisionCount = 0;

    let speed = 5;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const runner = new Runner(30, 130);
    const ground = new Ground(190);
    const obstacles: Obstacle[] = [];

    setInterval(() => {
      obstacles.push(
    new Obstacle(800, 150, speed, obstacleImage, obstacleImage, obstacleCollisionImage)
  );
    }, 2000);

    window.addEventListener('keydown', (event) => {
      if (event.key === ' ' && runner.y === 130) {
        runner.speedY = -10 - (speed / 2);
        // runner.speedY = -10;
      }
    });

    let gameRunning = true;

    const gameLoop = () => {
      if (!gameRunning) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!collision) {
        speed += 0.001;
        score++;
      }

      // Update and draw the runner
      runner.update();
      runner.draw(ctx); // Use the new draw method


       ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

      // Game loop continued from the previous part
      obstacles.forEach((obstacle, index) => {
        obstacle.update();
        obstacle.draw(ctx);
        // ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Check for collisions
        if (
            runner.x < obstacle.x + obstacle.width &&
            runner.x + runner.width > obstacle.x &&
            runner.y < obstacle.y + obstacle.height &&
            runner.y + runner.height > obstacle.y
        ) {
          // Collision detected
          if (!collision) {
            collisionCount++;
            obstacle.changeImageOnCollision();
            collision = true;
          }
          collision = true;

          if (collisionCount >= 3) {
            // Stop the game after the third collision
            gameRunning = false;
            alert(`Game over! Your score is ${Math.floor(score / 100)}`);
            return;
          }
        }else {
          collision = false;
        }

        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
          obstacles.splice(index, 1);
        }

      });
      // Make sure the runner doesn't go below the ground
      
      if (runner.y > 130) {
        runner.y = 130;
        runner.speedY = 0;
      }

      // Display the score
      ctx.font = '16px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(`Score: ${Math.floor(score / 100)}`, 10, 30);

      requestAnimationFrame(gameLoop);
    };
    // Start the game loop
    gameLoop();
  }, []);

  return (
    <canvas ref={canvasRef} width="800" height="200" />
  );
};

export default RunnerGame;
