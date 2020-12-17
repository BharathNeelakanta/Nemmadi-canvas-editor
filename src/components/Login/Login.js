import React from "react"
// import axios from "axios"
import Swal from 'sweetalert2'
import "./Login.css"
import Loginimage from "../Assets/Log in image.jpg"
import nemmadi_logo from "../Assets/nemmadi_logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import Toast from 'react-bootstrap/Toast'
// import ToastBody from 'react-bootstrap/ToastBody'
import axios from "../Axios"
import {toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure() 
class Login extends React.Component {
    constructor() {
        super()
        this.passwordOneRef = React.createRef()
        this.IconRevealPassword = React.createRef()
        this.state = {
            username: '',
            password: '',
            isRevealPassword: false,
            validationFields: {
                username: '',
                password: '',
            },
            errors: {}
        }

        this.validateForm = this.validateForm.bind(this);

    }
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


    togglePassword = event => {
        this.setState({ isRevealPassword: !this.state.isRevealPassword })
    }


    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()

        const formData = {
            username: this.state.username,
            password: this.state.password,
        }
        if (!this.validateForm()) {
            return false;
        } else {

            axios.post('auth/', formData, {
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${localStorage.setItem("authToken")}`
                }
            })
                .then(response => {
                    // if (response.data == 200) {
                        console.log(response.data)
                        localStorage.setItem('authToken', response.data.access)
                        // Swal.fire({
                        //     position: 'top-end',
                        //     icon: 'success',
                        //     title: 'Your are successfully registerd',
                        //     timer: 1500
                        // })
                        toast('Logged in Successfully') 
                        window.location.href="/listingProjects";

                    // }
                    this.props.history.push('/listingProjects')

                })
                .catch(error => {
                    toast('Logged in Successfully') 
                    console.log(error)
                })
        }
    }
    render() {
        console.log("errors==>", this.state.errors)

        const { isRevealPassword, password } = this.state
        return (
            <section className="login-section">
                <div className="row">
                    <div className="col-md-4">
                        <div className="logo">
                            <img src={nemmadi_logo} className="logo" alt="" />  <h3 className="title">Nemmadi</h3>
                        </div>
                        <h4>Sign in</h4>
                        <form className="login-form" action="{% url 'loststuffapp:IndexView' %}" method="get" >
                            <div className={this.state.errors.username ? "form-group invalid" : "form-group"}>
                                <input type="text" id="username"
                                    name="username" onChange={this.handleChange} className="form-control" required />
                                <label htmlFor="username">User Name</label>
                                {this.state.errors.username && <p style={{ color: "red" }}>The User Name field is required</p>}
                            </div>
                            <div className={this.state.errors.password ? "form-group invalid" : "form-group"}>
                                <input className="form-control"
                                    name="password"
                                    id="password"
                                    onChange={this.handleChange}
                                    required
                                    type={isRevealPassword ? "text" : "password"}
                                    ref={this.passwordOneRef}
                                />
                                <label htmlFor="password">Password</label>
                                <span onClick={this.togglePassword} ref={this.IconRevealPassword}>
                                    <span>
                                        {isRevealPassword ?
                                            <FontAwesomeIcon id="togglePassword"
                                                icon={faEye} className="customIcon"></FontAwesomeIcon> :

                                            <FontAwesomeIcon id="togglePassword"
                                                icon={faEyeSlash} className="customIcon"></FontAwesomeIcon>}
                                    </span>
                                </span>
                                {this.state.errors.password && <p style={{ color: "red" }}>The Password field is required</p>}
                            </div>
                            <button className="btn btn-primary login-btn"
                                onClick={this.handleSubmit} type="submit">Login</button>
                            <button className="btn btn-danger login-btn mt-2" onClick={this.handleError} type="button">Cancel</button>
                        </form>
                    </div>
                    <div className="col-md-8">
                        <img className="main-img" src={Loginimage} alt="" />
                    </div>
                </div >
            </section >

        )
    }
}
export default Login