import React from 'react';
import { connect } from 'react-redux'
import {NavBar,Icon,List,Button, WhiteSpace, WingBlank} from 'antd-mobile'
import getPinYinFirstCharacter from './convert'
import axios from 'axios'
const Item = List.Item;
const Brief = Item.Brief;
//store all the information for the Dali for current log-in worker
class DailiList extends React.Component{
    constructor(){
        super()
        this.state = {
            Customer:[],
            //CustomerNameList:[],
            CORRE_SALE:'',

        }
        this.handleClick = this.handleClick.bind(this);
        this.sortChinese = this.sortChinese.bind(this);
        this.handleArea = this.handleArea.bind(this);
        this.handleName = this.handleName.bind(this);
        this.getData = this.getData.bind(this);
        this.getData_ = this.getData_.bind(this);
    }
    componentDidMount(){
        this.getData();
        this.getData_();
    }


    getData_(){
        var this_ = this;
		let user = this_.props.countState["userName"];
		let password = this_.props.countState["passWord"];
		let url = "http://192.168.2.54:5000/allcust?username=" + user + "&password=" + password;
		console.log(url);
		axios.get(url)
			.then(function(response){
				//let data = response.data
				console.log(response.data)
				this_.setState({
					Customer : response.data
				})
			})
			.catch(function(error){
				console.log(error);
			});
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
					CORRE_SALE: response.data["CORRE_SALE"]
				})
			})
			.catch(function(error){
				console.log(error);
			});
    }



    handleClick(name){
        const{countDispatch} = this.props;
        countDispatch.setCustomer(name);
        this.props.history.push("/MyDaili")
        console.log(this.props.countState)
        console.log(name)
    }

    handleBack = () =>{
        this.props.history.push('/ManagerPage')
    }
    sortChinese(arr){
        arr.sort(function(item1,item2){
            return item1.localeCompare(item2,'zh-CN');
        })
    }
    render(){
        let items = [];
        let items_ = [];
        console.log(this.state);
        let CustomerList = [];
        let CustomerCopy = [];

        let CustomerList_ = [];
        let CustomerCopy_ = [];

        for(let i = 0 ; i < this.state.Customer.length; i++){
            if(this.state.Customer[i]["SAL"] === this.props.countState["userName"]){
                CustomerList.push(this.state.Customer[i]["CUS_NAME"]);
            }
        }
        this.sortChinese(CustomerList);
        for(let j = 0 ; j < CustomerList.length; j++){
            for(let i = 0 ; i < this.state.Customer.length; i++){
                if(this.state.Customer[i]["CUS_NAME"] === CustomerList[j]){
                    CustomerCopy.push(this.state.Customer[i]);
                }   
            }
        }
        var temp = [];
        for(let i = 0 ; i < this.state.Customer.length; i++){
            if(this.state.Customer[i]["SAL"] === this.props.countState["userName"]){
                CustomerList_.push(this.state.Customer[i]["AREA_NAME"]);
                temp.push(this.state.Customer[i]);
            }
        }
        this.sortChinese(CustomerList_);
        var temp_ = []
        for(let j = 0;j < CustomerList_.length; j++){
            for(let i = 0 ; i < temp.length; i++){
                if(temp[i]["AREA_NAME"] === CustomerList_[j]){
                    console.log(temp[i]["CUS_NAME"])
                    temp_.push(temp[i]);
                }   
            }
        }
        for(var i in temp_){
            if(CustomerCopy_.indexOf(temp_[i]) === -1)
                CustomerCopy_.push(temp_[i]);
        }
        console.log(CustomerCopy_)


        console.log(this.props.countState);
        if(CustomerList.length > 0){
            var flag = getPinYinFirstCharacter(CustomerList[0],"",true);
            console.log(flag);
            items.push(
                <div className = "item">
                <List renderHeader={() => getPinYinFirstCharacter(CustomerList[0],"",true)} className="my-list">
                <Item onClick = {()=>this.handleClick(CustomerList[0].toString())} thumb="/contact.jpg" multipleLine extra={CustomerCopy[0]["CUS_NO"]}>
                    {CustomerList[0]}<Brief>客户电话： {CustomerCopy[0]["CUS_TEL"]}</Brief>
                </Item>
                </List>
                </div>
            )
        }
        for(let i = 1 ; i < CustomerList.length; i++){
            let a = getPinYinFirstCharacter(CustomerList[i],"",true);
            if(a === flag){
                items.push(
                <div className = "item">
                <List className="my-list">
                     <Item onClick = {()=>this.handleClick(CustomerList[i].toString())} thumb="/contact.jpg" multipleLine extra={CustomerCopy[i]["CUS_NO"]}>
                        {CustomerList[i]}<Brief>客户电话： {CustomerCopy[i]["CUS_TEL"]}</Brief>
                    </Item>
                </List>
                </div>
                )
            }else{
                items.push(
                    <div className = "item">
                    <List renderHeader={() => a} className="my-list">
                         <Item onClick = {()=>this.handleClick(CustomerList[i].toString())} thumb="/contact.jpg" multipleLine extra={CustomerCopy[i]["CUS_NO"]}>
                            {CustomerList[i]}<Brief>客户电话： {CustomerCopy[i]["CUS_TEL"]}</Brief>
                        </Item>
                    </List>
                    </div>
                )
                flag = a;
            }
        }


        if(CustomerList_.length > 0){
            var flag_ = getPinYinFirstCharacter(CustomerList_[0],"",true);
            console.log(flag_);
            items_.push(
                <div className = "item_">
                <List renderHeader={() => CustomerList_[0]} className="my-list_">
                <Item  onClick = {()=>this.handleClick(CustomerCopy_[0]["CUS_NAME"].toString())} thumb="/contact.jpg" multipleLine extra={CustomerCopy_[0]["CUS_NO"]}>
                    {CustomerCopy_[0]["CUS_NAME"]}<Brief>客户电话： {CustomerCopy_[0]["CUS_TEL"]}</Brief>
                </Item>
                </List>
                </div>
            )
        }
        for(let i = 1 ; i < CustomerList_.length; i++){
            let a = getPinYinFirstCharacter(CustomerList_[i],"",true);
            if(a === flag_){
                items_.push(
                <div className = "item_">
                <List className="my-list_">
                     <Item onClick = {()=>this.handleClick(CustomerCopy_[i]["CUS_NAME"].toString())} thumb="/contact.jpg" multipleLine extra={CustomerCopy_[i]["CUS_NO"]}>
                        {CustomerCopy_[i]["CUS_NAME"]}<Brief>客户电话： {CustomerCopy_[i]["CUS_TEL"]}</Brief>
                    </Item>
                </List>
                </div>
                )
            }else{
                items_.push(
                    <div className = "item_">
                    <List renderHeader={() => CustomerList_[i]} className="my-list_">
                         <Item onClick = {()=>this.handleClick(CustomerCopy_[i]["CUS_NAME"].toString())} thumb="/contact.jpg" multipleLine extra={CustomerCopy_[i]["CUS_NO"]}>
                            {CustomerCopy_[i]["CUS_NAME"]}<Brief>客户电话： {CustomerCopy_[i]["CUS_TEL"]}</Brief>
                        </Item>
                    </List>
                    </div>
                )
                flag_ = a;
            }
        }



        return(
            <div>
                <NavBar
                mode="dark" icon={<Icon type="left" onClick={this.handleBack} />}
                >代理商列表</NavBar>
                <hr></hr>
                <WhiteSpace />
                <WingBlank>
                <Button type="primary" inline size="medium" style={{ marginRight: '100px' }} onClick = {this.handleName}>按名称显示</Button>
                <Button type="primary" inline size="medium" style={{ marginRight: '0px' }} onClick = {this.handleArea}>按区域显示</Button>
                </WingBlank>
                <WhiteSpace />
                <div id = "name" style = {{display:""}}>
                    {items}
                </div>
                <div id = "area" style = {{display:"none"}}>
                    {items_}
                </div>
            </div>
        )
    }
    handleName(){
        let name = document.getElementById("name");
        let area = document.getElementById("area");
        area.style.display = "none"
        if(name.style.display === "none"){
            name.style.display = "";
        }
    }
    handleArea(){
        let area = document.getElementById("area");
        let name = document.getElementById("name");
        name.style.display = "none"
        if(area.style.display === "none"){
            area.style.display = "";
        }
    }
}
const mapStateToProps = (state) =>({
	countState: state.count
})
const mapDispatchToProps = (dispatch) =>({
	countDispatch: dispatch.count
})
export default connect(mapStateToProps,mapDispatchToProps)(DailiList);