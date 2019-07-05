import {init} from '@rematch/core'
import * as models from './models'
//import AsyncStorage from 'react-native'
import {persistStore } from 'redux-persist'

const store = init({
    models,
})
//export const persistor = persistStore(store)
//persistStore(store,{storage:AsyncStorage})
export default store