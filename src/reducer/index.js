import {combineReducers} from 'redux'
import loginReducer from './loginreducer'
import {historyReducer} from './historyreducer'

let allReducers = combineReducers({
    login: loginReducer,
    history: historyReducer
})
export default allReducers