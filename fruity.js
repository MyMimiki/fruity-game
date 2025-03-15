    let keySpace = false;
    let keyEnter = false;
    let keyLeft = false;
    let keyRight = false;
    let canvas;
    let ctx;
    let gameOver = false;
    let score = 0;   
    
    let basket = {
        x: 360,
        y: 420,
        width: 120,
        height: 85,
        src: 'img/basket.png',
        img: new Image(),
    }

    let apples = [];
    let oranges = [];
    let pears = [];
    let hearts = [];
    let scoreEffects = [];

    let gameInterval;
    let appleInterval;
    let orangeInterval;
    let pearInterval;
    let collisionInterval;

    //VERHALTEN WENN TASTEN GEDRÜCKT
    document.onkeydown = function(e){

        if(e.code === "Space"){
            keySpace = true;
        }

        if(e.code === "ArrowLeft"){
            keyLeft = true;
        }

        if(e.code  === "ArrowRight"){
            keyRight = true;
        }

        if(e.code === "Enter"){
            keyEnter = true;
        }
    }

    //VERHALTEN WENN TASTEN NICHT MEHR GEDRÜCKT
    document.onkeyup = function(e){
        
        if(e.code  === "Space"){
            keySpace = false;
        }

        if(e.code  === "ArrowLeft"){
            keyLeft = false;
        }

        if(e.code  === "ArrowRight"){
            keyRight = false;
        }

        if(e.code === "Enter"){
            keyEnter = false;
        }
    }

    function CatchTheApples(){
        document.getElementById ('startGameDiv').style.display = 'block';
    }

    function startGame(){
        document.getElementById ('startGameDiv').style.display = 'none';
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        loadImages();

        gameInterval = setInterval(update, 1000/25)
        appleInterval = setInterval(createApples, 3000);
        orangeInterval = setInterval(createOranges, 2000);
        pearInterval = setInterval(createPears, 4500);
        collisionInterval = setInterval(checkForCollision, 1000/25);
        draw();
        createHearts();
    }

    function clearIntervals(){
        clearInterval(gameInterval);
        clearInterval(appleInterval);
        clearInterval(orangeInterval);
        clearInterval(pearInterval);
        clearInterval(collisionInterval);
    }

    function checkForCollision(){
        oranges.forEach(function(orange, i){
            if(basket.x + basket.height > orange.x
            && basket.y + basket.width > orange.y
            && basket.x < orange.x + orange.height
            && basket.y < orange.y + orange.width
            && orange.y + orange.height <= canvas.height
            ){

                oranges.splice(i, 1);
            
            if(hearts.length > 0)
                hearts.pop();

            if(hearts.length === 0)
                gameOverScreen();

            showBrokenHeart(orange.x, orange.y);  
         }


        apples.forEach(function(apple, i){
            if(basket.x + basket.width > apple.x
            && basket.y + basket.height > apple.y
            && basket.x < apple.x + apple.width
            && basket.y < apple.y + apple.height
            && apple.y + apple.height <= canvas.height
            ){
                updateScore(10);
                showScoreEffect(apple.x, apple.y, 10);
                apples.splice(i, 1);
            }

        pears.forEach(function(pear, i){
            if(basket.x + basket.width > pear.x
            && basket.y + basket.height > pear.y
            && basket.x < pear.x + pear.width
            && basket.y < pear.y + pear.height
            && pear.y + pear.height <= canvas.height
            ){
                pears.splice(i, 1);

            if(hearts.length > 0)
                hearts.pop();

            if(hearts.length === 0)
                gameOverScreen();

            showBrokenHeart(pear.x, pear.y);
            } 

        });    
        })});
    }

    function createOranges(){
        let orange = {
        x: Math.random() * (canvas.width - 100),
        y: -20,
        width: 40,
        height: 40,
        src: 'img/orange.png',
        img: new Image(),
    };
        orange.img.src = orange.src;
        oranges.push(orange);
    }

    function createApples(){
        let apple = {
        x: Math.random() * (canvas.width - 100),
        y: -20,
        width: 40,
        height: 40,
        src: 'img/apple.png',
        img: new Image(),
    };
        apple.img.src = apple.src;
        apples.push(apple);
    }

    function createPears(){
        let pear = {
        x: Math.random() * (canvas.width - 100),
        y: -20,
        width: 40,
        height: 50,
        src: 'img/pear.png',
        img: new Image(),
    };
        pear.img.src = pear.src;
        pears.push(pear);
    }

    function createHearts(){
        for(let i = 0; i < 3; i++){
            let heart = {
            x: 10 + i*40,
            y: 10,
            width: 30,
            height: 30,
            src: 'img/heart.png',
            img: new Image(),
            }
            heart.img.src = heart.src;
            hearts.push(heart);
        }
    }

    function showScoreEffect(x,y,points){
        let scoreEffect = {
            x: x,
            y: y -10,
            points: points,
            lifetime: 1000, //Länge der Anzeige in Millisekunden
            startTime: Date.now(),
        }
        scoreEffects.push(scoreEffect);
        setTimeout(()=>{
            scoreEffects = scoreEffects.filter(effect => effect !== scoreEffect);
        }, scoreEffect.lifetime);
    }

    function showBrokenHeart(x, y) {
        let brokenHeart = {
            x: x,
            y: y -10,
            img: new Image(),
            lifetime: 800,
            startTime: Date.now(),
        }
        brokenHeart.img.src = 'img/brokenHeart.png';
        scoreEffects.push(brokenHeart)
        setTimeout(()=>{
            scoreEffects = scoreEffects.filter(effect => effect !== brokenHeart);
        }, brokenHeart.lifetime);
    }

    function updateScore(points){
        score += points;
        document.getElementById('scoreSpan').innerText = score;
    }

    function update(){
        if (gameOver) return;

        if(keyLeft && basket.x > 0){
            basket.x -= 8;
        }

        if(keyRight && basket.x + basket.width < canvas.width){
            basket.x += 8;
        }

        oranges.forEach(function(orange){
            orange.y += 3;
        })

        apples.forEach(function(apple){
            apple.y += 4;
        })

        pears.forEach(function(pear){
            pear.y += 2.5;
        })
    }

    function loadImages(){
        basket.img = new Image();
        basket.img.src = basket.src;
    }

    function draw(){
        if(gameOver) return;
        //ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)//nun im CSS eingefügt --> bessere Performance
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Verhindert Überlagerungen

        ctx.drawImage(basket.img, basket.x, basket.y, basket.width, basket.height);

        hearts.forEach(function(heart){
            ctx.drawImage(heart.img, heart.x, heart.y, heart.width, heart.height);
        });

        oranges.forEach(function(orange){
            ctx.drawImage(orange.img, orange.x, orange.y, orange.width, orange.height);

        });

        apples.forEach(function(apple){
            ctx.drawImage(apple.img, apple.x, apple.y, apple.width, apple.height);
        });

        pears.forEach(function(pear){
            ctx.drawImage(pear.img, pear.x, pear.y, pear.width, pear.height);
        });

        scoreEffects.forEach(function(effect){
            if(effect.points){
                ctx.font = '20px sans-serif';
                ctx.fillStyle = 'white';
                ctx.fillText('+' + effect.points, effect.x, effect.y)
            }else if(effect.img){
                ctx.drawImage(effect.img, effect.x, effect.y, 30, 30)
            }
        });
        
        requestAnimationFrame(draw);
    }


    function gameOverScreen(){
        clearIntervals();
        gameOver === true;
        document.getElementById('gameOverDiv').style.display = 'block';
    }

    function restartGame(){
        score = 0;
        gameOver = false;
        oranges =[];
        apples = [];
        pears = [];

        document.getElementById('scoreSpan').innerText = score;
        document.getElementById('gameOverDiv').style.display = 'none';
        startGame();
    }