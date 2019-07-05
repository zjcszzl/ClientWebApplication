import React from 'react';
import {Button, WhiteSpace,NavBar,Icon,WingBlank,DatePicker,List,Tabs,Badge,Result} from 'antd-mobile';
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const Item = List.Item
const Brief = Item.Brief

class DinghuoDetail extends React.Component{
    constructor(){
            super()
            this.state = {
                Orders:[]
            }
            this.getData = this.getData.bind(this)
            this.handleBack = this.handleBack.bind(this)
        }
    
    componentDidMount(){
        this.getData();
    }
    getData(){
        var this_ = this;
        let user = this_.props.countState["chosenCustomer"];
        let password = this_.props.countState["passWord"];
        let url = "http://192.168.2.54:5000/OrderHistory?username=" + user + "&password=" + password;
        console.log(url);
        axios.get(url)
            .then(function(response){
                    //let data = response.data
                console.log(response.data)
                for(var count = 0 ; count < response.data.length; count++){
                    if(response.data[count]["OS_NO"] === this_.props.countState["danHao"] && response.data[count]["PRD_NAME"] === this_.props.countState["product"]){
                        this_.setState({
                            Orders: response.data[count]
                        })
                    }
                }
                console.log(this_.state.Orders)
            })
            .catch(function(error){
                console.log(error);
            });
    }
    handleBack(){
        this.props.history.push('./DinghuoBaobiao')
    }
    

    render(){
        let string = ""
        if((this.state.Orders["OS_ID"]) === "SO")
            string = "受订单"
        else string = "受订退回单"
        return(
            <div>
                <NavBar mode="dark" icon={<Icon type="left" onClick = {this.handleBack}/>}
                    >{string}详情
                </NavBar>
                <hr></hr>
                <List>
                    <Result title={this.state.Orders["NAME"]} message={<div>{string}</div>}/>
                    <WhiteSpace />
                    <Item extra={this.state.Orders["AMT"]}>订单金额</Item>
                    <Item extra={this.state.Orders["Order_Amount"]}>订单订货金额</Item>
                    <Item extra={this.state.Orders["Order_total"]}>订单总金额</Item>
                    <Item extra={moment(this.state.Orders["SYS_DATE"]).format("YYYY-MM-DD")}>交易时间</Item>
                    <Item extra={this.props.countState["chosenCustomer"]}>代理商名称</Item>
                    <Item extra={this.state.Orders["PRD_NAME"]}>货品名称</Item>
                    <Item extra={this.state.Orders["QTY"]}>货品数量</Item>
                    <Item extra={this.state.Orders["UP"]}>货品单价</Item>
                    <Item extra={this.state.Orders["OS_NO"]}>单号</Item>

                </List>
            </div>
        )
    }

}


const mapStateToProps = (state) =>({
	countState: state.count
})
const mapDispatchToProps = (dispatch) =>({
	countDispatch: dispatch.count
})
export default connect(mapStateToProps,mapDispatchToProps)(DinghuoDetail);