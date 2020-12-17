import React from "react"
// import axios from 'axios';
import "./CreateFloor.css"
import { Link } from "react-router-dom"
import Loginimage from "../Assets/Log in image.jpg"
import nemmadi_logo from "../Assets/nemmadi_logo.png"
import filter from "../Assets/icon Nemmadi/filter_list-24px.svg"
import sort from "../Assets/icon Nemmadi/sort-24px.svg"
import bell from "../Assets/icon Nemmadi/bell.svg"
import search from "../Assets/icon Nemmadi/search.png"
import asset from "../Assets/icon Nemmadi/asset-24px.svg"
import dateFormat from "dateformat";
import Delete from "../Assets/Delete.png"
import Edit from "../Assets/Edit.png"
import Mark from "../Assets/Mark.png"
import Duplicate from "../Assets/Duplicate.png"
import Navbar from "../Navbar";
import CreateFloorModal from "./CreateFloorModal"
import CreateModal from "../../components/Completed_projects/CreateModal"
import Swal from "sweetalert2"
import axios from "../Axios"
import Pagination from "../Pagination"
import arrows from "../Assets/arrows.jpeg"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

class ListingFloors extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            FloorsData: [],
            projectData: {},
            search: "",
            ascending: false,
            showPerPage: 5,
            floorsData: [],
            floorId: "",
            currentIndex: "",
            editProject: {},
            type: "",

            pagination: {
                start: "",
                end: ""
            },
            assigned_to: "",
            name: ""
        }

    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleClick = (e) => {
    }
    compareBy = (key) => {
        return function (a, b) {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        };
    };

    sortByKey = (key) => {
        this.setState(prevState => ({
            ascending: !prevState.ascending
        }));
        if (this.state.ascending) {
            let floorsDataCopy = this.state.floorsData;
            floorsDataCopy.sort(this.compareBy(key));
            this.setState({ floorsData: floorsDataCopy })
        } else {
            let floorsDataCopy = this.state.floorsData;
            floorsDataCopy.sort(this.compareBy(key));
            this.setState({ floorsData: floorsDataCopy.reverse() })

        }
    };


    handleRemove = (id) => {
        console.log(id)
        const confirmRemove = window.confirm('are u sure?')
        if (confirmRemove) {
            axios.delete(`/floors/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            })
                .then(response => {
                    console.log(response.status)
                    if (response.status == 204) {
                        console.log(response.data)
                        // Swal.fire({
                        //     position: 'top-end',
                        //     icon: 'success',
                        //     title: 'Your are successfully deleted record',
                        //     timer: 1500
                        // })
                        toast('Deleted')

                        this.loadFloors()
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    componentDidMount() {
        this.loadFloors()
        this.loadAllFloors()
    }

    loadFloors = async () => {
        const response = await axios.get(`project/${this.props.match.params.projectid}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        const propertyResponse = await axios.get(`property/${response.data.properties[0].id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }

        })
        console.log("floorsListResponse", response)
        console.log("floorsresponse", propertyResponse)
        let floorsData = await propertyResponse.data.floors;
        let projectData = await propertyResponse.data
        // console.log("floorsData==>", propertyResponse.data.floors);
        // console.log("projectData", projectData)
        // console.log("propertyresponse", response)
        // console.log("floorsresponse", propertyResponse)
        this.setState({
            floorsData, projectData
        })
    }
    loadAllFloors = async () => {
        const response = await axios.get(`/floors/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        let FloorsData = await response.data.results;

        console.log("response", response)
        this.setState({
            FloorsData
        })
    }

    // componentDidMount() {
    //     axios.get("https://nbk.synctactic.ai/floors/", {
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    //         }
    //     })
    //         .then(response => {
    //             console.log(response.data)
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         })

    // }

    // floor modal 
    handleError = () => {
        let errors = {};
        this.setState({ errors: errors })
    }
    validateForm() {

        let errors = {};
        let formIsValid = true;

        for (var name in this.state.validationFields) {
            if ((this.state[name] === "")) {
                errors[name] = "This field is required"

                formIsValid = false
            } else {
                errors[name] = ""

            }
        }
        this.setState({
            errors: errors
        });
        return formIsValid;
    }
    handleEdit = (id, index, type) => {
        console.log("index", index)
        this.setState({ floorId: id, currentIndex: index, type: type })
    }


    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const formData = {
            name: this.state.name,
            assigned_to: this.state.assigned_to,
            property: this.state.projectData.id

            // assignee: this.state.assignee,
            // owner: this.state.owner,


        }
        console.log("O", this.props.match.params.propertyid)
        console.log(formData)
        if (!this.validateForm()) {
            return false;
        } else {

            axios.post("https://nbk.synctactic.ai/floors/", formData, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            })
                .then(response => {
                    console.log(response.data)
                    toast('Created')

                    window.location.reload();


                })
                .catch(error => {
                    console.log(error)
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);

                })


        }


    }

    onPaginationChange = (start, end) => {
        let pagination = this.state.pagination;
        pagination.start = start;
        pagination.end = end;
        this.setState({ pagination });
    };

    render() {
        console.log("this.state.floorsData", this.state.floorsData)
        let filteredData = this.state.floorsData.filter(project =>
            project.name && project.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
            project.status && project.status.toLowerCase().includes(this.state.search.toLowerCase()) ||

            // project.project && project.project.toLowerCase().includes(this.state.search.toLowerCase()) ||
            project.date && project.date.toLowerCase().includes(this.state.search.toLowerCase())
        )

        let allFloorsData;
        return (
            <div>
                <Navbar />
                {/* <nav className="navbar navbar-expand-sm ">
                    <div className="container-fluid">
                        <div className="navbar-header mr-5">
                            <a className="navbar-brand" href="#">
                                <img src={nemmadi_logo} alt="logo" className="img-fluid" />
                                <span>Nemmadhi</span>
                            </a>
                        </div>
                        <ul className="navbar-nav ml activated-bg" >
                            <li className="nav-item ">
                                <a className="nav-link active " href="# ">Properties</a>
                            </li>
                            <li className="nav-item">
                                <Link to="/people" className="nav-link" href="#">People</Link>
                            </li>

                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="#">
                                <img src={bell} alt="" />
                            </a></li>
                            <li className="pl-4"><Link to="/Create_Modal" className="create_btn"
                                data-toggle="modal" data-target="#myModal"> Create Project</Link></li>
                            <li className="pl-4"><a className="user" href="#">admin</a></li>
                            <li className="pl-4"><a className="user" href="#">Logout</a></li>
                        </ul>
                    </div>

                </nav> */}

                <section className="activated-bg">
                    <div className="container-fluid">
                        <div className="row">
                            {/* <div className="col-4 pl-3 pr-0">
                                <a href="#" className="pl-3 active">Active Projects</a>
                                <a href="#" className="ml-3 ">Completed Projects</a>
                            </div> */}
                            <div class="col-5">
                                {/* <nav class="navbar navbar-expand-lg " >
                                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                        <ul class="navbar-nav mr-auto" style={{ fontFamily: "Roboto" }}>
                                            <li class="nav-item">
                                                <a class="nav-link" href="#">Home
                                            </a>
                                            </li>
                                            <p style={{ marginTop: "2px" }}>/</p>
                                            <li class="nav-item" style={{padding:"0"}}>
                                                <Link to="/listingProjects">Active Projects</Link>
                                                {/* <a class="nav-link" href="#">Active Projects
                                            </a> *
                                            </li>
                                            <p style={{ marginTop: "2px" }}>/</p>
                                            <li class="nav-item">
                                                <a class="nav-link" href="#">{this.props.match.params.projectName}
                                                </a>
                                            </li>

                                        </ul>
                                    </div>
                                </nav> */}
                                <ul class="breadcrumb">
                                    <li><a href="#">Home</a></li>
                                    <li><Link to="/listingProjects">Active Projects</Link></li>
                                    <li> <Link to={`/projectDetails/${this.props.match.params.projectid}`}>{this.props.match.params.projectName}</Link></li>,
                                    <li>{this.state.projectData && this.state.projectData.type && this.state.projectData.type.name}</li>


                                </ul>

                            </div>
                            {/* <div className="col-3"></div> */}
                            <div className="col-3">
                                <input
                                    type="search"
                                    name="search"
                                    value={this.state.search}
                                    onChange={this.handleChange}
                                    className="search_input" placeholder="Search" />
                                <img src={search} alt="search" className="search_img" />

                            </div>
                            <div className="col-3 ml-5">
                                <div className="row float-right">
                                    <div className="col-12">
                                        <button className="addfloor-btn  "
                                            onClick={this.handleClick} data-toggle="modal" data-target="#myModal1" >
                                            Add Floor
                                </button>

                                        {/* <button className="filter_btn pr-2 ml-2">
                                            <img src={filter}
                                                alt="filter" className="img-fluid" />
                                    Filter
                                </button>&nbsp;
                                <img src={sort} alt="sort" className="img-fluid" /> */}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* <div class="col-3">
                            <nav class="navbar navbar-expand-lg mt-2" >
                                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul class="navbar-nav mr-auto" style={{ fontFamily: "Roboto" }}>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#">Home
                                            </a>
                                        </li>
                                        <p style={{ marginTop: "2px" }}>/</p>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#">Active Projects
                                            </a>
                                        </li>
                                        <p style={{ marginTop: "2px" }}>/</p>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#">{this.props.match.params.projectName}
                                            </a>
                                        </li>

                                    </ul>
                                </div>
                            </nav>

                        </div> */}
                        {/* <CreateFloorModal /> */}
                        <div className="row mt-3">
                            <table className="table table-striped" style={{ width: "100%" }}>
                                <thead>
                                    {/* <tr>
                                        <th onClick={() => this.sortByKey("id")}>id &nbsp;
                                         <img src={arrows} alt="sort"
                                                className="arrow_img image" /></th>
                                        <th onClick={() => this.sortByKey("Name")}> Name &nbsp;
                                         <img src={arrows} alt="sort"
                                                className="arrow_img image" /></th>
                                        <th onClick={() => this.sortByKey("project")}>project &nbsp;
                                         <img src={arrows} alt="sort"
                                                className="arrow_img image" /></th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th onClick={() => this.sortByKey("Assignee")}>Assignee &nbsp;
                                         <img src={arrows} alt="sort"
                                                className="arrow_img image" /></th>
                                        <th>Action </th>
                                    </tr> */}
                                    <tr>
                                        <th onClick={() => this.sortByKey("id")}>Id &nbsp;
                                         <img src={arrows} alt="sort"
                                                className="arrow_img image" /></th>
                                        <th onClick={() => this.sortByKey("type")}> Project Type &nbsp;
                                         <img src={arrows} alt="sort"
                                                className="arrow_img image" /></th>
                                        <th onClick={() => this.sortByKey("type")}> Floor No &nbsp;
                                         <img src={arrows} alt="sort"
                                                className="arrow_img image" /></th>
                                        <th onClick={() => this.sortByKey("type")}> Owner &nbsp;
                                         <img src={arrows} alt="sort"
                                                className="arrow_img image" /></th>
                                        <th onClick={() => this.sortByKey("type")}> Door No
                                        &nbsp;
                                         <img src={arrows} alt="sort"
                                                className="arrow_img image" /></th>

                                        <th onClick={() => this.sortByKey("type")}> Status &nbsp;
                                         <img src={arrows} alt="sort"
                                                className="arrow_img image" /></th>
                                        <th onClick={() => this.sortByKey("assignee")}> Employee Id &nbsp;
                                         <img src={arrows} alt="sort"
                                                className="arrow_img image" /></th>

                                        <th>Date</th>

                                        <th>Action </th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {

                                        filteredData.slice(this.state.pagination.start, this.state.pagination.end).map((floor, index) => {


                                            // if (project.id == this.props.match.params.propertyid) {



                                            return (
                                                // console.log("floorid", floor[index].id),
                                                // console.log("projectid", floor.property),
                                                < tr key={floor.id}>
                                                    <td>{floor.id}</td>


                                                    <td> {this.state.projectData.type.name}</td>
                                                    <td><Link to={`/Canvas/${floor.name}/${floor.id}`}>{floor.name} </Link></td>
                                                    <td>{this.state.projectData.property_owner}</td>
                                                    <td>{this.state.projectData.doorno}</td>
                                                    <td>{floor.status}</td>
                                                    <td>{floor.assigned_to}</td>


                                                    < td > {dateFormat(floor.created_time, " dd-mm-yyyy")}</td>

                                                    <td>
                                                        <div class="dropdown">
                                                            <button class="dropbtn">
                                                                <img src={asset}
                                                                    alt="" class="img-fluid asset_img" /></button>
                                                            <div class="dropdown-content">
                                                                {/* <a href="#" data-toggle="modal" data-target="#myModal1">
                                                                    <img src={Duplicate} alt="" onClick={() => this.handleEdit(floor.id, index, "copy")} title="Duplicate" />
                                                                </a> */}
                                                                <a href="#" data-toggle="modal" data-target="#myModal1">
                                                                    <img src={Edit} alt="" onClick={() => this.handleEdit(floor.id, index, "edit")} title="Edit" />
                                                                </a>
                                                                <a href="#">
                                                                    <img src={Delete} alt="" onClick={() => this.handleRemove(floor.id)} title="Delete" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>

                                            )

                                        })




                                    }

                                </tbody>
                            </table>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <p className="Rectangle-4">Showing 1 of {this.state.FloorsData.length}  entries</p>
                            </div>
                            <div className="col-6 p-0">
                                <div className="pagination float-right mt-4">
                                    {/* <a href="#">&lsaquo;&lsaquo;</a>
                                    <a href="#">&lsaquo;</a>
                                    <a href="#" className="active">1</a>
                                    <a href="#" >2</a>
                                    <a href="#">3</a>
                                    <a href="#">4</a>
                                    <a href="#">5</a>
                                    <a href="#">&rsaquo;</a>
                                    <a href="#">&rsaquo;&rsaquo;</a> */}
                                    <Pagination
                                        pathName="/listingFloor/:projectName/:projectid/:propertyid"
                                        showPerPage={this.state.showPerPage}
                                        onPaginationChange={this.onPaginationChange}
                                        // total={this.state.floorsData.length}
                                        total={this.state.FloorsData.length}
                                    />
                                </div></div>
                        </div>

                    </div>
                </section >
                <div>
                    <div id="myModal1" className="modal fade" role="dialog">
                        <div className="modal-dialog">

                            <div className="modal-content">
                                <div className="modal-header">
                                    <p className="text-center">CREATE NEW FLOOR</p>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form className="create-form">
                                        <div className="form-group">
                                            <label HtmlFor="projectname"> Floor Name</label>

                                            <input type="text" name="name" onChange={this.handleChange}
                                                className="form-control" required />


                                            {/* {this.state.errors.name && <p style={{ color: "red" }}>The  Name field is required</p>} */}
                                            {/* <label HtmlFor="projectid">Assigned To</label>

                                            <input type="text" name="assigned_to" onChange={this.handleChange}
                                                className="form-control" required /> */}


                                        </div>
                                        <div className="form-group">

                                            <label htmlFor="proper">Select  Employee Id</label>
                                            <select name="assigned_to" id="proper" class="form-control" onChange={this.handleChange} >
                                                <option value="0">-Select-</option>

                                                <option value="3">3</option>
                                            </select>
                                        </div>
                                        {/* <div className="form-group">

                                            <label HtmlFor="projectname">Assigned To</label>
                                            <input type="text" name="assigned_to" onChange={this.handleChange}
                                                className="form-control" required />
                                        </div> */}


                                        <button href="#" className="create_btn mt-4 ml-2" onClick={this.handleSubmit}> Create</button>
                                        {/* <span className="btn btn_cancel ml-2" onClick={this.handleError}>&nbsp; Cancel</span> */}

                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <CreateFloorModal
                    type={this.state.type}
                    floorId={this.state.floorId}
                    currentIndex={this.state.currentIndex}
                    FloorsData={this.state.FloorsData} />


            </div >
        )
    }
}
export default ListingFloors