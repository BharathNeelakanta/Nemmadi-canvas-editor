import React, { Fragment } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import nemmadi_logo from "./Assets/nemmadi_logo.png"
import bell from "./Assets/icon Nemmadi/bell.svg"
import key from "./Assets/key.jpeg"
import logout from "./Assets/login.jpeg"
import image15569 from "./Assets/15569.jpeg"
// import createProjectModal from "./createProjectModal"
import CreateProject from "./CreateProject"

class Navbar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }
    handleClick = () => {
        axios.get("https://nbk.synctactic.ai/user/alerts?filter=read", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
            .then(response => {
                console.log(response.data)
            })


    }
    handleReset = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()

        const formData = {
            email: this.state.email
        }
        console.log(formData)
        axios.post("/reset/ ", formData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
            .then(response => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    render() {
        // console.log("path",);
        var path = window.location.pathname;
        return (
            <div>
                <nav className="navbar navbar-expand-sm">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                <img src={nemmadi_logo} alt="logo" className="img-fluid" />
                                <span style={{ marginRight: "15px" }}>Nemmadi</span>
                            </a>
                        </div>
                        <ul className="navbar-nav ml activated-bg">
                            { path === '/people' ?  
                            <Fragment>
                            <li className="nav-item ">
                                <Link to="/listingProjects" className="nav-link" href="#">Properties</Link>
                            </li>
                            <li className="nav-item">
                            <a className="nav-link active" href="# ">People</a>
                                
                            </li>
                            
                            </Fragment>
                            :
                            <Fragment>
                            <li className="nav-item "><a className="nav-link active" href="# ">Properties</a></li>
                            <li className="nav-item"><Link to="/people" className="nav-link" href="#">People</Link></li>
                            </Fragment>
                            }
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <div className="col-1 dropdown notification_dropdown p-0">
                                <i style={{ color: "black", fontFamily: "fontAwesome" }} className="fa fa-bell-o mt-2 " href="#"
                                    data-toggle="dropdown"
                                    role="button" aria-haspopup="true" aria-hidden="true"></i>
                                <ul style={{ marginLeft: "-180px", width: "350px", padding: "11px" }}
                                    className=" dropdown-menu notifications" role="menu" aria-labelledby="dLabel">

                                    <div className="notification-heading">
                                        <h2 style={{ paddingLeft: "10px" }} className="menu-title">Notifications </h2>
                                    </div>
                                    <hr />
                                    <div className="notifications-wrapper">
                                        <div className="row notification-item">
                                            <div className="col-12 ">
                                                <p> <span className="title">Title</span>
                                                    <span className="date">22/08/20</span>
                                                </p>
                                                <p className="text">
                                                    Lorem ipsum dolor sit amet elit,<br />
                                                consectetur adipiscing elit, </p>
                                            </div>
                                        </div>
                                        <div className="row notification-item">
                                            <div className="col-12 ">
                                                <p> <span className="title">Title</span>
                                                    <span className="date">22/08/20</span>
                                                </p>
                                                <p className="text">
                                                    Lorem ipsum dolor sit amet elit,<br />
                                                consectetur adipiscing elit, </p>
                                            </div>
                                        </div>
                                    </div>
                                </ul>
                            </div>
                            <li className="pl-4"><Link to="" className="create_btn"
                                data-toggle="modal"
                                data-target="#myModalCreateProject"  > Create Project</Link></li>
                                <div className="logout">
                                <div className="dropdown">
                                    <i href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
                                        aria-haspopup="true" aria-expanded="true">
                                        <li className="pl-2"><a className="user" href="#"></a>
                                            <img src={image15569} style={{width:"40px"}}/></li> </i>
                                    <ul className="dropdown-menu" role="menu" aria-labelledby="dLabel">
                                        <li><a href="" data-toggle="modal"
                                            data-target="#exampleModal">
                                            <img src={key} className="key_img " />
                                           Change Password </a></li>

                                        <li><a href="">
                                            <img src={logout} className="login_img" />
                                            Logout</a></li>
                                    </ul>
                                </div>
                            </div>

                        </ul>
                    </div>
                </nav>
                <div
                    class="modal fade"
                    id="exampleModal"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true" >
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Change Password</h5>
                                <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group">
                                    <input onChange={this.handleReset}
                                        type="text"
                                        name="email"
                                        class="form-control"
                                        placeholder="Enter Emailid"
                                    /><br />
                                </div><br />
                                <button type="button"
                                    className="create_btn" onClick={this.handleSubmit}>Submit</button>
                                <button type="button" className="btn btn_cancel ml-2" data-dismiss="modal">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
            </div>
            <CreateProject/>
            </div>
        )
    }
}
export default Navbar