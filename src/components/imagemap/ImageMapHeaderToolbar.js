import React, { Component } from "react";
import PropTypes from "prop-types";
import i18n from "i18next";

import { FlexBox, FlexItem } from "../flex";
import ImageMapList from "./ImageMapList";
import { CommonButton } from "../common";
import Icon from "../icon/Icon";

class ImageMapHeaderToolbar extends Component {
  static propTypes = {
    canvasRef: PropTypes.any,
    selectedItem: PropTypes.object,
    descriptors: PropTypes.object,
  };


    /* eslint-disable react/sort-comp, react/prop-types */
    handlers = {
        onAddItem: (item, centered) => {
            const { canvasRef } = this.props;
            if (canvasRef.handler.workarea.layout === 'responsive') {
                if (!canvasRef.handler.workarea.isElement) {
                    notification.warn({
                        message: 'Please your select background image',
                    });
                    return;
                }
            }
            if (canvasRef.handler.interactionMode === 'polygon') {
                message.info('Already drawing');
                return;
            }
            const id = uuid();
            const option = Object.assign({}, item.option, { id });
            if (item.option.type === 'svg' && item.type === 'default') {
                this.handlers.onSVGModalVisible(item.option);
                return;
            }
            canvasRef.handler.add(option, centered);
        },
        onAddSVG: (option, centered) => {
            const { canvasRef } = this.props;
            canvasRef.handler.add({ ...option, type: 'svg', id: uuid(), name: 'New SVG' }, centered);
            this.handlers.onSVGModalVisible();
        },
        onDrawingItem: (item) => {
            const { canvasRef } = this.props;
            if (canvasRef.handler.workarea.layout === 'responsive') {
                if (!canvasRef.handler.workarea.isElement) {
                    notification.warn({
                        message: 'Please your select background image',
                    });
                    return;
                }
            }
            if (canvasRef.handler.interactionMode === 'polygon') {
                message.info('Already drawing');
                return;
            }
            if (item.option.type === 'line') {
                canvasRef.handler.drawingHandler.line.init();
            }
               else if (item.option.type === 'dottedline') {
                   console.log("heree")
                    canvasRef.handler.drawingHandler.dottedline.init();
            } 
            else if (item.option.type === 'measureroom') {
              console.log("heree")
               canvasRef.handler.drawingHandler.measureroom.init();
       } 
       else if (item.option.type === 'measurewall') {
        console.log("heree")
         canvasRef.handler.drawingHandler.measurewall.init();
 } 
            else if (item.option.type === 'partition') {
                console.log("heree")
                 canvasRef.handler.drawingHandler.partition.init();
         } 
         else if (item.option.type === 'arrow') {
                canvasRef.handler.drawingHandler.arrow.init();
            } else {
                canvasRef.handler.drawingHandler.polygon.init();
            }
        },
        onChangeActiveKey: (activeKey) => {
            this.setState({
                activeKey,
            });
        },
        onCollapse: () => {
            this.setState({
                collapse: !this.state.collapse,
            });
        },
        onSearchNode: (e) => {
            const filteredDescriptors = this.handlers.transformList().filter(descriptor => descriptor.name.toLowerCase().includes(e.target.value.toLowerCase()));
            this.setState({
                textSearch: e.target.value,
                filteredDescriptors,
            });
        },
        transformList: () => {
            return Object.values(this.props.descriptors).reduce((prev, curr) => prev.concat(curr), []);
        },
        onSVGModalVisible: () => {
            this.setState((prevState) => {
                return {
                    svgModalVisible: !prevState.svgModalVisible,
                };
            });
        },
    }

    events = {
        onDragStart: (e, item) => {
            this.item = item;
            const { target } = e;
            target.classList.add('dragging');
        },
        onDragOver: (e) => {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'copy';
            return false;
        },
        onDragEnter: (e) => {
            const { target } = e;
            target.classList.add('over');
        },
        onDragLeave: (e) => {
            const { target } = e;
            target.classList.remove('over');
        },
        onDrop: (e) => {
            e = e || window.event;
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            const { layerX, layerY } = e;
            const dt = e.dataTransfer;
            if (dt.types.length && dt.types[0] === 'Files') {
                const { files } = dt;
                Array.from(files).forEach((file) => {
                    file.uid = uuid();
                    const { type } = file;
                    if (type === 'image/png' || type === 'image/jpeg' || type === 'image/jpg') {
                        const item = {
                            option: {
                                type: 'image',
                                file,
                                left: layerX,
                                top: layerY,
                            },
                        };
                        this.handlers.onAddItem(item, false);
                    } else {
                        notification.warn({
                            message: 'Not supported file type',
                        });
                    }
                });
                return false;
            }
            const option = Object.assign({}, this.item.option, { left: layerX, top: layerY });
            const newItem = Object.assign({}, this.item, { option });
            this.handlers.onAddItem(newItem, false);
            return false;
        },
        onDragEnd: (e) => {
            this.item = null;
            e.target.classList.remove('dragging');
        },
    }


