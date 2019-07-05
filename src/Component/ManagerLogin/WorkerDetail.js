import React from 'react';
import {List,NavBar,Icon,WingBlank,Button} from 'antd-mobile';
import { connect } from 'react-redux'
import axios from 'axios'
const Item = List.Item;
//the detail information for the log-in worker
class WorkerDetail extends React.Component{
	constructor(props){
        super(props);
        this.state={
            WorkerName:"",
            WorkerNumber:"",
            LoginPwd:0,
            Data:[]
        }
        this.handleBack = this.handleBack.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleCustomer = this.handleCustomer.bind(this);
        this.getData = this.getData.bind(this);
    }
    componentDidMount(){
        this.getData()
        
    }
    getData(){
        var this_ = this;
		let user = this_.props.countState["userName"];
		let password = this_.props.countState["passWord"];
		let url = "http://192.168.2.54:5000/login?username=" + user + "&password=" + password;
		console.log(url);
		axios.get(url)
			.then(function(response){
				//let data = response.data
				console.log(response.data)
				this_.setState({
					WorkerName: response.data["LOGIN_NAME"],
                    WorkerNumber: response.data["LOGIN_NO"],
                    LoginPwd: response.data["LOGIN_PWD"]
				})
			})
			.catch(function(error){
				console.log(error);
			});
    }
    handleBack(){
        this.props.history.push('./ManagerPage')
    }
    handleClick(){
        this.props.history.push('./ChangePwd')
    }
    handleCustomer(){
        this.props.history.push('./DailiList')
    }
	render(){
        console.log(this.props.countState["userName"] + " " + this.props.countState["passWord"])
        
		return(
			<div>
				<NavBar
      				mode="dark" icon={<Icon type="left" onClick={this.handleBack} />}
					>员工信息
				</NavBar>
				<hr></hr>
				<div>
					<WingBlank>
                    <List>
                        <Item extra={this.state.WorkerNumber}>员工代号</Item>
                        <Item extra={this.state.WorkerName}>员工名称</Item>
                        <Item extra={this.state.LoginPwd}>登录密码</Item>
                        <hr></hr>
                        {/*
                        <Item arrow="horizontal" onClick={this.handleCustomer}>我的代理商</Item>
                        */}
                        </List>
                    </WingBlank>	
                    <Button onClick = {this.handleClick} type = "primary">修改登录密码</Button>
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
export default connect(mapStateToProps,mapDispatchToProps)(WorkerDetail);