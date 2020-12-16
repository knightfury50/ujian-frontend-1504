import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'

import { Redirect } from 'react-router-dom'

import { getHistory } from '../action'

import { Table, Accordion, Card, Image, Button } from 'react-bootstrap'

class History extends React.Component {
    componentDidMount() {
        Axios.get(`http://localhost:2000/history?email=${this.props.email}`)
            .then((res) => {
                console.log(res.data)
                this.props.getHistory(res.data)
            })
            .catch((err) => console.log(err))
    }
    handlecancel = (index) => {
        let temphistory = this.props.history
        temphistory.splice(index, 1)
        Axios.patch(`http://localhost:2000/history/${this.props.id}`, { history: temphistory })
            .then((res) => {
                console.log(res.data)
                Axios.get(`http://localhost:2000/history/${this.props.id}`)
                    .then((res) => {
                        this.props.login(res.data)
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }
    rendertable = () => {
        return (
            <Accordion>
                {this.props.history.map((item, index) => {
                    return (
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey={index + 1}>
                                Date: {item.date}, Total Purchasing: IDR {item.total.toLocaleString()} - Status: {item.status}
                                
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={index + 1}>
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Name</th>
                                            <th>Image</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.product.map((item2, index2) => {
                                            return (
                                                <tr>
                                                    <td>{index2 + 1}</td>
                                                    <td>{item2.name}</td>
                                                    <td>
                                                        <Image src={item2.image} style={{ height: 60, width: 60 }} rounded />
                                                    </td>
                                                    <td>IDR {item2.price.toLocaleString()}</td>
                                                    <td>{item2.quantity}</td>
                                                    <td>IDR {item2.total.toLocaleString()}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                    <Button variant="danger" onClick={() => this.handlecancel(index)}>Cancel Transaction</Button>
                                </Table>
                            </Accordion.Collapse>
                        </Card>
                    )
                })}
            </Accordion>
        )
    }
    render() {
        if (!this.props.email) return <Redirect to='/login' />
        return (
            <div>
                <p style={{marginLeft:'20px'}}> YOUR HISTORY </p>
                {this.rendertable()}
            </div>

        )
    }
}
const mapStateToProps = (state) => {
    return {
        history: state.history,
        email: state.login.email,
        id: state.login.id,
    }
}
export default connect(mapStateToProps, { getHistory })(History)