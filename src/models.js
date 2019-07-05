export const count ={
    state: {
        userName: "test",
        passWord: "test",
        chosenCustomer:"test",
        chosenBaobiao:"test",
        danHao:"test",
        product:"test",
    },
    reducers:{
        increment(state,userName,passWord){
            state.userName = userName
            state.passWord = passWord
            state.chosenCustomer = userName
            return{
            ...state} 
        },
        setCustomer(state,customer){
            state.chosenCustomer = customer
            return{
            ...state} 
        },
        setBaobiao(state,type){
            state.chosenBaobiao = type
            return{
                ...state
            }
        },
        setDanhao(state,type){
            state.danHao = type
            return{
                ...state
            }
        },
        setProduct(state,type){
            state.product = type
            return{
                ...state
            }
        }
    },
    effects:(dispatch) => ({
        async incrementAsync(payload,rootState){
            await new Promise(resolve => setTimeout(resolve,1000))
            dispatch.count.increment(payload)
        },
        async setCustomerAsync(payload,rootState){
            await new Promise(resolve => setTimeout(resolve,1000))
            dispatch.count.setCustomer(payload)
        },
        async setBaobiaoAsync(payload,rootState){
            await new Promise(resolve => setTimeout(resolve,1000))
            dispatch.count.setBaobiao(payload)
        },
        async setDanhaoAsync(payload,rootState){
            await new Promise(resolve => setTimeout(resolve,1000))
            dispatch.count.setDanhao(payload)
        },
        async setProductAsync(payload,rootState){
            await new Promise(resolve => setTimeout(resolve,1000))
            dispatch.count.setProduct(payload)
        }
    })
}
export default count;