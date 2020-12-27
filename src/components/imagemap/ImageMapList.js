import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import Icon from '../icon/Icon';
import { FlexBox, FlexItem } from '../flex';

class ImageMapList extends Component {
    static propTypes = {
        canvasRef: PropTypes.any,
        selectedItem: PropTypes.object,
    }

    state = {
        editingItem: null,
        editingValue: ''
    }

    isEditing = val => {
        console.log("val is::::",val);
        this.setState({editingItem:val})
    }
    renderActions = () => {
        const { canvasRef } = this.props;
        const idCropping = canvasRef ? canvasRef.handler.interactionMode === 'crop' : false;
        return (
            <FlexItem className="rde-canvas-list-actions" flex="0 1 auto">
                <FlexBox justifyContent="space-between" alignItems="center">
                    <FlexBox flex="1" justifyContent="center">
                        <Button className="rde-action-btn" style={{ width: '100%', height: 30 }} disabled={idCropping} onClick={e => canvasRef.handler.sendBackwards()}>
                            <Icon name="arrow-up" />
                        </Button>
                    </FlexBox>
                    <FlexBox flex="1" justifyContent="center">
                        <Button className="rde-action-btn" style={{ width: '100%', height: 30 }} disabled={idCropping} onClick={e => canvasRef.handler.bringForward()}>
                            <Icon name="arrow-down" />
                        </Button>
                    </FlexBox>
                </FlexBox>
            </FlexItem>
        );
    }
    handleChange = (obj1, e) => {
        const { canvasRef, selectedItem } = this.props;

        console.log(e.target.value);
        obj.name = e.target.value
        // canvasRef.canvas.getObjects().filter((obj) => {
        //     if (obj.id === ) {
        //         return false;
        //     }
        //     if (obj.id) {
        //         return true;
        //     }
        //     return false;
        // }).map((obj) => {
        // });
    }

    keyPress = (e = null) => {
        const { canvasRef } = this.props;
        const { editingItem , editingValue} = this.state;
        if( e != null) {
            let value =  e.target.value;
            if(e.keyCode == 13){
                canvasRef.handler.editByID(editingItem,value)
                this.setState({editingItem:null});
                }
        }else{
            canvasRef.handler.editByID(editingItem,editingValue)
            this.setState({editingItem:null,editingValue:''});
        }

    }

    keyPressUp = (e) => {
        let value =  e.target.value;
        this.setState({editingValue: value})
    }

    renderItem = () => {
        const { canvasRef, selectedItem } = this.props;
        const { editingItem } = this.state;
        const idCropping = canvasRef ? canvasRef.handler.interactionMode === 'crop' : false;
        return canvasRef ? (
            canvasRef.canvas.getObjects().filter((obj) => {
                if (obj.id === 'workarea') {
                    return false;
                }
                if (obj.id) {
                    return true;
                }
                return false;
            }).map((obj) => {
                let icon;
                let title = obj.name || obj.type;
                let prefix = 'fas';
                console.log("obj.type is::::",obj.type);
                if (obj.type === 'i-text') {
                    icon = 'map-marker-alt';
                } else if (obj.type === 'textbox') {
                    icon = 'font';
                } else if (obj.type === 'image') {
                    icon = 'image';
                } else if (obj.type === 'triangle') {
                    icon = 'image';
                } else if (obj.type === 'rect') {
                    icon = 'image';
                } else if (obj.type === 'circle') {
                    icon = 'circle';
                } else if (obj.type === 'polygon') {
                    icon = 'draw-polygon';
                } else if (obj.type === 'line') {
                    icon = 'image';
                } else if (obj.type === 'element') {
                    icon = 'html5';
                    prefix = 'fab';
                } else if (obj.type === 'iframe') {
                    icon = 'window-maximize';
                } else if (obj.type === 'video') {
                    icon = 'video';
                } else if (obj.type === 'svg') {
                    icon = 'bezier-curve';
                }
                else if (obj.type === 'dottedline') {
                    icon = 'image';
                } 
                else if (obj.type === 'partition') {
                    icon = 'image';
                }  else if (obj.type === 'group')
                {
                    icon = 'image';
                }
                else {
                    icon = 'image';
                    title = 'Group';
                }
                let className = 'rde-canvas-list-item';
                if (selectedItem && selectedItem.id === obj.id) {
                    className += ' selected-item';
                }
                console.log("obj.id :::",obj.id);
                console.log("editingItem ::::",editingItem);
                return (
                    <FlexItem key={obj.id} className={className} flex="1" onClick={() => canvasRef.handler.select(obj)}>
                        <FlexBox alignItems="center" style={{"padding":"10px"}}>
                            {/* <Icon className="rde-canvas-list-item-icon" name={icon} size={1.5} style={{ width: 32 }} prefix={prefix} /> */}
                            <div className="rde-canvas-list-item-text">
                                {/* <input value={title} onChange={(e) => {console.log("id::",obj.id); e.stopPropagation(); canvasRef.handler.editByID(obj.id,e.target.value); }} /> */}
                                
                                {obj.id === editingItem ? 
                                    <input type ="text" style={{'max-width':'100px'}} onKeyDown={this.keyPress} onKeyUp={this.keyPressUp}/>
                                :<div>{title}</div>}
                            </div>

                            <FlexBox className="rde-canvas-list-item-actions" flex="1" justifyContent="flex-end">
                                <Button className="rde-action-btn" shape="circle" disabled={idCropping} onClick={(e) => { e.stopPropagation(); canvasRef.handler.duplicateById(obj.id); }}>
                                    <Icon name="clone" />
                                </Button>
                                {obj.id === editingItem  ?
                                <Button className="rde-action-btn" shape="circle" disabled={idCropping} onClick={(e) => { e.stopPropagation(); this.keyPress() }}>
                                <Icon name="save" />
                                </Button>
                                :<Button className="rde-action-btn" shape="circle" disabled={idCropping} onClick={(e) => { e.stopPropagation(); this.isEditing(obj.id) }}>
                                    <Icon name="edit" />
                                </Button>
                                }
                                <Button className="rde-action-btn" shape="circle" disabled={idCropping} onClick={(e) => { e.stopPropagation(); canvasRef.handler.removeById(obj.id); }}>
                                    <Icon name="trash" />
                                </Button>
                            </FlexBox>
                        </FlexBox>
                    </FlexItem>
                );
            })
        ) : null;
    }

    render() {
        return (
            <FlexBox style={{ height: '100%' }} flexDirection="column">
                {/* {this.renderActions()} */}
                <div className="rde-canvas-list-items">
                    {this.renderItem()}
                </div>
            </FlexBox>
        );
    }
}

export default ImageMapList;
