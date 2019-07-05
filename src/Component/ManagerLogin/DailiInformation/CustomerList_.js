import React from 'react';
import { connect } from 'react-redux'
import {NavBar,Icon,List} from 'antd-mobile'
import getPinYinFirstCharacter from './convert'
import axios from 'axios'
const Item = List.Item;
const Brief = Item.Brief;
//store all the customer list for the chosen Dali by the chosen worker
class CustomerList_ extends React.Component{
    constructor(){
        super()
        this.state = {
            Customer:[],
            CustomerList:[],
        }
        this.handleClick = this.handleClick.bind(this);
        this.sortChinese = this.sortChinese.bind(this);
        this.getData = this.getData.bind(this);
    }
    componentDidMount(){
        this.getData()
    }

    getData(){
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
					Customer:response.data
                })
                console.log(this_.state.Customer)
			})
			.catch(function(error){
				console.log(error);
			});

	}


    handleClick(i){
        this.props.history.push("/CustomerDetail")
    }
    handleBack = () =>{
        this.props.history.push('/MyDaili')
    }
    sortChinese(arr){
        arr.sort(function(item1,item2){
            return item1.localeCompare(item2,'zh-CN');
        })
    }
    render(){
        let items = [];
        var flag = '';
        for(let a = 0; a < this.state.Customer.length; a++){
            if(this.state.Customer[a]["CUS_NAME"] === this.props.countState["chosenCustomer"]){
                flag = this.state.Customer[a]["CUS_NO"]
            }
        }


        let CustomerList = [];
        let CustomerCopy = [];
        for(let i = 0 ; i < this.state.Customer.length; i++){
            if(this.state.Customer[i]["CUS_UP"] === flag){
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
        console.log(this.props.countState["chosenCustomer"]);
        if(CustomerList.length > 0){
            flag = getPinYinFirstCharacter(CustomerList[0],"",true);
            console.log(flag);
            items.push(
                <div className = "item">
                <List renderHeader={() => getPinYinFirstCharacter(CustomerList[0],"",true)} className="my-list">
                <Item thumb="/contact.jpg" multipleLine extra={CustomerCopy[0]["CUS_NO"]}>
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
                     <Item thumb="/contact.jpg" multipleLine extra={CustomerCopy[i]["CUS_NO"]}>
                        {CustomerList[i]}<Brief>客户电话： {CustomerCopy[i]["CUS_TEL"]}</Brief>
                    </Item>
                </List>
                </div>
                )
            }else{
                items.push(
                    <div className = "item">
                    <List renderHeader={() => a} className="my-list">
                         <Item thumb="/contact.jpg" multipleLine extra={CustomerCopy[i]["CUS_NO"]}>
                            {CustomerList[i]}<Brief>客户电话： {CustomerCopy[i]["CUS_TEL"]}</Brief>
                        </Item>
                    </List>
                    </div>
                )
                flag = a;
            }
        }
        return(
            <div>
                <NavBar
                mode="dark" icon={<Icon type="left" onClick={this.handleBack} />}
                >管理您的客户</NavBar>
                <hr></hr>
                <div>
                    {items}
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
export default connect(mapStateToProps,mapDispatchToProps)(CustomerList_);