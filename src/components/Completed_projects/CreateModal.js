import React from "react"
import axios from "axios"

class CreateModal extends React.Component {
    constructor() {
        console.log('constructor')
        super()
        this.state = {
            addNewProject: {
                name: '',
                location: '',
                type: "",
                builder: "",
                id: "",
                status: "",
            },
            projectData: [],
            projectId: "",
            currentIndex: "",
            editProject: {},
            type: "",
            validationFields: {
                name: '',
                location: '',
                type: "",
                builder: "",
            },
            errors: {}
        }
        this.validateForm = this.validateForm.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        console.log("nextProps==>", nextProps);
        if (nextProps.type === "edit" || nextProps.type === "completed" || nextProps.type === "copy") {
            this.setState({
                projectData: nextProps.projectData,
                projectId: nextProps.projectId,
                currentIndex: nextProps.currentIndex,
                editProject: nextProps.projectData[nextProps.currentIndex],
                type: nextProps.type
            })
        } else {
            this.setState({
                projectData: [],
                projectId: "",
                currentIndex: "",
                editProject: {},
                type: "",
            })
        }
    }

    handleError = () => {
        let errors = {};
        this.setState({ errors: errors })
    }

    handleChange = (e) => {
        var { name, value } = e.target;
        if (this.state.currentIndex === "") {
            let addNewProject = this.state.addNewProject;
            addNewProject[name] = value;
            this.setState({ addNewProject });
        }
        else {
            let projectData = this.state.projectData;
            projectData[this.state.currentIndex][name] = value
            this.setState({ projectData });
        }
    }

    handleCancel = () => {
        this.setState({ addNewProject: {} })
    }


    validateForm() {

        let errors = {};
        let formIsValid = true;
        if (this.state.currentIndex === "") {

            for (var name in this.state.validationFields) {
                if (this.state.addNewProject[name] === "") {
                    errors[name] = "This field is required"
                    formIsValid = false
                } else {
                    errors[name] = ""
                }
            }
        } else {
            for (var name in this.state.validationFields) {
                if (this.state.editProject[name] === "") {
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
        if (this.state.projectId > 0) {
            formData = {
                name: this.state.editProject.name,
                location: this.state.editProject.location,
                type: Number(this.state.editProject.type),
                builder: this.state.editProject.builder,
            }
        } else {
            formData = {
                name: this.state.addNewProject.name,
                location: this.state.addNewProject.location,
                type: Number(this.state.addNewProject.type),
                builder: this.state.addNewProject.builder,
            }
        }

        console.log("formData==>", formData);
        if (!this.validateForm()) {
            return false;

        } else if (this.state.currentIndex !== "" && this.state.type === "edit") {
            axios.patch(`https://nbk.synctactic.ai/project/${this.state.projectId}/`, { ...formData, status: this.state.editProject.status }, {
                headers: {
                    "Content-Type": "application/json",
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

        } else if (this.state.currentIndex !== "" && this.state.type === "completed") {
            console.log("completed project as mark as complete")
            axios.patch(`https://nbk.synctactic.ai/project/${this.state.projectId}/`, { ...formData, status: "CMP" }, {
                headers: {
                    "Content-Type": "application/json",
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
        } else if (this.state.currentIndex !== "" && this.state.type === "copy") {
            axios.post("https://nbk.synctactic.ai/project/ ", formData, {
                headers: {
                    "Content-Type": "application/json",
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
        } else {
            axios.post("https://nbk.synctactic.ai/project/ ", formData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            })
                .then(response => {
                    console.log(response.data)
                    // window.location.href = "/listingProjects";
                })
                .catch(error => {
                    console.log(error)
                })
        }

    }

    render() {
        return (
            <div>
                <div id="myModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                {/* <p className="text-center">CREATE NEW PROJECT</p> */}
                                <h4 className="modal-title">{this.state.type === "edit" ? "Edit Project" : "Duplicate Project"}</h4>

                                <button type="button" className="close" data-dismiss="modal">&times;</button>

                            </div>
                            <div className="modal-body">
                                <form className="create-form">
                                    <div className="form-group">
                                        <label htmlFor="projectname"> Project Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={this.state.projectId > 0 ?
                                                (this.state.editProject && this.state.editProject.name ? this.state.editProject.name : "") :
                                                this.state.addNewProject.name}
                                            onChange={this.handleChange} className="form-control" required />

                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="builder"> Builder/Promotor</label>
                                        <input
                                            type="text"
                                            name="builder"
                                            value={this.state.projectId > 0 ?
                                                (this.state.editProject && this.state.editProject.builder ? this.state.editProject.builder : "") :
                                                this.state.addNewProject.builder}
                                            onChange={this.handleChange} className="form-control" required />

                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="location">Project Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={this.state.projectId > 0 ?
                                                (this.state.editProject && this.state.editProject.location ? this.state.editProject.location : "") :
                                                this.state.addNewProject.location}
                                            onChange={this.handleChange} className="form-control" required />
                                        <img src="assets/images/location.png" className="location-icon" alt="" />

                                    </div>
                                    {/* <div className="form-group">
                                        <input
                                            name="type"
                                            value={this.state.projectId > 0 ? 
                                                  (this.state.editProject.type && this.state.editProject.type.name ? this.state.editProject.type.name : "") : 
                                                  this.state.addNewProject.type}
                                            onChange={this.handleChange}
                                            className="form-control" required />
                                        <label htmlFor="projectype">Project Type</label>

                                    </div> */}
                                    <button className="create_btn mt-4 ml-2" onClick={this.handleSubmit}> Create</button>
                                    <span className="btn btn_cancel ml-2" onClick={this.handleCancel}>&nbsp; Cancel</span>

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