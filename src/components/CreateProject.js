import React from "react"
import { Modal } from "bootstrap"
import axios from "./Axios"
import "./create.css"
import add_icon from "./Assets/add_icon.png"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
class createProject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            currentStep: 1,
            propertiesData: "",
            floorsData: "",
            name: "",
            location: "",
            builder: "",
            type: '',
            owner: '',
            door: '',
            assignee: '',
            floor: '',

        }

    }


    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    componentDidMount() {
        this.loadProperties()
        this.loadFloors()

    }

    loadProperties = async () => {
        const response = await axios.get("/property/", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        console.log(response.status)
        if (response.status == 200) {
            let propertiesData = await response.data.results;
            console.log("propertiesData==>", response.data.results);
            this.setState({
                propertiesData
            })
        }
    }

    loadFloors = async () => {
        const response = await axios.get("floors/", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        console.log(response.status)
        let floorsData = await response.data.results;
        console.log("floorsData==>", response.data.results);
        this.setState({
            floorsData
        })

    }

    handleChange3 = () => {
        window.location.reload();

    }


    handleSubmit = (e) => {
        e.preventDefault()
        const formData = {
            name: this.state.name,
            location: this.state.location,
            builder: this.state.builder,
            // type: this.state.type,
            // owner: this.state.owner,
            // door: this.state.door,
            // status: "ACTIVE",
            owner: 2,


        }



        axios.post("/project/", formData, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })

            .then(response => {
                console.log(response.data)

                // alert("projectcreated")
                // window.location.href = "/listingProjects";
                if (response.status = 201) {
                    const formData1 = {
                        property_owner: this.state.owner,
                        doorno: this.state.door,
                        status: "ACTIVE",
                        type: this.state.type,
                        project: response.data.id,
                        owner: 2,
                        name: this.state.floor,
                        assigned_to: this.state.assignee


                    }



                    console.log(formData1)
                    axios.post("/property/", formData1, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                        }
                    })
                        .then(response => {
                            if (response.status == 201) {
                                let formData2 = {
                                    name: this.state.floor,
                                    assigned_to: this.state.assignee,
                                    property: response.data.id
                                }
                                axios.post("/floors/", formData2, {
                                    headers: {
                                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                                    }
                                })
                                    .then(response => {
                                        console.log("response", response.data)
                                        toast('Project Created')

                                        window.location.href = "/listingProjects";

                                    })
                                    .catch(error => {
                                        console.log(error)
                                    })
                            }


                        })
                        .catch(error => {
                            console.log(error)
                        })

                }

            })
            .catch(error => {
                console.log(error)
            })

    }








    _next = () => {
        let currentStep = this.state.currentStep
        currentStep = currentStep >= 2 ? 3 : currentStep + 1
        this.setState({
            currentStep: currentStep
        })
    }

    _prev = () => {
        let currentStep = this.state.currentStep
        currentStep = currentStep <= 1 ? 1 : currentStep - 1
        this.setState({
            currentStep: currentStep
        })
    }

    /*
    * the functions for our button
    */
    previousButton() {
        let currentStep = this.state.currentStep;
        if (currentStep !== 1) {
            return (
                <button
                    className="btn btn-primary js-btn-step"
                    type="button" onClick={this._prev}>
                    Previous
                </button>
            )
        }
        return null;
    }

    nextButton() {
        const { currentStep, name, location, builder, type, owner, door, floor, assignee } = this.state;

        if (currentStep < 3) {
            return (
                <button
                    className="btn btn-primary float-right mr-3 mb-2"
                    type="button"
                    onClick={this._next}
                    disabled={currentStep == 1 && name !== "" && location !== "" && builder !== "" ? false :
                        currentStep == 2 && type !== "" && owner !== "" && door !== "" ? false :
                            // currentStep == 3 && floor !== "" && assignee !== "" ? false :
                            true}>
                    Next
                </button>
            )
        }
        // else {
        //     return (
        //         <button type="submit" className="btn btn-primary js-btn-step float-right mt-2">Complete</button>
        //     )
        // }
        return null;
    }

    render() {
        return (
            <React.Fragment>
                {/* <h1>React Wizard Form 🧙‍♂️</h1> */}
                <style>
                    {`
                 .createProject label{
                    position: relative;
                    top: 19px;
                    left: 11px;
                    background: #fff;
                }
                .createProject input{
                    padding: 23px
                }
                `}
                </style>
                {/* <button type="button" className="btn btn-info btn-lg" data-toggle="modal"
                    data-target="#myModalCreateProject">Open Modal</button> */}
                <div id="myModalCreateProject" className="modal fade createProject" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">{this.state.currentStep === 1 ? "Create New Project" : "Enter Detail"}</h4>
                                <button type="button" onClick={this.handleChange3} className="close"
                                    data-dismiss="modal" >&times; </button>

                            </div>
                            <form className="m-0" onSubmit={this.handleSubmit}>
                                <div className="modal-body">

                                    {/* 
                            render the form steps and pass required props in
                        */}
                                    <Step1
                                        currentStep={this.state.currentStep}
                                        handleChange={this.handleChange}
                                        name={this.state.name}
                                        location={this.state.location}
                                        builder={this.state.builder}
                                        errors={this.state.errors}
                                    />
                                    <Step2
                                        currentStep={this.state.currentStep}
                                        handleChange={this.handleChange}
                                        type={this.state.type}
                                        owner={this.state.owner}
                                        door={this.state.door}
                                        name={this.state.name}
                                        Location={this.state.location}
                                        Builder={this.state.builder}
                                        propertiesData={this.state.propertiesData}
                                        errors={this.state.errors}

                                    />
                                    <Step3
                                        currentStep={this.state.currentStep}
                                        handleChange={this.handleChange}
                                        floor={this.state.floor}
                                        assignee={this.state.assignee}
                                        handleClick={this.handleClick1}
                                        floorsData={this.state.floorsData}

                                    />




                                </div>
                                <div className="modal-button" style={{ borderTop: "1px solid rgb(219 216 216)", padding: "11px" }}>
                                    {this.previousButton()}
                                    {this.nextButton()}
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
                {/* <p>Step {props.currentStep} </p>  */}


            </React.Fragment >
        );
    }
}

