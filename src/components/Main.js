require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';


//获取图片相关的数据
var imageDatas = require('json!../data/imageDatas.json');

//利用自执行函数，将图片信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr){
	for(var i = 0 , j = imageDatasArr.length; i < j ; i ++){
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/' 
			+ singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}

	return imageDatasArr;
})(imageDatas);

//自包含的imgFigure
var ImgFigure = React.createClass({
	render: function(){
		return (
				<figure>
					<img src = {this.props.data.imageURL}
						alt = {this.props.data.imageName}/>
					<figcaption>
						<h2>{this.props.data.title}</h2>
					</figcaption>
				</figure>
			)
	}
});

class AppComponent extends React.Component {
  render() {
  		var controllerUnits = [],
		imgFigures = [];

		imageDatas.forEach(function(value){
			imageFigures.push(<ImgFigure data = {value}>);
		});

    return (
     <section className = "stage">
     	<section className = "img-sec">
     		{imgFigures}
     	</section>
     	<nav className = "controller-nav"></nav>
     </section>
    )
  }
};

AppComponent.defaultProps = {
};

export default AppComponent;
