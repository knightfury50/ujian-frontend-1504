const INITIAL_STATE = {
    id:'',
    password: '',
    email: '',
    cart: []
}

const loginReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'LOG_IN' :
            return {
                ...state,
                id : action.payload.id,
                password: action.payload.password,
                email: action.payload.email,
                cart : action.payload.cart  
            }
        case 'LOG_OUT' :
            return INITIAL_STATE
        default :
            return state
    }
}
export default  loginReducer