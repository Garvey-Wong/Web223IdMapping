import React, { Component, Fragment } from "react";
import { Link, Route } from "react-router-dom";
import { Layout, Row, Col } from "antd"

const { Header, Content, Footer } = Layout

class Home extends Component {
    render() {
        return (
            <Fragment>
                <Header>
                    <Row gutter={12}>
                        <Col className='gutter-row' span={3}>
                            <Link to="/org">机构端</Link>
                        </Col>
                        <Col className='gutter-row' span={3}>
                            <Link to="/person">用户端</Link>
                        </Col>
                    </Row>
                </Header>

                <Content>
                    {renderRoutes(this.props.routes || [])}
                </Content>

                <Footer>@Copyright Niubee-Group</Footer>
            </Fragment>
        );
    }
}

const renderRoutes = (routerConfig) =>
    routerConfig.map(({ component: Component, children, ...routeProps }) =>
        <Route {...routeProps} render={(props) => <Component {...props} routes={children} />} />
    )

export default Home