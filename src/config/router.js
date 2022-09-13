import Home from "../views/Home/Home"
import OrganizationHome from "../views/OrganizationHome/OrganizationHome"
import MemberHome from "../views/MemberHome/MemberHome"

const routerConfig = [{
    path: "/",
    component: Home,
    children: [{
        path: "/org",
        component: OrganizationHome
    },{
        path: "/person",
        component: MemberHome
    }]
}]

export default routerConfig