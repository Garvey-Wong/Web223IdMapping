import React, { Component } from 'react'
import contractWeb223IdMapping from "../../lib/ContractWeb223IdMapping"
import { Card, Select, Tag, Input, Button } from 'antd';
import { FLUENT_STATE_CONNECTED } from '../../ContextContainer';
import { UserOutlined, CodeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

class MemberHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',

            regOrgName: '',
            joinedOrgs: [],
            allOrgNames: [],

            queryOrgName: '',
            queryAddr: '',
            showQueryResult: false,
            queryResult: false,
        }
    }

    handleCode = (event) => {
        this.setState({ code: event.target.value });
    }

    onSelectRegOrgChange = (value) => {
        this.setState({ regOrgName: value })
    }

    onSelectQueryOrgChange = (value) => {
        this.setState({ queryOrgName: value, showQueryResult: false })
    }

    handleQueryAddr = (event) => {
        this.setState({ queryAddr: event.target.value, showQueryResult: false });
    }

    callRegister = async () => {
        const result = await contractWeb223IdMapping.memberRegister(this.state.regOrgName, this.state.code);
        console.log(result)
        alert("Success!")
        this.callGetJoinedOrgs();
    }

    callVerify = async () => {
        const result = await contractWeb223IdMapping.verify(this.state.queryOrgName, this.state.queryAddr);
        console.log(result)
        this.setState({ showQueryResult: true, queryResult: result })
    }

    callGetJoinedOrgs = async () => {
        const orgs = await contractWeb223IdMapping.getJoinedOrgs();
        console.log(orgs);
        this.setState({ joinedOrgs: orgs });
    }

    callGetAllOrgNames = async () => {
        const names = await contractWeb223IdMapping.getAllOrgNames();
        console.log('all org:', names)
        this.setState({ allOrgNames: names });
    }

    componentDidMount() {
        if (this.props.status === FLUENT_STATE_CONNECTED) {
            this.callGetJoinedOrgs();
            this.callGetAllOrgNames();
        }
    }

    render() {
        return (
            <div>
                {this.props.status === FLUENT_STATE_CONNECTED ? this.renderMenu() : <div></div>}
            </div>
        );
    }

    renderMenu = () => {
        var code = this.state.code;
        var queryAddr = this.state.queryAddr;
        return (
            <div>
                <Card>??????????????????????????????
                    {
                        (this.state.joinedOrgs || []).map((name, index) => <Tag color="geekblue" key={'joined_org_' + index}>{name}</Tag>)
                    }
                </Card>
                <Card>?????????????????????
                    <Input.Group compact>
                        <Select
                            showSearch
                            placeholder="????????????"
                            optionFilterProp="children"
                            onChange={this.onSelectRegOrgChange}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                (this.state.allOrgNames || []).map((name, index) => <Option key={'select_reg_org_' + index} value={name}>{name}</Option>)
                            }
                        </Select>
                        <Input style={{ width: 'calc(100% - 400px)' }} placeholder="???????????????" value={code} onChange={this.handleCode} prefix={<CodeOutlined />} />
                        <Button type="primary" onClick={this.callRegister}>??????</Button>
                    </Input.Group>
                </Card>
                <Card>??????????????????????????????
                    <Input.Group compact>
                        <Select
                            showSearch
                            placeholder="????????????"
                            optionFilterProp="children"
                            onChange={this.onSelectQueryOrgChange}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                (this.state.allOrgNames || []).map((name, index) => <Option key={'select_query_org_' + index} value={name}>{name}</Option>)
                            }
                        </Select>
                        <Input style={{ width: 'calc(100% - 400px)' }} placeholder="????????????" value={queryAddr} onChange={this.handleQueryAddr} prefix={<UserOutlined />} />
                        <Button type="primary" onClick={this.callVerify}>??????</Button>
                    </Input.Group>
                    {this.state.showQueryResult ? (this.state.queryResult ? <div>???????????????<CheckCircleOutlined /></div> : <div>???????????????<CloseCircleOutlined /></div>) : null}
                </Card>
            </div>
        );
    }
}

export default MemberHome