import React from 'react';
import {Link } from 'react-router-dom'
import {Button,List,WingBlank} from 'antd-mobile';
import { connect } from 'react-redux'
import axios from 'axios'
const Item = List.Item;
const Brief = Item.Brief;
//the home page for the dali shang 
class CustomerPage extends React.Component{
	constructor(props){
        super(props);
        this.state={
           CustomerName: "",
           CustomerNumber: "",
		}
		this.handleCustomer = this.handleCustomer.bind(this);
		this.handleRightClick = this.handleRightClick.bind(this);
		this.handleOrder = this.handleOrder.bind(this);
		this.getData = this.getData.bind(this);
	}
	
	componentDidMount(){
		this.getData()
	}
	

	getData(){
		var this_ = this;
		let user = this_.props.countState["userName"];
		let password = this_.props.countState["passWord"];
		let url = "http://192.168.2.54:5000/info?username=" + user + "&password=" + password;
		console.log(url);
		axios.get(url)
			.then(function(response){
				//let data = response.data
				console.log(response.data)
				this_.setState({
					CustomerName: response.data["CUS_NAME"],
					CustomerNumber: response.data["CUS_NO"]
				})
			})
			.catch(function(error){
				console.log(error);
			});

	}
	handleCustomer = () => {
		this.props.history.push('/AccountDetail');
	}
    handleRightClick(){
        this.props.history.push('/CustomerDetail');
	}
	handleOrder(){
		this.props.history.push('/OrderProduct');
	}
	render(){
		console.log(this.props.countState["userName"])
		return(
			<div>
				<Item class= "App-top" extra="" align="top"  multipleLine
				thumb="/user.jpg"  style={{background:"#108ee9"}}
				arrow="horizontal" onClick={this.handleRightClick}>
          		名字：{this.state.CustomerName}<Brief style ={{color:"black"}}>编号：{this.state.CustomerNumber}</Brief>
				</Item>
				<div>
					<WingBlank>
					<List>
						<Item thumb="/chart.png" arrow="horizontal" onClick={this.handleCustomer}>账单</Item>
						<Item thumb="/要货.jpg" arrow="horizontal" onClick={this.handleOrder}>要货</Item>
						<Item thumb="/文档.jpg" arrow="horizontal" onClick={() => {}}>文档</Item>
						<Item thumb="/平台.jpg" arrow="horizontal" onClick={() => {}}>平台</Item>
						<Item thumb="/分析.jpg" arrow="horizontal" onClick={() => {}}>分析</Item>
						<Item thumb="/设置.png" arrow="horizontal" onClick={this.handleOrder}>其他</Item>
					</List>
					<Link to="/">
						<Button className="e-button" type="warning">退出账户</Button>
					</Link>
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
export default connect(mapStateToProps,mapDispatchToProps)(CustomerPage);