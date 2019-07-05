import React from 'react';
import {Accordion,Button, WhiteSpace,NavBar,Icon,WingBlank,DatePicker,List,Tabs,Badge,Result} from 'antd-mobile';
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import { Brief } from 'antd-mobile/lib/list/ListItem';
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const Item = List.Item
const tabs = [
    {title: <Badge>近一月</Badge>},
    {title: <Badge>近三月</Badge>},
    {title: <Badge>近半年</Badge>},
    {title: <Badge>自定义</Badge>}
]
//the page for dalishang checking account
class DuizhangBaobiao extends React.Component{
    constructor(){
        super()
        this.state = {
            dateStart: now,
            dateEnd:now,
            time: now,
            type: null,
            Orders: [],
            Dinghuo:[],
            Zengquan:[]
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getData = this.getData.bind(this);
        this.detail = this.detail.bind(this);
    }
    componentDidMount(){
        this.getData();
    }
    //获取数据库中该用户的预收款，受订单以及赠券的记录
    getData(){
        var this_ = this;
        let user = this_.props.countState["chosenCustomer"];
		let password = this_.props.countState["passWord"];
		let url = "http://192.168.2.54:5000/YushouHistory?username=" + user + "&password=" + password;
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
            let url_ = "http://192.168.2.54:5000/OrderHistory?username=" + user + "&password=" + password;
            console.log(url_);
            axios.get(url_)
                .then(function(response_){
                    //let data = response.data
                    console.log(response_.data)
                    if(response_.data === 'ERROR')
                        return
                    this_.setState({
                        Dinghuo: response_.data
                    })
                })
                .catch(function(error){
                    console.log(error);
                });
            let url__ = "http://192.168.2.54:5000/ZengquanHistory?username=" + user + "&password=" + password;
            console.log(url__);
            axios.get(url__)
                .then(function(response__){
                    //let data = response.data
                    console.log(response__.data)
                        if(response__.data === 'ERROR')
                            return
                        this_.setState({
                            Zengquan: response__.data
                        })
                    })
                .catch(function(error){
                        console.log(error);
                });    
            
    }
    //检验用户提交的自定义搜索时间范围
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
    //根据用户自定义的时间范围按条件渲染呈现预收款，受订单及赠券的记录
    checkInformation(start,end){
        for(var i = 0; i < this.state.Orders.length + this.state.Dinghuo.length + this.state.Zengquan.length;i++){
			console.log("here")
            console.log(this.state.Orders[i])
            if(i < this.state.Orders.length){
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
            else if(i < this.state.Orders.length + this.state.Dinghuo.length){
                if((moment(this.state.Dinghuo[i-this.state.Orders.length]["SYS_DATE"]).format('YYYY-MM-DD') >= start) &&
                (moment(this.state.Dinghuo[i-this.state.Orders.length]["SYS_DATE"]).format('YYYY-MM-DD') <= end) 
			    ){
                    console.log("HERE");
                    let apple = document.getElementById(i.toString());
                    if(apple.style.display === "none"){
                        apple.style.display = "";
                        console.log("Change!!!")
                    }
                }
                else{
                    let apple = document.getElementById(i.toString());
                    if(apple.style.display === ""){
                        apple.style.display = "none";
                        console.log("Change Back!!!")
                    }
                }
            }
            else{
                if((moment(this.state.Zengquan[i-this.state.Orders.length-this.state.Dinghuo.length]["SYS_DATE"]).format('YYYY-MM-DD') >= start) &&
                (moment(this.state.Zengquan[i-this.state.Orders.length-this.state.Dinghuo.length]["SYS_DATE"]).format('YYYY-MM-DD') <= end) 
			    ){
                    console.log("HERE");
                    let apple = document.getElementById(i.toString());
                    if(apple.style.display === "none"){
                        apple.style.display = "";
                        console.log("Change!!!")
                    }
                }
                else{
                    let apple = document.getElementById(i.toString());
                    if(apple.style.display === ""){
                        apple.style.display = "none";
                        console.log("Change Back!!!")
                    }
                }
            }
		}
    }
    //返回到选择代理商的界面
    handleBack = () =>{
        this.props.history.push('/DuizhangDaili')
    }
    //测试点击事件
    handleClick(i){
        window.alert("You have chosen order " + i);
    }
    //根据选择的表单号和种类，跳转到详细信息
    detail(num){
        const{countDispatch} = this.props;
        countDispatch.setDanhao(num);
        console.log(this.props.countState["danHao"])
        //this.props.history.push('/DinghuoDetail')
        window.alert("You have chosen order " + num);
    }
    render(){
        console.log(this.props.countState)
        console.log(this.state.Dinghuo)
        console.log(this.state.Orders)
        console.log(this.state.Zengquan)
        let total = 0;
        //计算装款金额总数，预收款 + 受订单 - 赠券 + 赠券使用 + 赠券返还 -
        for(var count = 0 ; count < this.state.Orders.length; count++){
            total = total + this.state.Orders[count]["Prepay_Total"]
        }
        for(var count_ = 0; count_ < this.state.Dinghuo.length; count_++){
            if(this.state.Dinghuo[count_]["OS_ID"] === "SO"){
                total = total - this.state.Dinghuo[count_]["Order_Amount"]
                total = total + this.state.Dinghuo[count_]["Gift_Amount"]
            }
            else{
                total = total + this.state.Dinghuo[count_]["Order_Amount"]
                total = total - this.state.Dinghuo[count_]["Gift_Amount"]
            }
        }
        for(var count__ = 0; count__ < this.state.Zengquan.length; count__++){
            total = total + this.state.Zengquan[count__]['AMTN_DKE']
        }
        let items = [];
        //预收款记录封装
        for(var i = 0 ; i < this.state.Orders.length; i++){
            let NO = this.state.Orders[i]["RP_NO"]
            items.push(
                <div class = "items" id = {i.toString()} style={{display:"none"}}>
                    <Item onClick = {() => this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        multipleLine extra={this.state.Orders[i]["Prepay_Total"]}>预收款<Brief>
                        交易时间：{moment(this.state.Orders[i]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                        预收单号：{this.state.Orders[i]["RP_NO"]}
                        </Brief>
                    </Item>
                </div>
            )
        }
        //受订单及受订退货单记录封装
        for(var j = 0; j < this.state.Dinghuo.length; j++){
            let NO = this.state.Dinghuo[j]["OS_NO"]
            let string = ""
            if((this.state.Dinghuo[j]["OS_ID"]) === "SO"){
                if(this.state.Dinghuo[j]["Gift_Amount"] === 0){
                    string = "受订单"
                    items.push(
                        <div class= "items" id = {(j+this.state.Orders.length).toString()} style = {{display:"none"}} >
                            <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Dinghuo[j]["Order_Amount"]}>
                                订单-订货<Brief>交易时间：{moment(this.state.Dinghuo[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                {string}：{this.state.Dinghuo[j]["OS_NO"]}</Brief>
                            </Item>
                        </div>
                    )
                }
                else{
                    string = "受订单"
                    items.push(
                        <div class= "items" id = {(j+this.state.Orders.length).toString()} style = {{display:"none"}} >
                            <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Dinghuo[j]["Order_Amount"]}>
                                订单-订货<Brief>交易时间：{moment(this.state.Dinghuo[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                {string}：{this.state.Dinghuo[j]["OS_NO"]}</Brief>
                            </Item>
                            <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Dinghuo[j]["Gift_Amount"]}>
                                订单-赠券使用<Brief>交易时间：{moment(this.state.Dinghuo[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                赠券号：{this.state.Dinghuo[j]["Gift_NO"]}</Brief>
                            </Item>
                        </div>
                    )
                }
            }
            else{
                if(this.state.Dinghuo[j]["Gift_Amount"] === 0){
                    string = "受订退回单"
                    items.push(
                        <div class= "items" id = {(j+this.state.Orders.length).toString()} style = {{display:"none"}} >
                            <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Dinghuo[j]["Order_Amount"]}>
                                订单-退货<Brief>交易时间：{moment(this.state.Dinghuo[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                {string}：{this.state.Dinghuo[j]["OS_NO"]}</Brief>
                            </Item>
                        </div>
                    )
                }
                else{
                    string = "受订退回单"
                    items.push(
                        <div class= "items" id = {(j+this.state.Orders.length).toString()} style = {{display:"none"}} >
                            <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Dinghuo[j]["Order_Amount"]}>
                                订单-退货<Brief>交易时间：{moment(this.state.Dinghuo[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                {string}：{this.state.Dinghuo[j]["OS_NO"]}</Brief>
                            </Item>
                            <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Dinghuo[j]["Gift_Amount"]}>
                                订单-赠券返还<Brief>交易时间：{moment(this.state.Dinghuo[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                赠券号：{this.state.Dinghuo[j]["Gift_NO"]}</Brief>
                            </Item>
                        </div>
                    )
                }
            }
        }
        //赠券记录封装
        for(var k = 0; k < this.state.Zengquan.length; k++){
            let NO = this.state.Zengquan[k]["FF_NO"]
            items.push(
                <div class = "items" id = {(k+this.state.Orders.length+this.state.Dinghuo.length).toString()} style={{display:"none"}}>
                    <Item onClick = {() => this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        multipleLine extra={this.state.Zengquan[k]["AMTN_DKE"]}>赠券<Brief>
                        赠券时间：{moment(this.state.Zengquan[k]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                        赠券单号：{this.state.Zengquan[k]["FF_NO"]}
                        </Brief>
                    </Item>
                </div>
            )
        }
        let OneMonth = [];
        //根据当前时间设定一个月的时间范围
        let day = moment(now).format('DD');
        let start = moment(now).add('days',-day+1).format('YYYY-MM-DD');
        let end = moment(now).format('YYYY-MM-DD');
        //封装一个月内的预收款，受订单和赠券记录
        for(let j = 0 ; j < this.state.Orders.length + this.state.Dinghuo.length + this.state.Zengquan.length; j++){
            if(j < this.state.Orders.length){
                if((moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM-DD') >= start) &&
                (moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM-DD') <= end) 
			    ){
                    let NO = this.state.Orders[j]["RP_NO"]
                    OneMonth.push(
                        <div>
                            <Item onClick = {() => this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                multipleLine extra={this.state.Orders[j]["Prepay_Total"]}>预收款<Brief>
                                交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                预收单号：{this.state.Orders[j]["RP_NO"]}
                                </Brief>
                            </Item>
                        </div>
                    )
                }
            }
            else if(j < this.state.Orders.length + this.state.Dinghuo.length){
                console.log(moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]))
                if((moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format('YYYY-MM-DD') >= start) &&
                (moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format('YYYY-MM-DD') <= end) 
			    ){
                    let NO = this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]
                    let string = ""
                    if((this.state.Dinghuo[j-this.state.Orders.length]["OS_ID"]) === "SO"){
                        if(this.state.Dinghuo[j-this.state.Orders.length]["Gift_Amount"] === 0){
                            string = "受订单"
                            OneMonth.push(
                                <div>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Dinghuo[j-this.state.Orders.length]["Order_Amount"]}>
                                        订单-订货<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        {string}：{this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]}</Brief>
                                    </Item>
                                </div>
                            )
                        }
                        else{
                            string = "受订单"
                            OneMonth.push(
                                <div>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Dinghuo[j-this.state.Orders.length]["Order_Amount"]}>
                                        订单-订货<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        {string}：{this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]}</Brief>
                                    </Item>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Dinghuo[j-this.state.Orders.length]["Gift_Amount"]}>
                                        订单-赠券使用<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        赠券号码：{this.state.Dinghuo[j-this.state.Orders.length]["Gift_NO"]}</Brief>
                                    </Item>
                                </div>
                            )
                        }
                    }
                    else{
                        if(this.state.Dinghuo[j-this.state.Orders.length]["Gift_Amount"] === 0){
                            string = "受订退回单"
                            OneMonth.push(
                                <div>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Dinghuo[j-this.state.Orders.length]["Order_Amount"]}>
                                        订单-退货<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        {string}：{this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]}</Brief>
                                    </Item>
                                </div>
                            )
                        }
                        else{
                            string = "受订退回单"
                            OneMonth.push(
                                <div>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Dinghuo[j-this.state.Orders.length]["Order_Amount"]}>
                                        订单-退货<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        {string}：{this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]}</Brief>
                                    </Item>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Dinghuo[j-this.state.Orders.length]["Gift_Amount"]}>
                                        订单-赠券返回<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        赠券号码：{this.state.Dinghuo[j-this.state.Orders.length]["Gift_NO"]}</Brief>
                                    </Item>
                                </div>
                            )
                        }
                    }
                }
            }
            else{
                if((moment(this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["SYS_DATE"]).format('YYYY-MM-DD') >= start) &&
                (moment(this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["SYS_DATE"]).format('YYYY-MM-DD') <= end) 
			    ){
                    let NO = this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["FF_NO"]
                    OneMonth.push(
                        <div>
                            <Item onClick = {() => this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                multipleLine extra={this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["AMTN_DKE"]}>赠券<Brief>
                                赠券时间：{moment(this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                赠券单号：{this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["FF_NO"]}
                                </Brief>
                            </Item>
                        </div>
                    )
                }
            }
            console.log(start)
            console.log(end)
            console.log(OneMonth)
        }
        let ThreeMonth = [];
        //let month_ = moment(now).format('MM');
        let start_ = moment(now).add('months',-2).add('days',-day+1).format('YYYY-MM-DD');
        console.log(start_)
        //let start_ = moment(now).add('days',-90).format('YYYY-MM-DD');
        let end_ = moment(now).format('YYYY-MM-DD');
        //封装三个月内的预收款，受订单和赠券记录
        for(let j = 0 ; j < this.state.Orders.length + this.state.Dinghuo.length + this.state.Zengquan.length; j++){
            if(j < this.state.Orders.length){
                if((moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM-DD') >= start_) &&
                (moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM-DD') <= end_) 
			    ){
                    let NO = this.state.Orders[j]["RP_NO"]
                    ThreeMonth.push(
                        <div>
                            <Item onClick = {() => this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                multipleLine extra={this.state.Orders[j]["Prepay_Total"]}>预收款<Brief>
                                交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                预收单号：{this.state.Orders[j]["RP_NO"]}
                                </Brief>
                            </Item>
                        </div>
                    )
                }
            }
            else if(j < this.state.Orders.length + this.state.Dinghuo.length){
                if((moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format('YYYY-MM-DD') >= start_) &&
                (moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format('YYYY-MM-DD') <= end_) 
			    ){
                    let NO = this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]
                    let string = ""
                    if((this.state.Dinghuo[j-this.state.Orders.length]["OS_ID"]) === "SO"){
                        if(this.state.Dinghuo[j-this.state.Orders.length]["Gift_Amount"] === 0){
                            string = "受订单"
                            ThreeMonth.push(
                                <div>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Dinghuo[j-this.state.Orders.length]["Order_Amount"]}>
                                        订单-订货<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        {string}：{this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]}</Brief>
                                    </Item>
                                </div>
                            )
                        }
                        else{
                            string = "受订单"
                            ThreeMonth.push(
                                <div>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Dinghuo[j-this.state.Orders.length]["Order_Amount"]}>
                                        订单-订货<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        {string}：{this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]}</Brief>
                                    </Item>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Dinghuo[j-this.state.Orders.length]["Gift_Amount"]}>
                                        订单-赠券使用<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        赠券号码：{this.state.Dinghuo[j-this.state.Orders.length]["Gift_NO"]}</Brief>
                                    </Item>
                                </div>
                            )
                        }
                    }
                    else{
                        if(this.state.Dinghuo[j-this.state.Orders.length]["Gift_Amount"] === 0){ 
                            string = "受订退回单"
                            ThreeMonth.push(
                                <div>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Dinghuo[j-this.state.Orders.length]["Order_Amount"]}>
                                        订单-退货<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        {string}：{this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]}</Brief>
                                    </Item>
                                </div>
                            )
                        }
                        else{
                            string = "受订退回单"
                            ThreeMonth.push(
                                <div>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Dinghuo[j-this.state.Orders.length]["Order_Amount"]}>
                                        订单-退货<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        {string}：{this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]}</Brief>
                                    </Item>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Dinghuo[j-this.state.Orders.length]["Gift_Amount"]}>
                                        订单-赠券返回<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        赠券号码：{this.state.Dinghuo[j-this.state.Orders.length]["Gift_NO"]}</Brief>
                                    </Item>
                                </div>
                            )
                        }
                    }
                }
            }
            else{
                if((moment(this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["SYS_DATE"]).format('YYYY-MM-DD') >= start) &&
                (moment(this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["SYS_DATE"]).format('YYYY-MM-DD') <= end) 
			    ){
                    let NO = this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["FF_NO"]
                    ThreeMonth.push(
                        <div>
                            <Item onClick = {() => this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                multipleLine extra={this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["AMTN_DKE"]}>赠券<Brief>
                                赠券时间：{moment(this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                赠券单号：{this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["FF_NO"]}
                                </Brief>
                            </Item>
                        </div>
                    )
                }
            }
        }
        let SixMonth = [];
        let start__ = moment(now).add('months', -5).add('days',-day+1).format('YYYY-MM-DD')
        console.log(start__)
        //let start__ = moment(now).add('days',-180).format('YYYY-MM-DD');
        let end__ = moment(now).format('YYYY-MM-DD');
        //封装半年内的预收款，受订单和赠券记录
        for(let j = 0 ; j < this.state.Orders.length + this.state.Dinghuo.length + this.state.Zengquan.length; j++){
            if(j < this.state.Orders.length){
                if((moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM-DD') >= start__) &&
                (moment(this.state.Orders[j]["SYS_DATE"]).format('YYYY-MM-DD') <= end__) 
			    ){
                    let NO = this.state.Orders[j]["RP_NO"]
                    SixMonth.push(
                        <div>
                            <Item onClick = {() => this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                multipleLine extra={this.state.Orders[j]["Prepay_Total"]}>预收款<Brief>
                                交易时间：{moment(this.state.Orders[j]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                预收单号：{this.state.Orders[j]["RP_NO"]}
                                </Brief>
                            </Item>
                        </div>
                    )
                }
            }
            else if(j < this.state.Orders.length + this.state.Dinghuo.length){
                if((moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format('YYYY-MM-DD') >= start__) &&
                (moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format('YYYY-MM-DD') <= end__) 
			    ){
                    let NO = this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]
                    let string = ""
                    if((this.state.Dinghuo[j-this.state.Orders.length]["OS_ID"]) === "SO"){
                        if(this.state.Dinghuo[j-this.state.Orders.length]["Gift_Amount"] === 0){
                            string = "受订单"
                            SixMonth.push(
                                <div>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Dinghuo[j-this.state.Orders.length]["Order_Amount"]}>
                                        订单-订货<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        {string}：{this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]}</Brief>
                                    </Item>
                                </div>
                            )
                        }
                        else{
                            string = "受订单"
                            SixMonth.push(
                                <div>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Dinghuo[j-this.state.Orders.length]["Order_Amount"]}>
                                        订单-订货<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        {string}：{this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]}</Brief>
                                    </Item>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Dinghuo[j-this.state.Orders.length]["Gift_Amount"]}>
                                        订单-赠券使用<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        赠券号码：{this.state.Dinghuo[j-this.state.Orders.length]["Gift_NO"]}</Brief>
                                    </Item>
                                </div>
                            )
                        }
                    }
                    else{
                        if(this.state.Dinghuo[j-this.state.Orders.length]["Gift_Amount"] === 0){
                            string = "受订退回单"
                            SixMonth.push(
                                <div>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Dinghuo[j-this.state.Orders.length]["Order_Amount"]}>
                                        订单-退货<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        {string}：{this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]}</Brief>
                                    </Item>
                                </div>
                            )
                        }
                        else{
                            string = "受订退回单"
                            SixMonth.push(
                                <div>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={this.state.Dinghuo[j-this.state.Orders.length]["Order_Amount"]}>
                                        订单-退货<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        {string}：{this.state.Dinghuo[j-this.state.Orders.length]["OS_NO"]}</Brief>
                                    </Item>
                                    <Item onClick = {()=> this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine extra={-this.state.Dinghuo[j-this.state.Orders.length]["Gift_Amount"]}>
                                        订单-赠券返回<Brief>交易时间：{moment(this.state.Dinghuo[j-this.state.Orders.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                        赠券号码：{this.state.Dinghuo[j-this.state.Orders.length]["Gift_NO"]}</Brief>
                                    </Item>
                                </div>
                            )
                        }
                    }
                }
            }
            else{
                if((moment(this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["SYS_DATE"]).format('YYYY-MM-DD') >= start) &&
                (moment(this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["SYS_DATE"]).format('YYYY-MM-DD') <= end) 
			    ){
                    let NO = this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["FF_NO"]
                    SixMonth.push(
                        <div>
                            <Item onClick = {() => this.detail(NO)} thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                multipleLine extra={this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["AMTN_DKE"]}>赠券<Brief>
                                赠券时间：{moment(this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["SYS_DATE"]).format("YYYY-MM-DD")}{"                        ".replace(/ /g, "\u00a0")}
                                赠券单号：{this.state.Zengquan[j - this.state.Orders.length - this.state.Dinghuo.length]["FF_NO"]}
                                </Brief>
                            </Item>
                        </div>
                    )
                }
            }
        }
        return(
            <div>
                <NavBar mode="dark" icon={<Icon type="left" onClick = {this.handleBack}/>}
                    >对账报表
                </NavBar>
                <hr></hr>
                <List>
                    <Item>您选择的查询客户是{this.props.countState["chosenCustomer"]}</Item>
                    <Result title="余额" message={<div>{total}元</div>}/>
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
export default connect(mapStateToProps,mapDispatchToProps)(DuizhangBaobiao);