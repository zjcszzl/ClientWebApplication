import React from 'react';
import {Button, WhiteSpace,NavBar,Icon,WingBlank,Picker,DatePicker,List,InputItem} from 'antd-mobile';
import { connect } from 'react-redux'
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const Item = List.Item;
const ProductType = [{label:'Product A',value:'Product A'},{label:'Product B',value:'Product B'},{label:'Product C',value:'Product C'}];
const StorageType = [{label:'第一仓库',value:'第一仓库'},{label:'第二仓库',value:'第二仓库'},{label:'第三仓库',value:'第三仓库'}];
//request for product for dali shang 
class OrderProduct extends React.Component{
    state = {
        NeedDate: now,
        Product:null,
        Storage:null,
        Quantity:0,
        Other:Text
    }
    handleBack = () =>{
        this.props.history.push('/CustomerPage')
    }
    render(){
        //console.log(this.props.countState)
        return(
            <div>
                <NavBar mode="dark" icon={<Icon type="left" onClick = {this.handleBack}/>}
                >客户要货申请系统
                </NavBar>
                <hr></hr>
                <List>
                    <Item>您好: {this.props.countState["userName"]}</Item>
                    <DatePicker
                    mode = "date"
                    title = "Select Date"
                    extra = "Optional"
                    value = {this.state.NeedDate}
                    onChange = {NeedDate => this.setState({NeedDate})}>
                    <List.Item arrow = "horizontal">要货日期</List.Item>
                    </DatePicker>
                    <Picker 
                        data={ProductType} 
                        cols={1} 
                        value = {this.state.Product}
                        onChange={v => this.setState({Product:v})}
                        onOk = {v=>this.setState({Product:v})}>
                        <List.Item arrow="horizontal">货品类型</List.Item>
                    </Picker>
                    <Picker 
                        data={StorageType} 
                        cols={1} 
                        value = {this.state.Storage}
                        onChange={v => this.setState({Storage:v})}
                        onOk = {v=>this.setState({Storage:v})}>
                        <List.Item arrow="horizontal">库位选择</List.Item>
                    </Picker>
                    <InputItem  id = "quantity" type = "number" onChange = {Quantity => this.setState({Quantity})} >
						数量(Kg)
                    </InputItem>
                    <InputItem id = "other" type = "text" onChange = {Other => this.setState({Other})}>
						备注
					</InputItem>
                </List>
                <hr></hr>
                <WingBlank>
                <Button type = "primary" onClick={this.handleSubmit}>提交</Button><WhiteSpace />
                </WingBlank>
            </div>
        )
    }
    handleSubmit = () =>{
        window.alert(this.props.countState["userName"] + "，您已成功提交订单")
    }
}
const mapStateToProps = (state) =>({
	countState: state.count
})
export default connect(mapStateToProps)(OrderProduct);