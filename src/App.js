import React from 'react'
import Axios from 'axios'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { login, getHistory } from './action'

import Navigation from './components/navigation'
import Home from './pages/home'
import Login from './pages/login'
import Addtocart from './pages/addtocart'
import UserCart from './pages/usercart'
import History from './pages/history'

class App extends React.Component {
  componentDidMount() {
    Axios.get(`http://localhost:2000/users?email=${localStorage.email}`)
      .then((res) => this.props.login(res.data[0]))
      .catch((err) => console.log(err))
  }
  render() {
    return (
      <div>
        <Navigation />
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/login' component={Login} />
          <Route path='/addtocart' component={Addtocart} />
          <Route path='/usercart' component={UserCart} />
          <Route path='/history' component={History} />
        </Switch>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    email: state.login.email
  }
}
export default connect(mapStateToProps, { login, getHistory })(App) 
