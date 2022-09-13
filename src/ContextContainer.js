import { BrowserRouter, Switch, Route, } from "react-router-dom";
import React, { Component } from "react";
import ConfluxFluent from "./components/ConfluxFluent";
import Home from "./views/Home/Home";
import OrganizationHome from "./views/OrganizationHome/OrganizationHome";
import MemberHome from "./views/MemberHome/MemberHome";

export const FLUENT_STATE_DISCONNECTED = 0
export const FLUENT_STATE_CONNECTING = 1
export const FLUENT_STATE_CONNECTED = 2

class ContextContainer extends Component {
    state = {
        status: FLUENT_STATE_DISCONNECTED,
        connecting: false,
        account: '',
        allOrgNames: [],
    }

    changeStatus = (newVale) => {
        this.setState({
            status: newVale
        })
    }

    changeConnecting = (newVale) => {
        this.setState({
            connecting: newVale
        })
    }

    changeAccount = (newVale) => {
        this.setState({
            account: newVale
        })
    }

    render() {
        return (
            <div>
                <ConfluxFluent status={this.state.status} changeStatus={this.changeStatus.bind(this)}
                    connecting={this.state.connecting} changeConnecting={this.changeConnecting.bind(this)}
                    account={this.state.account} changeAccount={this.changeAccount.bind(this)} />


                <BrowserRouter>
                    {renderRoutes([
                        {
                            path: "/",
                            component: Home,
                            children: [{
                                path: "/org",
                                component: () => <OrganizationHome status={this.state.status} />,
                            }, {
                                path: "/person",
                                component: () => <MemberHome status={this.state.status} />,
                            }]
                        }
                    ])}

                </BrowserRouter>

            </div>
        )
    }
}

const renderRoutes = (routerConfig) =>
    routerConfig.map(({ component: Component, children, ...routeProps }) =>
        <Route {...routeProps} render={(props) => <Component {...props} routes={children} />} />
    )



export default ContextContainer;