import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";
            // initialize kaboom context
            kaboom({
                height:700,
                width: 1000,
                canvas: document.querySelector('#gameCanvas'),
                background: [ 200, 200, 255, ], 
            });

            // load assets
            loadSprite("dino", "../images/playerAnimation-01.png", {
                sliceX: 8,
                sliceY: 1,
                anims: {
                    run: {
                        from: 0,
                        to: 7,
                        loop: true,
                        speed: 10,
                    },
                    jump: {
                        from: 3,
                        to: 3,
                    },
                },
            }),
            loadSprite("controls", "../images/Untitled-2-01.jpg");
            loadSprite("paperTex", "../images/paperTexture-01.jpg");
            loadSprite("background", "https://www.paulwheeler.us/files/windows-95-desktop-background.jpg");
            loadFont("test", "../images/Bungee-Regular.ttf");

            //initialize variables
            const JUMP_FORCE = 800;
            const JUMP_PAD_FORCE = 1000;
            const PLAYER_SPEED = 480;
            const FLOOR_HEIGHT = 48;
            let acceleration = 500;
            let second_interval = 2;
            let distance = 0;
            let score = 0;

            //create game scene
            scene("game", () => {
                let background = add([
                    sprite("paperTex"),
                    pos(500, height() / 2),
                    anchor("center"),
                    // Allow the background to be scaled
                    scale(1),
                    // Keep the background position fixed even when the camera moves
                    fixed()
                ])
                let background2 = add([
                    sprite("paperTex"),
                    pos(1500, height() / 2),
                    anchor("center"),
                    // Allow the background to be scaled
                    scale(1),
                    // Keep the background position fixed even when the camera moves
                    fixed()
                ])

                //parallax scrolling for background
                onUpdate(() => {
                    if(background.pos.x < -500 ){
                        background.pos.x = background2.pos.x + 1000
                    }
                    else{
                        background.pos.x--
                    }
                    console.log(background.pos.x)
                    if(background2.pos.x < -500){
                        background2.pos.x = background.pos.x + 1000
                    }
                    else{
                        background2.pos.x--
                    }
                })

                //set score to 0 and add it to the screen
                distance = 0
                score = 0
                const distanceLabel = add([
                    text("Distance: " + distance,{
                        font:"test",
                        size: 30,
                    }),
                    pos(25, 25),
                    color(0, 0, 0)
                ]);
                const scoreLabel = add([
                    text("Score: " + score, {
                        font:"test",
                        size: 30,
                    }),
                    pos(825, 25),
                    color(0, 0, 0)
                ]);

                //set gravity
                setGravity(1600);

                //initialize player
                const player = add([
                    sprite("dino"),
                    pos(100, 200),
                    area(),
                    body(),
                    health(8),
                    scale(.6),
                ])
                player.play("run")

                //add floor
                add([
                    rect(width(), FLOOR_HEIGHT),
                    outline(4),
                    pos(0, height()),
                    anchor("botleft"),
                    area(),
                    body({ isStatic: true }),
                    color(127, 200, 255),
                ]);

                //*******Start player movement*******//
                onKeyPress("space", () => {
                    if (player.isGrounded()) {
                        player.jump(JUMP_FORCE);
                    }
                });

                onKeyDown("right", () =>{
                    player.move(PLAYER_SPEED,0)
                })

                onKeyDown("left", () =>{
                    player.move(-PLAYER_SPEED,0)
                })
                //*******End player movement*******//

                function spawnObstacle() {
                    console.log(acceleration)
                    console.log(second_interval)
                    
                    //if acceleration reaches 1000 it will stay 1000
                    if (acceleration == 1000 && second_interval <= 1){
                        acceleration == 1000
                        second_interval == 1
                    }

                    // obstacle acceleration will increase and the spawning interval will decrease
                    //but only if the score increases
                    else if(score > score - 1){
                        acceleration = acceleration + 10;
                        second_interval = second_interval - .05
                    }
                    let obstacles = randi(0,3);
                    
                    if (obstacles == 0){
                        //add obstacle
                        const obstacle = add([
                            rect(48, rand(50,100)),
                            area(),
                            outline(4),
                            pos(width(), height() - FLOOR_HEIGHT),
                            anchor("botleft"), 
                            move(LEFT, acceleration),
                            "obstacle",
                        ])

                        const collectable = add([
                            rect(50, 50),
                            area(),
                            outline(4),
                            pos(width(), obstacle.height + rand(250,300)),
                            anchor("botleft"), 
                            move(LEFT, acceleration),
                            "collectable",
                        ])

                    }
                    else if(obstacles == 1){
                        add([
                            rect(100, rand(50,100)),
                            area(),
                            outline(4),
                            pos(width(), height() - FLOOR_HEIGHT),
                            anchor("botleft"), 
                            move(LEFT, acceleration),
                            "obstacle",
                        ])
                    }
                    else if(obstacles == 2){
                        add([
                            rect(150, rand(50,100)),
                            area(),
                            outline(4),
                            pos(width(), height() - FLOOR_HEIGHT),
                            anchor("botleft"), 
                            move(LEFT, acceleration),
                            "obstacle",
                        ])
                        add([
                            rect(150, 50),
                            area(),
                            outline(4),
                            pos(width(), height() - FLOOR_HEIGHT - 50),
                            anchor("botleft"), 
                            move(LEFT, acceleration),
                            "jumpPad",
                        ])
                        add([
                            rect(300, 20),
                            area(),
                            outline(4),
                            pos(width() + 500, height() - FLOOR_HEIGHT - 300),
                            anchor("botleft"), 
                            body({ isStatic: true }),
                            move(LEFT, acceleration),
                            "upperFloor",
                        ])
                    }

                    //spawn obstacle at random interval
                    wait(rand(1, second_interval) , spawnObstacle);
                }
                spawnObstacle();

                //prevent player from exiting game screen
                onUpdate(() => {
                    distance++
                    distanceLabel.text = "Distance: " + distance;
                    if(player.pos.x < 0){
                        player.pos.x = 1
                    }
                    if(player.pos.x > 870){
                        player.pos.x = 870
                    }
                })

                //if player collides with box above obstacle, increase the score
                player.onCollide("collectable", (collectable) => {
                        score++;
                        scoreLabel.text = "Score: " + score;
                        destroy(collectable)
                })

                player.onCollide("jumpPad", () => {
                    player.jump(JUMP_PAD_FORCE)
                })

                //if player collides with obstacle, move to lose scene
                player.onCollide("obstacle", () => {
                    go("lose", score);
                })

            });

            scene("lose", () => {

                // display score
                add([
                    text("Score: " + score, {
                        font: "test",
                        size: 30
                    }),
                    pos(width() / 2, height() / 2 - 80),
                    scale(2),
                    anchor("center"),
                ]);

                // display distance
                add([
                    text("Distance: " + distance, {
                        font: "test",
                        size: 30
                    }),
                    pos(width() / 2, height() / 2 - 160),
                    scale(2),
                    anchor("center"),
                ]);

                // display try again message
                add([
                    text("Press Space To Retry!", {
                        font: "test",
                        size: 30
                    }),
                    pos(width() / 2, height() / 2 + 200),
                    scale(2),
                    anchor("center"),
                ]);

                // go back to game with space is pressed
                onKeyPress("space", () => go("game"))

                // reset obstacle acceleration and interval
                onKeyPress("space", () => acceleration = 500, second_interval = 2);
            });

            //title screen
            scene("title", () => {

                //set cursor to default on frame start
                onUpdate(() => setCursor("default"))

                let background = add([
                    sprite("paperTex"),
                    pos(width() / 2, height() / 2),
                    anchor("center"),
                    // Allow the background to be scaled
                    scale(1),
                    // Keep the background position fixed even when the camera moves
                    fixed()
                ])
                //add title
                const title = add ([
                    text("DINO DASH",{
                        font: "test",
                        size: 60
                    }),
                    pos(width() / 2, height() / 2 - 150),
                    anchor("center"),
                    outline(),
                ])

                let controls = add([
                    sprite("controls"),
                    pos(width() / 2, height() / 2 + 200),
                    anchor("center"),
                    // Allow the background to be scaled
                    scale(1),
                    // Keep the background position fixed even when the camera moves
                    fixed()
                ])

                //update title every frame
                onUpdate (() => {
                    const t = time() * 10
                    title.color = hsl2rgb ((t/100) % 1,0.7,0.8)
                    title.scale = wave(1.5,1.6, (t/1))
                })

                //add button
                const button = add([
                    rect(200,50, {radius: 8}),
                    outline(5),
                    pos(width() / 2, height() / 2),
                    area({cursor: "pointer"}), 
                    anchor("center"),
                ]);

                //add button text
                button.add([
                    text("start", {
                        font: "test",
                        size: 20
                    }),
                    anchor("center"),
                    color(0,0,0)
                ])

                //on button click start the game
                button.onClick(() => go("game"));

                //update the button every frame when its being hovered over
                button.onHoverUpdate(() => {
                    setCursor("pointer")
                    button.color = rgb (
                        100,
                        255,
                        34,
                    )
                    button.scale = vec2(1.5)
                })

                //update button when its no longer being hovered over
                button.onHoverEnd(() => {
                    button.color = rgb (
                        255,
                        255,
                        255,
                    )
                    button.scale = vec2(1)
                })
            });

            //set scene to title
            go("title");