import React from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { Button, Modal, Accordion, Card } from 'react-bootstrap'

class Addtocart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            total: 0,
            tologin: [false, ''],
            notcomplete: [false, ''],
            tocart: false
        }
    }
    componentDidMount() {
        Axios.get(`http://localhost:2000/products/${this.props.location.search}`)
            .then((res) => {
                console.log(res.data[0])
                this.setState({ data: res.data[0] })
            })
            .catch((err) => console.log(err))
    }
    handlecart = () => {
        const { data, total } = this.state
        if (!this.props.id) return this.setState({ tologin: [true, 'must login'], notcomplete: false })
        if (total === 0) return this.setState({ notcomplete: [true, 'Please input quantity !'], next: false })
        let datacart = {
            name: data.name,
            image: data.img,
            quantity: total,
            price: data.price,
            total: total * data.price
        }
        let tempcart = this.props.cart
        tempcart.push(datacart)
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
            cart: tempcart
        })
            .then((res) => {
                console.log(res.data)
                this.setState({ tocart: true })
            })
            .catch((err) => console.log(err))
    }
    render() {
        const { data, total, tologin, notcomplete } = this.state
        if (this.state.tocart) return <Redirect to="/usercart" />
        if (tologin)
            return (
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '50px' }}>
                    <h2>{data.name}</h2>
                    <Accordion>
                        <Card style={{ width: '430px' }}>
                            <Card.Header>
                                <Accordion.Toggle eventKey="1">Input Quantity</Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <div>
                                        <h1>Stock = {data.stock} </h1>
                                        <Button variant="outline-primary" disabled={total >= data.stock ? true : false}
                                            onClick={() => this.setState({ total: total + 1 })}> 🔺 </Button>
                                        <h1>{total}</h1>
                                        <Button variant="outline-primary" disabled={total <= 0 ? true : false}
                                            onClick={() => this.setState({ total: total - 1 })}> 🔻 </Button>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                    <div>
                        <Button variant="danger" as={Link} to={'/'}>
                            Back
                        </Button>
                        <Button variant="info" onClick={this.handlecart}>
                            Add to cart
                        </Button>
                    </div>
                    <Modal
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        show={tologin[0]} onClose={() => this.setState({ tologin: [false, ''] })}>
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter" style={{ color: 'green' }}>
                                {tologin[1]}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ textAlign: 'right' }}>
                                <Button as={Link} to='/login' variant="outline-success" onClick={() => this.setState({ tologin: [false, ''] })}>
                                    Go to login page
                                </Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                    <Modal
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        show={notcomplete[0]} onClose={() => this.setState({ notcomplete: [false, ''] })}>
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter" style={{ color: 'red' }}>
                                {notcomplete[1]}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ textAlign: 'right' }}>
                                <Button variant="outline-danger" onClick={() => this.setState({ notcomplete: [false, ''], next: true })}>
                                    Back
                                </Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                    {/* <Toast show={showA} onClose={toggleShowA}>
                        <Toast.Header>
                            <strong className="mr-auto">success add to cart</strong>
                        </Toast.Header>
                    </Toast> */}
                </div>
            )
    }
}
const mapStateToProps = (state) => {
    return {
        id: state.login.id,
        cart: state.login.cart
    }
}
export default connect(mapStateToProps)(Addtocart)