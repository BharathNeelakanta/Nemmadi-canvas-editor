import React, { useState, useEffect, Fragment } from "react";
import { Stage, Layer, Line, Image, Circle, Shape } from "react-konva";
import { Link } from "react-router-dom"
import { uniq, differenceBy } from 'lodash';
import useImage from "use-image";
import uuid from 'react-uuid'
import './SidePane.css'
import '../assets/index.css'
import axios from 'axios';
import {toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import CanvasApp from '../Canvas'

toast.configure() 
var scaleBy = 1.3;
var stroke = "";
var strokewidth = "";
var measurementSubType = "Carpet"
let dash = [];
let startX;
let startY;
let CanvasHistory = [];
let mouseX;
let mouseY;
let points = [];
let shape;
let selectedFile = "";
let rightclickPopup;
let s;
// let urlElements = window.location.href.split('/'); this is not required
let uploadImage; //global variable for upload image
let setDrawCanvasInitialState = false;
const SidePane1 = (props) => {
    const jsonexport = require('jsonexport');
    const [tool, setTool] = React.useState("");
    const [lines, setLines] = React.useState([]);
    const [filteredLines,setFilteredLines]=useState([]);
    const isDrawing = React.useRef(false);
    const [SharePopup,handleSharePopup] = useState(false);
    const [model, setModel] = useState(false);
    const [select, setSelect] = useState(false);
    const [popup, setPopup] = useState(false);
    const [history, setHistory] = useState([]);
    const [Reselect, setReselect] = useState([]);
    const [multiple, setMultiple] = useState([]);
    const [common, setCommon] = useState("");
    const [image, setImage] = useState("");
    const [newimage] = useImage(image);
    const [curve, setCurve] = useState(false);
    const [canvas, setCanvas] = useState(false);
    const [labelArray, setLabelArray] = useState([])
    const [previous, setPrevious] = useState([])
    const [sidePan, setSidePan] = useState(false)
    const [sideNavbar,sideNavbarStyle] = useState(false)
    const [isSidePan, setIsSidePan] = useState(false);
    const [mouseOver, setMouseOver] = useState(false);
    const [canvasPoints,setCanvasPoints] = useState([]);
    const [bezierPoints, setBezierPoints] = useState(
        {
            startx: '',
            starty: '',
            centerx: '',
            centery: '',
            endx: '',
            endy: '',
            stroke: '',
            strokeWidth: 0,
            dash: []
        }
    )

    const [id, setId] = useState(null);
    const [labelName, setLabelName] = useState('');
    const [labels, setLabels] = useState([]);
    const [labelDataArray, setLabelDataArray] = useState([]);
    const [isOpen, setIsOpen] = useState(false)
    const [labelsArray,setLabelsArray] = useState([])
    const [notCheckedLines,setNotCheckedLines] = useState([]);
    const [existedLines,setExistedLines] = useState([]);
    const [lineColor,setLineColor]=useState(false);
    const [redoLines,setRedoLines]=useState([]);

    // let finalLines = differenceBy(lines,existedLines,'id');

    const handleLabel = (e) => {
        setLabelName(e.target.value);
    }

    // useEffect(()=>{
    //     let finalLines = differenceBy(lines,existedLines,'id');
    //     setLines([...lines,...finalLines])
    // },[lines,existedLines]);

    
    const handleSave = (e) => {
        e.preventDefault();
        let labArr = [];
        let newLabelDataArray = labelDataArray && labelDataArray.filter(data => data.isChecked === true)
        let groupedData = newLabelDataArray.map(label => label.isGroup === false ? Object.assign(label,{isGroup:!label.isGroup}) : label)
        // console.log('groupedData==>',groupedData);
        // console.log('newLabelDataArray==>',newLabelDataArray);
        // console.log('newLabelDataArray with uniq==>',uniq(newLabelDataArray));

        let newLabelArray = { id: uuid(), "name": labelName, "data": uniq(groupedData) };
        setLabelsArray([...labelsArray,newLabelArray])
        const newLines = lines.filter(line => line.isChecked === false && line.isGroup === false);
        const flines = lines.filter(line => line.isChecked === true ? line.isChecked === false : line.isChecked )
        // console.log('newlines==>',newLines);
        // console.log('newlines.pop()==>',newLines.pop());
        const notCheckedLines = differenceBy(lines,labelDataArray,'id');
        const filteredLines = differenceBy(lines,newLines,'id');
        // console.log('notchecked lines from save==>',notCheckedLines);
        const newLabels = labels;
        setLabels([...newLabels,newLabelArray]);
        setLabelName('');
        setLabelDataArray([]);
        setIsOpen(false)
        setLineColor(false);
        setNotCheckedLines(notCheckedLines);
        setLines(uniq([...newLines,...notCheckedLines,...lines]));
        setExistedLines(uniq([...existedLines,...newLabelDataArray]));
        // setLines(notCheckedLines)
    }

    // console.log('existedlines data==>',existedLines);

    const handleLoadCanvas = async () =>{
            // let urlElements = window.location.href.split('/');
            let floorId = props.match.params.floorid;
            console.log(props.match.params.floorid);
            let output;
            // console.log('load canvas');
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("authToken")}`);
            // myHeaders.append("Cookie", "__cfduid=d3836be0a2e132b22fc9584ac19f5d8441605698523");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                // body: formdata,
                redirect: 'follow'
            };
            const response = await axios.get("https://nbk.synctactic.ai/blobs/", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            // let lastBlobId = response.data.results[response.data.results.length-1].id;
            // console.log(response.data.results[response.data.results.length-1].id);
            // console.log(response.data.results);
            for(var i=0;i<response.data.results.length;i++){
                var res = response.data.results[i].id;
                // console.log("floor",res);
                const blobs = await axios.get("https://nbk.synctactic.ai/blobs/"+res, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                    }
                })
                
                if(parseInt(floorId) === blobs.data.floor){
                    console.log("blobs details",blobs.data.floor);
                    console.log("blobs details floorid",parseInt(floorId));
                    console.log('blobs data',blobs.data.data);
                    const responseBlob = await axios.get("https://nbk.synctactic.ai/blobs/"+blobs.data.id, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                        }
                    })
                    console.log(responseBlob.data.data);
                    var file = responseBlob.data.data;
                    output = fetch(file)
                        .then((r) => r.text())
                        .then(text  => {
                            // output = text;
                        // console.log(text);
                        let existline=[];
                        let existcurve=[];
                        var obj = JSON.parse(text)
                        console.log("obj",obj.dimensions);
                        for(var i=0;i<obj.dimensions.length;i++){
                            var Pooints = obj.dimensions[i];
                            if(Pooints.points.length === 4){
                                existline.push(Pooints)
                            }
                            else{
                                existcurve.push(Pooints);
                            }
                        }
                        setImage(obj.uploadimage);
                        // console.log("uploadimage",obj.uploadimage);
                        // console.log("existline",existline);
                        setLines(existline)
                        setCanvasPoints(existcurve)
                    })  
                }
            }
            
    }

    const handleChange = (event, index, line) => {
        const { name, value, type, checked } = event.target
        lines[index][name] = value;
        setLines([...lines])
    }

    const handleCheckBox = (event, index, line) => {
        const { name, value } = event.target
        console.log('"�ndex and line===?',index,line);
        console.log("name,value,type,checked==>", name, value, event.target.type, event.target.checked);
        if (mouseOver && event.target.checked === true) {
            lines[index]["isChecked"] = true;
            console.log("newlines after click from handleCheckBox==>", lines);
            setLines([...lines])
            setLineColor(true);
        } else {
            lines[index]["isChecked"] = false;
            console.log("newlines from handleCheckBox==>", lines);
            // setLines([...lines])
            setLineColor(false);
        }

        const newLabelDataArray = labelDataArray;
        
        if (event.target.checked) {
            newLabelDataArray.push(line);
            setLabelDataArray(newLabelDataArray)
            setLines([...lines])
        }
    }

    const handleDeleteLine = (lineId) => {
        console.log("lineid from delete===>", lineId);
        const newLines = lines.filter(line => line.id !== lineId)
        setLines(newLines)
    }

    const handleDeleteLabelLine = (index,lineId)=>{
        const newLabelsData = labels[index].data.filter(line => line.id !== lineId );
        setLabels(...labels,newLabelsData);
    }

    const handleModel = () => {
        setModel(!model);
    };
    const handleSelect = () => {
        setTool("");
        setSelect(true);
    };
    const handleMouseDown = (e) => {
        document.body.style.cursor="default";
        stroke = "";
        dash = [];
        if (tool !== "") {
            isDrawing.current = true;
            const stage = e.target.getStage();
            stage.draggable(false);
            setCommon(stage);
            const pos = getRelativePointerPosition(stage);
            setSelect(false);
            if (tool === "Wall") {
                strokewidth = 3;
                stroke = "#B168DE";
                dash = [];
            } else if (tool === "Exterior") {
                strokewidth = 3;
                stroke = "#B168DE";
                dash = [];
            } else if (tool === "Interior") {
                strokewidth = 3;
                stroke = "#707070";
                dash = [];
            } else if (tool === "MEASURE") {
                strokewidth = 3;
                stroke = "#075BD9";
                dash = [];
                measurementSubType = 'carpet'
            } else if (tool === "Partition") {
                strokewidth = 3;
                stroke = "#737373";
                dash = [5, 20];
            }
            startX = pos.x;
            startY = pos.y;
            // if (tool === "undo") {
            //     setlines();
            // }
        }
    };

    const setlines = (e) => {
        if (points.length > 0) {
            // console.log("points in loop", points);
            console.log('points list===>',points);
            for (var i = 0; i < points.length; i++) {
                // console.log("i value is ===>", i);
                var line = points[i];
                let tools = line.tool;
                let strokes = line.stroke;
                let dashs = line.dash;
                let strokewidths = line.strokewidth;
                var type = '';
                var subType = '';
                if (tool === "Exterior") {
                    type = 'Wall'
                    subType = "EXTERIOR"
                } else if (tool === "Interior") {
                    type = 'Wall'
                    subType = "INTERIOR"
                } else if (tool === "MEASURE") {
                    console.log('measure-----');
                    type = 'MEASURE'
                    subType = 'CARPET'
                } else if (tool === "Partition") {
                    type = 'Wall'
                    subType = "PARTITION"
                }
                setLines([
                    ...lines,
                    {
                        uid: uuid(),
                        gid:"",
                        aid:"",
                        name: `Line ${i + 1}`,
                        isChecked: false,
                        isGroup:false,
                        tool: tools,
                        stroke: strokes,
                        dash: dashs,
                        strokewidth: strokewidths,
                        x1:line.startX,
                        y1:line.startY,
                        x2:line.endX,
                        y2:line.endY,
                        type:type,
                        varient:"line",
                        sub_type:subType,
                        points: [line.startX, line.startY, line.endX, line.endY],
                    },
                ]);
                setNotCheckedLines([
                    ...lines,
                    {
                        uid: uuid(),
                        gid:"",
                        aid:"",
                        name: `Line ${i + 1}`,
                        isChecked: false,
                        tool: tools,
                        stroke: strokes,
                        dash: dashs,
                        strokewidth: strokewidths,
                        x1:line.startX,
                        y1:line.startY,
                        x2:line.endX,
                        y2:line.endY,
                        type:type,
                        varient:"line",
                        sub_type:subType,
                        points: [line.startX, line.startY, line.endX, line.endY],
                    },
                ]);
                // console.log('lines in  setLInes==>',lines);

            }
        }
    };

    const setcanvaspointfunction = (CanvasHistory) =>{
        if(CanvasHistory.length > 0){
          for (let i = 0; i < CanvasHistory.length; i++) {
            const shapeele = CanvasHistory[i];
            setCanvasPoints([...canvasPoints,
              {
                uid:uuid(),
                gid:"",
                aid:"",
                name:`Curve ${i+1}`,
                isChecked:false,
                x1: shapeele.startx,
                y1:shapeele.starty,
                q1:shapeele.centerx,
                q2:shapeele.centery,
                x2:shapeele.endx,
                y2:shapeele.endy,
                points:shapeele.points,
                stroke:shapeele.stroke,
                varient:"Path",
                strokeWidth: shapeele.strokeWidth,
                dash: shapeele.dash
              },
            ])
          }
        }
      }

    const undosetlines = (point) => {
        if (point.length > 0) {
            for (var i = 0; i < point.length; ++i) {
                var line = point[i];
                let tools = line.tool;
                let strokes = line.stroke;
                let dashs = line.dash;
                let pointss = line.points;
                let strokewidths = line.strokewidth;
                setLines([
                    ...lines,
                    {
                        id: uuid(),
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
        document.body.style.cursor="default";
        if (tool !== "") {
            if (!isDrawing.current) {
                return;
            }
            const stage = e.target.getStage();
            setCommon(stage);
            const point = getRelativePointerPosition(stage);;
            mouseX = point.x;
            mouseY = point.y;
        }
    };
    const handleMouseUp = (e) => {
        // console.log("handleMouseUp at line 240===>", e);
        if (tool !== "" && mouseY !== "" && mouseX !== "") {
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
            setlines(e);
            // let linearray = e.currentTarget.children[0].children;
            // console.log("linear array==>", linearray);
        }
    };
    const  getRelativePointerPosition = (node) => {
        // the function will return pointer position relative to the passed node
        var transform = node.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
    
        // get pointer (say mouse or touch) position
        var pos = node.getStage().getPointerPosition();
    
        // now we find relative point
        return transform.point(pos);
      }
    const handleWheel = (e) => {
        setTool("");
        setId(0);
        setModel(false);
        setSelect(false);
        document.body.style.cursor="grab";
        var width = window.innerWidth;
        var height = window.innerHeight;
        const stage = e.target.getStage({
            container: "canvas",
            width: width,
            height: height,
        });
        setCommon(stage);
        stage.draggable(true);
        if(stage.draggable(true)){
            document.body.style.cursor="grab";
        }
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
        stage.position(newPos);
        stage.batchDraw();
    };

    const zoomIn = (e) => {
        if (common === "") {
            return;
        }
        var stage = common;
        stage.draggable(true);
        setTool("");
        setId(0);
        setModel(false);
        setSelect(false);
        var oldScale = stage.scaleX();
        var pointer = stage.getPointerPosition();

        var mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };
        var newScale = e.deltaY > 0 ? oldScale * scaleBy : oldScale * scaleBy;
        stage.scale({ x: newScale, y: newScale });

        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
        stage.batchDraw();
    };

    const zoomOut = (e) => {
        if (common === "") {
            return;
        }
        var stage = common;
        stage.draggable(true);
        setTool("");
        setId(0);
        setModel(false);
        setSelect(false);
        var oldScale = stage.scaleX();
        var pointer = stage.getPointerPosition();
        var mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };
        var newScale = e.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        stage.scale({ x: newScale, y: newScale });

        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
        stage.batchDraw();
    };
    const undo = () => {
        if (lines.length === 0) {
            return;
        } else {
            // const previous = [];
            console.log('lines',lines);
            let prev = lines.pop();
            // lines.pop();
            setHistory([...history,prev]);
            console.log('previous', prev);
            // lines.pop();
            points.pop();
            setPrevious(prev);
            console.log('undolines', history);
            setLines([...lines]);
        }
    };
    const reset = (e) => {
        lines.length = 0;
        points.length = 0;
        setLines([]);
        setCanvasPoints([]);
        setFilteredLines([]);
        setLabels([]);
        undosetlines(lines);
    }
    const redo = () => {
        console.log('history',history);
        if (history.length === 0) {
            return;
        }
        else {
            console.log('sethistory==>', history);
            let next = history[history.length - 1];
            console.log('next===>',next);
            setRedoLines([...redoLines,next]);
            console.log('redoLines in redo==>',redoLines);
            console.log('lines in redo==>',lines);
            setLines([...lines,next]);
            history.pop();
        }
    }

    const handlemouseover = (e) => {
        document.body.style.cursor = "pointer";
    };
    const handlemouseout = (e) => {
        document.body.style.cursor = "default";
    };
    const handlepopup = (e) => {
        shape = e.target;
        // console.log('canvas', canvas);
        // console.log('e.target', e.target);
        s = e.target.attrs.points;
        if(s.length === 6){
            setReselect({
                startx: s[0],
                starty: s[1],
                centerx: s[2],
                centery: s[3],
                endx: s[4],
                endy: s[5],
                points:[s[0],s[1],s[2],s[3],s[4],s[5]],
                stroke: shape.attrs.stroke,
                strokeWidth: shape.attrs.strokeWidth,
                dash: shape.attrs.dash
            });
        }
        else{
            setReselect({
                startx: s[0],
                starty: s[1],
                endx: s[2],
                endy: s[3],
                stroke: shape.attrs.stroke,
                points:[s[0],s[1],s[2],s[3]],
                strokeWidth: shape.attrs.strokeWidth,
                dash: shape.attrs.dash
            });
        }
        setCurve(false);
        // console.log('popup',shape);
        setPopup(true);
    };
    const handleCurveDragMove = (e) => {
        // console.log('handleCurveDragMove', e);
        // console.log('shape', shape);
        s = shape.attrs.points;
        if(s.length === 4){
            setBezierPoints({
                startx: Reselect.startx,
                starty:Reselect.starty,
                centerx: e.evt.clientX,
                centery: e.evt.clientY,
                endx:Reselect.endx,
                endy:Reselect.endy,
                stroke: Reselect.stroke,
                strokeWidth: Reselect.strokeWidth,
                dash: Reselect.dash
            });
        }
        else{
            setBezierPoints({
                startx: Reselect.startx,
                starty:Reselect.starty,
                centerx: e.evt.clientX,
                centery: e.evt.clientY,
                endx:Reselect.endx,
                endy:Reselect.endy,
                stroke: Reselect.stroke,
                strokeWidth: Reselect.strokeWidth,
                dash: Reselect.dash
            });
        }
        
        // console.log("bezierPoints move",bezierPoints);
        setHistory([
            ...history,
            {
                tool: shape.attrs.tool,
                stroke: shape.attrs.stroke,
                dash: shape.attrs.dash,
                strokewidth: shape.attrs.strokewidth,
                points: [shape.attrs.points[0], shape.attrs.points[1], shape.attrs.points[2], shape.attrs.points[3]],
            },
        ]);
        let list = lines.filter(
            (x) => x?.points.join("+") !== Reselect?.points.join("+")
        );
        setLines(list);
        points = points.filter(
            (x) => x?.points.join("+") !== Reselect?.points.join("+")
        );
    }
    const handleDragMoveUp = (e) =>{
        // console.log('handleDragMoveUp',e);
        // let s = shape.attrs.points;
        // console.log('dragup shape ===>',s);
        if(shape.attrs.points.length === 4){
            // console.log('dragup shape ===>',shape.attrs.points);
            // console.log('center points ===>',e.evt.clientX,e.evt.clientY);
            CanvasHistory.push({
                startx: Reselect.startx,
                starty:Reselect.starty,
                centerx: e.evt.clientX,
                centery: e.evt.clientY,
                endx:Reselect.endx,
                endy:Reselect.endy,
                points:[Reselect.startx,Reselect.starty,e.evt.clientX,e.evt.clientY,Reselect.endx,Reselect.endy],
                stroke:Reselect.stroke,
                strokeWidth: 3,
                dash: Reselect.dash
              })
            // console.log('CanvasHistory--4',CanvasHistory);
            // setCanvasPoints(CanvasHistory)
            // setCanvasPoints([CanvasHistory])
        }
        else{
            // console.log('madhan',e);
            CanvasHistory.push({
                startx: Reselect.startx,
                starty:Reselect.starty,
                centerx: e.evt.clientX,
                centery: e.evt.clientY,
                endx:Reselect.endx,
                endy:Reselect.endy,
                points:[Reselect.startx,Reselect.starty,Reselect.centerx,Reselect.centery,Reselect.endx,Reselect.endy],
                stroke:Reselect.stroke,
                strokeWidth: 3,
                dash: Reselect.dash
            })
        }
        // setCanvasPoints(CanvasHistory)
        console.log("CanvasHistory--all",CanvasHistory);
        // setCanvasPoints([CanvasHistory])
        setcanvaspointfunction(CanvasHistory);
        setBezierPoints([]);
        s = null;
        setPopup(false);
      };
    const handleCurve = (e) => {
        // console.log("Shapes sh",shape);
        if(s.length === 4){
            setBezierPoints({
                startx: Reselect.startx,
                starty:Reselect.starty,
                centerx:s[0]/4,
                centery:s[1]/2,
                endx:Reselect.endx,
                endy:Reselect.endy,
                points:[Reselect.startx,Reselect.starty,Reselect.startx/4,Reselect.starty/2,Reselect.endx,Reselect.endy],
                stroke:Reselect.stroke,
                strokeWidth: Reselect.strokeWidth,
                dash: Reselect.dash
            });
          }
          else{
            setBezierPoints({
              startx: Reselect.startx,
              starty:Reselect.starty,
              centerx:Reselect.centerx,
              centery:Reselect.centery,
              endx:Reselect.endx,
              endy:Reselect.endy,
              points:[Reselect.startx,Reselect.starty,Reselect.centerx,Reselect.centery,Reselect.endx,Reselect.endy],
              stroke:Reselect.stroke,
              strokeWidth: Reselect.strokeWidth,
              dash: Reselect.dash
            });
            let list = canvasPoints.filter(
              (x) => x?.points.join("+") !== Reselect.points.join("+")
            );
            // console.log("OnCurve",Reselect);
            setCanvasPoints(list);
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
                points: [shape.attrs.points[0], shape.attrs.points[1], shape.attrs.points[2], shape.attrs.points[3]],
            },
        ]);
        let list = lines.filter(
            (x) => x?.points.join("+") !== Reselect?.points.join("+")
        );
        setLines(list);
        points = points.filter(
            (x) => x?.points.join("+") !== Reselect?.points.join("+")
        );
        // console.log('canvas', canvas);
        // console.log('handleCurve', shape);
    };

  
// console.log('main lines array==>',lines);
    const handleDelete = (e) => {
        // console.log("e from madan's delete", shape);
        setHistory([
            ...history,
            {
                tool: shape.attrs.tool,
                stroke: shape.attrs.stroke,
                dash: shape.attrs.dash,
                strokewidth: shape.attrs.strokewidth,
                points: [shape.attrs.points[0], shape.attrs.points[1], shape.attrs.points[2], shape.attrs.points[3]],
            },
        ]);
        let list = lines.filter(
            (x) => x?.points.join("+") !== shape?.attrs?.points.join("+")
        );
        // console.log("lines==============>", lines);
        setLines(list);
        let can = canvasPoints.filter(
            (x) => x?.points.join("+") !== shape?.attrs?.points.join("+")
          );
          setCanvasPoints(can);
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
        console.log("file",file)
        let reader = new FileReader();
        var url = reader.readAsDataURL(file);
        // console.log(url);
        reader.onloadend = (e) => {
            selectedFile = e.currentTarget.result;
            uploadImage = selectedFile
            console.log(uploadImage);
            setImage(selectedFile);
        };
        // console.log(reader);
    };

    useEffect(() => {
        // setLines();
        // console.log("hiiii")
        const handleEsc = (event) => {
            if (event.keyCode === 27) 
                // onEscape();
                // console.log("esc key pressed");
                setTool("");
                setId(0);
                startX = "";
                startY = "";
                mouseX = "";
                mouseY = "";
                points = [];
                // console.log(startX,startY);
        };
        window.addEventListener('keydown', handleEsc);
        // console.log(this.params);
        console.log("itsworking");
        // var object = [{"lines":[{"id":"5c2f03b-05b1-4e63-853b-06fb615a3bbf","lineName":"Line 1","isChecked":false,"tool":"Measurement","stroke":"blue","dash":[],"strokewidth":3,"points":[280,114,583,95]},{"id":"cf8ce1a-238-5824-33dd-452e65d08f0f","lineName":"Line 2","isChecked":false,"tool":"Measurement","stroke":"blue","dash":[],"strokewidth":3,"points":[418,206,765,115]}]},{"curve":[]}]
        // // var obj = JSON.parse(object);
        // // console.log('obj',obj[0].lines);
        // // console.log('objcurve',obj[1]);
        // console.log(labels);
        if(!setDrawCanvasInitialState){
            handleLoadCanvas()
            // setLines(object[0].lines)
            // setCanvasPoints(object[1].curve);
            setDrawCanvasInitialState=true;
        }
      
    }, [lines]);

    

    const handleSaveLoad = () => {
        console.log('save lines ==>',lines);
        console.log('save shapes ==>',canvasPoints);
        // let allPoints = [
        //     {
        //         'lines':lines,
        //     },
        //     {
        //         'curve':canvasPoints
        //     },
        //     {
        //         'group':labels
        //     }
        // ]
        let linesAndCurves = [
            {
                'lines':lines,
            },
            {
                'curve':canvasPoints
            },
        ]

        const result = linesAndCurves.reduce((acc, x) => {
            if(x.lines){
                acc = acc.concat(x.lines);
            }
        if(x.curve){
                acc = acc.concat(x.curve);
            }
        
            return acc;
        }, []);

        // let allPoints = {
        //         'dimensions':result,
        //         'group':labels
        //     };
        
        //     return acc;
        // };

        let allPoints = {
                'dimensions':result,
                'group':labels,
                'uploadimage':uploadImage
            };
        

        // let urlElements = window.location.href.split('/'); this is not required
        console.log(props.match.params.floorid);
        console.log("allPoints",allPoints);
        if(lines.length !== 0 || canvasPoints.length !== 0){
            try{
                // let fileData = JSON.stringify(allPoints);
                // fs.writeFileSync('awesome.txt', fileData);
                // console.log('success');
                function downloadDraw(content, fileName, contentType) {
                    var anchor = document.createElement("a");
                    var file = new Blob([content], {type: contentType});
                    anchor.href = URL.createObjectURL(file);
                    anchor.download = fileName;
                    anchor.click();
                }
                downloadDraw(JSON.stringify(allPoints), 'json.txt', 'text/plain');
                let element = document.createElement("input");
                element.setAttribute("type","file");
                element.setAttribute("class","custom-file-input");
                element.setAttribute("id","custom-file-inputs");
                document.getElementsByTagName("body")[0].append(element)
                element.addEventListener("change", function () {
                    var myHeaders = new Headers();
                    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("authToken")}`);
                    // myHeaders.append("Cookie", "__cfduid=d3836be0a2e132b22fc9584ac19f5d8441605698523");

                    var formdata = new FormData();
                    formdata.append("floor", props.match.params.floorid);
                    // above floor id needs to be made dynamic
                    formdata.append("dist", "{}");
                    formdata.append("data", this.files[0], this.files[0].name);

                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: formdata,
                        redirect: 'follow'
                    };

                    fetch("https://nbk.synctactic.ai/blobs/", requestOptions)
                        .then(response => response.text())
                        .then(result => 
                            console.log("Empty Success:", result),
                            document.getElementById("custom-file-inputs").remove(),
                            // alert('Saved Successfully. Ready to Publish'),
                            toast('Saved Successfully. Ready to Publish')
                            // window.location.href="/listingProjects"
                        )
                        .catch(error => console.log('error', error));
                });

            }catch(e){
                console.log(e);
            }
        // this.jsonexport(lines);
        // let urlElements = window.location.href.split('/');
        // console.log(props.match.params.floorid);
        // var csvUrl;
        // let csvContent = "data:text/csv;charset=utf-8,";
        // // let rows;
        // allPoints.forEach(function(rows) {
        //     console.log("allpoints rows",rows);
        //     // let row = rows.join(",");
        //     csvContent += JSON.stringify(rows) + "\r\n";
        // });
        // var encodedUri = encodeURI(csvContent);
        // window.open(encodedUri);
        // jsonexport(allPoints, function(err, csv){
        //     if (err) return console.error(err);
        //     var myURL = window.URL || window.webkitURL //window.webkitURL works in Chrome and window.URL works in Firefox
        //     var csv = csv;  
        //     let blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });  
        //     // saveAs(blob, "hello world.txt");
        //     csvUrl = myURL.createObjectURL(blob);
        //     // csvUrl = Object.assign(new Blob([csv]), { lastModifiedDate: new Date(), name: 'blobname',type:"text/plain" });
        //     // csvUrl = new File(myURL.createObjectURL(blob), 'blobfilename', { type: 'mime' });
        //     // let window2 = window.open(csvUrl, 'log.' + new Date() + '.txt');
        //     // window2.onload = e => window.URL.revokeObjectURL(csvUrl);
        //     console.log("Import data",csv);
        //     console.log("Import dataurl",csvUrl);
        // });
        // const formData = {
        //     floor: props.match.params.floorid,
        //     dict: "Canvas",
        //     data: csvUrl,
        // }
        // // 'HTTP_CONTENT_DISPOSITION': 
        // axios.post("https://nbk.synctactic.ai/blobs/", formData,{
        //     headers: {
        //         "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        //         // "Access-Control-Allow-Origin":"*",
        //         "Content-Type": "multipart/form-data,boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW,application/x-www-form-urlencoded",
        //         // "Access-Control-Allow-Methods":"POST",
        //         "Content-Disposition": "attachment,filename:"+csvUrl,
        //         // "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        //     },
        // })
        //     .then(response => {
        //         console.log(response.data)
        //     })
        //     .catch(error => {
        //         console.log(error)
        //     })

        }
        else{
        alert('Draw Something');
        }
    }
    const handlePublish = () => {
        let urlElements = window.location.href.split('/');
        // console.log(props.match.params.floorid);
        let floorId = props.match.params.floorid;
        // let blob = 26;
        try{
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("authToken")}`);
            var formdata = new FormData();
            // formdata.append("id", floorId);
            // formdata.append("status", "MEASURE");
            // above floor id needs to be made dynamic
            // formdata.append("dict", "{}");
            // formdata.append("data", "{}");
            formdata.append("status", "MEASURE");
            var requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            fetch("https://nbk.synctactic.ai/floors/"+floorId+"/", requestOptions)
                .then(response => response.text())
                .then(result => 
                    console.log("Success:", result),
                    // alert(''),
                    toast('Published Successfully'),
                    window.location.href="/listingProjects"
                )
                .catch(error => console.log('error', error));
        }catch(e){
            console.log(e);
        }
        // alert(floorId+","+blob)
    }
    const onReset=()=>{
        console.log("reset")
    }
    const onUndo=()=>{
        
    }
    const onRedo=()=>{
        
    }
    // console.log('@labels==>',labels);
    return (
        <div className="wrapper">
            <div id="content">
            <style>
                {`
                 body {
                    background-image: url("../../assets/Bitmap.png")!important;
                    overflow:hidden!important
                  }
                  .custom-file-input{
                    position: absolute;
                    z-index: 2;
                    width: 19%;
                    height: calc(0.5em + .5rem + 1px);
                    margin: 0;
                    opacity: 1;
                    top: 0;
                    left: 60rem;
                    background: #ffff;
                    padding: 29px 38px 53px;
                  }
                  .custom-file-input::-webkit-file-upload-button {
                    visibility: hidden;
                  }
                  .custom-file-input::before {
                    content: 'Upload File';
                    display: inline-block;
                    background: linear-gradient(top, #f9f9f9, #e3e3e3);
                    border: 1px solid #999;
                    border-radius: 3px;
                    padding: 5px 8px;
                    outline: none;
                    white-space: nowrap;
                    -webkit-user-select: none;
                    cursor: pointer;
                    text-shadow: 1px 1px #fff;
                    font-weight: 700;
                    font-size: 10pt;
                  }
                  .custom-file-input:hover::before {
                    border-color: black;
                  }
                  .custom-file-input:active::before {
                    background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
                  }
                `}
            </style>
                {/* <CanvasView />  */}
                <div>
                    {select === true ? (
                        <React.Fragment>
                            {/* {canvas ?
                                (<div>
                                    <CanvasApp line={tool} image={uploadImage} onReset={onReset} onUndo={onUndo} onRedo={onRedo}></CanvasApp>
                                </div>
                                )
                                :
                                <CanvasApp line={tool} image={uploadImage} onReset={onReset} onUndo={onUndo} onRedo={onRedo} ></CanvasApp>
                            } */}
                            <section className="buttons">
                                <ul>
                                    <li className={id === 1 ? "active" : ""}>
                                        <img src="../../assets/select.png" alt="select" className="selectimg" onClick={(e) => {
                                            handleSelect();
                                            setModel(false);
                                            setId(1);
                                        }} />
                                        <label
                                            onClick={(e) => {
                                                handleSelect();
                                                setModel(false);
                                                setId(1);
                                            }}
                                        >
                                            Select
              </label>
                                    </li>
                                    <li className={id === 2 ? "active" : ""}>
                                        <img src="../../assets/wall.png" alt="select" className="wallimg" onClick={(e) => {
                                            handleModel();
                                            setSelect(false);
                                            setId(2);
                                        }} />
                                        <label
                                            onClick={(e) => {
                                                handleModel();
                                                setSelect(false);
                                                setId(2);
                                            }}
                                        >
                                            Wall
              </label>
                                    </li>
                                    <li className={id === 3 ? "active" : ""}>
                                        <img
                                            src="../../assets/measure.png"
                                            alt="select"
                                            className="measureimg"
                                            onClick={(e) => {
                                                setTool("MEASURE");
                                                setModel(false);
                                                setSelect(false);
                                                setId(3);
                                            }}
                                        />
                                        <label
                                            onClick={(e) => {
                                                setTool("MEASURE");
                                                setModel(false);
                                                setSelect(false);
                                                setId(3);
                                            }}
                                        >
                                            Measurement
              </label>
                                    </li>

                                    <li className={id === 4 ? "active" : ""}>
                                        <img src="../../assets/insert.png" alt="select" className="insertimg" onChange={fileSelectHandler} 
                                            onClick={(e) => {
                                                setModel(false);
                                                setSelect(false);
                                                setId(4);
                                            }} />
                                        <label htmlFor="file" className=" inse">
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
                                        <img src="../../assets/undo.png" alt="select" className="undoimg" onClick={(e) => {
                                            onUndo();
                                            setId(5);
                                            setModel(false);
                                            setSelect(false);
                                            setTool("undo");
                                        }} />
                                        <label
                                            onClick={(e) => {
                                                onUndo();
                                                setId(5);
                                                setModel(false);
                                                setSelect(false);
                                            }}
                                        >
                                            Undo
              </label>
                                    </li>
                                    <li className={id === 6 ? "active" : ""}>
                                        <img src="../../assets/redo.png" alt="select" className="redoimg" onClick={(e) => {
                                            onRedo()
                                            setId(6);
                                            setModel(false);
                                            setSelect(false);
                                        }} />
                                        <label onClick={(e) => {
                                            redo();
                                            setId(6);
                                            setModel(false);
                                            setSelect(false);
                                        }}>Redo</label>
                                    </li>
                                    <li className={id === 7 ? "active" : ""}>
                                        <img src="../../assets/reset.png" alt="reset" className="resetimg" onClick={(e) => {
                                            reset()
                                            setId(7);
                                            setModel(false);
                                            setSelect(false);
                                        }} />
                                        <label onClick={(e) => {
                                            reset()
                                            setId(7);
                                            setModel(false);
                                            setSelect(false);
                                        }}>Reset</label>
                                    </li>
                                    <li className={id === 8 ? "active" : ""}>
                                        <img src="../../assets/save.png" alt="save" className="saveimg" onClick={(e) => {
                                            handleSaveLoad()
                                            setId(8);
                                            setModel(false);
                                            setSelect(false);
                                        }} />
                                        <label onClick={(e) => {
                                            handleSaveLoad()
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
                                           
                                            <label htmlFor="inte"> Interior</label>
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
                                            <label htmlFor="part"> Partition</label>
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
                                            <label htmlFor="exte"> Exterior</label>
                                        </li>
                                    </ul>
                                </section>
                            )}
                            {popup && (
                                <div className="list_pop" style={rightclickPopup}>
                                    <img
                                        src="../../assets/curve.png"
                                        title="Curve"
                                        alt="select"
                                        onClick={(e) => {
                                            handleCurve(e);
                                        }}
                                        className="undoimgs"
                                    />
                                    <img
                                        src="../../assets/delete.png"
                                        title="Delete"
                                        alt="select"
                                        onClick={(e) => {
                                            handleDelete();
                                        }}
                                        className="undoimgs"
                                    />
                                </div>
                            )}
                            <img src="../../assets/back_img.png" alt="home" className="homeimg" />
                            <button className="btn btn-outline-primary publish" onClick={(e) => {
                            // handleSharePopup(!SharePopup)
                            handlePublish()
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
                            <img src="../../assets/back_img.png" style={{cursor:"pointer"}} alt="home" className="homeimg" onClick={props.history.goBack}/>
                            <span className="homeback" style={{cursor:"pointer"}} onClick={props.history.goBack}>{props.match.params.projectName} </span>
                            
                        </React.Fragment>
                    ) : (
                            <React.Fragment>
                                <CanvasApp line={tool} image={uploadImage} onReset={onReset} onUndo={onUndo} onRedo={onRedo}></CanvasApp>
                                <section className="buttons">
                                    <ul>
                                        <li className={id === 1 ? "active" : ""}>
                                            <img src="../../assets/select.png" alt="select" className="selectimg" onClick={(e) => {
                                                handleSelect();
                                                setModel(false);
                                                setId(1);
                                            }} />
                                            <label
                                                onClick={(e) => {
                                                    handleSelect();
                                                    setModel(false);
                                                    setId(1);
                                                }}
                                            >
                                                Select
              </label>
                                        </li>
                                        <li className={id === 2 ? "active" : ""}>
                                            <img src="../../assets/wall.png" alt="select" className="wallimg" onClick={(e) => {
                                                handleModel();
                                                setSelect(false);
                                                setId(2);
                                            }} />
                                            <label
                                                onClick={(e) => {
                                                    handleModel();
                                                    setSelect(false);
                                                    setId(2);
                                                }}
                                            >
                                                Wall
              </label>
                                        </li>
                                        <li className={id === 3 ? "active" : ""}>
                                            <img
                                                src="../../assets/measure.png"
                                                alt="select"
                                                className="measureimg"
                                                onClick={(e) => {
                                                    setTool("MEASURE");
                                                    setModel(false);
                                                    setSelect(false);
                                                    setId(3);
                                                    document.body.style.cursor="default"
                                                }}
                                            />
                                            <label
                                                onClick={(e) => {
                                                    setTool("MEASURE");
                                                    setModel(false);
                                                    setSelect(false);
                                                    setId(3);
                                                }}
                                            >
                                                Measurement
                                            </label>
                                        </li>

                                        <li className={id === 4 ? "active" : ""}  >
                                            <img src="../../assets/insert.png" alt="select" className="insertimg" onChange={fileSelectHandler} 
                                                onClick={(e) => {
                                                    setModel(false);
                                                    setSelect(false);
                                                    setId(4);
                                                }} />
                                            <label htmlFor="file" className=" inse">
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
                                            <img src="../../assets/undo.png" alt="select" className="undoimg" onClick={(e) => {
                                                undo();
                                                setId(5);
                                                setModel(false);
                                                setSelect(false);
                                            }} />
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
                                            <img src="../../assets/redo.png" alt="select" className="redoimg" onClick={(e) => {
                                                onRedo()
                                                setId(6);
                                                setModel(false);
                                                setSelect(false);
                                            }} />
                                            <label onClick={(e) => {
                                                onRedo()
                                                setId(6);
                                                setModel(false);
                                                setSelect(false);
                                            }}>Redo</label>
                                        </li>
                                        <li className={id === 7 ? "active" : ""}>
                                            <img src="../../assets/reset.png" alt="reset" className="resetimg" onClick={(e) => {
                                                reset()
                                                setId(7);
                                                setModel(false);
                                                setSelect(false);
                                            }} />
                                            <label onClick={(e) => {
                                                reset()
                                                setId(7);
                                                setModel(false);
                                                setSelect(false);
                                            }}>Reset</label>
                                        </li>
                                        <li className={id === 8 ? "active" : ""}>
                                            <img src="../../assets/save.png" alt="save" className="saveimg" onClick={(e) => {
                                                handleSaveLoad()
                                                setId(8);
                                                setModel(false);
                                                setSelect(false);
                                            }} />
                                            <label onClick={(e) => {
                                                handleSaveLoad()
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
                                                <label htmlFor="inte"> Interior</label>
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
                                                <label htmlFor="part"> Partition</label>
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
                                                <label htmlFor="exte"> Exterior</label>
                                            </li>
                                        </ul>
                                    </section>
                                )}
                                <img src="../../assets/back_img.png" style={{cursor:"pointer"}} alt="home" className="homeimg" onClick={props.history.goBack}/>
                                <span className="homeback" style={{cursor:"pointer"}} onClick={props.history.goBack}>{props.match.params.projectName} </span>
                                                {/* <span className="" >{}</span> */}
                                <button className="btn btn-outline-primary publish" onClick={(e) => {
                                // handleSharePopup(!SharePopup)
                                handlePublish()
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
                               
                            </React.Fragment>
                        )
                        
                    }
                </div>

            </div>
            
            <button type="button" id="sidebarCollapse" className="btn btn-info" onClick={(e) => {
                sideNavbarStyle(!sideNavbar)
            }}>
                <span>
                   {sideNavbar === true ? <i className="fas fa-chevron-right"></i> : <i className="fas fa-chevron-left"></i> } 
                </span>
            </button>
            {sideNavbar && 
            <nav id="sidebar">
                <ul className="list-unstyled components">
                    <div className="header row">
                        <div className="col-10">
                            <h2 className="mt-2 ml-8">Room Planner</h2>
                        </div>
                        <div className="col-4">
                            {/* <i className="fa fa-plus mt-2 pull-right"></i> */}
                        </div>


                    </div>
                    <ul className="category">
                            {
                                labels.length > 0 && labels.map((label,index) => (
                                    <li className="mt-2" key={index}>
                                        <div className="row category-header">
                                            <div className="col-8">
                                                <h3>{label.name}</h3>
                                            </div>
                                            {/* <div className="col-4">
                                                <i className="fa fa-pencil-square-o mt-2"></i>
                                            </div> */}
                                            {label.data && label.data.map((labeldata, i) => {
                                                return (
                                                    <ul className="second-level">
                                                        <li key={labeldata.id}>
                                                            <div className="row ">
                                                                <div className="col-2 ">
                                                                    <span>
                                                                        <p className="count">
                                                                            {i + 1}
                                                                        </p>
                                                                    </span>
                                                                </div>
                                                                <div className="col-5">
                                                                    <p>{labeldata.name}</p>
                                                                </div>
                                                                {/* <div className="col-5 group-icons">
                                                                    <i className="fa fa-pencil-square-o"></i>
                                                                    <i className="fa fa-trash ml-3"></i>
                                                                </div> */}
                                                            </div>
                                                        </li>
                                                    </ul>
                                                )
                                            })
                                            }
                                        </div>
                                    </li>
                                ))

                            }
                            {lines.filter(line => line.isGroup === false).map((line, i) => {
                                return (
                                    <ul className="second-level">
                                        <li key={line.id}>
                                            <div className="row">
                                                <div className="col-2 ">
                                                    <span>
                                                        <p className="count ml-2">
                                                            {i + 1}
                                                        </p>
                                                    </span>
                                                </div>
                                                <div className="col-4">
                                                    {lines[i].name !== '' && <input type="text" name="lineName" value={line.name} onChange={(e) => handleChange(e, i, line)} />}
                                                </div>

                                                <div className="col-6">
                                                    <input type="checkbox" name="isChecked"
                                                        checked={line.isChecked ? true : false}
                                                        onMouseOver={() => setMouseOver(!mouseOver)}
                                                        onMouseOut={() => setMouseOver(!mouseOver)}
                                                        onChange={(e) => handleCheckBox(e, i, line)} />
                                                    <i className="fa fa-trash ml-3" onClick={(e) => handleDeleteLine(line.id)}></i>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                )
                            })
                            }
                    </ul>
                    <div className="footer">
                        <h3>
                            <a href="#" data-toggle="modal" data-target="#myModal">
                                Group By
                       </a>
                        </h3>
                    </div>

                </ul>
            </nav>
        }
            <div id="myModal" className="modal fade" role="dialog">
                <div className="modal-dialog">

                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="text-center">Create New</p>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form className="create-form m-0">
                                <div className="form-group">
                                    <input type="text" name="labelName" value={labelName} onChange={handleLabel} className="form-control" required />
                                </div>
                                <button type="submit" className="create_btn" onClick={handleSave}>Save</button>
                                <span className="btn btn-cancel">&nbsp; Cancel</span>

                            </form>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    )
}

export default SidePane1;