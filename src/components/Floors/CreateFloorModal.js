import React from "react"
import "./CreateFloor.css"
import create from "../Assets/create.jpg"
import nemmadi_logo from "../Assets/nemmadi_logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import bell from "../Assets/icon Nemmadi/bell.svg"
import { Modal } from "bootstrap"
import Navbar from "../Navbar";
import axios from "axios"
import ListingProjects from "../Completed_projects/ListingProjects"
class CreateFloorModal extends React.Component {
    constructor(props) {
        console.log('constructor')
        super(props)
        this.state = {

            validationFields: {
                name: '',
                assigned_to: ''
            },
            errors: {},
            FloorsData: [],
            floorId: "",
            currentIndex: "",
            editFloor: {},
            type: "",
            addNewFloor: {
                name: '',
                assigned_to: ""
            }
        }

        this.validateForm = this.validateForm.bind(this);

    }
    handleError = () => {
        let errors = {};
        this.setState({ errors: errors })
    }

    componentWillReceiveProps(nextProps) {
        console.log("nextProps==>", nextProps);
        if (nextProps.type === "edit" || nextProps.type === "completed" || nextProps.type === "copy") {
            this.setState({
                FloorsData: nextProps.FloorsData,
                floorId: nextProps.floorId,
                currentIndex: nextProps.currentIndex,
                editFloor: nextProps.FloorsData[nextProps.currentIndex],
                type: nextProps.type
            })
        } else {
            this.setState({
                FloorsData: [],
                floorId: "",
                currentIndex: "",
                editfloor: {},
                type: "",
            })
        }
    }
    handleChange = (e) => {
        var { name, value } = e.target;
        if (this.state.currentIndex === "") {
            let addNewFloor = this.state.addNewFloor;
            addNewFloor[name] = value;
            this.setState({ addNewFloor });
        }
        else {
            let editFloor = this.state.editFloor;
            editFloor[name] = value;
            this.setState({ editFloor })
        }
    }


    validateForm() {

        let errors = {};
        let formIsValid = true;

        if (this.state.currentIndex === "") {

            for (var name in this.state.validationFields) {
                if (this.state.addNewFloor[name] === "") {
                    errors[name] = "This field is required"
                    formIsValid = false
                } else {
                    errors[name] = ""
                }
            }
        } else {
            for (var name in this.state.validationFields) {
                if (this.state.editFloor[name] === "") {
                    errors[name] = "This field is required"
                    formIsValid = false
                } else {
                    errors[name] = ""
                }
            }
        }

        this.setState({
            errors: errors
        });
        return formIsValid;
    }

    handleSubmit = (e) => {
        e.preventDefault()
        let formData;
        if (this.state.floorId > 0) {
            formData = {
                name: this.state.editFloor.name,
                assigned_to: this.state.editFloor.assigned_to,
                property: this.state.editFloor.property
            }
        } else {
            formData = {
                name: this.state.addNewFloor.name,
                assigned_to: this.state.addNewFloor.assigned_to,
                //  property: this.state.FloorsData[this.state.currentIndex].property

            }
        }

        console.log("formData==>", formData);
        if (!this.validateForm()) {
            return false;

        } else if (this.state.currentIndex !== "" && this.state.type === "edit") {
            axios.patch(`https://nbk.synctactic.ai/floors/${this.state.floorId}/`, { ...formData }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            })
                .then(response => {
                    console.log(response.data)
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error)
                })
        }
        // } else if (this.state.currentIndex !== "" && this.state.type === "completed") {
        //     console.log("completed project as mark as complete")
        //     axios.patch(`https://nbk.synctactic.ai/floor/${this.state.floorId}/`, { ...formData, status: "CMP" }, {
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        //         }
        //     })
        //         .then(response => {
        //             console.log(response.data)
        //             window.location.href = "/listingFloor/:projectName/:projectid";
        //         })
        //         .catch(error => {
        //             console.log(error)
        //         })
        // }
        else if (this.state.currentIndex !== "" && this.state.type === "copy") {
            axios.post("https://nbk.synctactic.ai/floors/ ", { ...formData }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            })
                .then(response => {
                    console.log(response.data)
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error)
                })
        } else {
            axios.post("https://nbk.synctactic.ai/floors/ ", formData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            })
                .then(response => {
                    console.log(response.data)
                    // window.location.href = "/listingProjects";
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error)
                })
        }

    }



    render() {
        console.log("floorid", this.state.floorId)
        console.log("editFloor", this.state.editFloor)
        console.log("addNewFloor", this.state.addNewFloor)
        console.log("type", this.state.type)
        return (
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
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>

                                        <input type="text" name="name"
                                            value={this.state.floorId > 0 ?
                                                this.state.editFloor.name :
                                                this.state.addNewFloor.name}

                                            onChange={this.handleChange}
                                            className="form-control" required />
                                        {this.state.errors.name && <p style={{ color: "red" }}>The  Name field is required</p>}

                                        <label HtmlFor="projectname">Assigned To</label>
                                        <input type="text" name="assigned_to"
                                            value={this.state.floorId > 0 ?
                                                this.state.editFloor.assigned_to :
                                                this.state.addNewFloor.assigned_to}

                                            onChange={this.handleChange}
                                            className="form-control" required />
                                        {this.state.errors.name && <p style={{ color: "red" }}>The  Name field is required</p>}
                                        {/* <input type="text" name="status" onChange={this.handleChange}
                                            className="form-control" required />
                                        <label HtmlFor="projectname"> status</label>
                                        {this.state.errors.name && <p style={{ color: "red" }}>The  Name field is required</p>} */}

                                    </div>
                                    <button href="#" className="create_btn ml-2" onClick={this.handleSubmit}> Create</button>
                                    <span className="btn btn_cancel ml-2" onClick={this.handleError}>&nbsp; Cancel</span>

                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        )
    }
}
export default CreateFloorModal