import React from "react"
// import axios from 'axios';
import "./CreateFloor.css"
import { Link } from "react-router-dom"
import Navbar from "../Navbar"
import axios from "../Axios"

class FloorReport extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            FloorsData: [],
            metaData:[],
            totalarea: 0,
            metaList: false,
            owner : "",
            doorno:""
        }
    }
    componentDidMount() {
        this.loadAllFloors()
    }

    loadAllFloors = async () => {
        let floorid = this.props.match.params.floorid;

        const projectDetail = await axios.get(`/property/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        
        console.log("projectid",this.props.match.params.projectid);
        console.log('projectDetail',projectDetail.data.results);
        for(var i=0;i<projectDetail.data.results.length;i++){
            var pd = projectDetail.data.results[i];
            console.log("pd",pd.project,parseInt(this.props.match.params.projectid));
            if(pd.project === parseInt(this.props.match.params.projectid)){
                this.setState({owner:pd['property_owner']})
                this.setState({doorno:pd['doorno']})
                console.log("property_owner",pd['property_owner']);
                console.log("property_owner",pd['doorno']);
            }
        }
        const response = await axios.get(`/floors/`+floorid, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        let FloorsData = await response.data.results;
        console.log("floordata",response.data);
        let FloorMetaId = response.data.meta[0].id;
        console.log(FloorMetaId);
        const FloormetaData = await axios.get(`/meta/`+FloorMetaId, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        let metaData = FloormetaData.data.dict.groups
        console.log("response", response.data.meta)
        console.log("response metaData", FloormetaData.data.dict.groups)
        // console.log("response metaData", FloormetaData.data.dict.groups[0].carpet_area)
        if(FloormetaData.data.dict.groups.length !== 0){
            if(FloormetaData.data.dict.groups[0].carpet_area === undefined){
                // console.log("undefined","carpert");
                this.setState({metaList:false});
            }else{
                this.setState({metaList:true});
            }
        }
        else{
            this.setState({metaList:false});
        }
        this.setState({
            metaData
        })
        console.log("this.FloorsData",this.state.metaData);
        console.log("this.FloorsData",this.state.metaList);
        // console.log("this.FloorsData carpet",this.state.metaData.carpet_area);
    }

    render (){
        let valueAdded = 0
            if(this.state.metaList){
                for(let i = 0 ; i < this.state.metaData.length ; i++){
                    let count= parseInt(this.state.metaData[i].carpet_area.value)
                    console.log(count);
                    valueAdded += count
                }
            }
            console.log(valueAdded);
        return(
            <>
            
                <Navbar/>
                <div className="container">
                    <ul className="breadcrumb mt-3">
                        <li><Link to="/listingProjects">Home</Link></li>
                        <li><Link to="/listingProjects">Active Projects</Link></li>
                        {/* <li> <Link to={`/listingFloor/${this.props.match.params.floorid}`}>{this.props.match.params.floorName}</Link></li> */}
                        <li><a onClick={this.props.history.goBack} style={{cursor:"pointer"}}>{this.props.match.params.floorName}</a></li>
                    </ul>
                    <div className="row mt-2 mb-4 p-3" style={{background:"#eee"}}>
                        <div className="col-md-4">
                            <span>Floor Name : {this.props.match.params.floorName}</span>
                        </div>
                        <div className="col-md-4">
                            <span>Owner Name : {this.state.owner}</span>
                        </div>
                        <div className="col-md-4">
                            <span>Door No : {this.state.doorno}</span>
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Room</th>
                                <th>Carpet Area</th>
                                {/* <th>Unit</th> */}
                            </tr>
                        </thead>
                        <tbody>
                        { this.state.metaList && (
                        this.state.metaData.map(function (meta, index) {
                                return(
                                    <tr>
                                        <td>{index}</td>
                                        <td>{meta.name}</td>
                                        <td>{meta.carpet_area.value} {meta.carpet_area.unit}</td>
                                        {/* <td></td> */}
                                        {/* {this.state.totalarea += meta.carpet_area.value } */}
                                    </tr>
                                )
                            })
                        )
                        }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Total Area</td>
                                <td></td>
                                <td >
                                {valueAdded} m
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </>
        )
    }

}
export default FloorReport