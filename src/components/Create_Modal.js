import React from "react"
import create from "./Assets/create.jpg"
import nemmadi_logo from "./Assets/nemmadi_logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import bell from "./Assets/icon Nemmadi/bell.svg"
import { Modal } from "bootstrap"
import Navbar from "./Navbar";
import axios from "axios"
import ListingProjects from "./Completed_projects/ListingProjects"
class CreateModal extends React.Component {
    constructor() {
        console.log('constructor')
        super()
        this.state = {
            name: '',
            location: '',
            type: "",
            builder: "",
            // owner: "",
            //     assignee: ""
        }

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
            location: this.state.location,
            type: this.state.type,
            builder: this.state.builder,
            // assignee: this.state.assignee,
            // owner: this.state.owner,

        }
        console.log(formData)
        axios.post("https://nbk.synctactic.ai/project/ ", formData, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
            .then(response => {
                console.log(response.data)
                window.location.href = "/listingProjects";

            })
            .catch(error => {
                console.log(error)
            })


    }



    render() {
        return (
            <div>
                <div id="myModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">

                        <div className="modal-content">
                            <div className="modal-header">
                                <p className="text-center">CREATE NEW PROJECT</p>
                            </div>
                            <div className="modal-body">
                                <form className="create-form">
                                    <div className="form-group">
                                        <input type="text" name="name" onChange={this.handleChange} className="form-control" required />
                                        <label HtmlFor="projectname"> Project Name</label>

                                    </div>
                                    <div className="form-group">
                                        <input type="text" name="builder" onChange={this.handleChange} className="form-control" required />
                                        <label HtmlFor="builder"> Builder/Promotor</label>

                                    </div>
                                    {/* <div className="form-group">
                                        <input type="text" name="assignee" onChange={this.handleChange} className="form-control" required />
                                        <label HtmlFor="assignee"> Assignee</label>

                                    </div> */}


                                    <div className="form-group">
                                        <input type="text" name="location" onChange={this.handleChange} className="form-control" required />
                                        <img src="assets/images/location.png" className="location-icon" alt="" />
                                        <label HtmlFor="location">Project Location</label>

                                    </div>

                                    {/* <div className="form-group">
                                        <input type="text" name="owner" onChange={this.handleChange} className="form-control" required />
                                        <label HtmlFor="builder">owner</label>

                                    </div> */}


                                    <div className="form-group">
                                        <input name="type" onChange={this.handleChange} className="form-control" required />
                                        <label HtmlFor="projectype">projectType</label>

                                    </div>
                                    <button href="#" className="create_btn ml-2" onClick={this.handleSubmit}> Create</button>
                                    <span className="btn btn_cancel ml-2">&nbsp; Cancel</span>

                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        )
    }
}
export default CreateModal
