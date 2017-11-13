function avator(width , height ,positon ,src){
	var image = getImage(src);
	o = {
		image : image,
		width : width,
		height : height,
		positionX : positon.x,
		positionY : positon.y,
	}

	o.path = 0;

	o.transformSize = function(speed , mixSize=100 , maxSize = 600 ){
		if (o.width >= mixSize + speed  && o.width <= maxSize - speed) {
			o.width += speed;
		}
		if (o.height >= mixSize + speed && o.height <= maxSize - speed) {
			o.height += speed;
		}
	}

	o.move = function(speedX , speedY) {
		o.positionX += speedX;
		o.positionY += speedY;
	}

	return o;
}