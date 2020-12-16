import React from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'

import { Card, Button, Modal } from 'react-bootstrap'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        Axios.get('http://localhost:2000/products')
            .then((res) => {
                console.log(res.data)
                this.setState({ data: res.data })
            })
            .catch((err) => console.log(err))
    }
    render() {
        return (
            <div style={{ padding: '0 50px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {this.state.data.map((item, index) => {
                    return (
                        <div>
                            <Card key={index} style={{ width: '20rem', margin: '20px auto' }}>
                                <Card.Img variant="top" src={item.img} />
                                <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <Card.Title style={{ color: 'black' }}><b>{item.name}</b></Card.Title>
                                        <Card.Title>Price: IDR {item.price.toLocaleString()}</Card.Title>
                                        <Card.Text>Stock: {item.stock}</Card.Text>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Button variant="outline-danger" style={{ marginRight: '10px' }}>❤</Button>
                                        <Button variant="outline-info" as={Link} to={`/addtocart?id=${item.id}`}>▶</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    )
                })}
            </div>
        )
    }
}
export default Home