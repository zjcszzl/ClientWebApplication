import React from 'react';
import {List,NavBar,Icon,WingBlank} from 'antd-mobile';
import { connect } from 'react-redux'
import { now } from 'moment';
import axios from 'axios'
const Item = List.Item;
//store all the information for the chosen customer from the list of Dali for the current worker
class MyDaili extends React.Component{
	constructor(props){
        super(props);
        this.state={
            CustomerName: "",
            CustomerNumber: "",
            CustomerRank:"",
            Cust_area:"",
            Area_name:"",
            txjs: "",
            tsjs:"",
            Valid_time_start:now,
            Valid_time_end:now,
            Discount:"",
            Cust_up: "",
        }
        this.handleBack = this.handleBack.bind(this);
        this.handleCustomerList = this.handleCustomerList.bind(this);
        this.getData = this.getData.bind(this)
    }
    
    componentDidMount(){
        this.getData()
    }

    getData(){
		var this_ = this;
		let user = this_.props.countState["chosenCustomer"];
		let password = this_.props.countState["passWord"];
		let url = "http://192.168.2.54:5000/chosen?username=" + user + "&password=" + password;
		console.log(url);
		axios.get(url)
			.then(function(response){
				//let data = response.data
				console.log(response.data)
				this_.setState({
					CustomerName:response.data["CUS_NAME"],
                    CustomerNumber:response.data["CUS_NO"],
                    CustomerRank:response.data["CUS_RANK"],
                    Cust_area:response.data["CUS_AREA"],
                    Area_name:response.data["AREA_NAME"],
                    txjs:response.data["TXJS"],
                    tsjs:response.data["TSJS"],
                    Valid_time_start:response.data["VALID_TIME_START"],
                    Valid_time_end:response.data["VALID_TIME_END"],
                    Discount:response.data["TJ_NUM"],
                    Cust_up:response.data["CUS_UP"],
                })
                console.log(this_.state.CustomerName)
			})
			.catch(function(error){
				console.log(error);
			});

	}



    handleBack(){
        this.props.history.push("/DailiList");
    }
    handleCustomerList(){
        this.props.history.push("/CustomerList_");
    }
	render(){
		console.log(this.props.countState["userName"])
		return(
			<div>
				<NavBar
      				mode="dark" icon={<Icon type="left" onClick={this.handleBack} />}
					>代理商信息
				</NavBar>
				<hr></hr>
				<div>
					<WingBlank>
                    <List>
                    <Item extra={this.state.CustomerName}>名称</Item>
                    <Item extra={this.state.CustomerNumber}>代理商编号</Item>
                    <Item extra={this.state.CustomerRank}>代理级别</Item>
                    <Item extra={this.state.Cust_area}>所在地区</Item>
                    <Item extra={this.state.Area_name}>区域名称</Item>
                    <Item extra={this.state.txjs}>天心结算</Item>
                    <Item extra={this.state.tsjs}>天思结算</Item>
                    <Item extra={this.state.Valid_time_start-this.state.Valid_time_end}>代理期限</Item>
                    <Item extra={this.state.Discount}>特价次数</Item>
                    <Item extra={this.state.Cust_up}>上级</Item>
                        <hr></hr>
                        <Item arrow="horizontal" onClick={this.handleCustomerList}>我的客户</Item>
                        <Item arrow="horizontal" onClick={() => {}}>其他</Item>
					</List>
					</WingBlank>	
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state) =>({
	countState: state.count
})
const mapDispatchToProps = (dispatch) =>({
	countDispatch: dispatch.count
})
export default connect(mapStateToProps,mapDispatchToProps)(MyDaili);