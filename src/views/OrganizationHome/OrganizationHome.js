import React, { PureComponent } from 'react'
import { format } from 'js-conflux-sdk';
import contractWeb223IdMapping from "../../lib/ContractWeb223IdMapping"
import { FLUENT_STATE_CONNECTED } from '../../ContextContainer';
import { Card, Select, Tag, Input, Button } from 'antd';
import { UserOutlined, CodeOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

class OrganizationHome extends PureComponent {

    state = {
        code: '',
        codes: '',
        orgName: '',
        regOrgName: '',
        members: [],
        pendingAdmin: '',
        allOrgNames: [],
        managedOrgNames: [],
    }

    callAddAdmin = async () => {
        const result = await contractWeb223IdMapping.addAdmin(this.state.orgName, this.state.pendingAdmin);
        console.log(result)
        alert("Success!")
    }


    callPutCode = async () => {
        const hashedCode = format.keccak256(this.state.code).toString('hex');
        console.log("hashedcode=" + hashedCode)
        const result = await contractWeb223IdMapping.putCode(this.state.orgName, hashedCode);
        console.log(result)
        alert("Success!")
    }

    callPutCodes = async () => {
        const codes = this.state.codes.split(',');
        const hashedCodes = [];
        for (let code in codes) {
            const hashedCode = format.keccak256(code).toString('hex');
            hashedCodes.push(hashedCode);
            console.log("hashedcode=" + hashedCode);
        }
        const result = await contractWeb223IdMapping.putCodes(this.state.orgName, hashedCodes);
        console.log(result)
        alert("Success!")
    }

    callGetAllOrgNames = async () => {
        const names = await contractWeb223IdMapping.getAllOrgNames();
        console.log('all org:', names)
        this.setState({ allOrgNames: names });
    }

    callGetManagedOrgNames = async () => {
        const names = await contractWeb223IdMapping.getManagedOrgNames();
        console.log(names)
        this.setState({ managedOrgNames: names });
    }

    callGetMembers = async () => {
        const members = await contractWeb223IdMapping.getMembers(this.state.orgName);
        console.log('get members from ' + this.state.orgName + ': ' + members)
        this.setState({ members: members });
    }

    callOrgRegister = async () => {
        const result = await contractWeb223IdMapping.orgRegister(this.state.regOrgName);
        console.log(result)
        alert("Success!")
        this.callGetAllOrgNames();
        this.callGetManagedOrgNames()
    }

    handleOrgName = (event) => {
        this.setState({ orgName: event.target.value });
    }

    handleRegOrgName = (event) => {
        this.setState({ regOrgName: event.target.value })
    }

    handleCode = (event) => {
        this.setState({ code: event.target.value });
    }

    handleCodes = (event) => {
        this.setState({ codes: event.target.value });
    }

    handlePendingAdmin = (event) => {
        this.setState({ pendingAdmin: event.target.value });
    }

    onSelectOrgChange = (value) => {
        this.setState({ orgName: value });
        console.log(`selected ${value}`);

        this.callGetMembers();
    };

    componentDidMount() {
        if (this.props.status === FLUENT_STATE_CONNECTED) {
            this.callGetAllOrgNames();
            this.callGetManagedOrgNames();
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
        var regOrgName = this.state.regOrgName;
        return (
            <div>
                <Card>?????????????????????
                    {
                        (this.state.allOrgNames || []).map((name, index) => <Tag color="geekblue" key={'all_org_' + index}>{name}</Tag>)
                    }
                </Card>
                <Card>??????????????????????????????
                    {
                        (this.state.managedOrgNames || []).map((name, index) => <Tag color="geekblue" key={'managed_org_' + index}>{name}</Tag>)
                    }
                </Card>
                <Card>??????????????????
                    <Input.Group compact>
                        <Input style={{ width: 'calc(100% - 200px)' }} placeholder="???????????????" value={regOrgName} onChange={this.handleRegOrgName} prefix={<CodeOutlined />} />
                        <Button type="primary" onClick={this.callOrgRegister}>??????</Button>
                    </Input.Group>
                </Card>
                <Card>??????????????????????????????
                    <Select
                        showSearch
                        placeholder="????????????"
                        optionFilterProp="children"
                        onChange={this.onSelectOrgChange}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    >
                        {
                            (this.state.managedOrgNames || []).map((name, index) => <Option key={'select_org_' + index} value={name}>{name}</Option>)
                        }
                    </Select>

                    {this.state.orgName ? this.renderSubMenu() : null}
                </Card>

            </div>
        );
    };

    renderSubMenu = () => {
        var code = this.state.code;
        var codes = this.state.codes;
        var pendingAdmin = this.state.pendingAdmin;
        return (
            <Card title={this.state.orgName}>
                <Card>
                    <Input.Group compact>
                        <Input style={{ width: 'calc(100% - 200px)' }} placeholder="?????????????????????" value={pendingAdmin} onChange={this.handlePendingAdmin} prefix={<UserOutlined />} />
                        <Button type="primary" onClick={this.callAddAdmin}>???????????????</Button>
                    </Input.Group>
                </Card>
                <Card>
                    <Input.Group compact>
                        <Input style={{ width: 'calc(100% - 200px)' }} placeholder="???????????????" value={code} onChange={this.handleCode} prefix={<CodeOutlined />} />
                        <Button type="primary" onClick={this.callPutCode}>???????????????</Button>
                    </Input.Group>
                </Card>
                <Card>
                    <TextArea
                        placeholder="???????????????????????????????????????"
                        autoSize={{ minRows: 2, maxRows: 10 }}
                        onChange={this.handleCodes}
                        value={codes}
                    />
                    <Button type="primary" onClick={this.callPutCodes}>?????????????????????</Button>
                </Card>
                <Card title='??????????????????'>
                    {
                        (this.state.members || []).map((name, index) => <Tag color="geekblue" key={'members_' + index}>{name}</Tag>)
                    }
                </Card>
            </Card>
        );
    }
}

export default OrganizationHome