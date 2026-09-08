import * as Phaser from "phaser";
import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Game extends Scene {
    private timeLeft: Phaser.GameObjects.Text;
    private buttons: Phaser.GameObjects.Graphics[] = [];
    private colors: number[] = [
        0xee1515, 0x1d70f5, 0x22c55e, 0xfacc15, 0x7c3aed,
    ];
    private targetIndex: number;
    private Box: Phaser.GameObjects.Graphics;
    private playerGuess: number | null = null;
    private playAgainBtn: Phaser.GameObjects.Graphics;
    private playAgainText: Phaser.GameObjects.Text;
    private Stake: number = 10;
    private balance: number = 0;
    private balanceText: Phaser.GameObjects.Text;
    private backgroundGame: Phaser.GameObjects.Image;
    private colorNames: string[] = ["Red", "blue", "Green", "Yellow", "Purple"];
    shakeText(target: Phaser.GameObjects.Text) {
        const originalX = target.x;

        this.tweens.add({
            targets: target,
            x: originalX + 8,
            duration: 50,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                target.x = originalX; // snap back exactly to original position when done
            },
        });
    }
    music:
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound
        | Phaser.Sound.WebAudioSound;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");
        this.load.image("backgroundGame", "background.jpeg");
        this.load.audio("sound", "sound.mp3");
    }

    create() {
        this.music = this.sound.add("sound", { loop: true });
        this.music.play();

        this.backgroundGame = this.add
            .image(0, 0, "backgroundGame")
            .setScale(2)
            .setOrigin(0);
        this.add
            .text(500, 100, "Color Rush", {
                color: "#657294",
                fontSize: "16px",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);
        this.balanceText = this.add.text(
            800,
            100,
            "Your balance is: " + this.balance + "GVT",
            {
                color: "#f9c12c",
                fontSize: "16px",
                fontFamily: "Arial",
            },
        );

        this.Box = this.add.graphics();
        this.drawRoundedBox(this.Box, 500, 300, 200, 100, 0x222222);

        EventBus.emit("current-scene-ready", this);
        EventBus.on("setstake", (amount: number) => {
            this.Stake = amount;
            this.balance += amount;
            this.balanceText.setText(
                "Your balance is: " + this.balance + "GVT",
            );
        });

        this.timeLeft = this.add
            .text(500, 150, "Pick a color to guess!", {
                color: "#ffffff",
                fontSize: "25px",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        const panel = this.add.graphics();
        panel.fillStyle(0x131a2e, 1);
        panel.fillRoundedRect(100, 500, 820, 180, 16);

        this.add
            .text(500, 520, "Pick a Color", {
                color: "#657294",
                fontSize: "16px",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        for (let i = 0; i < this.colors.length; i++) {
            const btn = this.add.graphics();
            const xPosition = 200 + i * 150;
            this.drawRoundedBox(btn, xPosition, 600, 100, 70, this.colors[i]);

            this.add
                .text(xPosition, 600, this.colorNames[i], {
                    fontSize: "16px",
                    fontFamily: "Arial",
                    fontStyle: "bold",
                })
                .setOrigin(0.5);
            this.buttons.push(btn);
        }

        this.buttons.forEach((btn, i) => {
            const xPosition = 200 + i * 150;
            const hitZone = this.add
                .zone(xPosition, 600, 100, 70)
                .setOrigin(0.5);
            hitZone.setInteractive();
            hitZone.on("pointerdown", () => {
                this.handleGuess(i);
            });
        });

        this.playAgainBtn = this.add.graphics();
        this.drawRoundedBox(this.playAgainBtn, 500, 420, 200, 70, 0x378add);
        this.playAgainBtn.setVisible(false);

        this.playAgainText = this.add
            .text(500, 420, "Play Again", {
                color: "#ffffff",
                fontSize: "20px",
                fontFamily: "Arial",
            })
            .setOrigin(0.5)
            .setVisible(false);

        const playAgainZone = this.add.zone(500, 420, 200, 70).setOrigin(0.5);
        playAgainZone.setInteractive();
        playAgainZone.on("pointerdown", () => {
            if (this.playAgainBtn.visible) {
                this.resetRound();
            }
        });
    }

    drawRoundedBox(
        graphic: Phaser.GameObjects.Graphics,
        centerX: number,
        centerY: number,
        width: number,
        height: number,
        color: number,
    ) {
        graphic.clear();
        graphic.fillStyle(color, 1);
        graphic.fillRoundedRect(
            centerX - width / 2,
            centerY - height / 2,
            width,
            height,
            12,
        );
    }

    handleGuess(index: number) {
        if (this.playerGuess !== null) {
            return;
        }
        if (this.balance < this.Stake) {
            this.timeLeft.setText("Not enough amount!").setColor("#ff0000");
            this.shakeText(this.timeLeft);
            return;
        }
        this.playerGuess = index;

        this.balance -= this.Stake;
        this.balanceText.setText("Balance :" + this.balance + "GVT");
        this.timeLeft
            .setText("Guess locked in! Revealing...")
            .setColor("#ffffff");
        this.time.delayedCall(1000, () => {
            this.showColors();
        });
    }

    showColors() {
        this.targetIndex = Phaser.Math.Between(0, this.colors.length - 1);
        this.drawRoundedBox(
            this.Box,
            500,
            300,
            200,
            100,
            this.colors[this.targetIndex],
        );

        const won = this.playerGuess === this.targetIndex;

        if (won) {
            const winning = this.Stake * 2;
            this.balance += winning;
            this.timeLeft
                .setText("You won! " + winning + " GVT")
                .setColor("#639922");
        } else {
            this.timeLeft
                .setText("You lost! " + this.Stake + " GVT")
                .setColor("#ff0000");
        }

        this.balanceText.setText("Balance: " + this.balance + "GVT");

        this.playAgainBtn.setVisible(true);
        this.playAgainText.setVisible(true);
    }

    resetRound() {
        this.drawRoundedBox(this.Box, 500, 300, 200, 100, 0x222222);
        this.playerGuess = null;
        this.timeLeft.setText("Pick a color to guess!").setColor("#ffffff");

        this.playAgainBtn.setVisible(false);
        this.playAgainText.setVisible(false);
    }

    update(time: number, delta: number): void {}
}
