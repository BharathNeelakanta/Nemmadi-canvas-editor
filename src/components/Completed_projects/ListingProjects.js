import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom"
import dateFormat from "dateformat";
import Swal from "sweetalert2"
import "./completed_projects.css"
import filter from "../Assets/icon Nemmadi/filter_list-24px.svg"
import sort from "../Assets/icon Nemmadi/sort-24px.svg"
import searchIcon from "../Assets/icon Nemmadi/search.png"
import asset from "../Assets/icon Nemmadi/asset-24px.svg"
import Delete from "../Assets/Delete.png"
import Delete11 from "../Assets/Delete11.png"

import Edit from "../Assets/Edit.png"
import Mark from "../Assets/Mark.png"
import Duplicate from "../Assets/Duplicate.png"
import CreateModal from "./CreateModal";
import Navbar from "../Navbar"
import arrows from "../Assets/arrows.jpeg"
// import axios from "../Axios"
import Pagination from "../Pagination"
import Filter from "../Filter/Filter";
import Createproject from "../CreateProject"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
let headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
}
class ListingProjects extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            projectData: [],
            completedProjectsData: [],
            projectTypes: [],
            filteredProjectsData: [],
            ascending: false,
            search: "",
            activeTab: "active",
            projectId: "",
            currentIndex: "",
            type: "",
            searchkeyword: "",
            showPerPage: 10,
            pagination: {
                start: "",
                end: ""
            },
            isFilter: false,
            filterSearch: "",
            filterBuilder: "",
            projectType: null
        }
    }


    handleActiveTab = (activeData) => {
        this.setState({
            activeTab: activeData
        })
    }

    handleFilter = (filterValue = null) => {
        this.setState({ isFilter: filterValue, filterSearch: "", filterBuilder: "" })
    }

    handleToggleFilter = () => {
        this.setState({ isFilter: !this.state.isFilter })
    }

    handleEdit = (id, index, type) => {
        this.setState({ projectId: id, currentIndex: index, type: type })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
            // searchkeyword: e.target.value
        })
    }

    handleFilterChange = (e) => {
        this.setState({ filterSearch: e.target.value })
    }

    handleFilterBuilderChange = (e) => {
        console.log("filter builder==>", e);
        this.setState({ filterBuilder: e.target.value })
    }

    handleProjectTypeChange = (e) => {
        console.log("handleProjectTypeChange==>", e);
        const projectData = this.state.projectData;
        // if(e.target.checked){
        //     this.setState({ projectType : e.target.checked })
        // }
        if (e.target.checked) {
            const newState = projectData.filter(project => project.properties.length > 0 && project.properties[0].type === parseInt(e.target.name));
            this.setState({ filteredProjectsData: newState });
        } else {
            this.setState({ filteredProjectsData: projectData })
        }
        // this.setState({ projectType : e.target.checked })
    }


    handleClick = (e) => {
        this.props.history.push('/createProject')

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
        if (this.state.ascending) {
            let projectDataCopy = this.state.projectData;
            projectDataCopy.sort(this.compareBy(key));
            this.setState({ projectData: projectDataCopy })
        } else {
            let projectDataCopy = this.state.projectData;
            projectDataCopy.sort(this.compareBy(key));
            this.setState({ projectData: projectDataCopy.reverse() })

        }
    };


    componentDidMount() {
        this.loadProjects();

    }

    loadProjects = async () => {
        const activeProjects = await axios.get(`https://nbk.synctactic.ai/project/?status=ACTIVE`, { headers })
        const completedProjects = await axios.get("https://nbk.synctactic.ai/property/?status=CMP", { headers })
        const projectTypes = await axios.get("https://nbk.synctactic.ai/project/types/", { headers })

        axios.all([activeProjects, completedProjects, projectTypes]).then(axios.spread((...responses) => {
            const activeProjects = responses[0].data.results
            const completedProjects = responses[1].data.results
            const projectTypes = responses[2].data.results
            this.setState({
                projectData: activeProjects,
                filteredProjectsData: activeProjects,
                completedProjectsData: completedProjects,
                projectTypes: projectTypes
            })
        }))


            .catch(errors => {
                console.log("errors==>", errors);
            })

    }
    handleRemove = (id) => {
        const confirmRemove = window.confirm('Are You sure?')
        if (confirmRemove) {
            axios.delete(`https://nbk.synctactic.ai/project/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            })
                .then(response => {
                    console.log(response.status)
                    if (response.status = 204) {
                        // Swal.fire({
                        //     position: 'top-end',
                        //     icon: 'success',
                        //     title: 'Your are successfully deleted record',
                        //     timer: 1500
                        // })
                        toast('Deleted')
                        this.loadProjects()
                    }
                })

                .catch(error => {
                    console.log(error)
                })
        }
    }
    // const[showPerPage, setShowPerPage] = useState(10);
    // const[pagination, setPagination] = useState({
    //     start: 0,
    //     end: showPerPage,
    // });

    onPaginationChange = (start, end) => {
        let pagination = this.state.pagination;
        pagination.start = start;
        pagination.end = end;
        this.setState({ pagination });
    };



    render() {
        let allProjectData;
        const { projectData, completedProjectsData, search, filterSearch, filterBuilder, pagination, projectType, activeTab, projectTypes, filteredProjectsData } = this.state;
        let filterProjectTypes = projectData && projectData.filter(project => project.properties && project.properties.length > 0 && project.properties[0].type === 1);
        console.log("filterProjectTypes==>", filterProjectTypes);
        console.log("type of projectType and Number(projectType===>", typeof projectType, typeof Number(projectType), projectType);
        console.log("@projectsdata==>", projectData);
        console.log("@completedprojects==>", completedProjectsData);
        let filteredData;



        filteredData = filteredProjectsData.filter((project, i) =>
            // project.properties && project.properties.length >0 && project.properties.type == Number(projectType) ||
            project.name && project.name.toLowerCase().includes(search.toLowerCase() || filterBuilder.toLowerCase() || filterSearch.toLowerCase()) ||
            project.location && project.location.toLowerCase().includes(search.toLowerCase() || filterBuilder.toLowerCase() || filterSearch.toLowerCase()) ||
            project.builder && project.builder.toLowerCase().includes(search.toLowerCase() || filterBuilder.toLowerCase() || filterSearch.toLowerCase())
        )

        let activeProjectsDataOnly = filteredData.slice(pagination.start, pagination.end).map((project, index) => {
            console.log("project", project)

            // allProjectData = project.properties.map((property, index) => {
            return (
                <tr key={project.id}>
                    <td>{project.id}</td>
                    <td><Link to={`listingFloor/${project.name}/${project.id} `}>{project.name} </Link></td>
                    <td>{project.location}</td>
                    <td>{project.builder}</td>
                    <td>{project.properties && project.properties[0] && project.properties[0].type ? project.properties[0].type : "---"}</td>
                    <td>{project.properties && project.properties[0] && project.properties[0].property_owner ? project.properties[0].property_owner : "---"}</td>
                    <td>{project.properties && project.properties[0] && project.properties[0].doorno ? project.properties[0].doorno : "---"}</td>
                    <td>{project.properties && project.properties[0] && project.properties[0].name ? project.properties[0].name : "---"}</td>
                    <td>{project.properties && project.properties[0] && project.properties[0].assigned ? project.properties[0].type : "---"}</td>
                    <td>{project.properties && project.properties[0] && project.properties[0].status ? project.properties[0].status : "---"}</td>
                    <td>{dateFormat(project.created_time, " dd-mm-yyyy")}</td>
                    <td>
                        <div className="dropdown">
                            <button className="dropbtn">
                                <img src={asset}
                                    alt="" className="img-fluid asset_img" /></button>
                            <div className="dropdown-content">
                                <a href="#">
                                    <img src={Duplicate} alt="" title="Duplicate" data-toggle="modal"
                                        data-target="#myModal"
                                        onClick={() => this.handleEdit(project.id, index, "copy")} />
                                </a>
                                <a href="#">
                                    <img src={Mark} alt="" title="Mark" data-toggle="modal"
                                        data-target="#myModal" onClick={() => this.handleEdit(project.id, index, "completed")} />
                                </a>
                                <a href="#">
                                    <img src={Edit} alt="" title="Edit" data-toggle="modal"
                                        data-target="#myModal"
                                        onClick={() => this.handleEdit(project.id, index, "edit")} />
                                </a>
                                <a href="#">
                                    <img className="image1" src={Delete11} alt="" title="Delete" onClick={() => this.handleRemove(project.id)} />
                                </a>
                            </div>
                        </div>
                    </td>
                </tr >
            )
            // })
        })
        console.log("activeProjectData", activeProjectsDataOnly)

        let completedFilteredProjects = completedProjectsData.filter(project =>
            project.name && project.name.toLowerCase().includes(search.toLowerCase() || filterBuilder.toLowerCase()) ||
            project.location && project.location.toLowerCase().includes(search.toLowerCase() || filterBuilder.toLowerCase()) ||
            project.builder && project.builder.toLowerCase().includes(search.toLowerCase() || filterBuilder.toLowerCase())
        )
        let allCompletedProjects = completedFilteredProjects.slice(pagination.start, pagination.end).map((project, index) => {
            return (
                <tr key={project.id}>
                    <td>{project.id}</td>
                    <td><Link to={`/listingFloor/${project.name}/${project.id} `}>{project.name} </Link></td>
                    <td>{project.location}</td>
                    <td>{project.builder}</td>
                    <td>{project.properties && project.properties[0] && project.properties[0].type ? project.properties[0].type : "---"}</td>
                    <td>{project.properties && project.properties[0] && project.properties[0].property_owner ? project.properties[0].property_owner : "---"}</td>
                    <td>{project.properties && project.properties[0] && project.properties[0].doorno ? project.properties[0].doorno : "---"}</td>
                    <td>{project.properties && project.properties[0] && project.properties[0].name ? project.properties[0].name : "---"}</td>
                    <td>{project.properties && project.properties[0] && project.properties[0].assigned ? project.properties[0].type : "---"}</td>

                    <td>{dateFormat(project.created_time, " dd-mm-yyyy")}</td>
                    <td>
                        <div className="dropdown">
                            <button className="dropbtn">
                                <img src={asset}
                                    alt="" className="img-fluid asset_img" /></button>
                            <div className="dropdown-content">
                                <a href="#">
                                    <img src={Duplicate} alt="" title="Duplicate" data-toggle="modal"
                                        data-target="#myModal" onClick={() => this.handleEdit(project.id, index, "copy")} />
                                </a>
                                <a href="#">
                                    <img src={Mark} alt="" title="Mark" data-toggle="modal" data-target="#myModal" onClick={() => this.handleEdit(project.id, index, "completed")} />
                                </a>
                                <a href="#">
                                    <img src={Edit} alt="" title="Edit" data-toggle="modal" data-target="#myModal"
                                        onClick={() => this.handleEdit(project.id, index, "edit")} />
                                </a>
                                <a href="#">
                                    <img src={Delete11} alt="" title="Delete" onClick={() => this.handleRemove(project.id)} />
                                </a>
                            </div>
                        </div>
                    </td>
                </tr>
            )
        })

        return (
            <div>
                <Navbar />
                {/* <Filter  /> */}

                { this.state.isFilter && <Filter
                    handleFilter={this.handleFilter}
                    handleBuilder={this.handleFilterBuilderChange}
                    handleProject={this.handleProjectTypeChange}
                    projectType={projectType}
                    projectTypes={projectTypes}
                    search={filterSearch}
                    filterBuilder={filterBuilder}
                    data={activeTab === "active" ? projectData : completedProjectsData}
                    handleFilterChange={this.handleFilterChange} />}
                <section className="activated-bg">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-4 pl-3 pr-0">
                                <a href="#" className={this.state.activeTab === "active" ? "pl-3 active" : "pl-3"} onClick={() => this.handleActiveTab("active")}>Active Projects</a>
                                <a href="#" className={this.state.activeTab === "completed" ? "ml-3 active" : "ml-3"} onClick={() => this.handleActiveTab("completed")}>Completed Projects</a>
                            </div>
                            <div className="col-3">
                                <input
                                    type="search"
                                    name="search"
                                    value={this.state.search}
                                    onChange={this.handleChange}
                                    className="search_input" placeholder="Search" />
                                <img src={searchIcon} alt="search" className="search_img" />
                            </div>
                            <div className="offset-1 col-4">
                                <div className="row float-right">
                                    <button className="filter_btn pr-2" onClick={this.handleToggleFilter}>
                                        <img src={filter}
                                            alt="filter" className="img-fluid" />
                                        Filter
                                    </button>
                                </div>

                            </div>
                        </div>
                        <div className="row mt-3">
                            <table className="table table-striped" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th onClick={() => this.sortByKey("id")}>Id &nbsp;
                                            <img src={arrows} alt="sort"
                                                className="arrow_img image" /></th>
                                        <th onClick={() => this.sortByKey("name")}>Project Name &nbsp;
                                            <img src={arrows} className="arrow_img image" /></th>
                                        <th onClick={() => this.sortByKey("location")}>Location
                                        &nbsp;
                                            <img src={arrows} className="arrow_img image" /></th>
                                        <th onClick={() => this.sortByKey("builder")}>Builder
                                        &nbsp;
                                            <img src={arrows} className="arrow_img image" /></th>

                                        <th onClick={() => this.sortByKey("type")}>ProjectType
                                        &nbsp;
                                            <img src={arrows} className="arrow_img image" /></th>
                                        <th onClick={() => this.sortByKey("owner")}>Owner &nbsp;
                                            <img src={arrows} className="arrow_img image" /></th>

                                        <th onClick={() => this.sortByKey("door")}>Door No &nbsp;
                                            <img src={arrows} className="arrow_img image" /></th>

                                        <th onClick={() => this.sortByKey("floor")}>Floor Name  &nbsp;
                                            <img src={arrows} className="arrow_img image" /></th>

                                        <th onClick={() => this.sortByKey("assigned")}>Assigned_to&nbsp;
                                            <img src={arrows} className="arrow_img image" /></th>
                                        <th onClick={() => this.sortByKey("status")}>Status&nbsp;
                                            <img src={arrows} className="arrow_img image" /></th>
                                        <th onClick={() => this.sortByKey("date")}>Date</th>
                                        <th>Action  </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.activeTab === "active" ? activeProjectsDataOnly : allCompletedProjects}
                                    {/* {
                                        allProjectData
                                    } */}
                                </tbody>
                            </table>
                        </div>
                        <CreateModal
                            type={this.state.type}
                            projectId={this.state.projectId}
                            currentIndex={this.state.currentIndex}
                            projectData={this.state.projectData} />
                        <div className="row">
                            <div className="col-6">
                                <p className="Rectangle-4">Showing 1 to 10 of {this.state.projectData.length} entries</p>
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
                                        pathName="/listingProjects"
                                        showPerPage={this.state.showPerPage}
                                        onPaginationChange={this.onPaginationChange}
                                        total={this.state.projectData.length}
                                    />
                                </div></div>
                        </div>
                    </div>
                </section >
                <Createproject
                    type={this.state.type}
                    projectId={this.state.projectId}
                    currentIndex={this.state.currentIndex}
                    projectData={this.state.projectData} />

            </div >
        )
    }
}
export default ListingProjects