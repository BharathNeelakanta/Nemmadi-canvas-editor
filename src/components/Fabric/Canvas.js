import React, { Component } from "react";
import { fabric } from "fabric";
import './Canvas.css'
var lines=[];

var isRedoing = false;
var h = [];
var mouseUpArray=[];
var mouseMoveArray=[];
function undo(canvas) {
  
  console.log("inside undo")

  if (canvas._objects.length > 0) {
    h.push(canvas._objects.pop());
    console.log("active",h)
    canvas.renderAll();
  }
}
function redo(canvas) {
  
  console.log("Inside redo")
  console.log("active",canvas.getObjects())
  if (h.length > 0) {
    isRedoing = true;
    canvas.add(h.pop());
    console.log("active",h)
  }
}
export default class CanvasApp extends Component {
  constructor(props) {
    super(props);
    

    this.state = {
      canvas: null,
      size: {
        scaleX: 0,
        scaleY: 0,
      },
      line:'Interior',
      image:''
    };
  }
  
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
    if(nextProps.line!=''){
      this.setState({line:nextProps.line})
    }
    if(nextProps.image!==undefined){
      this.setState({image:nextProps.image})
    }
    
}

  componentDidMount() {
    
    var line,
      isSelected = false,
      isDown;
      var points;
      var pointermove;
      
    let canvas = new fabric.Canvas("main-canvas");
    
    this.setState({ canvas });
    var deleteIcon =
      "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
    var img = document.createElement("img");

    img.src = deleteIcon;
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "blue";
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.1,
      y: 0.5,
      offsetY: 16,
      cursorStyle: "pointer",
      mouseUpHandler: deleteObject,
      render: renderIcon,
      cornerSize: 24,
    });

    function deleteObject(eventData, target) {
      var canvas = target.canvas;
      canvas.remove(target);
   
      canvas.requestRenderAll();
     
    }
    document.getElementById('file').addEventListener("change", function(e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function(f) {
         var data = f.target.result;
         fabric.Image.fromURL(data, function(img) {
            // add background image
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
               scaleX: canvas.width / img.width,
               scaleY: canvas.height / img.height
            });
         });
      };
      reader.readAsDataURL(file);
   });
    var bgimg =this.state.image;
    fabric.Image.fromURL(bgimg, function (img) {
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
      });
    });

    fabric.Image.fromURL(bgimg, (img) => {
      this.setState({
        size: {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height,
        },
      });
    });
    

    function renderIcon(ctx, left, top, fabricObject) {
      var size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
canvas.on('selection:cleared',()=>{
 
})
    canvas.on("mouse:down",  (o)=> {
      
      if (!isSelected) {
        isDown = true;
        var lineMode=this.state.line;
        var pointer = canvas.getPointer(o.e);
         points = [pointer.x, pointer.y, pointer.x, pointer.y];
        //  console.log("LineMode",points)
        if(lineMode==="Interior"){
            line = new fabric.Line(points, {
          strokeWidth: 3,
          stroke: "red",
          lockScalingX: true,
          lockScalingY: true,
        });
        canvas.add(line);
        }
      else if(lineMode=='Partition'){
        line = new fabric.Line(points, {
          strokeWidth: 2,
          stroke: "black",
          strokeDashArray: [15,15]
        });
        canvas.add(line);
      }
      else if(lineMode=='Exterior'){
        line = new fabric.Line(points, {
          strokeWidth: 2,
          stroke: "green",
          
        });
        canvas.add(line);
      }
      else if(lineMode=='Measure Room'){
        line = new fabric.Line(points, {
          strokeWidth: 2,
          stroke: "green",
          
        });
        canvas.add(line);
      }
      else if(lineMode=='Measure Wall'){
        line = new fabric.Line(points, {
          strokeWidth: 2,
          stroke: "green",
          
        });
        canvas.add(line);
      }
      }
      line.on("selected", () => {
        isSelected = true;
        console.log('sele')
      });
      line.on("deselected", () => {
        isSelected = false;
        console.log('desele')
      });
    
      line.on('moved',(e)=>{
        isSelected=true;
      })
      line.on("scaled", (e) => {
        isSelected = true;
      });
      line.on("rotated", (e) => {
        isSelected = true;
      });
      line.on("skewed", (e) => {
        isSelected = true;
      });
    });

    canvas.on("mouse:move", function (o) {
      if (!isDown) return;
       pointermove = canvas.getPointer(o.e);
      
      
      line.set({ x2: pointermove.x, y2: pointermove.y });
      canvas.renderAll();
    });

    canvas.on("mouse:up", function (o) {
      isDown = false;
      mouseUpArray.push(points);
      mouseMoveArray.push(pointermove);
      console.log("MouseUp", mouseUpArray, mouseMoveArray)
      console.log("MouseDpwn", mouseMoveArray)
      
      if(mouseUpArray[mouseUpArray.length-1][0]===mouseUpArray[mouseUpArray.length-1][2]){
        if(mouseMoveArray[mouseMoveArray.length-1]===undefined  ){
        
          canvas.remove(line)
          mouseMoveArray.pop();
          mouseUpArray.pop();
         
          
          
        }
        else if(mouseMoveArray[mouseMoveArray.length-1]===mouseMoveArray[mouseMoveArray.length-2]){
          canvas.remove(line)
          mouseMoveArray.pop();
          mouseUpArray.pop();
          
       
        }
        
      }
     
      // lines.push(mouseUpArray,mouseMoveArray)
    // console.log("lines",lines)
    // var filtered = lines.filter(function (el) {
    //   return el.length!=0;
    // });
     try{
       lines.push([
        mouseUpArray[mouseUpArray.length-1][0],
          mouseUpArray[mouseUpArray.length-1][1],
          mouseMoveArray[mouseMoveArray.length-1].x,
          mouseMoveArray[mouseMoveArray.length-1].y,
        ])
     }
        catch(e){
        
        }
        
    console.log("filtered",lines )
  });
    canvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.9999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
    canvas.on('selected',()=>{
      console.log('selected')
    })
  }
  render() {
    console.log("h is :::",h);
    let jsonState = {};
    
    const clearCanvas = (canvas, state) => {
      this.props.onReset();
      state.val = canvas.toJSON();
      lines.push(state.val)
      console.log("Lines",lines)
      localStorage.removeItem('data')
      localStorage.setItem("data", JSON.stringify(state.val));
      canvas.getObjects().forEach((o) => {
        if (o !== canvas.backgroundImage) {
          canvas.remove(o);
        }
      });
    };


    const restoreCanvas = (canvas) => {
      this.props.onReset();
      const data = localStorage.getItem("data");
      if (data) {
        canvas.clear();
        canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
      }
    };

    

    
    const zoomIn = canvas =>{
      canvas.setZoom(canvas.getZoom() * 1.1 ) ;
    }
    const zoomOut = canvas =>{
      canvas.setZoom(canvas.getZoom()/1.1);
    }
    const up = canvas =>{
      var units = 10 ;
      var delta = new fabric.Point(0,-units) ;
      canvas.relativePan(delta) ;
    }
    const down = canvas =>{
      var units = 10 ;
        var delta = new fabric.Point(0,units) ;
        canvas.relativePan(delta) ;
    }
    const left = canvas =>{
      var units = 10 ;
      var delta = new fabric.Point(-units,0) ;
      canvas.relativePan(delta) ;
    }
    const right = canvas =>{
      var units = 10 ;
      var delta = new fabric.Point(units,0) ;
      canvas.relativePan(delta) ;
    }
    const active = canvas =>{
      let a = canvas.getObjects();
      // console.log("object",a)
    }
 
    return (
      <>
        {/* <div className="controls">
          <button onClick={() => clearCanvas(this.state.canvas, jsonState)}>
            Clear/Save
          </button>
          <button onClick={() => restoreCanvas(this.state.canvas, jsonState)}>
            Restore
          </button>
          
          <button onClick={()=>{undo(this.state.canvas)}}> Undo</button>
          <button onClick={()=>{redo(this.state.canvas)}}> Redo</button>
          <button onClick={()=>{zoomIn(this.state.canvas)}}>+</button>
          <button onClick={()=>{zoomOut(this.state.canvas)}}>-</button>
          <button onClick={()=>{up(this.state.canvas)}}>Up</button>
          <button onClick={()=>{down(this.state.canvas)}}>Down</button>
          <button onClick={()=>{left(this.state.canvas)}}>Left</button>
          <button onClick={()=>{right(this.state.canvas)}}>Right</button>
          
        </div> */}
        <div class= "canvas-container1">
          <canvas id="main-canvas" width="800px" height="800px"></canvas>
        </div>   
      </>
    );
  }
}
