import React from "react"
import Swal from "sweetalert2"
// import axios from "axios"
import { Link } from "react-router-dom"
import Loginimage from "./Assets/Log in image.jpg"
import nemmadi_logo from "./Assets/nemmadi_logo.png"
import filter from "./Assets/icon Nemmadi/filter_list-24px.svg"
import sort from "./Assets/icon Nemmadi/sort-24px.svg"
// import bell from "./Assets/bell.png"
import search from "./Assets/icon Nemmadi/search.png"
import asset from "./Assets/icon Nemmadi/asset-24px.svg"
import dateFormat from "dateformat";
import Delete from "./Assets/Delete.png"
import Edit from "./Assets/Edit.png"
// import Mark from "./Assets/Mark.png"
// import Duplicate from "./Assets/Duplicate.png"
// import Create_Modal from "./Create_Modal"
import axios from "./Axios"
// import key from "./Assets/key.png"
// import logout from "./Assets/login.png"
// import image15569 from "./Assets/15569.png"
import Navbar from "./Navbar"
import arrows from "./Assets/arrows.jpeg"
// import reset from "./Assets/reset.jpeg"
import Pagination from "./Pagination"
import Delete3 from "./Assets/Delete3.jpeg"
import edit3 from "./Assets/edit3.jpeg"
import Delete5 from "./Assets/Delete5.jpeg"

import CreateModal from "../components/Create_Modal";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
class People extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activeTab: "People",
            username: '',
            email: "",
            usersData: [],
            search: "",
            ascending: false,
            fields: {},
            errors: {},
            email: '',
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            showPerPage: 5,
            pagination: {
                start: "",
                end: ""
            },

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

    }
    handleSubmit = (e) => {
        e.preventDefault()

        const formData = {
            // fields: this.state.fields
            username: this.state.username,
            email: this.state.email
        }
        // if (this.validateForm()) {
        //     let fields = {};
        //     fields["username"] = "";
        //     fields["emailid"] = "";
        //     this.setState({ fields: fields });
        //     alert("Form submitted");
        //     console.log(formData)
        if (this.state.username !== "" && this.state.email !== "") {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (re.test(this.state.email)) {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${localStorage.getItem("authToken")}`);
                // myHeaders.append("Cookie", "__cfduid=d3836be0a2e132b22fc9584ac19f5d8441605698523");

                var formdata = new FormData();
                formdata.append("username", this.state.username);
                // above floor id needs to be made dynamic
                formdata.append("email", this.state.email);

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow'
                };

                fetch("https://nbk.synctactic.ai/user/", requestOptions)
                    .then(response => response.text())
                    .then(result =>
                        console.log("Empty Success:", result),
                        // document.getElementById("custom-file-inputs").remove(),
                        // alert('Saved Successfully. Ready to Publish'),
                        toast('Sent Request Successfully'),
                        window.location.reload()
                        // window.location.href="/listingProjects"
                    )
                    .catch(error => console.log('error', error));
            }
            else {
                toast.error('Invalid Email ID');
            }

        }
        else {
            toast.error('Email and Username both required');
        }

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
        // const confirmRemove = window.confirm('Are You sure?')
        Swal.fire({
            title: "Delete",
            text: "Are You sure?",
            icon:"question",
            // type:"info",
            showCancelButton: true
        }).then((confirmed) => {
            console.log("confirmed",confirmed);
            if(confirmed.isConfirmed){
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
                            // toast.error('Your are successfully deleted record');
                            this.loadUsers()
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        });
        // if (confirmRemove) {
        //     axios.delete(`user/${id}`, {
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        //         }
        //     })
        //         .then(response => {
        //             if (response.status == 204) {
        //                 Swal.fire({
        //                     position: 'top-end',
        //                     icon: 'success',
        //                     title: 'Your are successfully deleted record',
        //                     timer: 1500
        //                 })
        //                 toast.error('Your are successfully deleted record');
        //                 this.loadUsers()
        //             }
        //         })
        //         .catch(error => {
        //             console.log(error)
        //         })
        // }
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
    onPaginationChange = (start, end) => {
        let pagination = this.state.pagination;
        pagination.start = start;
        pagination.end = end;
        this.setState({ pagination });
    };


    render() {
        console.log("users", this.state.usersData)
        let filteredData = this.state.usersData.filter(project =>
            project.username && project.username.toLowerCase().includes(this.state.search.toLowerCase()) ||
            project.email && project.email.toLowerCase().includes(this.state.search.toLowerCase())
        )

        console.log("errors==>", this.state.errors)
        return (
            <div>
                <style>
                    {
                        `
                        .pagination{
                            display:flex!important
                        }
                        ul.pagination li {
                            padding: 5px;
                            list-style: none;
                        }
                        `
                    }
                </style>
                <Navbar />
                <div></div>
                <div className="activated-bg">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-4 pl-3 pr-0">

                                <ul className="breadcrumb">
                                    <li><Link to="/listingProjects">Home</Link></li>
                                    <li>People</li>
                                </ul>

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
                                <img src={sort} alt="sort" className="img-fluid" /> */}
                                    </div>
                                </div>
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
                                    onChange={this.handleChange} placeholder="Name"
                                //  value={this.state.fields.username}
                                />
                                {/* <div className="errorMsg ml-2">{this.state.errors.username}</div> */}
                            </div>
                            <div className="col-5">
                                <input className=" ml-2 form-group login " type="email"
                                    name="email" onChange={this.handleChange}
                                    //  value={this.state.fields.emailid}
                                    placeholder="Email Id" />
                                {/* <div className="errorMsg" >{this.state.errors.emailid}</div> */}
                            </div>
                            <div className="col-2">
                                <button className="ml-2  invite" onClick={this.handleSubmit} type="submit" >Invite</button>

                            </div>
                        </div>

                    </form>}
                    {this.state.activeTab === "People" && <table className="table table-striped mt-5" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th onClick={() => this.sortByKey("id")}>Id  &nbsp;
                                         <img src={arrows} className="arrow_img image" /></th>

                                <th onClick={() => this.sortByKey("name")}>Name&nbsp;
                                         <img src={arrows} className="arrow_img image" /> </th>
                                <th onClick={() => this.sortByKey("email")}>Email &nbsp;
                                         <img src={arrows} className="arrow_img image" /></th>
                                {/* <th onClick={() => this.sortByKey("Date")}>Date</th> */}
                                <th>Active</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredData.slice(this.state.pagination.start, this.state.pagination.end).map((user,i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            {/* <td>{dateFormat(user.crea_time, " dd-mm-yyyy")}</td> */}
                                            <td>{user.status}</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="dropbtn">
                                                        <img src={asset}
                                                            alt="" className="img-fluid asset_img" /></button>
                                                    <div className="dropdown-content">
                                                        {/* <a href="#">
                                                            <img src={Edit} alt="" onClick={() => this.handleEdit(user.id, user.email)} title="Edit" />
                                                        </a> */}
                                                        <a href="#" >
                                                            <img src={Delete5} onClick={() => this.handleRemove(user.id)} alt="" title="Delete" />
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
                <div className="row">
                    <div className="col-6 ">
                        <p className="Rectangle-4">Showing 1 to 10 of {this.state.usersData.length} entries</p>
                    </div>
                    <div className="col-5 p-0 ">

                        <Pagination
                            pathName="/people"
                            showPerPage={this.state.showPerPage}
                            onPaginationChange={this.onPaginationChange}
                            total={this.state.usersData.length}
                        />
                    </div>
                </div>
                <CreateModal />

            </div>


        )
    }
}
export default People