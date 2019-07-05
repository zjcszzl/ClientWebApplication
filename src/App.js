import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import HomeLoginPage from '../src/Component/MainPage/HomePage';   
import CustomerPage from '../src/Component/CustomerLogin/CustomerPage';  
import ManagerPage from '../src/Component/ManagerLogin/ManagerPage';
import WorkDetail from '../src/Component/ManagerLogin/WorkerDetail'
import AccountDetail from '../src/Component/AccountDetail';
import OrderProduct from '../src/Component/CustomerLogin/OrderProduct';
import CustomerList from '../src/Component/CustomerLogin/CustomerList';
import CustomerDetail from '../src/Component/CustomerLogin/CustomerDetail';
import ChangePwd from '../src/Component/ChangePwd';
import DailiList from '../src/Component/ManagerLogin/DailiInformation/DailiList';
import MyDaili from '../src/Component/ManagerLogin/DailiInformation/MyDaili';
import CustomerList_ from '../src/Component/ManagerLogin/DailiInformation/CustomerList_';
import DuizhangDaili from '../src/Component/ManagerLogin/DuizhangDaili';
import DuizhangBaobiao from '../src/Component/ManagerLogin/Duizhang/DuizhangBaobiao';
import DinghuoBaobiao from '../src/Component/ManagerLogin/Dinghuo/DinghuoBaobiao';
import WaibaoBaobiao from '../src/Component/ManagerLogin/Waibao/WaibaoBaobiao';
import DinghuoDetail from '../src/Component/ManagerLogin/Dinghuo/DinghuoDetail';
import WaibaoDetail from '../src/Component/ManagerLogin/Waibao/WaibaoDetail'
class App extends React.Component{
  render(){
  return (
    <Router history = {this.props.history}>
      <div>
          <Route exact path = "/" component = {HomeLoginPage} />
          <Route path = "/ManagerPage" component={ManagerPage} />
          <Route path = "/WorkerDetail" component={WorkDetail}/>
          <Route path = "/CustomerPage" component={CustomerPage} />
          <Route path = "/CustomerList" component = {CustomerList}/>
          <Route path = "/AccountDetail" component={AccountDetail} />
          <Route path = "/OrderProduct" component ={OrderProduct} />
          <Route path = "/CustomerDetail" component = {CustomerDetail} />
          <Route path = "/DailiList" component = {DailiList} />
          <Route path = "/ChangePwd" component ={ChangePwd} />
          <Route path = "/MyDaili" component={MyDaili}/>
          <Route path = "/CustomerList_" component={CustomerList_} />
          <Route path = "/DuizhangDaili" component={DuizhangDaili}/>
          <Route path = "/DuizhangBaobiao" component={DuizhangBaobiao}/>
          <Route path = "/DinghuoBaobiao" component={DinghuoBaobiao}/>
          <Route path = "/WaibaoBaobiao" component={WaibaoBaobiao}/>
          <Route path = "/DinghuoDetail" component={DinghuoDetail}/>
          <Route path = "/WaibaoDetail" component={WaibaoDetail}/>
		  </div>
		</Router>
  );
  }
}
export default App;
