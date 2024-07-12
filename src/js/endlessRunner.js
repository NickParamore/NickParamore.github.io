import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

            let gameSize = 1
            // initialize kaboom context
            let k = kaboom({
                height:700,
                width: 1000,
                canvas: document.querySelector('#gameCanvas'),
                background: [ 200, 200, 255, ], 
                scale: gameSize
            });
            debug.inspect = false
            //initialize variables
            const JUMP_FORCE = 820;
            const PLAYER_SPEED = 480;
            const FLOOR_HEIGHT = 40;
            let acceleration = 500;
            let distance = 0;
            let score = 0;
            let interval = 2;
            let leavesSpeed = 2;
            let floorSpeed = 3;
            let backgroundSpeed = 1;
            let dinoSpeed = 10;
            let power = 0;
            let isBig = false;

            //define obstacle objects so we can delete them later
            let obstacle = add([]);
            let obstacle2 = add([]);
            let obstacle3 = add([]);
            let collectable = add([]);

            // load assets
            loadSprite("dino", "../images/playerAnimation-01.png", {
                sliceX: 8,
                sliceY: 1,
                anims: {
                    run: {
                        from: 0,
                        to: 7,
                        speed: dinoSpeed,
                    },
                },
            }),
            loadSprite("controls", "../images/controls-01.png");
            loadSprite("paperTex", "../images/paperTexture-03.png");
            loadSprite("leaves", "../images/leaves-01.png");
            loadSprite("floor", "../images/floor-01.png");
            loadSprite("rocks","../images/rocks-01.png");
            loadSprite("bush","../images/bush-01.png");
            loadSprite("plant","../images/plant-01.png");
            loadSprite("pineapple","../images/pineapple-01.png");
            loadFont("test", "../images/Bungee-Regular.ttf");
            loadSound("jump", "../images/jump2.mp3")
            loadSound("chomp", "../images/chomp.mp3")
            loadSound("power", "../images/power.mp3")
            loadSound("gameover", "../images/gameOver.mp3")
            loadSound("rockBreak", "../images/rockBreak.mp3")
            loadSound("plantBreak", "../images/plantBreak.mp3")
            loadSound("gameStart", "../images/gameStart.mp3")


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
                let leavesBackground = add([
                    sprite("leaves"),
                    pos(500, height() - 550),
                    anchor("center"),
                    // Allow the background to be scaled
                    scale(1),
                    // Keep the background position fixed even when the camera moves
                    fixed()
                ])
                let leavesBackground2 = add([
                    sprite("leaves"),
                    pos(1500, height() - 550),
                    anchor("center"),
                    // Allow the background to be scaled
                    scale(1),
                    // Keep the background position fixed even when the camera moves
                    fixed()
                ])

                //parallax scrolling for background
                onUpdate(() => {
                    if(background.pos.x < -500 ){
                        background.pos.x = background2.pos.x + (1000 - backgroundSpeed)
                        //need to use background width - speed otherwise there will be a gap
                    }
                    else{
                        background.pos.x = background.pos.x - backgroundSpeed
                    }
                    if(background2.pos.x < -500){
                        background2.pos.x = background.pos.x + (1000 - backgroundSpeed)
                    }
                    else{
                        background2.pos.x = background2.pos.x - backgroundSpeed
                    }
                    //parallax for leaves
                    if(leavesBackground.pos.x < -500 ){
                        leavesBackground.pos.x = leavesBackground2.pos.x + (1000 - leavesSpeed)
                    }
                    else{
                        leavesBackground.pos.x = leavesBackground.pos.x - leavesSpeed
                    }
                    if(leavesBackground2.pos.x < -500){
                        leavesBackground2.pos.x = leavesBackground.pos.x + (1000 - leavesSpeed)
                    }
                    else{
                        leavesBackground2.pos.x = leavesBackground2.pos.x - leavesSpeed
                    }
                    //parallax for floor
                    if(floorBackground.pos.x < -500 ){
                        floorBackground.pos.x = floorBackground2.pos.x + (1000 - floorSpeed)
                    }
                    else{
                        floorBackground.pos.x = floorBackground.pos.x - floorSpeed
                    }
                    if(floorBackground2.pos.x < -500){
                        floorBackground2.pos.x = floorBackground.pos.x + (1000 - floorSpeed)
                    }
                    else{
                        floorBackground2.pos.x = floorBackground2.pos.x - floorSpeed
                    }
                })

                //set score to 0 and add it to the screen
                distance = 0
                power = 0
                const distanceLabelBack = add([
                    rect(300,50),
                    pos(25, 25),
                    color(0,0,0)
                ]);
                const distanceLabel = add([
                    text("Distance: " + distance,{
                        font: "test",
                        size: 30,
                        color: 'white',
                        outline: 1
                    }),
                    pos(35, 35),
                ]);
                const powerBarBorder = add([
                    rect(250,50),
                    pos(700, 25),
                    color(0,0,0)
                ]);
                const powerBarBack = add([
                    rect(240,40),
                    pos(705, 30),
                    color(255,255,255)
                ]);
                const powerBar = add([
                    rect(power,40),
                    pos(705, 30),
                    color(255,255,0)
                ]);

                //set gravity
                setGravity(1600);

                //initialize player
                var player = add([
                    sprite("dino"),
                    pos(100, 200),
                    area(),
                    body(),
                    scale(.6),
                    
                ])
                player.play("run")
                player.onAnimEnd(() => {player.play("run", { speed: dinoSpeed })})
                //add floor
                add([
                    rect(width(), FLOOR_HEIGHT,),
                    pos(0, height()),
                    anchor("botleft"),
                    area(),
                    body({ isStatic: true }),
                ]);
                //make sure to add the sprites after the floor so they appear on top
                let floorBackground = add([
                    sprite("floor",),
                    pos(500, 650),
                    anchor("center"),
                    // Allow the background to be scaled
                    scale(1),
                    // Keep the background position fixed even when the camera moves
                    fixed()
                ])
                let floorBackground2 = add([
                    sprite("floor"),
                    pos(1500, 650),
                    anchor("center"),
                    // Allow the background to be scaled
                    scale(1),
                    // Keep the background position fixed even when the camera moves
                    fixed()
                ])

                //*******Start player movement*******//
                onKeyPress("space", () => {
                    if (player.isGrounded()) {
                        player.jump(JUMP_FORCE);
                        play("jump", {
                            volume: 0.3
                        })
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
                   
                    
                    //if acceleration reaches 1000 it will stay 1000
                    if (acceleration == 1000){
                        acceleration == 1000;
                        
                    }

                    // obstacle acceleration will increase each loop around
                    else {
                        acceleration = acceleration + 10;
                    }
                    let obstacles = randi(0,3);
                    
                    if (obstacles == 0){
                        //add obstacle
                        obstacle = add([
                            sprite("plant"),
                            area(),
                            outline(4),
                            pos(width(), height() - FLOOR_HEIGHT),
                            anchor("botleft"), 
                            move(LEFT, acceleration),
                            "obstacle",
                        ])
                        //destroy obstacle when it leaves the screen
                        onUpdate(() => {if(obstacle.pos.x < -200){
                            destroy(obstacle)
                        }})
                        let powerChance = randi(0,5);
                        console.log(powerChance)
                        if (powerChance == 1){
                            collectable = add([
                                sprite("pineapple"),
                                area(),
                                outline(4),
                                pos(width() + obstacle.width/3, obstacle.height + rand(250,300)),
                                anchor("botleft"), 
                                move(LEFT, acceleration),
                                "collectable",
                            ])
                            onUpdate(() => {if(collectable.pos.x < -200){
                                destroy(collectable)
                            }})
                        }

                    }
                    else if(obstacles == 1){
                        obstacle2 = add([
                            sprite("bush"),
                            area(),
                            pos(width(), height() - FLOOR_HEIGHT),
                            anchor("botleft"), 
                            move(LEFT, acceleration),
                            "obstacle2",
                        ])
                        onUpdate(() => {if(obstacle2.pos.x < -200){
                            destroy(obstacle2)
                        }})

                        let powerChance = randi(0,5);
                        console.log(powerChance)
                        if (powerChance == 1){
                            collectable = add([
                                sprite("pineapple"),
                                area(),
                                outline(4),
                                pos(width() + obstacle2.width/3, obstacle2.height + rand(250,300)),
                                anchor("botleft"), 
                                move(LEFT, acceleration),
                                "collectable",
                            ])
                            onUpdate(() => {if(collectable.pos.x < -200){
                                destroy(collectable)
                            }})
                        }
                    }
                    
                    else if(obstacles == 2){
                        obstacle3 = add([
                            sprite("rocks"),
                            area(),
                            pos(width(), height() - FLOOR_HEIGHT),
                            anchor("botleft"), 
                            move(LEFT, acceleration),
                            "obstacle3"
                        ])
                        onUpdate(() => {if(obstacle3.pos.x < -200){
                            destroy(obstacle3)
                        }})

                        let powerChance = randi(0,5);
                        if (powerChance == 1){
                            collectable = add([
                                sprite("pineapple"),
                                area(),
                                outline(4),
                                pos(width() + obstacle3.width/3, obstacle3.height + rand(250,300)),
                                anchor("botleft"), 
                                move(LEFT, acceleration),
                                "collectable",
                            ])
                            onUpdate(() => {if(collectable.pos.x < -200){
                                destroy(collectable)
                            }})
                        }

                    }
                    
                    //spawn obstacle at certain interval then subtract from it
                    wait(interval , spawnObstacle);
                    interval = interval - 0.02;
                    //make sure interval doesn't go lower than 1
                    if (interval < 1.3){
                        interval = 1.3; 
                    }
                    console.log(interval)

                    //make sure speeds are capped
                    if (dinoSpeed > 15){
                        dinoSpeed = 15;
                    }
                    if (leavesSpeed > 5){
                        leavesSpeed = 5;
                    }
                    if (floorSpeed > 6){
                        floorSpeed = 6;
                    }
                    if (backgroundSpeed > 4){
                        backgroundSpeed = 4;
                    }
                    //increase all speed variables
                    dinoSpeed = dinoSpeed + 0.2;
                    leavesSpeed = leavesSpeed + 0.10;
                    floorSpeed = floorSpeed + 0.10;
                    backgroundSpeed = backgroundSpeed + 0.10;
                    
                }
                spawnObstacle();

                //check power and key press for big mode
                //increase distance
                //prevent player from exiting game screen
                onUpdate(() => {
                    if(power == 240){
                        power = 0;
                        powerBar.width = power;
                        play("power", {
                            volume: 0.30
                        })
                        isBig = true;
                        player.scaleTo(1)
                        wait(10,() => {
                            isBig = false;
                            player.scaleTo(.6)
                        })
                    }   

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
                        if(powerBar.width < 240){
                            power = power + 40
                            powerBar.width = power
                        }
                        play("chomp")
                        destroy(collectable)
                })

                //if player collides with obstacle, move to lose scene
                player.onCollide("obstacle", (obstacle) => {
                    if(isBig){
                        play('plantBreak'),
                        destroy(obstacle)           
                    }else{
                        play('gameover')
                        go("lose", score);
                    }
                })
                player.onCollide("obstacle2", (obstacle2) => {
                    if(isBig){
                        play('plantBreak'),
                        destroy(obstacle2)           
                    }else{
                        play('gameover')
                        go("lose", score);
                    }
                })
                player.onCollide("obstacle3", (obstacle3) => {
                    if(isBig){
                        play('rockBreak', {
                            volume: .3
                        }),
                        destroy(obstacle3)           
                    }else{
                        play('gameover')
                        go("lose", score);
                    }
                })

            });

            scene("lose", () => {

                let background = add([
                    sprite("paperTex"),
                    pos(width() / 2, height() / 2),
                    anchor("center"),
                    // Allow the background to be scaled
                    scale(1),
                    // Keep the background position fixed even when the camera moves
                    fixed()
                ])
                // display distance
                add([
                    text("Distance: " + distance, {
                        font: "test",
                        size: 40,
                        color: 'white',
                        outline: 1
                    }),
                    pos(width() / 2, height() / 2 - 100),
                    scale(2),
                    anchor("center"),
                ]);

                // display try again message
                add([
                    text("Press Space To Retry!", {
                        font: "test",
                        size: 30,
                        color: 'white',
                        outline: 1
                    }),
                    pos(width() / 2, height() / 2 + 200),
                    scale(2),
                    anchor("center"),
                ]);

                // go back to game with space is pressed
                onKeyPress("space", () => {
                    play('gameStart')
                    go("game")
                })

                // reset obstacle acceleration and interval
                onKeyPress("space", () => acceleration = 500, interval = 2, dinoSpeed = 10, leavesSpeed = 2, floorSpeed = 3, backgroundSpeed = 1, isBig = false);
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
                let leaves = add([
                    sprite("leaves"),
                ])
                //add title
                const title = add ([
                    text("DINO DASH",{
                        font: "test",
                        size: 60,
                        letterSpacing: 4,
                        

                        
                    }),
                    pos(width() / 2, height() / 2 - 120),
                    anchor("center"),
                    outline(),
                    color(240,255,0)
                ])

                onCharInput((ch) => {
                    input.text += ch
                })

                let controls = add([
                    sprite("controls"),
                    pos(width() / 2, height() / 2 + 200),
                    anchor("center"),
                    // Allow the background to be scaled
                    scale(.8),
                    // Keep the background position fixed even when the camera moves
                    fixed()
                ])

                //update title every frame
                onUpdate (() => {
                    const t = time() * 10
                    title.scale = wave(1.5,1.6, (t/1))
                })

                //add button
                const button = add([
                    rect(200,50),
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
                button.onClick(() => {
                    play('gameStart')
                    go("game")
                });

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