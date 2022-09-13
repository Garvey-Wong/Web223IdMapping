import { Button, Col, Row } from 'antd'
import React, { PureComponent } from 'react'
import { FLUENT_STATE_DISCONNECTED, FLUENT_STATE_CONNECTING, FLUENT_STATE_CONNECTED } from '../ContextContainer'
import contractWeb223IdMapping from '../lib/ContractWeb223IdMapping'

export default class ConfluxFluent extends PureComponent {

  connectConfluxFluent = async () => {
    contractWeb223IdMapping.init()
    this.props.changeStatus(FLUENT_STATE_CONNECTING)
    const response = await window.conflux.send("cfx_requestAccounts")
    const account = response.result[0]
    this.props.changeStatus(FLUENT_STATE_CONNECTED)
    this.props.changeAccount(account)
  }


  renderFluentButton = () => {
    if (this.props.status === FLUENT_STATE_CONNECTED) {
      return (
        <Button>
          钱包已连接
        </Button>
      )
    } else if (this.props.status === FLUENT_STATE_CONNECTING) {
      return (
        <Button type="primary" loading>
          连接中...
        </Button>
      )
    } else {
      return (
        <Button type="primary" onClick={this.connectConfluxFluent}>
          请连接钱包
        </Button>
      )
    }
  }

  renderConnectedAccount = () => {
    if (this.props.status === FLUENT_STATE_CONNECTED) {
      return (
        <div>
          <div>连接到账户: <code>{this.props.account}</code></div>
        </div>
      )
    }
    return null
  }

  render() {
    return (
      <Row gutter={24}>
        <Col className='gutter-row' span={20}>
          {this.renderConnectedAccount()}
        </Col>
        <Col className="gutter-row" span={4} >
          {this.renderFluentButton()}
        </Col>
      </Row>
    )
  }
}