  renderItems = items => {
      console.log("items is :::",items);
    // return <FlexBox flexWrap="wrap" flexDirection="column" style={{ width: '100%' }}>
    //     {items.map(item => this.renderItem(item))}
    // </FlexBox>
    return items.map(item => this.renderItem(item))
  }

renderItem = (item, centered) => {
  console.log("item.name ::::",item.name);
  let color = 'red';
  let icon = item.icon.name;
  if(item.name === 'Exterior'){
    color = 'DeepPink'
  }else if(item.name === 'Interior'){
    color = 'blue'
  }else if(item.name === 'Measure Room'){
    color = 'green'
  }else if(item.name === 'Measure Wall'){
    color = 'Navy'
  }else if(item.name === 'Partition'){
    color = 'grey'
    icon = 'ellipsis-h'
  }
   return  item.type === 'drawing' ? (
        <div
            key={item.name}
            draggable
            onClick={e => this.handlers.onDrawingItem(item)}
        >
            <div style={{display:"flex","flex-direction":"column",justifyContent:"center",alignItems:"center" ,margin:"8px 10px"}}>
                <Icon name={icon} prefix={item.icon.prefix} style={item.icon.style} color={color} size = {1.5}/>
                <div>{item.name}</div>
            </div>
        </div>
    ) : (
        <div
            key={item.name}
            draggable
            onClick={e => this.handlers.onAddItem(item, centered)}
            onDragStart={e => this.events.onDragStart(e, item)}
            onDragEnd={e => this.events.onDragEnd(e, item)}
            // className="rde-editor-items-item"
            // style={{ justifyContent:  'center'}}
        >
            <div style={{display:"flex", "flex-direction":"column",justifyContent:"center",alignItems:"center",margin:"9px 10px"}}>
               <Icon name={item.icon.name} prefix={item.icon.prefix} style={item.icon.style} size = {1.5}/>
               <div>{item.name}</div>
            </div>
                    {/* <div className="">
                        {item.name}
                    </div> */}
        </div>
    )
                  }

  render() {
    const { canvasRef, selectedItem, descriptors } = this.props;
    console.log("descriptors inside ::::",descriptors);
    const isCropping = canvasRef
      ? canvasRef.handler.interactionMode === "crop"
      : false;
    console.log("prop", selectedItem);
    return (
      <FlexBox className="rde-editor-header-toolbar-container" flex="1" style={{"justify-content":"center"}}>
        {/* <FlexItem className="rde-canvas-toolbar rde-canvas-toolbar-list">
          <CommonButton
            className="rde-action-btn"
            style={{ height: "10px" }}
            shape="circle"
            icon="layer-group"
            tooltipTitle={i18n.t("action.canvas-list")}
          />
          <div className="rde-canvas-list">
            <ImageMapList canvasRef={canvasRef} selectedItem={selectedItem} />
          </div>
        </FlexItem> */}
        {/* <FlexItem className="rde-canvas-toolbar rde-canvas-toolbar-alignment">
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.bringForward()}
            icon="angle-up"
            tooltipTitle={i18n.t("action.bring-forward")}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.sendBackwards()}
            icon="angle-down"
            tooltipTitle={i18n.t("action.send-backwards")}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.bringToFront()}
            icon="angle-double-up"
            tooltipTitle={i18n.t("action.bring-to-front")}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.sendToBack()}
            icon="angle-double-down"
            tooltipTitle={i18n.t("action.send-to-back")}
          />
        </FlexItem> */}
        {/* <FlexItem className="rde-canvas-toolbar rde-canvas-toolbar-alignment">
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.alignmentHandler.left()}
            icon="align-left"
            tooltipTitle={i18n.t("action.align-left")}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.alignmentHandler.center()}
            icon="align-center"
            tooltipTitle={i18n.t("action.align-center")}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.alignmentHandler.right()}
            icon="align-right"
            tooltipTitle={i18n.t("action.align-right")}
          />
        </FlexItem> */}
        <FlexItem className="rde-canvas-toolbar rde-canvas-toolbar-group">
          <div style = {{"display":"flex","flex-direction":"column","margin":"0px 10px", "align-items":"center"}}>
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.toGroup()}
            icon="object-group"
            iconStyle={{fontSize:'1.5em'}}
            size = {2}
            tooltipTitle={i18n.t("action.object-group")}
          />
          <div style={{"cursor":"pointer","margin-top": "-5px"}} onClick={() => canvasRef.handler.toGroup()}>Group</div>
          </div>
          <div style = {{"display":"flex","flex-direction":"column","margin":"0px 10px", "align-items":"center"}}>
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.toActiveSelection()}
            icon="object-ungroup"
            iconStyle={{fontSize:'1.5em'}}
            size = {2}
            tooltipTitle={i18n.t("action.object-ungroup")}
          />
          <div style={{"cursor":"pointer","margin-top": "-5px"}} onClick={() => canvasRef.handler.toActiveSelection()}>Ungroup</div>
          </div>

