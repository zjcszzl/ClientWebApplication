import React from 'react';
import {Link } from 'react-router-dom'
import {Button,List,WingBlank} from 'antd-mobile';
import { connect } from 'react-redux'
import axios from 'axios'
const Item = List.Item;
const Brief = Item.Brief;
//the page for the worker and manager
class ManagerPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
           WorkerName: "",
           WorkerNumber: "",
		}
        this.handleRightClick = this.handleRightClick.bind(this);
		this.handleDuizhang = this.handleDuizhang.bind(this);
		this.handleDinghuo = this.handleDinghuo.bind(this);
		this.handleWaibao = this.handleWaibao.bind(this);
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
		//let url = "http://127.0.0.1:5000/login?username=a1&password=123555"
		axios.get(url)
			.then(function(response){
				//let data = response.data
				console.log(response.data)
				this_.setState({
					WorkerName: response.data["LOGIN_NAME"],
					WorkerNumber: response.data["LOGIN_NO"]
				})
			})
			.catch(function(error){
				console.log(error);
			});

	}

    handleRightClick(){
        this.props.history.push('./WorkerDetail')
    }
    handleDuizhang(){
		const{countDispatch} = this.props;
        countDispatch.setBaobiao('Duizhang');
        this.props.history.push('./DuizhangDaili')
	}
	handleDinghuo(){
		const{countDispatch} = this.props;
        countDispatch.setBaobiao('Dinghuo');
		this.props.history.push('./DuizhangDaili')
	}
	handleWaibao(){
		const{countDispatch} = this.props;
        countDispatch.setBaobiao('Waibao');
		this.props.history.push('./DuizhangDaili')
	}
	
	render(){
		console.log(this.props.countState["userName"])
		return(
			<div>
                <Item extra=""  multipleLine style={{background:"#108ee9"}}
                thumb="/user.jpg"
				arrow="horizontal" onClick={this.handleRightClick}>
          		名字：{this.state.WorkerName}<Brief style ={{color:"black"}}>编号：{this.state.WorkerNumber}</Brief>
        		</Item>
				<div>
					<WingBlank>
					<List>
						<Item thumb="/chart.png" arrow="horizontal" onClick={this.handleDuizhang}>企业对账报表</Item>
						<Item thumb="/chart.png" arrow="horizontal" onClick={this.handleDinghuo}>产品受订报表</Item>
						<Item thumb="/chart.png" arrow="horizontal" onClick={this.handleWaibao}>产品采购报表</Item>
                        <Item thumb="/contact.jpg" arrow="horizontal" onClick={() => {this.props.history.push('./DailiList')}}>代理商信息</Item>
                        <Item thumb="/设置.png" arrow="horizontal" onClick={() => {}}>设置</Item>
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
export default connect(mapStateToProps,mapDispatchToProps)(ManagerPage);