function Step1(props) {
    if (props.currentStep !== 1) {
        return null
    }
    return (
        <div>
            {console.log("1", props.location)}
            {console.log("2", props.name)}
            {console.log("3", props.builder)}

            <div className="form-group">
                <label htmlFor="name">Project Name (required)</label>

                <input
                    className="form-control"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="enter name"
                    value={props.name}
                    onChange={props.handleChange}
                />

            </div>
            <div className="form-group">
                <label htmlFor="location">Enter Location (required)</label>

                <input
                    className="form-control"
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Enter Location"
                    value={props.location}
                    onChange={props.handleChange} />

            </div>
            <div className="form-group">
                <label htmlFor="builder">Builder / Promotion</label>

                <input
                    className="form-control"
                    id="builder"
                    name="builder"
                    type="text"
                    placeholder="Enter Builder"
                    value={props.builder}
                    onChange={props.handleChange}
                />
            </div>
        </div>

    );
}

function Step2(props) {
    if (props.currentStep !== 2) {
        return null
    }
    return (
        <div>

            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label>Select a property type</label>
                        <select name="type" id="proper" value={props.type} className="form-control" onChange={props.handleChange} >
                            <option>-Select-</option>

                            <option value="1">Villa</option>
                            <option value="2">Apartment</option>
                            <option value="3">Duplex</option>

                        </select>

                    </div>
                </div>
                <div className="col-md-4">
                    <label htmlFor="">Enter Property Owner Name</label>

                    <input type="text" name="owner" className="form-control"
                        placeholder="Eg.Jhon"
                        onChange={props.handleChange}
                        value={props.owner} />

                </div>
                <div className="col-md-4">
                    <label htmlFor="">Enter Door Number</label>
                    <input type="text" name="door" className="form-control"
                        placeholder="Eg.001"
                        onChange={props.handleChange}
                        value={props.door} />
                </div>
            </div>
            {/* <div className="col-md-offset-1 col-md-10" style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                <span className="pull-right add_prop" style={{ color: "#075bd9" }}> <img src={add_icon} alt="addicon"
                />
                 Add Property</span>
            </div> */}
            <div className="col-md-12 mt-2 table_div">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Property Type</th>
                            <th>Property Owner</th>
                            <th>Door Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{props.type == 1 ? "Villa" : props.type == 2 ? "Apartment" :props.type == 3 ? "Duplex" : ""} </td>
                            <td>{props.owner} </td>
                            <td>{props.door}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Step3(props) {
    if (props.currentStep !== 3) {
        return null
    }
    return (
        <React.Fragment>
            {/* <div className="col-md-offset-1 col-md-10"> */}
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="">Enter Floor Number</label>
                    <input type="text" name="floor" className="form-control" value={props.floor} onChange={props.handleChange} placeholder="Eg.12" />
                </div>
                <div className="col-md-6">

                    {/* <label htmlFor="" style={{ visibility: "hidden" }}>Employee Id</label> */}
                    <label htmlFor="">Select Employee Id</label>

                    <select name="assignee" id="assignee" value={props.assignee} className="form-control"
                        onChange={props.handleChange}>
                        <option >Assignee</option>
                        <option value="3">Jhon</option>
                        {/* <option value="4">4</option> */}
                    </select>
                </div>
            </div>
            {/* </div> */}
            {/* <div className="col-md-12" style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                <span className="pull-right add_prop" style={{ color: "#075bd9" }}> <img src={add_icon} alt="addicon"
                /> Add Floor</span>
            </div> */}
            <div className="col-md-12 mt-3 table_div">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Floor No</th>
                            <th>Assignee</th>
                        </tr>

                    </thead>
                    <tbody>
                        <tr>
                            <td>{props.floor}</td>
                            <td>{props.assignee == 3 ? 'Jhon' : ""}</td>
                        </tr>
                        {/* {
                            props.floorsData.map((floor) => {
                                return (
                                    <tr>
                                        <td>{floor.name}</td>
                                        <td>{floor.assigned_to}</td>

                                    </tr>
                                )
                            })

                        } */}

                    </tbody>
                </table>
            </div>
            <button className="btn btn-primary js-btn-step float-right" style={{marginTop:"30px"}}>Complete</button>

        </React.Fragment>
    );
}
export default createProject;
// import React from "react"
// import { Modal } from "bootstrap"
// import axios from "./Axios"
// import "./create.css"
// import add_icon from "./Assets/add_icon.png"
// class createProject extends React.Component {

//     constructor(props) {
//         super(props)
//         this.state = {
//             currentStep: 1,
//             propertiesData: "",
//             floorsData: "",
//             name: "",
//             location: "",
//             builder: "",
//             type: '',
//             owner: '',
//             door: '',
//             assignee: '',
//             floor: '',
//             projectId: "",
//             addNewProject: {
//                 name: '',
//                 location: '',
//                 builder: "",
//                 type: ""
//             },
//             editProject: {},
//             currentIndex: '',
//             projectData: [],
//             type: ""
//         }

//     }


//     componentWillReceiveProps(nextProps) {
//         // console.log("nextProps==>", nextProps);
//         if (nextProps.type === "edit" || nextProps.type === "completed" || nextProps.type === "copy") {
//             this.setState({
//                 projectData: nextProps.projectData,
//                 projectId: nextProps.projectId,
//                 currentIndex: nextProps.currentIndex,
//                 editProject: nextProps.projectData[nextProps.currentIndex],
//                 type: nextProps.type
//             })
//         } else {
//             this.setState({
//                 projectData: [],
//                 projectId: "",
//                 currentIndex: "",
//                 editProject: {},
//                 type: "",
//             })
//         }
//     }

//     handleChange = (e) => {
//         var { name, value } = e.target;
//         if (this.state.currentIndex === "") {
//             let addNewProject = this.state.addNewProject;
//             addNewProject[name] = value;
//             this.setState({ addNewProject });
//         }
//         else {
//             let projectData = this.state.projectData;
//             projectData[this.state.currentIndex][name] = value
//             this.setState({ projectData });
//         }
//     }

//     handleSubmit = (e) => {
//         e.preventDefault()
//         let formData;
//         if (this.state.projectId > 0) {
//             //         formData = {
//             //             name: this.state.editProject.name,
//             //             location: this.state.editProject.location,
//             //             type: Number(this.state.editProject.type),
//             //             builder: this.state.editProject.builder,
//             //         }
//             //     } else {
//             //         formData = {
//             //             name: this.state.addNewProject.name,
//             //             location: this.state.addNewProject.location,
//             //             type: Number(this.state.addNewProject.type),
//             //             builder: this.state.addNewProject.builder,
//             //         }
//             //     }

//             formData = {
//                 name: this.state.editProject.name,
//                 location: this.state.editProject.location,
//                 builder: this.state.editProject.builder,

//                 owner: 2,
//             }

//         }
//         else {
//             formData = {
//                 name: this.state.addNewProject.name,

//                 location: this.state.addNewProject.location,
//                 builder: this.state.addNewProject.builder,
//                 owner: 2,


//             }
//         }
//         if (this.state.currentIndex !== "" && this.state.type === "edit") {
//             axios.patch(`https://nbk.synctactic.ai/project/${this.state.projectId}/`, { ...formData, status: this.state.editProject.status }, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//                 }
//             })
//                 .then(response => {
//                     console.log(response.data)
//                     window.location.href = "/listingProjects";
//                 })
//                 .catch(error => {
//                     console.log(error)
//                 })

//         } else if (this.state.currentIndex !== "" && this.state.type === "completed") {
//             console.log("completed project as mark as complete")
//             axios.patch(`https://nbk.synctactic.ai/property/${this.state.projectId}/`, { ...formData, status: "CMP" }, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//                 }
//             })
//                 .then(response => {
//                     console.log(response.data)
//                     window.location.href = "/listingProjects";
//                 })
//                 .catch(error => {
//                     console.log(error)
//                 })
//         } else if (this.state.currentIndex !== "" && this.state.type === "copy") {
//             axios.post("https://nbk.synctactic.ai/project/ ", formData, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//                 }
//             })
//                 .then(response => {
//                     console.log(response.data)
//                     window.location.href = "/listingProjects";

//                 })
//                 .catch(error => {
//                     console.log(error)
//                 })
//         } else {
//             axios.post("https://nbk.synctactic.ai/project/ ", formData, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//                 }
//             })
//                 .then(response => {
//                     console.log(response.data)
//                     window.location.href = "/listingProjects";
//                 })
//                 .catch(error => {
//                     console.log(error)
//                 })
//         }




//         // axios.post("/project/", formData, {
//         //     headers: {
//         //         "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//         //     }
//         // })

//         //     .then(response => {
//         //         console.log(response.data)

//         //         window.location.href = "/listingProjects";
//         // if (response.status = 201) {
//         //     const formData1 = {
//         //         property_owner: this.state.owner,
//         //         doorno: this.state.door,
//         //         status: "ACTIVE",
//         //         type: this.state.type,
//         //         project: response.data.id,
//         //         owner: 2,
//         //         name: this.state.floor,
//         //         assigned_to: this.state.assignee


//         //     }


//         //     console.log(formData1)
//         //     axios.post("/property/", formData1, {
//         //         headers: {
//         //             "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//         //         }
//         //     })
//         //         .then(response => {
//         //             console.log("response", response.data)
//         //             window.location.href = "/listingProjects";


//         //         })
//         //         .catch(error => {
//         //             console.log(error)
//         //         })

//         // }

//         //         })
//         //         .catch(error => {
//         //             console.log(error)
//         //         })

//         // }

//         //  handleSubmit = (e) => {
//         //     e.preventDefault()
//         //     let formData;
//         //     if (this.state.projectId > 0) {
//         //         formData = {
//         //             name: this.state.editProject.name,
//         //             location: this.state.editProject.location,
//         //             type: Number(this.state.editProject.type),
//         //             builder: this.state.editProject.builder,
//         //         }
//         //     } else {
//         //         formData = {
//         //             name: this.state.addNewProject.name,
//         //             location: this.state.addNewProject.location,
//         //             type: Number(this.state.addNewProject.type),
//         //             builder: this.state.addNewProject.builder,
//         //         }
//         //     }

//         //     console.log("formData==>", formData);
//         //    
//         //      if (this.state.currentIndex !== "" && this.state.type === "edit") {
//         //         axios.patch(`https://nbk.synctactic.ai/project/${this.state.projectId}/`, { ...formData, status: this.state.editProject.status }, {
//         //             headers: {
//         //                 "Content-Type": "application/json",
//         //                 "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//         //             }
//         //         })
//         //             .then(response => {
//         //                 console.log(response.data)
//         //                 window.location.href = "/listingProjects";
//         //             })
//         //             .catch(error => {
//         //                 console.log(error)
//         //             })

//         //     } else if (this.state.currentIndex !== "" && this.state.type === "completed") {
//         //         console.log("completed project as mark as complete")
//         //         axios.patch(`https://nbk.synctactic.ai/project/${this.state.projectId}/`, { ...formData, status: "CMP" }, {
//         //             headers: {
//         //                 "Content-Type": "application/json",
//         //                 "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//         //             }
//         //         })
//         //             .then(response => {
//         //                 console.log(response.data)
//         //                 window.location.href = "/listingProjects";
//         //             })
//         //             .catch(error => {
//         //                 console.log(error)
//         //             })
//         //     } else if (this.state.currentIndex !== "" && this.state.type === "copy") {
//         //         axios.post("https://nbk.synctactic.ai/project/ ", formData, {
//         //             headers: {
//         //                 "Content-Type": "application/json",
//         //                 "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//         //             }
//         //         })
//         //             .then(response => {
//         //                 console.log(response.data)
//         //                 window.location.href = "/listingProjects";

//         //             })
//         //             .catch(error => {
//         //                 console.log(error)
//         //             })
//         //     } else {
//         //         axios.post("https://nbk.synctactic.ai/project/ ", formData, {
//         //             headers: {
//         //                 "Content-Type": "application/json",
//         //                 "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//         //             }
//         //         })
//         //             .then(response => {
//         //                 console.log(response.data)
//         //                 window.location.href = "/listingProjects";
//         //             })
//         //             .catch(error => {
//         //                 console.log(error)
//         //             })
//     }










//     _next = () => {
//         let currentStep = this.state.currentStep
//         currentStep = currentStep >= 2 ? 3 : currentStep + 1
//         this.setState({
//             currentStep: currentStep
//         })
//     }

//     _prev = () => {
//         let currentStep = this.state.currentStep
//         currentStep = currentStep <= 1 ? 1 : currentStep - 1
//         this.setState({
//             currentStep: currentStep
//         })
//     }

//     /*
//     * the functions for our button
//     */
//     previousButton() {
//         let currentStep = this.state.currentStep;
//         if (currentStep !== 1) {
//             return (
//                 <button
//                     className="btn btn-primary js-btn-step"
//                     type="button" onClick={this._prev}>
//                     Previous
//                 </button>
//             )
//         }
//         return null;
//     }

//     nextButton() {
//         let currentStep = this.state.currentStep;
//         if (currentStep < 3) {
//             return (
//                 <button
//                     className="btn btn-primary float-right mr-3"
//                     type="button" onClick={this._next}>
//                     Next
//                 </button>
//             )
//         }
//         return null;
//     }

//     render() {
//         //  console.log("values", this.state.editProject,
//         // this.state.currentIndex,
//         //     this.state.projectData,
//         //     this.state.type, this.state.projectId)
//         return (
//             <React.Fragment>
//                 {/* <h1>React Wizard Form 🧙‍♂️</h1> */}
//                 <style>
//                     {`
//                  .createProject label{
//                     position: relative;
//                     top: 19px;
//                     left: 11px;
//                     background: #fff;
//                 }
//                 .createProject input{
//                     padding: 23px
//                 }
//                 `}
//                 </style>
//                 {/* <button type="button" className="btn btn-info btn-lg" data-toggle="modal"
//                     data-target="#myModalCreateProject">Open Modal</button> */}
//                 <div id="myModalCreateProject" className="modal fade createProject" role="dialog">
//                     <div className="modal-dialog modal-lg">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h4 className="modal-title">{this.state.currentStep === 1 ? "Create New Project" : "Enter Detail"}</h4>
//                                 <button type="button" className="close" data-dismiss="modal">&times;</button>
//                             </div>
//                             <div className="modal-body">
//                                 <form className="m-0" onSubmit={this.handleSubmit}>
//                                     {/* 
//                             render the form steps and pass required props in
//                         */}
//                                     <Step1
//                                         currentStep={this.state.currentStep}
//                                         handleChange={this.handleChange}
//                                         name={this.state.name}
//                                         Location={this.state.location}
//                                         Builder={this.state.builder}
//                                         projectId={this.state.projectId}
//                                         editProject={this.state.editProject}
//                                         currentIndex={this.state.currentIndex}
//                                         type={this.state.type}
//                                         addNewProject={this.state.addNewProject}
//                                     />
//                                     <Step2
//                                         currentStep={this.state.currentStep}
//                                         handleChange={this.handleChange}
//                                         type={this.state.type}
//                                         owner={this.state.owner}
//                                         door={this.state.door}
//                                         propertiesData={this.state.propertiesData}
//                                         currentIndex={this.state.currentIndex}
//                                         addNewProject={this.state.addNewProject}


//                                     />
//                                     <Step3
//                                         currentStep={this.state.currentStep}
//                                         handleChange={this.handleChange}
//                                         floor={this.state.floor}
//                                         assignee={this.state.assignee}
//                                         floorsData={this.state.floorsData}
//                                         currentIndex={this.state.currentIndex}
//                                         addNewProject={this.state.addNewProject}
//                                         type={this.state.type}

//                                     />



//                                 </form>
//                             </div>
//                             <div className="modal-button" style={{ borderTop: "1px solid rgb(219 216 216)", padding: "11px" }}>
//                                 {this.previousButton()}
//                                 {this.nextButton()}
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//                 {/* <p>Step {props.currentStep} </p>  */}


//             </React.Fragment>
//         );
//     }
// }
// function Step1(props) {
//     console.log("step1", props)

//     if (props.currentStep !== 1) {
//         return null
//     }
//     return (
//         <div>
//             <div className="form-group">
//                 <label htmlFor="name">Project Name (required)</label>

//                 <input
//                     className="form-control"
//                     id="name"
//                     name="name"
//                     type="text"
//                     placeholder="enter name"
//                     value={props.projectId > 0 ? props.editProject.name : props.addNewProject.name}
//                     // value={props.name}
//                     onChange={props.handleChange}


//                 />

//             </div>
//             <div className="form-group">
//                 <label htmlFor="location">Enter Location (required)</label>

//                 <input
//                     className="form-control"
//                     id="location"
//                     name="location"
//                     type="text"
//                     placeholder="Enter Location"
//                     // value={props.location}

//                     value={props.projectId > 0 ? props.editProject.location : props.addNewProject.location}

//                     onChange={props.handleChange} />

//             </div>
//             <div className="form-group">
//                 <label htmlFor="builder">Builder / Promotion</label>

//                 <input
//                     className="form-control"
//                     id="builder"
//                     name="builder"
//                     type="text"
//                     placeholder="Enter Builder"
//                     // value={props.projectId > 0 ?
//                     value={props.projectId > 0 ? props.editProject.builder : props.addNewProject.builder}

//                     onChange={props.handleChange}
//                 />
//             </div>
//         </div>

//     );
// }

// function Step2(props) {
//     if (props.currentStep !== 2) {
//         return null
//     }
//     return (
//         <div>

//             <div className="row">
//                 <div className="col-md-4">
//                     <div className="form-group">
//                         <label>Select a project type</label>

//                         <select name="type" id="proper" className="form-control"
//                             value={props.projectId > 0 ? props.editProject.type : props.addNewProject.type}

//                             onChange={props.handleChange} >
//                             <option value="0">-Select-</option>

//                             <option value="1">Villa</option>
//                             <option value="2">Apartment</option>
//                             <option value="3">Duplex</option>

//                         </select>

//                     </div>
//                 </div>
//                 <div className="col-md-4">
//                     <label htmlFor="">Enter Property Owner Name</label>

//                     <input type="text" name="owner" className="form-control"
//                         placeholder="Eg.Jhon"
//                         onChange={props.handleChange}
//                         // value={props.owner} 
//                         value={props.projectId > 0 ? props.editProject.owner : props.addNewProject.owner} />

//                 </div>
//                 <div className="col-md-4">
//                     <label htmlFor="">Enter Door Number</label>

//                     <input type="text" name="door" className="form-control"
//                         placeholder="Eg.001"
//                         onChange={props.handleChange}
//                         // value={props.door}
//                         value={props.projectId > 0 ? props.editProject.door : props.addNewProject.door}
//                     />
//                 </div>
//             </div>
//             <div className="col-md-offset-1 col-md-10" style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>

//                 <span className="pull-right add_prop" style={{ color: "#075bd9" }}> <img src={add_icon} alt="addicon"
//                 />
//                  Add Property</span>
//             </div>
//             <div className="col-md-12 table_div">
//                 <table className="table table-striped">

//                     <thead>
//                         <tr>
//                             <th>Property Type</th>
//                             <th>Property Owner</th>
//                             <th>Door Number</th>
//                         </tr>
//                     </thead>
//                     <tbody>

//                         <th>{props.type} </th>
//                         <th>{props.owner} </th>
//                         <th>{props.door}</th>

//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// function Step3(props) {
//     if (props.currentStep !== 3) {
//         return null
//     }
//     return (
//         <React.Fragment>
//             {/* <div className="col-md-offset-1 col-md-10"> */}
//             <div className="row">
//                 <div className="col-md-6">
//                     <label htmlFor="">Enter Floor Number</label>

//                     <input type="text" name="floor" className="form-control"
//                         value={props.projectId > 0 ? props.editProject.floor : props.addNewProject.floor}
//                         onChange={props.handleChange} placeholder="Eg.12" />
//                 </div>
//                 <div className="col-md-6">
//                     <label>Select a project type</label>

//                     <select name="assignee" id="assignee" className="form-control"
//                         value={props.projectId > 0 ? props.editProject.assignee : props.addNewProject.assignee}

//                         onChange={props.handleChange}>
//                         <option value="0">-Select-</option>
//                         <option value="">Assignee</option>
//                         <option value="1">Jhon</option>
//                         <option value="2">Raja</option>
//                     </select>
//                 </div>
//             </div>
//             {/* </div> */}
//             <div className="col-md-12" style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
//                 <span className="pull-right add_prop" style={{ color: "#075bd9" }}> <img src={add_icon} alt="addicon"
//                 /> Add Floor</span>
//             </div>
//             <div className="col-md-12 table_div">
//                 <table className="table table-striped">
//                     <thead>
//                         <tr>
//                             <th>Floor Number</th>
//                             <th>Assignee</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td>{props.name}</td>
//                             <td>{props.assigned_to}</td>

//                         </tr>


//                     </tbody>
//                 </table>
//             </div>
//             <button className="btn btn-primary js-btn-step float-right mt-2">Complete</button>
//         </React.Fragment>
//     );
// }
// export default createProject;
// nextButton() {
//     const { currentStep, name, location, builder, type, owner, door, floor, assignee } = this.state;
//     // let currentStep = this.state.currentStep;
//     if (currentStep < 3) {
//         return (
//             <button
//                 className="btn btn-primary float-right mr-3"
//                 type="button"
//                 onClick={this._next}
//                 disabled={currentStep == 1 && name !== "" && location !== "" && builder !== "" ? false :
//                     currentStep == 2 && type !== "" && owner !== "" && door !== "" ? false :
//                         // currentStep == 3 && floor !== "" && assignee !== "" ? false :
//                         true}>
//                 Next
//             </button>
//         )
//     }
//     // else {
//     //     return (
//     //         <button type="submit" className="btn btn-primary js-btn-step float-right mt-2">Complete</button>
//     //     )
//     // }
//     return null;
// }