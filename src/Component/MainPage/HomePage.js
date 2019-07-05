import React from 'react';
import {Button, WhiteSpace, WingBlank,List,InputItem,NavBar,Icon} from 'antd-mobile';
import{connect} from 'react-redux'
import axios from 'axios'
import moment from 'moment'
const nowTimeStamp = Date.now();
var now = new Date(nowTimeStamp);

//Login page for all the user
class HomeLoginPage extends React.Component{
	constructor(props){
		super(props);
		this.state={
			UserName: '',
			PassWord: '',
			Authorize: {},
			test:""
		}
		this.handleLogin = this.handleLogin.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.login_ = this.login_.bind(this)
	}
	handleLogin = () => {
		let user = this.state.UserName;
		let pwd = this.state.PassWord;
		const{countDispatch} = this.props;
		countDispatch.increment(user,pwd);
		console.log(this.props.countState)
		if(pwd.length === 0 && user.length === 0){
			window.alert("请输入账号和密码！");
		}else if(pwd.length === 0 && user.length > 0){
			window.alert("密码不能为空!");
		}else if(user.length === 0 && pwd.length > 0){
			window.alert("账号不能为空！");
		}else{
			this.handleClick(user,pwd)
			//this.login(this.state.Authorize)


		}
	}
	handleClick(user,pwd){
		var this_ = this;
		//192.168.50.137
		let url =  "http://192.168.2.54:5000/login?username=" + user + "&password=" + pwd;
		console.log(url);
		//let url = "http://127.0.0.1:5000/login?username=a1&password=123555"
		axios.get(url)
			.then(function(response){
				//let data = response.data
				console.log(response.data)
				this_.setState({
					Authorize:response.data
				})
				console.log(this_.state.Authorize)
				this_.login_();
			})
			.catch(function(error){
				console.log(error);
				alert(error)
			});

	}
	login_(){
		console.log(this.state.Authorize)
		console.log(now)

		let valid_start = moment(this.state.Authorize["VALID_TIME_START"]).format('YYYY-MM-DD');
		let valid_end = moment(this.state.Authorize["VALID_TIME_END"]).format('YYYY-MM-DD');
		now = moment(now).format('YYYY-MM-DD');

		if(this.state.Authorize["VALID_TIME_START"] != null && this.state.Authorize["VALID_TIME_END"] != null
				&& (valid_end < now || valid_start > now)){
			window.alert("账户已过期")
			return;
		}
		if(this.state.Authorize["LOGIN_TYPE_CUSTOMER"] === "T"){
			this.props.history.push('/CustomerPage')
			return;
		}
		else if(this.state.Authorize["LOGIN_TYPE_WORKER"] === "T"){
			this.props.history.push('/ManagerPage')
			return;
		}
		else{
			window.alert("账户/密码错误或者账号已过期")
		}
	}
	render(){
		return(
		<div>
            <NavBar
            mode="dark" icon={<Icon type="ellipsis" onClick={() => window.location.href="http://www.amtxts.com/"} />}
            >天心天思代理商服务平台
            </NavBar>
            <hr></hr>
			<div>
				<WingBlank>
				<List>
					<InputItem id = "username" type = "text" onChange = {UserName => this.setState({UserName})}>
						账号
					</InputItem>
					<InputItem  id = "userpass" type = "password" onChange = {PassWord => this.setState({PassWord})} >
						密码
					</InputItem>
				</List>
				<WhiteSpace/>
				<Button type="primary" test-align="center" onClick={this.handleLogin}>
					登录
				</Button>
				<WhiteSpace/>
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
export default connect(mapStateToProps,mapDispatchToProps)(HomeLoginPage);