var Vector = function(x,y,z){
            this.x = x;
            this.y = y;
            this.z = z;
            this._get2d = function(){
                var scale = fallLength/(fallLength+this.z);
                var x = centerX + this.x*scale;
                var y = centerY + this.y*scale;
                return {x:x , y:y};
            }
        }

var Face = function(vector1,vector2,vector3,vector4,color){
            this.v1 = vector1;
            this.v2 = vector2;
            this.v3 = vector3;
            this.v4 = vector4;
            this.color = color;
            this.zIndex = (this.v1.z + this.v2.z + this.v3.z + this.v4.z)/4;
            this.draw = function(){
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(this.v1._get2d().x , this.v1._get2d().y);
                ctx.lineTo(this.v2._get2d().x , this.v2._get2d().y);
                ctx.lineTo(this.v3._get2d().x , this.v3._get2d().y);
                ctx.lineTo(this.v4._get2d().x , this.v4._get2d().y);
                ctx.closePath();
                // ctx.fillStyle = "rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+",0.2)";
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

var Cube = function(length){
            this.length = length;
            this.faces = [];
            this.vectors = [];
        }
        Cube.prototype = {
            _initVector:function(){
                this.vectors[0] = new Vector(-this.length/2 , -this.length/2 , this.length/2);
                this.vectors[1] = new Vector(-this.length/2 , this.length/2 , this.length/2); 
                this.vectors[2] = new Vector(this.length/2 , -this.length/2 , this.length/2); 
                this.vectors[3] = new Vector(this.length/2 , this.length/2 , this.length/2); 
                this.vectors[4] = new Vector(this.length/2 , -this.length/2 , -this.length/2);
                this.vectors[5] = new Vector(this.length/2 , this.length/2 , -this.length/2);
                this.vectors[6] = new Vector(-this.length/2 , -this.length/2 , -this.length/2);
                this.vectors[7] = new Vector(-this.length/2 , this.length/2 , -this.length/2);
            },
            _draw:function(){
                this.faces[0] = new Face(this.vectors[0] , this.vectors[1] , this.vectors[3] , this.vectors[2] , "#6c6");
                this.faces[1] = new Face(this.vectors[2] , this.vectors[3] , this.vectors[5] , this.vectors[4] , "#6cc");
                this.faces[2] = new Face(this.vectors[4] , this.vectors[5] , this.vectors[7] , this.vectors[6] , "#cc6");
                this.faces[3] = new Face(this.vectors[6] , this.vectors[7] , this.vectors[1] , this.vectors[0] , "#c6c");
                this.faces[4] = new Face(this.vectors[1] , this.vectors[3] , this.vectors[5] , this.vectors[7] , "#666");
                this.faces[5] = new Face(this.vectors[0] , this.vectors[2] , this.vectors[4] , this.vectors[6] , "#ccc");

                this.faces.sort(function(a , b){
                    return b.zIndex - a.zIndex;
                });
                this.faces.foreach(function(){
                    this.draw();
                })
            }
        }


// if("addEventListener" in window){
//             window.addEventListener("mousemove" , function(event){
//                 var x = event.clientX - canvas.offsetLeft - centerX;
//                 var y = event.clientY - canvas.offsetTop - centerY;
//                 angleY = x*0.0001;
//                 angleX = y*0.0001;
//             });
//         }
//         else {
//             window.attachEvent("onmousemove" , function(event){
//                 var x = event.clientX - canvas.offsetLeft - centerX;
//                 var y = event.clientY - canvas.offsetTop - centerY;
//                 angleY = x*0.0001;
//                 angleX = y*0.0001;
//             });
//         }
        

function rotateX(vectors){
    var cos = Math.cos(angleX);
    var sin = Math.sin(angleX);
    vectors.foreach(function(){
        var y1 = this.y * cos - this.z * sin;
        var z1 = this.z * cos + this.y * sin;
        this.y = y1;
        this.z = z1;
    });
}

function rotateY(vectors){
    var cos = Math.cos(angleY);
    var sin = Math.sin(angleY);
    vectors.foreach(function(){
        var x1 = this.x * cos - this.z * sin;
        var z1 = this.z * cos + this.x * sin;
        this.x = x1;
        this.z = z1;
    })
}

        

        cube = new Cube(80);
        cube._initVector();
        function initAnimate(){
            cube._draw();

            animate();
        }

        function animate(){
            ctx.clearRect(0,0,canvas.width,canvas.height)
            
            rotateY(cube.vectors);
            rotateX(cube.vectors);
            cube._draw();
            if("requestAnimationFrame" in window){
                requestAnimationFrame(animate);
            }
            else if("webkitRequestAnimationFrame" in window){
                webkitRequestAnimationFrame(animate);
            }
            else if("msRequestAnimationFrame" in window){
                msRequestAnimationFrame(animate);
            }
            else if("mozRequestAnimationFrame" in window){
                mozRequestAnimationFrame(animate);
            }
            else {
                setTimeout(animate , 16);
            }
        }
