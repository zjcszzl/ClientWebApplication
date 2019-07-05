import {Button, WhiteSpace, WingBlank,List,InputItem,NavBar,Icon} from 'antd-mobile';
import{connect} from 'react-redux';
import React from 'react';
import axios from 'axios'
//page for the worker to change the login password
class ChangePwd extends React.Component{
    constructor(props){
		super(props);
		this.state={
			PrePwd: '',
			NewPwd: '',
            NewPwd_: '',
            type:''
		}
        this.handleBack = this.handleBack.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.postData = this.postData.bind(this);
        this.getData = this.getData.bind(this);
    }
    
    postData(){
        var this_ = this;
		let user = this_.props.countState["userName"];
		let password = this.state.NewPwd;
		let url = "http://192.168.50.137:5000/changePWD?username=" + user + "&password=" + password;
		console.log(url);
		//let url = "http://127.0.0.1:5000/changePWD?username=a1&password=123555"
		axios.post(url)
			.then(function(response){
				//let data = response.data
				console.log(response.data)
			})
			.catch(function(error){
				console.log(error);
			});
    }

    componentDidMount(){
		this.getData()
	}

    getData(){
        var this_ = this;
        let user = this.props.countState["userName"];
        let pwd =  this.props.countState["passWord"];
		//192.168.50.137
		let url =  "http://192.168.50.137:5000/login?username=" + user + "&password=" + pwd;
		console.log(url);
		//let url = "http://127.0.0.1:5000/login?username=a1&password=123555"
		axios.get(url)
			.then(function(response){
				//let data = response.data
				console.log(response.data)
				this_.setState({
					type:response.data["LOGIN_TYPE"]
				})
				console.log(this_.state.type)
			})
			.catch(function(error){
				console.log(error);
				alert(error)
			});
    }

    handleBack(){
        if(this.state.type === "Worker"){
            this.props.history.push('./WorkerDetail')
        }
        else{
            this.props.history.push('./CustomerDetail')
        }
    }
    handleSubmit(){
        let user = this.props.countState["userName"];
        let pre = this.state.PrePwd;
        let post = this.state.NewPwd;
        let post_ = this.state.NewPwd_;
        if(pre !== this.props.countState["passWord"]){
            window.alert("请输入正确的前密码");
            return;
        }
        if(post.length === 0){
            window.alert("密码不能为空！")
            return;
        }
        if(post !== post_){
            window.alert("两次新密码不一致，请重新输入新密码");
            return;
        }
        
        this.postData()
        window.alert("您已修改成功,请重新登录")
        this.props.history.push('/')

        const{countDispatch} = this.props;
        countDispatch.increment(user,post);



    }
    render(){
        return(
            <div>
            <NavBar
            mode="dark" icon={<Icon type="left" onClick={this.handleBack} />}
            >修改密码
            </NavBar>
            <hr></hr>
			<div>
				<WingBlank>
				<List>
					<InputItem  type = "text" onChange = {PrePwd => this.setState({PrePwd})}>
						原密码
					</InputItem>
					<InputItem   type = "password" onChange = {NewPwd => this.setState({NewPwd})} >
						新密码
                    </InputItem>
                    <InputItem   type = "password" onChange = {NewPwd_ => this.setState({NewPwd_})} >
						确认新密码
                    </InputItem>
				</List>
				<WhiteSpace/>
				<Button type="primary" test-align="center" onClick={this.handleSubmit}>
					确认
				</Button>
				<WhiteSpace/>
				</WingBlank>
			</div>
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
export default connect(mapStateToProps,mapDispatchToProps)(ChangePwd);