require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
var ReactDOM = require('react-dom');


//获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

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

function getRangeRandom(low , high) {
  return Math.floor(Math.random() * (high - low) + low);
}

//取得一个0-30°的旋转角度
function get30Deg() {
 return (Math.random() > 0.5 ? '' : '-') + Math.random() * 30;
}

//自包含的imgFigure
class ImgFigure  extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();

  }


	render(){
    var styleObj = {};
    var _this = this;
    //如果图片的props属性中指定了位置信息这应用这个位置信息
    if(this.props.arrange.pos){
        styleObj = this.props.arrange.pos;
    }

    //如果图片旋转角度不为0，则添加旋转角度
    if(this.props.arrange.rotate){
      (['MozTransform','msTransform','WebkitTransform',
        'transform']).forEach(function (value){
         styleObj[value] ='rotate(' + _this.props.arrange.rotate + 'deg)';
      })
    }

    var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    //居中的图片，zIndex设置为11
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }



    return (
				<figure className={imgFigureClassName} style = {styleObj} onClick={this.handleClick}>
					<img src = {this.props.data.imageURL}
						alt = {this.props.data.fileName}/>
					<figcaption >
						<h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back" onClick={this.handleClick}>
              <p>
                {this.props.data.desc}
              </p>
            </div>
					</figcaption>
				</figure>
			);
	}
}

  class ControllerUnit extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    //如果点击的是处于剧中态的按钮，则翻转图片，否则将对应的图片剧中
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();

  }
  render(){

    var controllerUnitClassNme = 'controller-unit';

    if(this.props.arrange.isCenter){
      controllerUnitClassNme += ' is-center';
    }

    if(this.props.arrange.isInverse){
      controllerUnitClassNme += ' is-inverse';
    }
    return (
      <span className={controllerUnitClassNme} onClick={this.handleClick}>

      </span>
      );

    }
  }

 class AppComponent extends React.Component{

  constructor(props){
    super(props);
    this.Constant ={
         centerPos:{
           left:0,
           top:0
         },
        hPosRange:{//水平方向上的取值范围
          leftSecX:[0,0],
          rightSecX:[0,0],
          y:[0,0]
        },
        vPosRange:{//垂直方向上的取值范围
          x:[0,0],
          topY:[0,0]
        }
      };
    this.state = {
          imgsArrangeArr : [
            /*{
              pos : {
                left : 0,
                top : 0
              },
              rotate :0,
              isInverse: false,
              isCenter: false

            }*/
          ]
        }
  }

    //组件加载以后为每个区域初始化取值
  componentDidMount(){
    //首先拿到舞台大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.floor(stageW / 2),
        halfStageH = Math.floor(stageH / 2);

    //拿到一个imgFigured的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgH = Math.floor(imgH / 2),
        halfImgW = Math.floor(imgW / 2);

    //计算中心区域的取值范围
    this.Constant.centerPos = {
      left : halfStageW - halfImgW,
      top : halfStageH - halfImgH
    };


    //计算水平方向的图片取值范围
    this.Constant.hPosRange = {
      leftSecX : [-halfImgW, halfStageW - halfImgW * 3],
      rightSecX : [halfStageW + halfImgW ,stageW - halfImgW],
      y : [-halfImgH,stageH - halfImgH]
    };

    //计算垂直方向图片排布位置的取值范围
    this.Constant.vPosRange = {
      x : [- halfImgW,stageW - halfImgW],
      topY : [- halfImgH , halfStageH - halfImgH * 3]
    };
  this.reArrange(0);
  }

  /**
   * 重新排布中心位置的图片
   * @param centerInext 位于中心的图片的序号
   */
  reArrange (centerInex){
    var imgsArrageArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeleftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeX = vPosRange.x,
        vPosRangeTopY = vPosRange.topY,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),//上方的图片数量为0个或者1个


        imgArrangeCenterArr = imgsArrageArr.splice(centerInex , 1);
        //居中centerIndex的图片,不需要旋转
        imgArrangeCenterArr[0] = {
          pos : centerPos,
          rotate : 0,
          isInverse : false,
          isCenter : true
        };


    //取出要布局在上侧的图片状态信息
    var topImgSpliceIndex = Math.floor(Math.random() *(imgsArrageArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrageArr.splice(topImgSpliceIndex , topImgNum);

    //给上侧图片初始化位置信息
    imgsArrangeTopArr.forEach(function(value , index){
      imgsArrangeTopArr[index]= {
        pos: {
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
        },
        rotate: get30Deg(),
        isInverse: false,
        isCenter: false
      }
    });

    //布局两侧的图片位置信息
    for( var i = 0 , j = imgsArrageArr.length , k = j / 2;
    i < j ; i++){

      var hPosRangeLoR = null;

      if( i < k){
        //左侧图片
        hPosRangeLoR = hPosRangeleftSecX;
      }else {
        //右侧图片
        hPosRangeLoR = hPosRangeRightSecX;
      }

      imgsArrageArr[i] ={
        pos : {
          left: getRangeRandom(hPosRangeLoR[0], hPosRangeLoR[1]),
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1])
        },
        rotate : get30Deg(),
        isInverse : false,
        isCenter : false
      };
    }

    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrageArr.splice(topImgSpliceIndex , 0 , imgsArrangeTopArr[0]);
    }

    imgsArrageArr.splice(centerInex,0,imgArrangeCenterArr[0]);

    this.setState({
          imgsArrangeArr:imgsArrageArr
    });

  }

  /*
   *控制图片是否翻转的闭包函数
   * @param index
   * @return {function}
   */
  inverse(index){
    return() => {
      this.state.imgsArrangeArr[index].isInverse = !this.state.imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr : this.state.imgsArrangeArr
      });
    }
  }

  center(index){
    return () => {
      this.reArrange(index);
    }
  }


  render(){
       let  imgFigures = [],
       controllerUnits = [];

   		imageDatas.forEach((value,index)=>{

   		  if(!this.state.imgsArrangeArr[index]){
   		    this.state.imgsArrangeArr[index] = {
   		      pos : {
   		        left : 0,
              top : 0
            },
            rotate : 0 ,
            isInverse : false,
            isCenter : false
          }
        }
        imgFigures.push(<ImgFigure
          data={value}
          key={index}
          ref={'imgFigure'+index}
          arrange={this.state.imgsArrangeArr[index]}
          inverse={this.inverse(index)}
          center = {this.center(index)}
          />);

   		  controllerUnits.push(<ControllerUnit
        key = {index}
        arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse(index)}
        center = {this.center(index)}
        />)
   		});

    return (
     <section className = "stage" ref="stage">
     	<section className = "img-sec">
     		{imgFigures}
     	</section>
     	<nav className = "controller-nav">
        {controllerUnits}
      </nav>
     </section>
    )
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
