import React from 'react';
import {Button, WhiteSpace,NavBar,Icon,WingBlank,DatePicker,List,Tabs,Badge,Result,Accordion} from 'antd-mobile';
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const Item = List.Item
const Brief = Item.Brief
const tabs = [
    {title: <Badge>近一月</Badge>},
    {title: <Badge>近三月</Badge>},
    {title: <Badge>近半年</Badge>},
    {title: <Badge>自定义</Badge>}
]
class DinghuoBaobiao extends React.Component{
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
        this.getData = this.getData.bind(this);
        this.detail = this.detail.bind(this);
    }
    componentDidMount(){
        this.getData();
    }
    //从数据库获得被选择代理商的所有受订单及退回单的数据
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
                if(response.data === 'ERROR')
                    return
				this_.setState({
					Orders: response.data
				})
			})
			.catch(function(error){
				console.log(error);
			});
    }
    //检测用户提交的时间范围
    handleSubmit = () =>{
        let start = moment(this.state.dateStart).format('YYYY-MM-DD');
        let end = moment(this.state.dateEnd).format('YYYY-MM-DD');
        let test = moment(now).add('days',-30).format('YYYY-MM-DD')
        console.log(test);
        if(end < start)
            window.alert("Wrong time choice");
        else{
            console.log(this.state.Orders);
            this.checkInformation(start,end);
        }
    }
    //根据用户提交的自定义时间范围，返回符合时间范围的受订单及退回情况
    checkInformation(start,end){
        for(var i = 0; i < this.state.Orders.length;i++){
			console.log("here")
			console.log(this.state.Orders[i])
			if((moment(this.state.Orders[i]["SYS_DATE"]).format('YYYY-MM-DD') >= start) &&
            (moment(this.state.Orders[i]["SYS_DATE"]).format('YYYY-MM-DD') <= end) 
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
    //返回到选择代理商列表页面
    handleBack = () =>{
        this.props.history.push('/DuizhangDaili')
    }
    //检测点击事件
    handleClick(i){
        window.alert("You have chosen order " + i);
    }
    //根据选择的单据号和种类，返回该单据的详细信息
    detail(num,name){
        //window.alert("You have chosen " + num )
        const{countDispatch} = this.props;
        countDispatch.setDanhao(num);
        countDispatch.setProduct(name);
        console.log(this.props.countState["product"])
        this.props.history.push('/DinghuoDetail')
    }
    render(){
        console.log(this.props.countState)
        let total = 0;
        //统计该用户受订单的付款总额（含折扣额在内） 受订 - 退回 +
        for(var count = 0 ; count < this.state.Orders.length; count++){
            if(this.state.Orders[count]["OS_ID"] === "SO")
                total = total - this.state.Orders[count]["Order_Amount"]
            else    
            total = total + this.state.Orders[count]["Order_Amount"]
        }
        let items = [];
        //封装该代理商抓取到所有的受订单及受订退货单，方便后续根据用户自定义事件范围按条件渲染
        for(var i = 0 ; i < this.state.Orders.length; i++){
            let NO = this.state.Orders[i]["OS_NO"]
            let NAME = this.state.Orders[i]["PRD_NAME"]
            let string = ""
            if((this.state.Orders[i]["OS_ID"]) === "SO"){
                string = "受订单"
                items.push(
                    <div class= "items" id = {i.toString()} style = {{display:"none"}} >
                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[i]["Order_Amount"]}>
                            {string}<Brief>交易时间：{moment(this.state.Orders[i]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}订货单：{this.state.Orders[i]["OS_NO"]}</Brief>
                        </Item>
                    </div>
                )
            }
            else{
                string = "受订退回单"
                items.push(
                    <div class= "items" id = {i.toString()} style = {{display:"none"}} >
                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[i]["Order_Amount"]}>
                            {string}<Brief>交易时间：{moment(this.state.Orders[i]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}订货单：{this.state.Orders[i]["OS_NO"]}</Brief>
                        </Item>
                    </div>
                )
            }
        console.log(items)
        }
        count = 0;
        let OneMonth = [];
        var day = moment(now).format('DD');
        let start = moment(now).add('days',-day+1).format('YYYY-MM-DD');
        let end = moment(now).format('YYYY-MM-DD');
        console.log(end)
        var flag = moment(now).add('days',32).format('YYYY-MM');
        //封装该代理商一个月内的受订单及受订退货单，并且按月份分类订单
        for(var j = 0 ; j < this.state.Orders.length; j++){
            console.log(this.state.Orders.length)
            console.log(moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM-DD'))
            if((moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM-DD') >= start) &&
            (moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM-DD') <= end) 
			){
                let NO = this.state.Orders[j]["OS_NO"]
                let NAME = this.state.Orders[j]["PRD_NAME"]
                let string = ""
                if((this.state.Orders[j]["OS_ID"]) === "SO")
                    string = "受订单"
                else 
                    string = "受订退回单"
                if(moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM') === flag){
                    if(j+1 === this.state.Orders.length){
                        if(string === "受订单"){
                            count -= this.state.Orders[j]["Order_Amount"]
                            OneMonth.push(
                                <div>
                                    <List renderFooter = {<div>本月总结：{count}</div>}>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[j]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[j]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>
                                </div>
                            )
                        }
                        else{
                            count += this.state.Orders[j]["Order_Amount"]
                            OneMonth.push(
                                <div>
                                    <List renderFooter = {<div>本月总结：{count}</div>}>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[j]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[j]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>
                                </div>
                            )
                        }
                    }
                    else{
                        if(moment(this.state.Orders[j+1]["SYS_DATE"]).format('YYYY-MM') === flag){
                            if(string === "受订单"){
                                count -= this.state.Orders[j]["Order_Amount"]
                                OneMonth.push(
                                    <div>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[j]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[j]["OS_NO"]}</Brief>
                                        </Item>
                                    </div>
                                )
                            }
                            else{
                                count += this.state.Orders[j]["Order_Amount"]
                                OneMonth.push(
                                    <div>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[j]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[j]["OS_NO"]}</Brief>
                                        </Item>
                                    </div>
                                )
                            }
                        }
                        else{
                            if(string === "受订单"){
                                count -= this.state.Orders[j]["Order_Amount"]
                                OneMonth.push(
                                    <div>
                                        <List renderFooter = {<div>本月总结：{count}</div>}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[j]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[j]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                            }
                            else{
                                count += this.state.Orders[j]["Order_Amount"]
                                OneMonth.push(
                                    <div>
                                        <List renderFooter = {<div>本月总结：{count}</div>}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[j]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[j]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                            }
                        }
                    }
                }
                else{
                    if(j+1 !== this.state.Orders.length){
                        if(moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM') === moment(this.state.Orders[j+1]["SYS_DATE"]).format('YYYY-MM')){
                            if(string === "受订单"){
                                flag = moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM')
                                OneMonth.push(
                                <div>
                                    <List renderHeader={flag}>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[j]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[j]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>
                                </div>
                                )
                                count = 0
                                count -= this.state.Orders[j]["Order_Amount"]
                            }
                            else{
                                flag = moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM')
                                OneMonth.push(
                                <div>
                                    <List renderHeader={flag}>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[j]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[j]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>
                                </div>
                                )
                                count = 0
                                count += this.state.Orders[j]["Order_Amount"]
                            }
                        }
                        else{
                            if(string === "受订单"){
                                flag = moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM')
                                OneMonth.push(
                                    <div>
                                        <List renderHeader={flag} renderFooter = { <div>本月总结：{-this.state.Orders[j]["Order_Amount"]}</div>}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[j]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[j]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                                count = 0
                                count -= this.state.Orders[j]["Order_Amount"]
                                }
                            else{
                                flag = moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM')
                                OneMonth.push(
                                    <div>
                                        <List renderHeader={flag} renderFooter = { <div>本月总结：{this.state.Orders[j]["Order_Amount"]}</div>}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[j]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[j]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                                count = 0
                                count += this.state.Orders[j]["Order_Amount"]
                            }
                        }
                    }
                    else{
                        if(string === "受订单"){
                            flag = moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM')
                            OneMonth.push(
                                <div>
                                    <List renderHeader={flag} renderFooter={<div>本月总结：{-this.state.Orders[j]["Order_Amount"]}</div>}>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[j]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[j]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>
                                </div>
                            )
                            count = 0
                            }
                            else{
                            flag = moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM')
                            OneMonth.push(
                                <div>
                                    <List renderHeader={flag} renderFooter={<div>本月总结：{this.state.Orders[j]["Order_Amount"]}</div>}>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[j]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[j]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>
                                </div>
                            )
                            count = 0
                            }
                    }
                }
            }
            console.log(start)
            console.log(end)
            console.log(OneMonth)
        }
        let ThreeMonth = [];
        let start_ = moment(now).add('months',-2).add('days',-day+1).format('YYYY-MM-DD');
        let end_ = moment(now).format('YYYY-MM-DD');
        var flag_ = moment(now).add('days',32).format('YYYY-MM');
        //封装该代理商三个月内的受订单及受订退货单，并且按月份分类订单
        for(var k = 0 ; k < this.state.Orders.length; k++){
            console.log(this.state.Orders[k]["SYS_DATE"])
            if((moment(this.state.Orders[k]["SYS_DATE"]).format('YYYY-MM-DD') >= start_) &&
            (moment(this.state.Orders[k]["SYS_DATE"]).format('YYYY-MM-DD') <= end_) 
			){
                let NO = this.state.Orders[k]["OS_NO"]
                let NAME = this.state.Orders[k]["PRD_NAME"]
                let string = ""
                if((this.state.Orders[k]["OS_ID"]) === "SO")
                    string = "受订单"
                else 
                    string = "受订退回单"
                if(moment(this.state.Orders[k]["SYS_DATE"]).format('YYYY-MM') === flag_){
                    if(k + 1 === this.state.Orders.length){
                        if(string === "受订单"){
                            count -= this.state.Orders[k]["Order_Amount"]
                            ThreeMonth.push(
                                <div>
                                    <List renderFooter={<div>本月总结:{count}</div>}>
                                        <Item onClick = {()=> this.detail(NO.NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[k]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[k]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[k]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>
                                </div>
                            )
                        }
                        else{
                            count += this.state.Orders[k]["Order_Amount"]
                            ThreeMonth.push(
                                <div>
                                    <List renderFooter={<div>本月总结:{count}</div>}>
                                        <Item onClick = {()=> this.detail(NO.NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[k]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[k]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[k]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>
                                </div>
                            )
                        }
                    }
                    else{
                        if(moment(this.state.Orders[k+1]["SYS_DATE"]).format('YYYY-MM') === flag_){
                            if(string === "受订单"){
                                count -= this.state.Orders[k]["Order_Amount"]
                                ThreeMonth.push(
                                    <div>
                                        <Item onClick = {()=> this.detail(NO.NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[k]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[k]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[k]["OS_NO"]}</Brief>
                                        </Item>
                                    </div>
                                )
                            }
                            else{
                                count += this.state.Orders[k]["Order_Amount"]
                                ThreeMonth.push(
                                    <div>
                                        <Item onClick = {()=> this.detail(NO.NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[k]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[k]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[k]["OS_NO"]}</Brief>
                                        </Item>
                                    </div>
                                )
                            }
                        }
                        else{
                            if(string === "受订单"){
                                count -= this.state.Orders[k]["Order_Amount"]
                                ThreeMonth.push(
                                    <div>
                                        <List renderFooter={<div>本月总结:{count}</div>}>
                                            <Item onClick = {()=> this.detail(NO.NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[k]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[k]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[k]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                            }
                            else{
                                count += this.state.Orders[k]["Order_Amount"]
                                ThreeMonth.push(
                                    <div>
                                        <List renderFooter={<div>本月总结:{count}</div>}>
                                            <Item onClick = {()=> this.detail(NO.NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[k]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[k]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[k]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                            }
                        }
                    }    
                }
                else{
                    if(k+1 !== this.state.Orders.length){
                        if(moment(this.state.Orders[k]["SYS_DATE"]).format('YYYY-MM') === moment(this.state.Orders[k+1]["SYS_DATE"]).format('YYYY-MM')){
                            if(string === "受订单"){
                                flag_ = moment(this.state.Orders[k]["SYS_DATE"]).format('YYYY-MM')
                                ThreeMonth.push(
                                    <div>
                                        <List renderHeader={flag_}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[k]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[k]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[k]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                                count = 0
                                count -= this.state.Orders[k]["Order_Amount"]
                            }
                            else{
                                flag_ = moment(this.state.Orders[k]["SYS_DATE"]).format('YYYY-MM')
                                ThreeMonth.push(
                                    <div>
                                        <List renderHeader={flag_}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[k]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[k]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[k]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                                count = 0
                                count += this.state.Orders[k]["Order_Amount"]
                            }
                        }
                        else{
                            if(string === "受订单"){
                                flag_ = moment(this.state.Orders[k]["SYS_DATE"]).format('YYYY-MM')
                                ThreeMonth.push(
                                    <div>
                                        <List renderHeader={flag_} renderFooter={<div>本月总结:{-this.state.Orders[k]["Order_Amount"]}</div>}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[k]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[k]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[k]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                                count = 0
                                count -= this.state.Orders[k]["Order_Amount"]
                            }
                            else{
                                flag_ = moment(this.state.Orders[k]["SYS_DATE"]).format('YYYY-MM')
                                ThreeMonth.push(
                                    <div>
                                        <List renderHeader={flag_} renderFooter={<div>本月总结:{this.state.Orders[k]["Order_Amount"]}</div>}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[k]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[k]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[k]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                                count = 0
                                count += this.state.Orders[k]["Order_Amount"]
                            }
                        }
                    }
                    else{
                        if(string === "受订单"){
                            flag_ = moment(this.state.Orders[k]["SYS_DATE"]).format('YYYY-MM')
                            ThreeMonth.push(
                                <div>
                                    <List renderHeader={flag_} renderFooter = {<div>本月总结：{-this.state.Orders[k]["Order_Amount"]} </div>}>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[k]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[k]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[k]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>
                                </div>
                            )
                            count = 0
                            count -= this.state.Orders[k]["Order_Amount"]
                        }
                        else{
                            flag_ = moment(this.state.Orders[k]["SYS_DATE"]).format('YYYY-MM')
                            ThreeMonth.push(
                                <div>
                                    <List renderHeader={flag_} renderFooter = {<div>本月总结：{this.state.Orders[k]["Order_Amount"]} </div>}>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[k]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[k]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[k]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>
                                </div>
                            )
                            count = 0
                            count += this.state.Orders[k]["Order_Amount"]
                        }
                    }
                }
            }
        }
        let SixMonth = [];
        let start__ = moment(now).add('months',-5).add('days',-day+1).format('YYYY-MM-DD');
        let end__ = moment(now).format('YYYY-MM-DD');
        var flag__ = moment(now).add('days',32).format('YYYY-MM');
        //封装该代理商六个月内的受订单及受订退货单，并且按月份分类订单
        for(var l = 0 ; l < this.state.Orders.length; l++){
            if((moment(this.state.Orders[l]["SYS_DATE"]).format('YYYY-MM-DD') >= start__) &&
            (moment(this.state.Orders[l]["SYS_DATE"]).format('YYYY-MM-DD') <= end__) 
			){
                let NO = this.state.Orders[l]["OS_NO"]
                let NAME = this.state.Orders[l]["PRD_NAME"]
                let string = ""
                if((this.state.Orders[l]["OS_ID"]) === "SO")
                    string = "受订单"
                else 
                    string = "受订退回单"
                if(moment(this.state.Orders[l]["SYS_DATE"]).format('YYYY-MM') === flag__){
                    if(l+1 === this.state.Orders.length){
                        if(string === "受订单"){
                            count -= this.state.Orders[l]["Order_Amount"]
                            SixMonth.push(
                                <div>
                                    <List renderFooter = {<div>本月总结:{count}</div>}>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[l]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[l]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[l]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>
                                </div>
                            )
                        }
                        else{
                            count += this.state.Orders[l]["Order_Amount"]
                            SixMonth.push(
                                <div>
                                    <List renderFooter = {<div>本月总结:{count}</div>}>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[l]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[l]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[l]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>    
                                </div>
                            )
                        }
                    }
                    else{
                        if(moment(this.state.Orders[l+1]["SYS_DATE"]).format('YYYY-MM') === flag__){
                            if(string === "受订单"){
                                count -= this.state.Orders[l]["Order_Amount"]
                                SixMonth.push(
                                    <div>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[l]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[l]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[l]["OS_NO"]}</Brief>
                                        </Item>
                                    </div>
                                )
                            }
                            else{
                                count += this.state.Orders[l]["Order_Amount"]
                                SixMonth.push(
                                    <div>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[l]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[l]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[l]["OS_NO"]}</Brief>
                                        </Item>
                                    </div>
                                )
                            }
                        }
                        else{
                            if(string === "受订单"){
                                count -= this.state.Orders[l]["Order_Amount"]
                                SixMonth.push(
                                    <div>
                                        <List renderFooter = {<div>本月总结:{count}</div>}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[l]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[l]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[l]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>    
                                    </div>
                                )
                            }
                            else{
                                count += this.state.Orders[l]["Order_Amount"]
                                SixMonth.push(
                                    <div>
                                        <List renderFooter = {<div>本月总结:{count}</div>}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[l]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[l]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[l]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                            }
                        }
                    }
                }
                else{
                    if(l+1 !== this.state.Orders.length){
                        if(moment(this.state.Orders[l]["SYS_DATE"]).format('YYYY-MM') === moment(this.state.Orders[l+1]["SYS_DATE"]).format('YYYY-MM')){
                            if(string === "受订单"){
                                flag__ = moment(this.state.Orders[l]["SYS_DATE"]).format('YYYY-MM')
                                SixMonth.push(
                                    <div>
                                        <List renderHeader={flag__}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[l]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[l]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[l]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                                count = 0
                                count -= this.state.Orders[l]["Order_Amount"]
                                }
                            else{
                                flag__ = moment(this.state.Orders[l]["SYS_DATE"]).format('YYYY-MM')
                                SixMonth.push(
                                    <div>
                                        <List renderHeader={flag__}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[l]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[l]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[l]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                                count = 0
                                count += this.state.Orders[l]["Order_Amount"]
                            }
                        }
                        else{
                            if(string === "受订单"){
                                flag__ = moment(this.state.Orders[l]["SYS_DATE"]).format('YYYY-MM')
                                SixMonth.push(
                                    <div>
                                        <List renderHeader={flag__} renderFooter={<div>本月总结:{-this.state.Orders[l]["Order_Amount"]}</div>}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[l]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[l]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[l]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                                count = 0
                                count -= this.state.Orders[l]["Order_Amount"]
                                    }
                                    else{
                                flag__ = moment(this.state.Orders[l]["SYS_DATE"]).format('YYYY-MM')
                                SixMonth.push(
                                    <div>
                                        <List renderHeader={flag__} renderFooter={<div>本月总结:{this.state.Orders[l]["Order_Amount"]}</div>}>
                                            <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[l]["Order_Amount"]}>
                                                {string}<Brief>交易时间：{moment(this.state.Orders[l]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[l]["OS_NO"]}</Brief>
                                            </Item>
                                        </List>
                                    </div>
                                )
                                count = 0
                                count += this.state.Orders[l]["Order_Amount"]
                                    }
                        }
                    }
                    else{
                        if(string === "受订单"){
                            flag__ = moment(this.state.Orders[l]["SYS_DATE"]).format('YYYY-MM')
                            SixMonth.push(
                                <div>
                                    <List renderHeader={flag__} renderFooter={<div>本月总结:{-this.state.Orders[l]["Order_Amount"]}</div>}>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Orders[l]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[l]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[l]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>
                                </div>
                            )
                            count = 0
                            count -= this.state.Orders[l]["Order_Amount"]
                            }
                            else{
                            flag__ = moment(this.state.Orders[l]["SYS_DATE"]).format('YYYY-MM')
                            SixMonth.push(
                                <div>
                                    <List renderHeader={flag__} renderFooter={<div>本月总结:{this.state.Orders[l]["Order_Amount"]}</div>}>
                                        <Item onClick = {()=> this.detail(NO,NAME)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Orders[l]["Order_Amount"]}>
                                            {string}<Brief>交易时间：{moment(this.state.Orders[l]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}{string}：{this.state.Orders[l]["OS_NO"]}</Brief>
                                        </Item>
                                    </List>
                                </div>
                            )
                            count = 0
                            count += this.state.Orders[l]["Order_Amount"]
                            }
                    }
                }
            }
        }
        return(
            <div>
                <NavBar mode="dark" icon={<Icon type="left" onClick = {this.handleBack}/>}
                    >受订单报表
                </NavBar>
                <hr></hr>
                <List>
                    <Item>您选择的查询代理商是{this.props.countState["chosenCustomer"]}</Item>
                    <Result title="受订单总金额" message={<div>{total}元</div>}/>
                    <WhiteSpace />
                    <div>
                        <Tabs tabs={tabs} initialPage={0}>
                            <div style={{ height: '600px', backgroundColor: '#fff' }}>
                                <Accordion>
                                    {OneMonth}
                                </Accordion>
                            </div>
                            <div style={{ height: '600px', backgroundColor: '#fff' }}>
                                <Accordion>
                                    {ThreeMonth}
                                </Accordion>
                            </div>
                            <div style={{ height: '600px', backgroundColor: '#fff' }}>
                                <Accordion>      
                                    {SixMonth}
                                </Accordion>
                            </div>
                            <div style={{  height: '600px', backgroundColor: '#fff' }}>
                                <List>
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
                                    <hr></hr>
                                    <WingBlank>
                                        <Button type = "primary" onClick={this.handleSubmit}>查询</Button><WhiteSpace />
                                    </WingBlank>
                                    <WingBlank size="lg"></WingBlank>
                                </List>
                                <div id = "Detail">
                                    <Accordion>
                                        {items}
                                    </Accordion>
                                </div>
                            </div>
                        </Tabs>
                    </div>
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
export default connect(mapStateToProps,mapDispatchToProps)(DinghuoBaobiao);