          <div style = {{"display":"flex","flex-direction":"column","margin":"0px 10px", "align-items":"center"}}>
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.remove()}
            icon="trash"
            iconStyle={{fontSize:'1.5em'}}
            size = {2}
            tooltipTitle={i18n.t("action.delete")}
          />
          <div style={{"cursor":"pointer","margin-top": "-5px"}} onClick={() => canvasRef.handler.remove()}>Delete</div>
          </div>
          {Object.keys(descriptors).map((key) => this.renderItems(descriptors[key]))}
          <CommonButton
            className="rde-action-btn"
            disabled={
              isCropping ||
              (canvasRef && !canvasRef.handler.transactionHandler.undos.length)
            }
            onClick={() => canvasRef.handler.transactionHandler.undo()}
          >
            <div style={{"display":"flex","flex-direction":"column"}}>
            <Icon name="undo-alt"/>
            <div>Undo</div>
            </div>
          </CommonButton>
          <CommonButton
            className="rde-action-btn"
            disabled={
              isCropping ||
              (canvasRef && !canvasRef.handler.transactionHandler.redos.length)
            }
            onClick={() => canvasRef.handler.transactionHandler.redo()}
          >
           <div style={{"display":"flex","flex-direction":"column"}}>
            <Icon name="redo-alt"/>
            <div>Redo</div>
            </div>
          </CommonButton>
        </FlexItem>
        {/* <FlexItem className="rde-canvas-toolbar rde-canvas-toolbar-crop">
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={
              canvasRef ? !canvasRef.handler.cropHandler.validType() : true
            }
            onClick={() => canvasRef.handler.cropHandler.start()}
            icon="crop"
            tooltipTitle={i18n.t("action.crop")}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={
              canvasRef ? !canvasRef.handler.cropHandler.cropRect : true
            }
            onClick={() => canvasRef.handler.cropHandler.finish()}
            icon="check"
            tooltipTitle={i18n.t("action.crop-save")}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={
              canvasRef ? !canvasRef.handler.cropHandler.cropRect : true
            }
            onClick={() => canvasRef.handler.cropHandler.cancel()}
            icon="times"
            tooltipTitle={i18n.t("action.crop-cancel")}
          />
        </FlexItem> */}
        {/* <FlexItem className="rde-canvas-toolbar rde-canvas-toolbar-operation"> */}
          {/* <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.saveImage()}
            icon="image"
            tooltipTitle={i18n.t("action.image-save")}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.duplicate()}
            icon="clone"
            tooltipTitle={i18n.t("action.clone")}
          /> */}
          {/* <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.remove()}
            icon="trash"
            tooltipTitle={i18n.t("action.delete")}
          /> */}
          {/* <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handler.insertImage()}
            icon="image"
            tooltipTitle={'Insert'}
          /> */}
        {/* </FlexItem> */}
         
        {/* <FlexItem className="rde-canvas-toolbar">
          
        </FlexItem> */}
      </FlexBox>
    );
  }
}

export default ImageMapHeaderToolbar;
