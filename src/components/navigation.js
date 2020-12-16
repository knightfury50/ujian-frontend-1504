import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {logout} from '../action'
import {Nav,Navbar,Dropdown,NavDropdown,Badge} from 'react-bootstrap'

class Navigation extends React.Component {
    handlelogout = () => {
        this.props.logout()
        localStorage.removeItem('email')
    }
    render() {
        return (
            <Navbar style={{backgroundColor:'#0a3d62', height:'70px'}}>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to='/' style={{color:'white', fontFamily:'Teko, sans-serif', fontSize:'26px', marginRight:'10px'}}><i class="fad fa-home"></i> Home </Nav.Link>
                    </Nav>
                    <Link to='/usercart' style={{fontSize:'30px', marginRight:'10px', marginBottom:'10px', textDecoration:'none'}}> 🛒 <Badge variant="light">{this.props.cart.length}</Badge> </Link>
                    <Dropdown style={{paddingRight:'55px', marginBottom:'2px'}}>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{color:'white',backgroundColor:'#000051'}}>
                            {this.props.email ? this.props.email : 'Not Login'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {this.props.email
                            ?
                            <>
                            <Dropdown.Item as={Link} to='/history'>History</Dropdown.Item>
                            <NavDropdown.Divider />
                            <Dropdown.Item onClick={this.handlelogout}>Logout</Dropdown.Item>
                            </>
                            :
                            <>
                            <Dropdown.Item as={Link} to='/login'>Login</Dropdown.Item>
                            </>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        email: state.login.email,
        cart: state.login.cart,
    }
}
export default connect(mapStateToProps, {logout}) (Navigation)