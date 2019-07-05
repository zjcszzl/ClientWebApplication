import React from 'react';
import {Button, WhiteSpace,NavBar,Icon,WingBlank,DatePicker,List} from 'antd-mobile';
import { connect } from 'react-redux'
import moment from 'moment'
//const type = [{label:'近一个月',value:'近一个月'},{label:'近三个月',value:'近三个月'},{label:'自定义',value:'custom'}];
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const Item = List.Item
//the page for dalishang checking account
class AccountDetail extends React.Component{
    constructor(){
        super()
        this.state = {
        dateStart: now,
        dateEnd:now,
        time: now,
        type: null,
        Orders: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount(){
		fetch('/data.json',{
            method:"GET",
            headers:{
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
        }).then(response => response.json()).then(data => {
            this.setState({Orders:data.Orders})
            console.log(this.state.Orders)
		})
	}
    handleSubmit = () =>{
        let start = moment(this.state.dateStart).format('YYYY-MM-DD');
        let end = moment(this.state.dateEnd).format('YYYY-MM-DD');
        if(end < start)
            window.alert("Wrong time choice");
        else{
            console.log(this.state.Orders);
            this.checkInformation(start,end);
        }
    }
    checkInformation(start,end){
        for(var i = 0; i < this.state.Orders.length;i++){
			console.log("here")
			console.log(this.state.Orders[i])
			if((this.state.Orders[i]["OrderTime"] >= start) &&
            (this.state.Orders[i]["OrderTime"] <= end) 
			){
                console.log("HERE");
                let apple = document.getElementById(i.toString());
                if(apple.style.display === "none"){
                    apple.style.display = "";
                    console.log("Change!!!")
                }
			}else{
                let apple = document.getElementById(i.toString());
                if(apple.style.display === ""){
                    apple.style.display = "none";
                    console.log("Change Back!!!")
                }
            }
		}
    }
    handleBack = () =>{
        this.props.history.push('/CustomerPage')
    }
    handleClick(i){
        window.alert("You have chosen order " + i);
    }
    render(){
        console.log(this.props.countState)

        let items = [];
        for(var i = 0 ; i < this.state.Orders.length; i++){
                items.push(
                    <div class= "items" id = {i.toString()} style = {{display:"none"}} >
                    <Item arrow = "horizontal" onClick={this.handleClick.bind(this,i)}>
                    {this.state.Orders[i]["number"]}
                    </Item>
                    <hr></hr>
                    </div>
                )
            
            console.log(items)
        }
        return(
            <div>
                <NavBar mode="dark" icon={<Icon type="left" onClick = {this.handleBack}/>}
                >客户对账单系统
                </NavBar>
                <hr></hr>
                <List>
                    <Item>您好: {this.props.countState["userName"]}</Item>
                    <div>
                    <DatePicker
                        mode = "date"
                        title = "Select Date"
                        extra = "Optional"
                        value = {this.state.dateStart}
                        onChange = {dateStart => this.setState({dateStart})}>
                        <List.Item arrow = "horizontal">起始时间</List.Item>
                    </DatePicker>
                    <DatePicker
                        mode = "date"
                        title = "Select Date"
                        extra = "Optional"
                        value = {this.state.dateEnd}
                        onChange = {dateEnd => this.setState({dateEnd})}>
                        <List.Item arrow = "horizontal">结束时间</List.Item>
                    </DatePicker>
                    </div>
                </List>
                <hr></hr>
                <WingBlank>
                <Button type = "primary" onClick={this.handleSubmit}>查询</Button><WhiteSpace />
                </WingBlank>
                <WingBlank size="lg">
                <div id = "Detail">
                    {items}
                </div>
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                </WingBlank>
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
export default connect(mapStateToProps,mapDispatchToProps)(AccountDetail);