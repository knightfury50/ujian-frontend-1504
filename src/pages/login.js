import Axios from 'axios'
import React from 'react'
import { connect } from 'react-redux'

import { login } from '../action'

import { Form, Button, InputGroup, Modal } from 'react-bootstrap'

import { Redirect } from 'react-router-dom'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            emailValidErr: [false, ""],
            passValidErr: [false, ""],
            loginError: [false, '']
        }
    }
    emailValid = (e) => {
        let email = e.target.value
        let regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email)) return this.setState({ emailValidErr: [true, "Email not valid !"] })
        this.setState({ emailValidErr: [false, ""] })
    }
    passValid = (e) => {
        let pass = e.target.value
        let numb = /[0-9]/
        if (!numb.test(pass) || pass.length < 6) return this.setState({ passValidErr: [true, "Must include number and min 6 char !"] })
        this.setState({ passValidErr: [false, ""] })
    }
    handlelogin = () => {
        const {passValidErr,emailValidErr} = this.state
        let email = this.refs.email.value
        let password = this.refs.password.value
        if (!email || !password) return this.setState({ loginError: [true, 'Please input all form !'] })
        if (passValidErr[0] || emailValidErr[0]) return this.setState({loginError:[true,'There is an error in your form !']})

        Axios.get(`http://localhost:2000/users?email=${email}&password=${password}`)
            .then((res) => {
                if (res.data.length === 0) return this.setState({ loginError: [true, "Wrong username or password !"] })
                this.props.login(res.data[0])
                localStorage.email = email
            }).then((res) => {
                Axios.get(`http://localhost:2000/login?email=${email}`)
            .then((res) => {
                console.log(res.data)
                if(res.data.length !== 0) return this.setState({loginError:[true,'Sorry, email already used !']})
                Axios.post('http://localhost:2000/login', {
                    email: email,
                    password: password,
                    cart: []
                })
                .then((res) => {
                    console.log(res.data)
                    this.setState ({loginError:[false,'']})
                })
                .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }
    render() {
        const { emailValidErr, passValidErr, loginError } = this.state
        if (this.props.email) return <Redirect to='/' />
        return (
            <div style={{ margin: '100px auto', width: '500px', padding: '60px', backgroundColor: '#747d8c' }}>
                <div>
                    <h1 style={{ color: 'white', marginBottom: '20px', fontFamily: 'Bree Serif, serif' }}>Login</h1>
                </div>
                <div>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">
                                <i className="fas fa-mail-bulk"></i>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control ref='email' type="email" placeholder="enter your email" onChange={(e) => this.emailValid(e)} />
                    </InputGroup>
                    <Form.Text className="mb-3" style={{ color: 'red' }}>
                        {emailValidErr[1]}
                    </Form.Text>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">
                                <i className="fas fa-key"></i>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control ref='password' type="password" placeholder="enter your password" onChange={(e) => this.passValid(e)} />
                    </InputGroup>
                    <Form.Text className="mb-3" style={{ color: 'red' }}>
                        {passValidErr[1]}
                    </Form.Text>
                </div>
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Button variant="light" onClick={this.handlelogin}
                        style={{ width: '80px', fontSize: '18px', fontFamily: 'Lobster, cursive', color: 'white', backgroundColor: '#3742fa' }}>Login</Button>
                </div>
                <Modal style={{ color: 'red' }} show={loginError[0]} onHide={() => this.setState({ loginError: [false, ''] })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cant Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{loginError[1]}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-danger" onClick={() => this.setState({ loginError: [false, ''] })}>
                            Back
                         </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        email: state.login.email
    }
}
export default connect(mapStateToProps, { login })(Login)