import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { login } from '../action'

import { Table, Button, Form, Modal, Image } from 'react-bootstrap'

class UserCart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedindex: null,
            newQty: 0,
            confirmation: false,
            cartEmpty: false,
            toHistory: false
        }
    }
    handledelete = (index) => {
        let tempcart = this.props.cart
        tempcart.splice(index, 1)
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: tempcart })
            .then((res) => {
                console.log(res.data)
                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                    .then((res) => {
                        this.props.login(res.data)
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }
    handlesave = (index) => {
        let tempProduct = this.props.cart[index]
        tempProduct.quantity = parseInt(this.state.newQty)
        tempProduct.total = this.state.newQty * this.props.cart[index].price
        let tempCart = this.props.cart
        tempCart.splice(index, 1, tempProduct)
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)
                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                    .then((res) => {
                        this.props.login(res.data)
                        this.setState({ selectedindex: null })
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }
    handleminus = () => {
        if (this.state.newQty <= 0) return

        this.setState({ newQty: this.state.newQty - 1 })
    }
    changeQty = (e) => {
        this.setState({ newQty: e.target.value })
    }
    totalprice = () => {
        let counter = 0
        this.props.cart.map(item => counter += item.total)  
        return counter
    }
    checkout = () => {
        if (this.props.cart.length === 0) return this.setState({ cartEmpty: true })
        this.setState({ confirmation: true })
    }
    confirm = () => {
        let total = this.totalprice()

        let history = {
            username: this.props.username,
            date: new Date().toLocaleString(),
            total: total,
            product: this.props.cart,
            status: 'Belum dibayar'
        }
        console.log(history)
        Axios.post('http://localhost:2000/history', history)
            .then((res) => {
                console.log(res.data)
                Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: [] })
                    .then((res) => {
                        console.log(res.data)
                        Axios.get(`http://localhost:2000/users/${this.props.id}`)
                            .then((res) => {
                                console.log(res.data)
                                this.props.login(res.data)
                                this.setState({ confirmation: false, toHistory: true })
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }
    renderTHead = () => {
        return (
            <thead style={{ backgroundColor: '#2f3640', textAlign: 'center' }}>
                <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
        )
    }
    renderTBody = () => {
        return (
            <tbody>
                {this.props.cart.map((item, index) => {
                    if (this.state.selectedindex === index) {
                        return (
                            <tr>
                                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                <td>{item.name}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <Image style={{ width: 60, height: 60 }} src={item.image} rounded />
                                </td>
                                <td style={{ textAlign: 'right' }}>IDR {item.price.toLocaleString()}</td>
                                <td style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button variant="outline-primary" onClick={this.handleminus}>
                                            ➖
                                        </Button>
                                        <Form.Control style={{ width: '100px' }} onChange={(e) => this.changeQty(e)} value={this.state.newQty} min={0} />
                                        <Button variant="outline-primary" onClick={() => this.setState({ newQty: parseInt(this.state.newQty) + 1 })}>
                                            ➕
                                        </Button>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>IDR {(this.state.newQty * item.price).toLocaleString()}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <Button style={{ marginRight: '10px' }} variant="outline-success" onClick={() => this.handlesave(index)}>✔</Button>
                                    <Button variant="outline-danger" onClick={() => this.setState({ selectedindex: null })}>❌</Button>
                                </td>
                            </tr>
                        )
                    }
                    return (
                        <tr key={index}>
                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                            <td>{item.name}</td>
                            <td style={{ textAlign: 'center' }}>
                                <Image style={{ width: 60, height: 60 }} src={item.image} rounded />
                            </td>
                            <td style={{ textAlign: 'right' }}>IDR {item.price.toLocaleString()}</td>
                            <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'right' }}>IDR {item.total.toLocaleString()}</td>
                            <td style={{ textAlign: 'center' }}>
                                <Button style={{ marginRight: '10px' }} variant="success" onClick={() => this.setState({ selectedindex: index, newQty: item.quantity })}>Edit</Button>
                                <Button variant="danger" onClick={() => this.handledelete(index)}>Delete</Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }
    render() {
        const { confirmation, cartEmpty, toHistory } = this.state
        if (!this.props.id) return <Redirect to='/login' />
        if (toHistory) return <Redirect to='/history' />
        return (
            <div style={{ padding: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1 style={{ color: 'white', fontFamily: 'Acme, sans-serif', fontSize: '42px' }}> Your Cart</h1>
                    <Button style={{ height: '50px' }} onClick={this.checkout} variant="outline-info">Checkout</Button>
                </div>
                <Table striped bordered hover variant="dark" style={{ marginTop: '15px' }}>
                    {this.renderTHead()}
                    {this.renderTBody()}
                </Table>
                <h1 style={{ textAlign: 'right' }}>Total: IDR {this.totalprice().toLocaleString()}</h1>
                <Modal show={confirmation} onHide={() => this.setState({ confirmation: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure ?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ confirmation: false })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.confirm} >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={cartEmpty} onHide={() => this.setState({ cartEmpty: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Make Sure Your Cart Is Not Empty!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ cartEmpty: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

        )
    }
}
const mapStateToProps = (state) => {
    return {
        cart: state.login.cart,
        id: state.login.id,
        pass: state.login.password,
        email: state.login.email
    }
}
export default connect(mapStateToProps, { login })(UserCart)