import React from "react"
import Swal from "sweetalert2"
// import axios from "axios"
import { Link } from "react-router-dom"
import Loginimage from "./Assets/Log in image.jpg"
import nemmadi_logo from "./Assets/nemmadi_logo.png"
import filter from "./Assets/icon Nemmadi/filter_list-24px.svg"
import sort from "./Assets/icon Nemmadi/sort-24px.svg"
// import bell from "./Assets/bell.jpg"
import search from "./Assets/icon Nemmadi/search.png"
import asset from "./Assets/icon Nemmadi/asset-24px.svg"
import dateFormat from "dateformat";
import Delete from "./Assets/Delete.png"
import Edit from "./Assets/Edit.png"
import Mark from "./Assets/Mark.png"
import Duplicate from "./Assets/Duplicate.png"
import Create_Modal from "./Create_Modal"
import axios from "./Axios"
import key from "./Assets/key.jpeg"
import logout from "./Assets/login.jpeg"
import image15569 from "./Assets/15569.jpeg"
import Navbar from "./Navbar"
import arrows from "./Assets/arrows.jpeg"
import CreateModal from "./Completed_projects/CreateModal"
// import reset from "./Assets/reset.jpeg"
class People extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activeTab: "People",
            // name: '',
            // email: "",
            usersData: [],
            search: "",
            ascending: false,
            fields: {},
            errors: {},
            email: '',
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    }


    handleClose = () => {
        this.setState({ search: "" })
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
        // this.setState({ascending: !this.state.ascending });
        // setAscending(!ascending);
        if (this.state.ascending) {
            let usersDataCopy = this.state.usersData;
            usersDataCopy.sort(this.compareBy(key));
            this.setState({ usersData: usersDataCopy })
            //   setData(projectDataCopy);
        } else {
            let usersDataCopy = this.state.usersData;
            usersDataCopy.sort(this.compareBy(key));
            this.setState({ usersData: usersDataCopy.reverse() })

            //   setData(projectDataCopy.reverse());
        }
    };



    handleActiveTab = (activeData) => {
        this.setState({
            activeTab: activeData
        })
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        let fields = this.state.fields;
        fields[e.target.name] = e.target.value;
        this.setState({
            fields
        });

    }
    handleSubmit = (e) => {
        e.preventDefault()

        const formData = {
            fields: this.state.fields
        }
        if (this.validateForm()) {
            let fields = {};
            fields["username"] = "";
            fields["email"] = "";
            this.setState({ fields: fields });
            alert("Form submitted");
            console.log(formData)
            axios.post("/user/", formData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            })
                .then(response => {
                    if (response.status == 201) {
                        this.props.history.push('/people')
                    }
                })
                .catch(error => {
                    console.log("hi")
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                })
        }
    }
    validateForm() {

        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if (!fields["username"]) {
            formIsValid = false;
            errors["username"] = "*Please enter your username.";
        }

        if (typeof fields["username"] !== "undefined") {
            if (!fields["username"].match(/^[\w.@+-]+$/)) {
                formIsValid = false;
                errors["username"] = "*Please enter alphabet characters only.";
            }
        }

        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "*Please enter your email-ID.";
        }

        if (typeof fields["email"] !== "undefined") {
            //regular expression for email validation
            if (!fields["email"].match(/^[\w.@+-]+$/)) {

                formIsValid = false;
                errors["email"] = "*Please enter valid email-ID.";
            }
        }
        this.setState({
            errors: errors
        });
        return formIsValid;


    }

    componentDidMount() {
        this.loadUsers();
    }
    loadUsers = async () => {
        const response = await axios.get("user/", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        if (response.status == 200) {
            let usersData = await response.data.results;
            console.log("usersData==>", response.data.results);

            this.setState({
                usersData
            })
        }
    }
    handleReset = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    // handleSubmit = (e) => {
    //     e.preventDefault()
    //     console.log("email")
    //     const formData = {
    //         email: this.state.email,
    //     }
    //     console.log(formData)
    //     axios.post("/reset/ ", formData, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    //         }
    //     })
    //         .then(response => {
    //             console.log(response)
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    // }
    handleChange1 = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit1 = (e) => {
        e.preventDefault()

        const formData = {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            confirmPassword: this.state.confirmPassword
        }
        console.log(formData)
        axios.post("/confirm/ ", formData, {
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

    handleRemove = (id) => {
        console.log(`${id}`)
        const confirmRemove = window.confirm('Are You sure?')
        if (confirmRemove) {
            axios.delete(`user/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            })
                .then(response => {
                    if (response.status == 204) {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Your are successfully deleted record',
                            timer: 1500
                        })
                        this.loadUsers()
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
    handleEdit = (id, email) => {
        const formData = {
            email: email,
            status: "INACTIVE"
        }
        console.log(formData)
        axios.patch(`user/${id}/`, formData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }


    render() {
        let filteredData = this.state.usersData.filter(project =>
            project.name && project.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
            project.email && project.email.toLowerCase().includes(this.state.search.toLowerCase())
        )

        return (
            <div>
                <Navbar />
                <div></div>
                {/* <div className="activated-bg">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-4 pl-3 pr-0">
                                <nav className="navbar navbar-expand-lg mt-2" >
                                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                        <ul className="navbar-nav mr-auto" style={{ fontFamily: "Roboto" }}>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Home
                                            </a>
                                            </li>
                                            <p style={{ marginTop: "2px" }}>/</p>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">People
                                            </a>
                                            </li>
                                        </ul>

                                    </div>
                                </nav>

                            </div>
                            <div className="col-3">
                                <input
                                    type="search"
                                    name="search"
                                    value={this.state.search}
                                    onChange={this.handleChange}
                                    className="search_input" placeholder="Search" />
                                <img src={search} alt="search" className="search_img" />
                            </div>

                            <div className="col-4">
                                <div className="row float-right">
                                    <div className="col-12">


                                        {/* <button className="filter_btn pr-2 ml-2">
                                            <img src={filter}
                                                alt="filter" className="img-fluid" />
                                    Filter
                                </button>&nbsp;
                                <img src={sort} alt="sort" className="img-fluid" /> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div> */}
                <div className="activated-bg">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-4 pl-3 pr-0">
                                <nav className="navbar navbar-expand-lg mt-2" style={{ background: "transparent", boxShadow: "none" }} >
                                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                        <ul className="navbar-nav mr-auto" style={{ fontFamily: "Roboto" }}>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Home
                                            </a>
                                            </li>
                                            <p style={{ marginTop: "2px" }}>/</p>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">People
                                            </a>
                                            </li>
                                        </ul>

                                    </div>
                                </nav>

                            </div>
                            <div className="col-3">
                                <input
                                    type="search"
                                    name="search"
                                    value={this.state.search}
                                    onChange={this.handleChange}
                                    className="search_input" placeholder="Search" />
                                <img src={search} alt="search" className="search_img" />
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.activeTab === "People" && <span className="ml-3 people">Invite People</span>}
                <div className="row ml-3 ">
                    {this.state.activeTab === "People" && <form style={{ float: "left", marginTop: "10px" }}>
                        <div className="row">
                            <div className="col-5">
                                <input className="form-group login ml-2 " type="text" name="username"
                                    onChange={this.handleChange} placeholder="Name" value={this.state.fields.username} />
                                <div className="errorMsg ml-2">{this.state.errors.username}</div>
                            </div>
                            <div className="col-5">
                                <input className=" ml-2 form-group login " type="text"
                                    name="email" onChange={this.handleChange} value={this.state.fields.emailid} placeholder="Email Id" />
                                <div className="errorMsg" >{this.state.errors.emailid}</div>
                            </div>
                            <div className="col-2">
                                <button className="ml-2  invite" onClick={this.handleSubmit} type="submit" >Invite</button>

                            </div>
                        </div>

                    </form>}
                    {this.state.activeTab === "People" && <table className="table table-striped mt-5" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th onClick={() => this.sortByKey("id")}>id  &nbsp;
                                         <img src={arrows} className="arrow_img image" /></th>

                                <th onClick={() => this.sortByKey("name")}>Name&nbsp;
                                         <img src={arrows} className="arrow_img image" /> </th>
                                <th onClick={() => this.sortByKey("email")}>Email &nbsp;
                                         <img src={arrows} className="arrow_img image" /></th>
                                <th onClick={() => this.sortByKey("Date")}>Date</th>
                                <th>Active</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredData.map((user) => {
                                    return (
                                        <tr>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{dateFormat(user.created_time, " dd-mm-yyyy")}</td>
                                            <td>{user.status}</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="dropbtn">
                                                        <img src={asset}
                                                            alt="" className="img-fluid asset_img" /></button>
                                                    <div className="dropdown-content">
                                                        <a href="#">
                                                            <img src={Edit} alt="" onClick={() => this.handleEdit(user.id, user.email)} title="Edit" />
                                                        </a>
                                                        <a href="#" >
                                                            <img src={Delete} onClick={() => this.handleRemove(user.id)} alt="" title="Delete" />
                                                        </a>
                                                        {/* <a href="#" data-toggle="modal"
                                                            data-target="#exampleModal">
                                                            <img className="imge-fluid" src={reset}
                                                                alt="" />
                                                        </a> */}
                                                        {/* <button className="bg-danger"
                                                                    onClick={() => { this.handleRemove(project.id) }}>

                                                                    <img src={Delete} alt="" title="Delete" />
                            </button> */}



                                                    </div>



                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>}
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-6 ml-2">
                            <p className="Rectangle-4">Showing 1 to 10 of 150 entries</p>
                        </div>
                        <div className="col-5 pull-right p-0 mr-3">
                            <div className="pagination float-right mt-4">
                                <a href="#">&lsaquo;&lsaquo;</a>
                                <a href="#">&lsaquo;</a>
                                <a href="#" className="active">1</a>
                                <a href="#" >2</a>
                                <a href="#">3</a>
                                <a href="#">4</a>
                                <a href="#">5</a>
                                <a href="#">&rsaquo;</a>
                                <a href="#">&rsaquo;&rsaquo;</a>
                            </div>
                        </div>
                    </div>
                </div>

                <CreateModal />
            </div>


        )
    }
}
export default People
// import React from "react"
// import Swal from "sweetalert2"
// // import axios from "axios"
// import { Link } from "react-router-dom"
// import Loginimage from "./Assets/Log in image.jpg"
// import nemmadi_logo from "./Assets/nemmadi_logo.png"
// import filter from "./Assets/icon Nemmadi/filter_list-24px.svg"
// import sort from "./Assets/icon Nemmadi/sort-24px.svg"
// // import bell from "./Assets/bell.png"
// import search from "./Assets/icon Nemmadi/search.png"
// import asset from "./Assets/icon Nemmadi/asset-24px.svg"
// import dateFormat from "dateformat";
// import Delete from "./Assets/Delete.png"
// import Edit from "./Assets/Edit.png"
// // import Mark from "./Assets/Mark.png"
// // import Duplicate from "./Assets/Duplicate.png"
// // import Create_Modal from "./Create_Modal"
// import axios from "./Axios"
// // import key from "./Assets/key.png"
// // import logout from "./Assets/login.png"
// // import image15569 from "./Assets/15569.png"
// import Navbar from "./Navbar"
// import arrows from "./Assets/arrows.jpeg"
// // import reset from "./Assets/reset.jpeg"
// import Pagination from "./Pagination"
// import CreateModal from "../components/Create_Modal";
// class People extends React.Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             activeTab: "People",
//             // name: '',
//             // email: "",
//             usersData: [],
//             search: "",
//             ascending: false,
//             fields: {},
//             errors: {},
//             email: '',
//             oldPassword: "",
//             newPassword: "",
//             confirmPassword: "",
//             showPerPage: 2,
//             pagination: {
//                 start: "",
//                 end: ""
//             },

//         }
//     }


//     handleClose = () => {
//         this.setState({ search: "" })
//     }
//     compareBy = (key) => {
//         return function (a, b) {
//             if (a[key] < b[key]) return -1;
//             if (a[key] > b[key]) return 1;
//             return 0;
//         };
//     };

//     sortByKey = (key) => {
//         this.setState(prevState => ({
//             ascending: !prevState.ascending
//         }));
//         // this.setState({ascending: !this.state.ascending });
//         // setAscending(!ascending);
//         if (this.state.ascending) {
//             let usersDataCopy = this.state.usersData;
//             usersDataCopy.sort(this.compareBy(key));
//             this.setState({ usersData: usersDataCopy })
//             //   setData(projectDataCopy);
//         } else {
//             let usersDataCopy = this.state.usersData;
//             usersDataCopy.sort(this.compareBy(key));
//             this.setState({ usersData: usersDataCopy.reverse() })

//             //   setData(projectDataCopy.reverse());
//         }
//     };



//     handleActiveTab = (activeData) => {
//         this.setState({
//             activeTab: activeData
//         })
//     }
//     handleChange = (e) => {
//         this.setState({
//             [e.target.name]: e.target.value
//         })
//         let fields = this.state.fields;
//         fields[e.target.name] = e.target.value;
//         this.setState({
//             fields
//         });

//     }
//     handleSubmit = (e) => {
//         e.preventDefault()

//         const formData = {
//             fields: this.state.fields
//         }
//         if (this.validateForm()) {
//             let fields = {};
//             fields["username"] = "";
//             fields["emailid"] = "";
//             this.setState({ fields: fields });
//             alert("Form submitted");
//             console.log(formData)
//             axios.post("/user/", formData, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//                 }
//             })
//                 .then(response => {
//                     if (response.status == 201) {
//                         this.props.history.push('/people')
//                     }
//                 })
//                 .catch(error => {
//                     console.log("hi")
//                     if (error.response) {
//                         console.log(error.response.data);
//                         console.log(error.response.status);
//                         console.log(error.response.headers);
//                     }
//                 })
//         }
//     }
//     validateForm() {

//         let fields = this.state.fields;
//         let errors = {};
//         let formIsValid = true;

//         if (!fields["username"]) {
//             formIsValid = false;
//             errors["username"] = "*Please enter your username.";
//         }

//         if (typeof fields["username"] !== "undefined") {
//             if (!fields["username"].match(/^[\w.@+-]+$/)) {
//                 formIsValid = false;
//                 errors["username"] = "*Please enter alphabet characters only.";
//             }
//         }

//         if (!fields["emailid"]) {
//             formIsValid = false;
//             errors["emailid"] = "*Please enter your email-ID.";
//         }

//         if (typeof fields["emailid"] !== "undefined") {
//             //regular expression for email validation
//             var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+))|("[\w-\s]+")([\w-]+(?:\.[\w-]+)))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
//             if (!pattern.test(fields["emailid"])) {
//                 formIsValid = false;
//                 errors["emailid"] = "*Please enter valid email-ID.";
//             }
//         }
//         this.setState({
//             errors: errors
//         });
//         return formIsValid;


//     }

//     componentDidMount() {
//         this.loadUsers();
//     }
//     loadUsers = async () => {
//         const response = await axios.get("user/", {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//             }
//         })
//         if (response.status == 200) {
//             let usersData = await response.data.results;
//             console.log("usersData==>", response.data.results);

//             this.setState({
//                 usersData
//             })
//         }
//     }
//     handleReset = (e) => {
//         this.setState({
//             [e.target.name]: e.target.value
//         })
//     }
//     handleSubmit = (e) => {
//         e.preventDefault()

//         const formData = {
//             email: this.state.email
//         }
//         console.log(formData)
//         axios.post("/reset/ ", formData, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//             }
//         })
//             .then(response => {
//                 console.log(response)
//             })
//             .catch((error) => {
//                 console.log(error)
//             })
//     }
//     handleChange1 = (e) => {
//         this.setState({
//             [e.target.name]: e.target.value
//         })
//     }
//     handleSubmit1 = (e) => {
//         e.preventDefault()

//         const formData = {
//             oldPassword: this.state.oldPassword,
//             newPassword: this.state.newPassword,
//             confirmPassword: this.state.confirmPassword
//         }
//         console.log(formData)
//         axios.post("/confirm/ ", formData, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//             }
//         })
//             .then(response => {
//                 console.log(response)
//             })
//             .catch((error) => {
//                 console.log(error)
//             })
//     }

//     handleRemove = (id) => {
//         console.log(`${id}`)
//         const confirmRemove = window.confirm('Are You sure?')
//         if (confirmRemove) {
//             axios.delete(`user/${id}`, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//                 }
//             })
//                 .then(response => {
//                     if (response.status == 204) {
//                         Swal.fire({
//                             position: 'top-end',
//                             icon: 'success',
//                             title: 'Your are successfully deleted record',
//                             timer: 1500
//                         })
//                         this.loadUsers()
//                     }
//                 })
//                 .catch(error => {
//                     console.log(error)
//                 })
//         }
//     }
//     handleEdit = (id, email) => {
//         const formData = {
//             email: email,
//             status: "INACTIVE"
//         }
//         console.log(formData)
//         axios.patch(`user/${id}/`, formData, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${localStorage.getItem("authToken")}`
//             }
//         })
//             .then(response => {
//                 console.log(response)
//             })
//             .catch(error => {
//                 console.log(error)
//             })
//     }
//     onPaginationChange = (start, end) => {
//         let pagination = this.state.pagination;
//         pagination.start = start;
//         pagination.end = end;
//         this.setState({ pagination });
//     };


//     render() {
//         let filteredData = this.state.usersData.filter(project =>
//             project.name && project.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
//             project.email && project.email.toLowerCase().includes(this.state.search.toLowerCase())
//         )

//         console.log("errors==>", this.state.errors)
//         return (
//             <div>

//                 <Navbar />
//                 <div></div>
//                 <div className="activated-bg">
//                     <div className="container-fluid">
//                         <div className="row">
//                             <div className="col-4 pl-3 pr-0">
//                                 {/* <nav className="navbar navbar-expand-lg mt-2" >
//                                     <div className="collapse navbar-collapse" id="navbarSupportedContent">
//                                         <ul className="navbar-nav mr-auto" style={{ fontFamily: "Roboto" }}>
//                                             <li className="nav-item">
//                                                 <a className="nav-link" href="#">Home
//                                             </a>
//                                             </li>
//                                             <p style={{ marginTop: "2px" }}>/</p>
//                                             <li className="nav-item">
//                                                 <a className="nav-link" href="#">People
//                                             </a>
//                                             </li>
//                                         </ul>

//                                     </div>
//                                 </nav> */}
//                                 <ul class="breadcrumb">
//                                     <li><a href="#">Home</a></li>
//                                     <li>People</li>
//                                 </ul>

//                             </div>
//                             <div className="col-3">
//                                 <input
//                                     type="search"
//                                     name="search"
//                                     value={this.state.search}
//                                     onChange={this.handleChange}
//                                     className="search_input" placeholder="Search" />
//                                 <img src={search} alt="search" className="search_img" />
//                             </div>

//                             <div className="col-4">
//                                 <div className="row float-right">
//                                     <div className="col-12">


//                                         {/* <button className="filter_btn pr-2 ml-2">
//                                             <img src={filter}
//                                                 alt="filter" className="img-fluid" />
//                                     Filter
//                                 </button>&nbsp;
//                                 <img src={sort} alt="sort" className="img-fluid" /> */}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>


//                 </div>
//                 {this.state.activeTab === "People" && <span className="ml-3 people">Invite People</span>}
//                 <div className="row ml-3 ">
//                     {this.state.activeTab === "People" && <form style={{ float: "left", marginTop: "10px" }}>
//                         <div className="row">
//                             <div className="col-5">
//                                 <input className="form-group login ml-2 " type="text" name="username"
//                                     onChange={this.handleChange} placeholder="Name" value={this.state.fields.username} />
//                                 <div className="errorMsg ml-2">{this.state.errors.username}</div>
//                             </div>
//                             <div className="col-5">
//                                 <input className=" ml-2 form-group login " type="text"
//                                     name="emailid" onChange={this.handleChange} value={this.state.fields.emailid} placeholder="Email Id" />
//                                 <div className="errorMsg" >{this.state.errors.emailid}</div>
//                             </div>
//                             <div className="col-2">
//                                 <button className="ml-2  invite" onClick={this.handleSubmit} type="submit" >Invite</button>

//                             </div>
//                         </div>

//                     </form>}
//                     {this.state.activeTab === "People" && <table className="table table-striped mt-5" style={{ width: "100%" }}>
//                         <thead>
//                             <tr>
//                                 <th onClick={() => this.sortByKey("id")}>id  &nbsp;
//                                          <img src={arrows} className="arrow_img image" /></th>

//                                 <th onClick={() => this.sortByKey("name")}>Name&nbsp;
//                                          <img src={arrows} className="arrow_img image" /> </th>
//                                 <th onClick={() => this.sortByKey("email")}>Email &nbsp;
//                                          <img src={arrows} className="arrow_img image" /></th>
//                                 <th onClick={() => this.sortByKey("Date")}>Date</th>
//                                 <th>Active</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {
//                                 filteredData.slice(this.state.pagination.start, this.state.pagination.end).map((user) => {
//                                     return (
//                                         <tr>
//                                             <td>{user.id}</td>
//                                             <td>{user.username}</td>
//                                             <td>{user.email}</td>
//                                             <td>{dateFormat(user.created_time, " dd-mm-yyyy")}</td>
//                                             <td>{user.status}</td>
//                                             <td>
//                                                 <div className="dropdown">
//                                                     <button className="dropbtn">
//                                                         <img src={asset}
//                                                             alt="" className="img-fluid asset_img" /></button>
//                                                     <div className="dropdown-content">
//                                                         <a href="#">
//                                                             <img src={Edit} alt="" onClick={() => this.handleEdit(user.id, user.email)} title="Edit" />
//                                                         </a>
//                                                         <a href="#" >
//                                                             <img src={Delete} onClick={() => this.handleRemove(user.id)} alt="" title="Delete" />
//                                                         </a>
//                                                         {/* <a href="#" data-toggle="modal"
//                                                             data-target="#exampleModal">
//                                                             <img className="imge-fluid" src={reset}
//                                                                 alt="" />
//                                                         </a> */}
//                                                         {/* <button className="bg-danger"
//                                                                     onClick={() => { this.handleRemove(project.id) }}>

//                                                                     <img src={Delete} alt="" title="Delete" />
//                             </button> */}



//                                                     </div>



//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     )
//                                 })
//                             }
//                         </tbody>
//                     </table>}
//                 </div>
//                 <div className="row">
//                     <div className="col-6 ">
//                         <p className="Rectangle-4">Showing 1 to 10 of {this.state.usersData.length} entries</p>
//                     </div>
//                     <div className="col-5 p-0 ">
//                         {/* <div className="pagination float-right mt-4">
//                             <a href="#">&lsaquo;&lsaquo;</a>
//                             <a href="#">&lsaquo;</a>
//                             <a href="#" className="active">1</a>
//                             <a href="#" >2</a>
//                             <a href="#">3</a>
//                             <a href="#">4</a>
//                             <a href="#">5</a>
//                             <a href="#">&rsaquo;</a>
//                             <a href="#">&rsaquo;&rsaquo;</a>
//                         </div> */}
//                         <Pagination
//                             pathName="/people"
//                             showPerPage={this.state.showPerPage}
//                             onPaginationChange={this.onPaginationChange}
//                             total={this.state.usersData.length}
//                         />
//                     </div>
//                 </div>
//                 <CreateModal />

//             </div>


//         )
//     }
// }
// export default People