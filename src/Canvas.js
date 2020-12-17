import React, { useState,Fragment } from "react";
import "./assets/index.css";
import { Stage, Layer, Line, Image,Circle,Shape } from "react-konva";
import useImage from "use-image";
import uuid from 'react-uuid';
import SidePane from "./SidePane/SidePane";
import axios from 'axios';
// import BackImage from "../public/assets/back_img.png";
var scaleBy = 1.01;
// var scale = 1.0;
// var scaleMultiplier = 0.8;
var stroke = "";
var strokewidth = "";
let dash = [];
let startX;
let startY;
let mouseX;
let mouseY;
let points = [];
let CanvasHistory = [];
let shape;
let selectedFile = "";
let rightclickPopup;
let s;
let urlElements = window.location.href.split('/');
const Canvas1 = () => {
  const jsonexport = require('jsonexport');
  // document.body.style.backgroundImage = "../assets/Bitmap.png";
  // document.body.style.overflow= "hidden";
  // const [shape,setShape] = useState([]);
  const [tool, setTool] = React.useState("");
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);
  // const isDelete = React.useRef(false);
  const [SharePopup,handleSharePopup] = useState(false);
  const [model, setModel] = useState(false);
  const [select, setSelect] = useState(false);
  const [popup, setPopup] = useState(false);
  const [history,setHistory] = useState([]);
  const [common, setCommon] = useState("");
  const [image, setImage] = useState("");
  const [newimage] = useImage(image);
  const [curve,setCurve] = useState(false);
  const [canvas,setCanvas] = useState(false);
  const [bezierPoints,setBezierPoints] = useState(
    {
      startx: '',
      starty:'',
      centerx:'',
      centery:'',
      endx:'',
      endy:'',
      stroke:'',
      strokeWidth: 0,
      dash:[]
    }
  )
  const [canvasPoints,setCanvasPoints] = useState([])
  // const [plus] = useImage('assets/plus.png');
  // const [minus] = useImage('assets/minus.png');
  const [id, setId] = useState(null);

  const handleModel = () => {
    setModel(!model);
  };
  const handleSelect = () => {
    setTool("");
    setSelect(true);
  };
  const handleMouseDown = (e) => {
    stroke = "";
    dash = [];
    if (tool !== "") {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setSelect(false);
      if (tool === "Wall") {
        strokewidth = 5;
        stroke = "#000000";
        dash = [];
      } else if (tool === "Exterior") {
        strokewidth = 7;
        stroke = "#000000";
        dash = [];
      } else if (tool === "Interior") {
        strokewidth = 3;
        stroke = "green";
        dash = [];
      } else if (tool === "Measurement") {
        strokewidth = 3;
        stroke = "blue";
        dash = [];
      } else if (tool === "Partition") {
        strokewidth = 3;
        stroke = "#000000";
        dash = [5, 20];
      }
      // lastLine.points = [pos.x, pos.y];
      startX = pos.x;
      startY = pos.y;
      // setlines();
    }
  };

  const setlines = () => {
    if (points.length > 0) {
      for (var i = 0; i < points.length; ++i) {
        var line = points[i];
        // console.log(line);
        let tools = line.tool;
        let strokes = line.stroke;
        let dashs = line.dash;
        let strokewidths = line.strokewidth;
        setLines([
          ...lines,
          {
            id:uuid(),
            lineName:`Line ${i+1}`,
            isChecked:false,
            tool: tools,
            stroke: strokes,
            dash: dashs,
            strokewidth: strokewidths,
            points: [line.startX, line.startY, line.endX, line.endY],
          },
        ]);
      }
    }
  };

  const setcanvaspointfunction = () =>{
    if(CanvasHistory.length > 0){
      for (let i = 0; i < CanvasHistory.length; i++) {
        const shapeele = CanvasHistory[i];
        setCanvasPoints([...canvasPoints,
          {
            id:uuid(),
            lineName:`Curve ${i+1}`,
            isChecked:false,
            startx: shapeele.startx,
            starty:shapeele.starty,
            centerx:shapeele.centerx,
            centery:shapeele.centery,
            endx:shapeele.endx,
            endy:shapeele.endy,
            points:shapeele.points,
            stroke:shapeele.stroke,
            strokeWidth: shapeele.strokeWidth,
            dash: shapeele.dash
          },
        ])
      }
    }
  }

  const undosetlines = (point) => {
    // console.log(point);
    if (point.length > 0) {
      for (var i = 0; i < point.length; ++i) {
        var line = point[i];
        // console.log(line);
        let tools = line.tool;
        let strokes = line.stroke;
        let dashs = line.dash;
        let pointss = line.points;
        let strokewidths = line.strokewidth;
        setLines([
          ...lines,
          {
            id:uuid(),
            lineName:`Line ${i+1}`,
            isChecked:false,
            tool: tools,
            stroke: strokes,
            dash: dashs,
            strokewidth: strokewidths,
            points: [pointss[0], pointss[1], pointss[2], pointss[3]],
          },
        ]);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (tool !== "") {
      if (!isDrawing.current) {
        return;
      }
      const stage = e.target.getStage();
      setCommon(stage);
      const point = stage.getPointerPosition();
      mouseX = point.x;
      mouseY = point.y;
    }
  };
  const handleMouseUp = (e) => {
    // console.log("handleMouseUp", e);
    if (tool !== "") {
      isDrawing.current = false;
      points.push({
        tool: tool,
        stroke: stroke,
        dash: dash,
        strokewidth: strokewidth,
        startX: startX,
        startY: startY,
        endX: mouseX,
        endY: mouseY,
        points: [startX, startY, mouseX, mouseY],
      });
      setlines();
      // let linearray = e.currentTarget.children[0].children;
      // console.log(linearray);
    }
  };
  const handleWheel = (e) => {
    // console.log(e);
    var width = 1325;
    var height = 600;
    const stage = e.target.getStage({
      container: "canvas",
      width: width,
      height: height,
    });
    setCommon(stage);
    var oldScale = stage.scaleX();
    var pointer = stage.getPointerPosition();
    console.log(pointer.x, pointer.y);
    var mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    var newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    console.log(newPos);
    stage.position(newPos);
    stage.batchDraw();
  };

  const zoomIn = (e) => {
    if (common === "") {
      return;
    }
    var stage = common;
    var oldScale = stage.scaleX();
    var pointer = stage.getPointerPosition();

    var mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    // console.log('oldScaleZoomin',oldScale);
    // console.log('mousePointToZoomIn',mousePointTo);
    var newScale = e.deltaY > 0 ? oldScale * scaleBy : oldScale * scaleBy;
    // console.log('newScale',newScale);
    stage.scale({ x: newScale, y: newScale });

    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    // console.log('newPoszoomin',newPos);
    stage.position(newPos);
    stage.batchDraw();
  };

  const zoomOut = (e) => {
    // console.log(common);
    if (common === "") {
      return;
    }
    var stage = common;
    var oldScale = stage.scaleX();
    var pointer = stage.getPointerPosition();
    // console.log('scaleX()',stage.scaleX());
    var mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    // console.log('oldScale',oldScale);
    // console.log('mousePointToZoomOut',mousePointTo);
    var newScale = e.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    // console.log('newScale',newScale);
    stage.scale({ x: newScale, y: newScale });

    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    // console.log('newPos',newPos);
    stage.position(newPos);
    stage.batchDraw();
  };
  const undo = () => {
    if (lines.length === 0) {
      return;
    } else {
      const previous = lines.pop();
      // setHistory(previous);
      setHistory([
        ...history,
        {
          id:previous.id,
          lineName:previous.lineName,
          isChecked:previous.isChecked,
          tool: previous.tool,
          stroke: previous.stroke,
          dash: previous.dash,
          strokewidth: previous.strokewidth,
          points: [previous.points[0], previous.points[1],previous.points[2],previous.points[3]],
        },
      ]);
      console.log('previous',previous);
      // lines.pop();
      points.pop();
      console.log('undolines',history);
      // console.log(lines.pop());
      // undosetlines(lines);
      setLines(lines);
    }
  };
  const reset = (e) =>{
    lines.length=0;
    points.length=0;
    setLines([]);
    setCanvasPoints([]);
    undosetlines(lines);
  }
  const redo = () =>{
    console.log(history);
    if(history.length === 0){
      return;
    }
    else{
      console.log('sethistory',history);
      let next = history[history.length - 1];
      console.log(next);
      setLines([
        ...lines,
        {
          id:next.id,
          lineName:next.lineName,
          isChecked:next.isChecked,
          tool: next.tool,
          stroke: next.stroke,
          dash: next.dash,
          strokewidth: next.strokewidth,
          points: [next.points[0], next.points[1],next.points[2],next.points[3]]
        },
      ]);
      history.pop();
    }
  }

  const handlemouseover = (e) => {
    // console.log(e);
    document.body.style.cursor = "pointer";
  };
  const handlemouseout = (e) => {
    document.body.style.cursor = "default";
  };
  const handlepopup = (e) => {
    shape = "";
    shape = e.target;
    // console.log('canvas',canvas);
    console.log('e.target',e.target);
    s = e.target.attrs.points;
    setPopup(true);
  };
  const handleCurveDragMove = (e) => {
    // console.log('handleCurveDragMove',e);
    // console.log('shapehandleCurveDragMove',shape);
    let s = e.currentTarget.parent.children[4].attrs.points;
    setBezierPoints({
      startx: s[0],
      starty:s[1],
      centerx:e.evt.clientX,
      centery:e.evt.clientY,
      endx:s[4],
      endy:s[5],
      stroke:shape.attrs.stroke,
      strokeWidth: shape.attrs.strokeWidth,
      dash: shape.attrs.dash
    });
    setHistory([
      ...history,
      {
        tool: shape.attrs.tool,
        stroke: shape.attrs.stroke,
        dash: shape.attrs.dash,
        strokewidth: shape.attrs.strokewidth,
        points: [shape.attrs.points[0], shape.attrs.points[1],shape.attrs.points[2],shape.attrs.points[3]],
      },
    ]);
    let list = lines.filter(
      (x) => x?.points.join("+") !== shape?.attrs?.points.join("+")
    );
    setLines(list);
    points = points.filter(
      (x) => x?.points.join("+") !== shape?.attrs?.points.join("+")
    );
  }

  const handleDragMoveUp = (e) =>{
    // console.log('handleDragMoveUp',e);
    let s = e.currentTarget.parent.children[4].attrs.points;
    // console.log('dragup shape ===>',shape);
    CanvasHistory.push({
      startx: s[0],
      starty:s[1],
      centerx:e.evt.clientX,
      centery:e.evt.clientY,
      endx:s[4],
      endy:s[5],
      points:[s[0],s[1],e.evt.clientX,e.evt.clientY,s[4],s[5]],
      stroke:shape.attrs.stroke,
      strokeWidth: shape.attrs.strokeWidth,
      dash: shape.attrs.dash
    })
    setcanvaspointfunction();
    setBezierPoints({
      startx: '',
      starty:'',
      centerx:'',
      centery:'',
      endx:'',
      endy:'',
      stroke:'',
      strokeWidth: 0,
      dash:[]
    });
    setPopup(false);
  };

  const handleCurve = () => {
    // shape = e.target;
    // setCanvas(true);
    console.log('handlecurve shape',shape);
    if(s.length === 4){
      setBezierPoints({
        startx: s[0],
        starty:s[1],
        centerx:s[0]/4,
        centery:s[1]/2,
        endx:s[2],
        endy:s[3],
        stroke:shape.attrs.stroke,
        strokeWidth: shape.attrs.strokeWidth,
        dash: shape.attrs.dash
      });
    }
    else{
      setBezierPoints({
        startx: s[0],
        starty:s[1],
        centerx:s[2],
        centery:s[3],
        endx:s[4],
        endy:s[5],
        points:[s[0],s[1],s[2],s[3],s[4],s[5]],
        stroke:shape.attrs.stroke,
        strokeWidth: shape.attrs.strokeWidth,
        dash: shape.attrs.dash
      });
      let list = canvasPoints.filter(
        (x) => x?.points.join("+") !== s.join("+")
      );
      setCanvasPoints(list);
      // let can = bezierPoints.filter(
      //   (x) => x?.points.join("+") !== shape?.attrs?.points.join("+")
      // );
      // setCanvasPoints(can);
    }
    setCurve(true);
    setCanvas(true);
    setHistory([
      ...history,
      {
        tool: shape.attrs.tool,
        stroke: shape.attrs.stroke,
        dash: shape.attrs.dash,
        strokewidth: shape.attrs.strokewidth,
        points: [shape.attrs.points[0], shape.attrs.points[1],shape.attrs.points[2],shape.attrs.points[3]],
      },
    ]);
    let list = lines.filter(
      (x) => x?.points.join("+") !== shape?.attrs?.points.join("+")
    );
    setLines(list);
    points = points.filter(
      (x) => x?.points.join("+") !== shape?.attrs?.points.join("+")
    );
    // console.log('canvas',canvas);
    // console.log('handleCurve',shape);
  };
  const handleDelete = (e) => {
    setHistory([
      ...history,
      {
        tool: shape.attrs.tool,
        stroke: shape.attrs.stroke,
        dash: shape.attrs.dash,
        strokewidth: shape.attrs.strokewidth,
        points: [shape.attrs.points[0], shape.attrs.points[1],shape.attrs.points[2],shape.attrs.points[3]],
      },
    ]);
    let list = lines.filter(
      (x) => x?.points.join("+") !== shape?.attrs?.points.join("+")
    );
    let can = canvasPoints.filter(
      (x) => x?.points.join("+") !== shape?.attrs?.points.join("+")
    );
    setCanvasPoints(can);
    console.log('canvasPoints',canvasPoints);
    setLines(list);
    points = points.filter(
      (x) => x?.points.join("+") !== shape?.attrs?.points.join("+")
    );
    setPopup(false);
  };
  const handledragmove = (e) => {
    console.log(e + "curve");
  };
  const fileSelectHandler = (e) => {
    // console.log(e);
    var file = e.target.files[0];
    let reader = new FileReader();
    var url = reader.readAsDataURL(file);
    console.log(url);
    reader.onloadend = (e) => {
      selectedFile = e.currentTarget.result;
      setImage(selectedFile);
    };
    console.log(reader);
  };
  const handleDeleteLine = (e) => {
    console.log('handleDeleteLine',e);
  }
  const RedirectGoBack = () =>{
    window.location.href="../listingFloor"
  }
  const save = () => {
    console.log('save lines ==>',lines);
    console.log('save shapes ==>',canvasPoints);
    if(lines.length !== 0 || canvasPoints.length !== 0){
      // this.jsonexport(lines);
      let urlElements = window.location.href.split('/');
      console.log(urlElements[4]);
      var csvUrl;
      jsonexport(lines, function(err, csv){
        if (err) return console.error(err);
        var myURL = window.URL || window.webkitURL //window.webkitURL works in Chrome and window.URL works in Firefox
        var csv = csv;  
        var blob = new Blob([csv], { type: 'text/plain' });  
        csvUrl = myURL.createObjectURL(blob);
        // let window2 = window.open(csvUrl, 'log.' + new Date() + '.txt');
        // window2.onload = e => window.URL.revokeObjectURL(csvUrl);
        console.log("Import data",csv);
        console.log("Import dataurl",csvUrl);
      });
      const formData = {
        floor: urlElements[4],
        dict: "Canvas",
        data: window.URL.revokeObjectURL(csvUrl),
      }
      axios.post("https://nbk.synctactic.ai/blobs/ ", formData,{
          headers: {
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
              "Access-Control-Allow-Origin":"*",
              "Content-Type": "multipart/form-data,application/x-www-form-urlencoded",
              "Content-Disposition": "attachment","filename":window.URL.revokeObjectURL(csvUrl)+".txt"
          },
      })
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }
    else{
      alert('Draw Something');
    }
  }
  if (select === true) {
    return (
      <div className="canvas" id="canvas">
        <style>
                {`
                 body {
                    background-image: url("../assets/Bitmap.png")!important;
                    
                  }
                `}
            </style>
        {/* <SidePane lines={lines} curves={canvasPoints} handleDelete={handleDeleteLine} /> */}
        {canvas ?
      <Stage width={1325} height={600}>
            <Layer>
                <Fragment>
                <Image image={newimage} width={1325} height={600} />
                    <Circle
                    x = {bezierPoints.startx}
                    y = {bezierPoints.starty}
                    radius = {5}
                    stroke= {'#666'}
                    fill = {'#ddd'}
                    strokeWidth = {2}
                    // draggable= {true}
                    // onDragMove = {this.handleDragMove}
                    />
                    <Circle
                    x = {bezierPoints.centerx}
                    y = {bezierPoints.centery}
                    radius = {8}
                    stroke= {'#666'}
                    fill = {'#ddd'}
                    strokeWidth = {2}
                    draggable= {true}
                    onDragMove = {handleCurveDragMove}
                    onDragEnd = {handleDragMoveUp}
                    />
                    <Circle
                    x = {bezierPoints.endx}
                    y = {bezierPoints.endy}
                    radius = {5}
                    stroke= {'#666'}
                    fill = {'#ddd'}
                    strokeWidth = {2}
                    // draggable= {true}
                    // onDragMove = {this.handleDragMove}
                    />
                    <Shape 
                    stroke= {bezierPoints.stroke}
                    strokeWidth= {bezierPoints.strokeWidth}
                    dash={bezierPoints.dash}
                    points={[bezierPoints.startx,bezierPoints.starty,bezierPoints.centerx,bezierPoints.centery,bezierPoints.endx,bezierPoints.endy]}
                    sceneFunc= {(ctx, shape) => {
                    ctx.beginPath();
                    ctx.moveTo(bezierPoints.startx,bezierPoints.starty);
                    ctx.quadraticCurveTo(bezierPoints.centerx,bezierPoints.centery,bezierPoints.endx,bezierPoints.endy);
                    ctx.fillStrokeShape(shape);
                    }}
                    />
                    <Line 
                        dash = {[10, 10, 0, 10]}
                        strokeWidth= {3}
                        stroke = {'black'}
                        lineCap = {'round'}
                        id= {'quadLinePath'}
                        opacity= {0.3}
                        points = {[bezierPoints.startx,bezierPoints.starty,bezierPoints.centerx,bezierPoints.centery,bezierPoints.endx,bezierPoints.endy]}
                        />
                        {lines.map((line, i) => (
                          <Line
                            onMouseOver={handlemouseover}
                            onMouseOut={handlemouseout}
                            onClick={handlepopup}
                            key={i}
                            points={line.points}
                            stroke={line.stroke}
                            strokeWidth={line.strokewidth}
                            dash={line.dash}
                            tension={0}
                            lineCap="round"
                            // bezier={true}
                          />
                        ))}
                        {canvasPoints.map((bezier,i) => (
                          <Shape 
                          id={uuid()}
                          lineName={`Curve ${i+1}`}
                          isChecked={false}
                          onMouseOver={handlemouseover}
                          onMouseOut={handlemouseout}
                          onClick={handlepopup}
                          stroke= {bezier.stroke}
                          strokeWidth= {bezier.strokeWidth}
                          dash={bezier.dash}
                          points={[bezier.startx,bezier.starty,bezier.centerx,bezier.centery,bezier.endx,bezier.endy]}
                          sceneFunc= {(ctx, shape) => {
                          ctx.beginPath();
                          ctx.moveTo(bezier.startx,bezier.starty);
                          ctx.quadraticCurveTo(bezier.centerx,bezier.centery,bezier.endx,bezier.endy);
                          ctx.fillStrokeShape(shape);
                          }}
                          />
                        ))}
                </Fragment>
            </Layer>
        </Stage>
    :
        <Stage
          width="1325"
          height="600"
          onWheel={handleWheel}
          onDragMove={handledragmove}
        >
          <Layer>
            <Image image={newimage} width={1325} height={600} />
            {curve && <Shape 
              stroke= {bezierPoints.stroke}
              strokeWidth= {bezierPoints.strokeWidth}
              dash={bezierPoints.dash}
              sceneFunc= {(ctx, shape) => {
              ctx.beginPath();
              ctx.moveTo(bezierPoints.startx,bezierPoints.starty);
              ctx.quadraticCurveTo(bezierPoints.centerx,bezierPoints.centery,bezierPoints.endx,bezierPoints.endy);
              ctx.fillStrokeShape(shape);
              }}
              />}
            {lines.map((line, i) => (
              <Line
                onMouseOver={handlemouseover}
                onMouseOut={handlemouseout}
                onClick={handlepopup}
                key={i}
                points={line.points}
                stroke={line.stroke}
                strokeWidth={line.strokewidth}
                dash={line.dash}
                tension={0}
                lineCap="round"
                // bezier={true}
              />
            ))}
            {canvasPoints.map((bezier,i) => (
              <Shape 
              stroke= {bezier.stroke}
              strokeWidth= {bezier.strokeWidth}
              dash={bezier.dash}
              points={[bezier.startx,bezier.starty,bezier.centerx,bezier.centery,bezier.endx,bezier.endy]}
              sceneFunc= {(ctx, shape) => {
              ctx.beginPath();
              ctx.moveTo(bezier.startx,bezier.starty);
              ctx.quadraticCurveTo(bezier.centerx,bezier.centery,bezier.endx,bezier.endy);
              ctx.fillStrokeShape(shape);
              }}
              />
            ))}
          </Layer>
        </Stage>
  }
        <section className="buttons">
          <ul>
            <li className={id === 1 ? "active" : ""}>
              <img src="../assets/select.png" alt="select" className="selectimg"  onClick={(e) => {
                  handleSelect();
                  setModel(false);
                  setId(1);
                }}/>
              <label
                onClick={(e) => {
                  handleSelect();
                  setModel(false);
                  setId(1);
                }}
              >
                Select
              </label>
              {/* <input value="Select" type="button"  /> */}
            </li>
            <li className={id === 2 ? "active" : ""}>
              <img src="../assets/wall.png" alt="select" className="wallimg" onClick={(e) => {
                  handleModel();
                  setSelect(false);
                  setId(2);
                }}/>
              <label
                onClick={(e) => {
                  handleModel();
                  setSelect(false);
                  setId(2);
                }}
              >
                Wall
              </label>
              {/* <input value="Wall" className="wall" id="Wall" type="button" /> */}
            </li>
            <li className={id === 3 ? "active" : ""}>
              <img
                src="../assets/measure.png"
                alt="select"
                className="measureimg"
                onClick={(e) => {
                  setTool("Measurement");
                  setModel(false);
                  setSelect(false);
                  setId(3);
                }}
              />
              <label
                onClick={(e) => {
                  setTool("Measurement");
                  setModel(false);
                  setSelect(false);
                  setId(3);
                }}
              >
                Measurement
              </label>
              {/* <input value="Measurement" type="button"/> */}
            </li>

            <li className={id === 4 ? "active" : ""}>
              <img src="../assets/insert.png" alt="select" className="insertimg"  onChange={fileSelectHandler}
                onClick={(e) => {
                  setModel(false);
                  setSelect(false);
                  setId(4);
                }}/>
              <label for="file" className=" inse">
                Insert
              </label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={fileSelectHandler}
                onClick={(e) => {
                  setModel(false);
                  setSelect(false);
                  setId(4);
                }}
              />
            </li>
            <li className={id === 5 ? "active" : ""}>
              <img src="../assets/undo.png" alt="select" className="undoimg" onClick={(e) => {
                  undo();
                  setId(5);
                  setModel(false);
                  setSelect(false);
                }}/>
              <label
                onClick={(e) => {
                  undo();
                  setId(5);
                  setModel(false);
                  setSelect(false);
                }}
              >
                Undo
              </label>
            </li>
            <li className={id === 6 ? "active" : ""}>
                <img src="../assets/redo.png" alt="select" className="redoimg" onClick={(e) => {
                redo()
                setId(6);
                setModel(false);
                setSelect(false);
              }}/>
                <label onClick={(e) => {
                redo()
                setId(6);
                setModel(false);
                setSelect(false);
              }}>Redo</label>
              </li>
            <li className={id === 7 ? "active" : ""}>
            <img src="../assets/reset.png" alt="reset" className="resetimg" onClick={(e) => {
                reset()
                setId(7);
                setModel(false);
                setSelect(false);
              }}/>
              <label  onClick={(e) => {
                reset()
                setId(7);
                setModel(false);
                setSelect(false);
              }}>Reset</label>
              </li>
              <li className={id === 8 ? "active" : ""}>
              <img src="../assets/save.png" alt="save" className="saveimg" onClick={(e) => {
                save()
                setId(8);
                setModel(false);
                setSelect(false);
              }}/>
              <label  onClick={(e) => {
                save()
                setId(8);
                setModel(false);
                setSelect(false);
              }}>Save</label>
              </li>
              
          </ul>
        </section>
        {model && (
          <section className="popup">
            <ul>
              <li>
                <input
                  type="radio"
                  id="inte"
                  name="wall"
                  value="Interior"
                  onClick={(e) => {
                    setTool(e.target.value);
                  }}
                />
                <label for="inte"> Interior</label>
              </li>
              <li>
                <input
                  type="radio"
                  id="part"
                  name="wall"
                  value="Partition"
                  onClick={(e) => {
                    setTool(e.target.value);
                  }}
                />
                <label for="part"> Partition</label>
              </li>
              <li>
                <input
                  type="radio"
                  id="exte"
                  name="wall"
                  value="Exterior"
                  onClick={(e) => {
                    setTool(e.target.value);
                  }}
                />
                <label for="exte"> Exterior</label>
              </li>
            </ul>
          </section>
        )}
        {popup && (
          <div className="list_pop" style={rightclickPopup}>
            <img
              src="../assets/curve.png"
              title="Curve"
              alt="select"
              onClick={(e) => {
                handleCurve(e);
              }}
              className="undoimgs"
            />
            <img
              src="../assets/delete.png"
              title="Delete"
              alt="select"
              onClick={(e) => {
                handleDelete();
              }}
              className="undoimgs"
            />
          </div>
        )}
        <img src="../assets/back_img.png" alt="home" className="homeimg" />
        <button className="btn btn-outline-primary publish" onClick={(e) => {
          handleSharePopup(!SharePopup)
        }}>Publish</button>
        {SharePopup && (<div className="pulish_drop">
            <h6>Share</h6>
            <label className="search_label">Search Person</label>
            <input type="text" className="publish_search form-control mb-3" placeholder="Search Person"/>
            {/* <div className="publish_line mt-1 mb-1"></div> */}
            <hr />
            <h6>Members</h6>
            <ul className="publish_ul">
              <li className="row">
                <div className="col-2">
                  <img src="image.jpg"/>
                </div>
                <div className="col-5">
                  <p>Sara Clark</p>
                </div>
                <div className="col-4">
                  <button className="btn btn-outline-primary">Assign</button>
                </div>
              </li>
            </ul>
        </div>)}
        <button className="plus" onClick={zoomIn}>
          <img src="../assets/plus.png" alt="plus" />
        </button>
        <button className="minus" onClick={zoomOut}>
          <img src="../assets/minus.png" alt="minus" />
        </button>
      </div>
    );
  } 

  else {
    return (
      <div className="canvas" id="canvas">
        {/* {console.log(lines)} */}
        <Fragment>
        <style>
                {`
                 body {
                    background-image: url("../assets/Bitmap.png")!important;
                    
                  }
                `}
            </style>
        <Stage
          width="1325"
          height="600"
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onWheel={handleWheel}
        >
          <Layer>
            {/* <Image image={plus} x={1290} y={525}/>
          <Image image={minus} x={1290} y={525}/> */}
            <Image image={newimage} width={1325} height={600} />
            {/* <Text text={select === true ? 'select':'unselect'} /> */}
            {canvasPoints.map((bezier,i) => (
              <Shape 
              stroke= {bezier.stroke}
              strokeWidth= {bezier.strokeWidth}
              dash={bezier.dash}
              points={[bezier.startx,bezier.starty,bezier.centerx,bezier.centery,bezier.endx,bezier.endy]}
              sceneFunc= {(ctx, shape) => {
              ctx.beginPath();
              ctx.moveTo(bezier.startx,bezier.starty);
              ctx.quadraticCurveTo(bezier.centerx,bezier.centery,bezier.endx,bezier.endy);
              ctx.fillStrokeShape(shape);
              }}
              />
            ))}
            
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.stroke}
                strokeWidth={line.strokewidth}
                dash={line.dash}
                tension={0}
                lineCap="round"
                // globalCompositeOperation={
                //   line.tool === 'eraser' ? 'destination-out' : 'source-over'
                // }
              />
            ))}
          </Layer>
        </Stage>
        </Fragment>
        <section className="buttons">
        <ul>
            <li className={id === 1 ? "active" : ""}>
              <img src="../assets/select.png" alt="select" className="selectimg"  onClick={(e) => {
                  handleSelect();
                  setModel(false);
                  setId(1);
                }}/>
              <label
                onClick={(e) => {
                  handleSelect();
                  setModel(false);
                  setId(1);
                }}
              >
                Select
              </label>
              {/* <input value="Select" type="button"  /> */}
            </li>
            <li className={id === 2 ? "active" : ""}>
              <img src="../assets/wall.png" alt="select" className="wallimg" onClick={(e) => {
                  handleModel();
                  setSelect(false);
                  setId(2);
                }}/>
              <label
                onClick={(e) => {
                  handleModel();
                  setSelect(false);
                  setId(2);
                }}
              >
                Wall
              </label>
              {/* <input value="Wall" className="wall" id="Wall" type="button" /> */}
            </li>
            <li className={id === 3 ? "active" : ""}>
              <img
                src="../assets/measure.png"
                alt="select"
                className="measureimg"
                onClick={(e) => {
                  setTool("Measurement");
                  setModel(false);
                  setSelect(false);
                  setId(3);
                }}
              />
              <label
                onClick={(e) => {
                  setTool("Measurement");
                  setModel(false);
                  setSelect(false);
                  setId(3);
                }}
              >
                Measurement
              </label>
              {/* <input value="Measurement" type="button"/> */}
            </li>

            <li className={id === 4 ? "active" : ""}>
              <img src="../assets/insert.png" alt="select" className="insertimg"  onChange={fileSelectHandler}
                onClick={(e) => {
                  setModel(false);
                  setSelect(false);
                  setId(4);
                }}/>
              <label for="file" className=" inse">
                Insert
              </label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={fileSelectHandler}
                onClick={(e) => {
                  setModel(false);
                  setSelect(false);
                  setId(4);
                }}
              />
            </li>
            <li className={id === 5 ? "active" : ""}>
              <img src="../assets/undo.png" alt="select" className="undoimg" onClick={(e) => {
                  undo();
                  setId(5);
                  setModel(false);
                  setSelect(false);
                }}/>
              <label
                onClick={(e) => {
                  undo();
                  setId(5);
                  setModel(false);
                  setSelect(false);
                }}
              >
                Undo
              </label>
            </li>
            <li className={id === 6 ? "active" : ""}>
                <img src="../assets/redo.png" alt="select" className="redoimg" onClick={(e) => {
                redo()
                setId(6);
                setModel(false);
                setSelect(false);
              }}/>
                <label onClick={(e) => {
                redo()
                setId(6);
                setModel(false);
                setSelect(false);
              }}>Redo</label>
              </li>
            <li className={id === 7 ? "active" : ""}>
              <img src="../assets/reset.png" alt="reset" className="resetimg" onClick={(e) => {
                reset()
                setId(7);
                setModel(false);
                setSelect(false);
              }}/>
              <label  onClick={(e) => {
                reset()
                setId(7);
                setModel(false);
                setSelect(false);
              }}>Reset</label>
              </li>
              <li className={id === 8 ? "active" : ""}>
              <img src="../assets/save.png" alt="save" className="saveimg" onClick={(e) => {
                save()
                setId(8);
                setModel(false);
                setSelect(false);
              }}/>
              <label  onClick={(e) => {
                save()
                setId(8);
                setModel(false);
                setSelect(false);
              }}>Save</label>
              </li>
          </ul>
        </section>
        {model && (
          <section className="popup">
            <ul>
              <li>
                <input
                  type="radio"
                  id="inte"
                  name="wall"
                  value="Interior"
                  onClick={(e) => {
                    setTool(e.target.value);
                  }}
                />
                <label for="inte"> Interior</label>
              </li>
              <li>
                <input
                  type="radio"
                  id="part"
                  name="wall"
                  value="Partition"
                  onClick={(e) => {
                    setTool(e.target.value);
                  }}
                />
                <label for="part"> Partition</label>
              </li>
              <li>
                <input
                  type="radio"
                  id="exte"
                  name="wall"
                  value="Exterior"
                  onClick={(e) => {
                    setTool(e.target.value);
                  }}
                />
                <label for="exte"> Exterior</label>
              </li>
            </ul>
          </section>
        )}
        {/* {canvas && <Canvas bezierPoints={bezierPoints} />} */}
        <img src="../assets/back_img.png" alt="home" className="homeimg"  />
        {/* <img src="../assets/publish.png" alt="Publish" className="publish" /> */}
        <button className="btn btn-outline-primary publish" onClick={(e) => {
          handleSharePopup(!SharePopup)
        }}>Publish</button>
        {SharePopup && (<div className="pulish_drop">
            <h6>Share</h6>
            <label className="search_label">Search Person</label>
            <input type="text" className="publish_search form-control mb-3" placeholder="Search Person"/>
            {/* <div className="publish_line mt-1 mb-1"></div> */}
            <hr />
            <h6>Members</h6>
            <ul className="publish_ul">
              <li className="row">
                <div className="col-2">
                  <img src="image.jpg"/>
                </div>
                <div className="col-5">
                  <p>Sara Clark</p>
                </div>
                <div className="col-4">
                  <button className="btn btn-outline-primary">Assign</button>
                </div>
              </li>
            </ul>
        </div>)}
        <button className="plus" onClick={zoomIn}>
          <img src="../assets/plus.png" alt="plus" />
        </button>
        <button className="minus" onClick={zoomOut}>
          <img src="../assets/minus.png" alt="minus" />
        </button>
      </div>
    );
  }
};
export default Canvas1;