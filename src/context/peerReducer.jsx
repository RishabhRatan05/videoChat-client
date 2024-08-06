

export const peerReducer = (state,action)=>{
    console.log("inside peerredu",action)
    if(action.stream){
            return{
                ...state,
                [action.payload.peerId]:{
                    stream: action.payload.stream
                }
            }
    }
    else if(action.peerId && !action.stream){
            const {[action.payload.peerId]: deleted,...rest} = state
            return rest
    }

    else
            return {...state}
}