    let container = document.getElementById("container");
    let size = 1000;
    container.style.width = size + "px";
    container.style.height = size + "px";
    let boxSize = 25;
    let rowNumber = size / boxSize;
    let boxNumber = rowNumber * rowNumber;
    for (let i = 0;i < boxNumber;i++) {
      let div = document.createElement("div");
      div.style.width = boxSize - 2 + "px";
      div.style.height = boxSize - 2 + "px";
      container.appendChild(div);
    }
    let boxes = document.querySelectorAll("#container div");

    class Shooter {
    	constructor(grid_x,grid_y,head,body,faceAt) {
    		this.facingAt = faceAt;
    		this.body = body;
    		this.grid_x = grid_x;
    		this.grid_y = grid_y;
    		this.head = head;
    		this.bullets = [];
    		this.delay = {
    			timer : 0,
    			target : 30
    		}
    		this.goto = {
    			left : false,
    			up : false,
    			right : false,
    			down : false
    		};
    	}

    	update_facingAt(head,body,faceTo) {
    		if (faceTo == this.facingAt) return;
    		this.head = head;
    		this.body = body;
        this.facingAt = faceTo;
    	}

    	move_to(to) {
        this.reset_direction();
        this.goto[to] = true;
    	}

    	reset_direction() {
    		for (let direction in this.goto) {
        	this.goto[direction] = false;
        }
    	}

    	update_grid(addX,addY) {
    		this.delay.timer++;
    		if (this.delay.timer < this.delay.target) return;
    		this.delay.timer = 0;
    		if ((addX < 0 && this.grid_x % rowNumber == 0) ||
    		   (addX > 0 && this.grid_x % rowNumber == rowNumber - 3)) addX = 0;
    		if ((addY > 0 && this.grid_y == rowNumber - 3) ||
    		   (addY < 0 && this.grid_y == 0)) addY = 0;
        this.grid_x += addX;
        this.grid_y += addY;
    	}

    	get_body_part(x,y) {
    		return this.grid_x + (this.grid_y * rowNumber) + x + (y * rowNumber);
    	}

    	draw() {
    		for (let y = 0;y < this.body.length;y++) {
    			for (let x = 0;x < this.body[y].length;x++) {
    				if (this.body[y][x] == 1) {
              let index = this.grid_x + (this.grid_y * rowNumber) + x + (y * rowNumber);
              boxes[index].classList.add("shooter");
    				}
    			}
    		}
    	}

    	shoot() {
    		let head = this.get_body_part(this.head[0],this.head[1]);
        let x = head % rowNumber;
        let y = Math.floor(head / rowNumber);
    		let bullet = new Bullet(x,y);
    	  switch (this.facingAt) {
    	    case "left" :
    	      bullet.addX = -1;
    	      break;
    	    case "up" :
    	      bullet.addY = -1;
    	      break;
    	    case "right" :
    	      bullet.addX = 1;
    	      break;
    	    case "down" :
    	      bullet.addY = 1;
    	      break; 
    	  }
    	  this.bullets.push(bullet);
    	}

    	update_bullets() {
    		let bulletsToRemove = [];
    		for (let i = 0;i < this.bullets.length;i++) {
    			let bullet = this.bullets[i];
    			if (bullet.isExceed()) {
    				bulletsToRemove.push(bullet);
    				continue;
    			}
    			bullet.update();
    		}
        for (let i = 0;i < bulletsToRemove.length;i++) {
        	let bullet = bulletsToRemove[i];
        	let index = this.bullets.indexOf(bullet);
        	this.bullets.splice(index,1);
        }
    	}

    	turn_off_direction(direction) {
    		this.goto[direction] = false;
    	}

    	update_position() {
    		let {left,up,right,down} = this.goto;
    		if (left) this.update_grid(-1,0);
      	if (up) this.update_grid(0,-1);
      	if (right) this.update_grid(1,0);
      	if (down) this.update_grid(0,1);
    	}

    	update() {
    		this.update_bullets();
    		this.update_position();
    		this.draw();
    		document.getElementById("bullets").innerText = this.bullets.length;
    	}
    }
    let shooter = new Shooter(rowNumber - (rowNumber / 2),rowNumber - 3,[1,0],[
         [0,1,0],
         [1,1,1],
         [1,0,1]
    	 ],"up");
    let shooter2 = new Shooter(rowNumber - (rowNumber / 2),rowNumber - 3,[1,0],[
         [0,1,0],
         [1,1,1],
         [1,0,1]
    	 ],"up");
    
    class Bullet {
    	constructor(x,y) {
        this.x = x;
        this.y = y;
        this.addX = this.addY = 0;
        this.timer_delay = 0;
        this.delay = 10;
        this.remove = false;
    	}

    	isExceed() {
    		if ((this.x % rowNumber == 0) ||
    			  (this.x % rowNumber == rowNumber - 1) ||
    			  (this.y == 0) ||
    			  (this.y == rowNumber - 1)) return true;
    	  return false;
    	}

    	update() { 
    	  this.timer_delay++;
    	  if (this.timer_delay == this.delay) { 
    	    this.x += this.addX;
    	    this.y += this.addY;
    	    this.timer_delay = 0;
    	  }
        let index = (this.y * rowNumber) + this.x;
    		boxes[index].classList.add("bullet");
    	}
    }
    
    function clearScreen() {
    	for (let i = 0;i < boxes.length;i++) {
    		boxes[i].classList.remove("shooter","bullet");
    	}
    }

    function animate() {
      clearScreen();
      
      shooter.update();
      shooter2.update();
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
    
    window.addEventListener("keydown",function(event) {
    	event.preventDefault()
    	switch (event.keyCode) {
         case 37:
         	shooter.update_facingAt([0,1],[
         		[0,1,1],
         		[1,1,0],
         		[0,1,1]
         	],"left");
         	shooter.move_to("left");
         	break;
         case 38:
         	shooter.update_facingAt([1,0],[
         		[0,1,0],
         		[1,1,1],
         		[1,0,1]
         	],"up");
         	shooter.move_to("up");
         	break;
         case 39:
         	shooter.update_facingAt([2,1],[
         		[1,1,0],
         		[0,1,1],
         		[1,1,0]
         	],"right");
         	shooter.move_to("right");
         	break;
         case 40:
         	shooter.update_facingAt([1,2],[
         		[1,0,1],
         		[1,1,1],
         		[0,1,0]
         	],"down");
         	shooter.move_to("down");
         	break;
         case 13:
         	shooter.shoot();
         	break;
         case 65:
         	shooter2.update_facingAt([0,1],[
         		[0,1,1],
         		[1,1,0],
         		[0,1,1]
         	],"left");
         	shooter2.move_to("left");
         	break;
         case 87:
         	shooter2.update_facingAt([1,0],[
         		[0,1,0],
         		[1,1,1],
         		[1,0,1]
         	],"up");
         	shooter2.move_to("up");
         	break;
         case 68:
         	shooter2.update_facingAt([2,1],[
         		[1,1,0],
         		[0,1,1],
         		[1,1,0]
         	],"right");
         	shooter2.move_to("right");
         	break;
         case 83:
         	shooter2.update_facingAt([1,2],[
         		[1,0,1],
         		[1,1,1],
         		[0,1,0]
         	],"down");
         	shooter2.move_to("down");
         	break;
         case 32:
         	shooter2.shoot();
         	break;
    	}      
    });


    window.onkeyup = function (event) {
    	switch (event.keyCode) {
    	  case 37 :
    	  	shooter.turn_off_direction("left");
    	  	break;
    	  case 38 :
    	  	shooter.turn_off_direction("up");
    	  	break;
    	  case 39 :
    	  	shooter.turn_off_direction("right");
    	  	break;
    	  case 40 :
    	  	shooter.turn_off_direction("down");
    	  	break;
    	  case 65 :
    	  	shooter2.turn_off_direction("left");
    	  	break;
    	  case 87 :
    	  	shooter2.turn_off_direction("up");
    	  	break;
    	  case 68 :
    	  	shooter2.turn_off_direction("right");
    	  	break;
    	  case 83 :
    	  	shooter2.turn_off_direction("down");
    	  	break;
    	}
    }
   