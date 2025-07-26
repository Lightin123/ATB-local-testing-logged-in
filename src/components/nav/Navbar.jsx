import {Button} from "../ui/button.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import { useEffect } from 'react';
import logo from '/assets/ATBlogo.jpg';
import Header from "./Header.jsx";
import {
    Building2,
    BuildingIcon,
    CalendarIcon,
    CircleDollarSignIcon,
    DrillIcon,
    HomeIcon, MessageCircleMoreIcon,
    UserIcon,
    Mail,
    Upload
} from "lucide-react";
import { useSelector} from "react-redux";
import {usePrefetch} from "../../services/api/authApi.js"
import {useGetUserQuery} from "../../services/api/userApi.js";

const items = [
    {
        title: 'Home',
        url: '/',
        icon: <HomeIcon/>,
        section: "MENU",
    },
    {
        title: 'Properties',
        url: '/properties',
        icon: <Building2/>,
        section: "MENU"
    },
    {
        title: 'Rentals',
        url: '/rentals',
        icon: <BuildingIcon/>,
        section: "MENU"
    },
    {
        title: 'Financials',
        url: '/financials',
        icon: <CircleDollarSignIcon/>,
        section: "MENU"
    },
    {
        title: 'Tenants',
        url: '/tenants',
        icon: <UserIcon/>,
        section: "MENU"
    },
    {
        title: 'Service Requests',
        url: '/maintenance',
        icon: <DrillIcon/>,
        section: "MENU"
    },
    {
        title: 'Messages',
        url: '/messages',
        icon: <MessageCircleMoreIcon/>,
        section: "PERSONAL"
    },
    {
        title: 'Calendar',
        url: '/calendar',
        icon: <CalendarIcon/>,
        section: "PERSONAL"
    },
    {
        title: 'Contact Us',
        url: '/contact',
        icon: <Mail/>,
        section: "MENU"
    },
    {
        title: 'Whitelist Upload',
        url: '/admin/upload',
        icon: <Upload/>,
        section: "MENU"
    },
    {
        title: 'Admin Maintenance',
        url: '/admin/maintenance',
        icon: <DrillIcon/>,
        section: "MENU"
    }
]

// eslint-disable-next-line react/prop-types
const Navbar = ({children}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const authSlice = useSelector(state => state.authSlice);
    const userRole = authSlice.userInfo?.role;

    const {isLoading: userIsLoading} = useGetUserQuery();

    // use prefetch on user, properties API
    const prefetchProperties = usePrefetch("getProperties")
    const prefetchUser = usePrefetch("getUser")
    const prefetchUnits = usePrefetch("getUnits")
    const prefetchTenants = usePrefetch("getTenants")
    const prefetchLeases = usePrefetch("getLeases")
    const prefetchPayments = usePrefetch("getPayments")
    const prefetchMessages = usePrefetch("getMessages")
    const prefetchMaintenance = usePrefetch("getMaintenanceReports")
    const prefetchExpenses = usePrefetch("getExpenses")

    prefetchUser();
    prefetchProperties();
    prefetchUnits();
    prefetchTenants();
    prefetchLeases();
    prefetchMessages();
    prefetchPayments();
    // prefetch maintenance reports only once after mount
    useEffect(() => {
        prefetchMaintenance();
    }, [prefetchMaintenance]);
    prefetchExpenses();

    let filteredItems = items.map(i => ({ ...i }));

    if (userRole === 'ADMIN') {
        filteredItems = filteredItems.map(item =>
            item.title === 'Properties' ? { ...item, title: 'Manage Properties' } : item
        );
    } else {
        filteredItems = filteredItems.filter(
            item => item.title !== 'Financials' && item.title !== 'Whitelist Upload' && item.title !== 'Admin Maintenance'
        );
    }

    if (['TENANT', 'OWNER'].includes(userRole)) {
        const allowed = ['Home', 'Properties', 'Service Requests', 'Messages', 'Calendar', 'Contact Us'];
        filteredItems = filteredItems.filter(item => allowed.includes(item.title));
    }

    function getNavItems(section) {
        return filteredItems.filter(item => item.section === section);
    }

    // If user is not logged in, but we are still waiting for the API (/user) to respond, show a loading spinner
    if (!authSlice.accessToken || userIsLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin"></div>
            </div>
        )
    }
    // Different nav button variant depending on if the current page is active or not
    function getNavButtonVariant(url) {
        if (url === "/") {
            return location.pathname === url ? "nav-button-active" : "nav-button";
        }

        return location.pathname.includes(url) ? "nav-button-active" : "nav-button";
    }


    const NavBar = () => {
        return (
            <div
                className="
    fixed inset-0 left-0 z-50
    flex flex-col justify-between
    border-border
    w-full md:w-56
    bg-background-light
    rounded-r-lg
  "
            >
                <div>
                    <div className="px-6 py-4 flex items-center">
                        <img src={logo} alt="ATB Logo" className="h-12 w-auto" />
                    </div>
                    <nav
                        className="hidden md:flex flex-col mt-5 gap-y-2">
                        <p className="text-muted-foreground font-500 mx-2 uppercase">
                            MENU
                        </p>
                        <div className="flex flex-col gap-2 mx-2">
                            {getNavItems("MENU").map((item, index) => (
                                <Button variant={getNavButtonVariant(item.url)} className="w-full justify-start flex gap-2" key={index}
                                        onClick={() => navigate(item.url)}>
                                    {item.icon}
                                    {item.title}
                                </Button>
                                )
                            )}

                        </div>
                        <p className="text-muted-foreground font-500 mx-2 mt-2 uppercase">
                            PERSONAL
                        </p>
                        <div className="flex flex-col gap-2 mx-2">
                            {getNavItems("PERSONAL").map((item, index) => (
                                    <Button variant={getNavButtonVariant(item.url)} className="w-full justify-start flex gap-2" key={index}
                                            onClick={() => navigate(item.url)}>
                                        {item.icon}
                                        {item.title}
                                    </Button>
                                )
                            )}
                        </div>

                    </nav>

                    <nav className="md:hidden flex flex-col justify-center items-center gap-y-1">
                        {filteredItems.map((item, index) => (
                            <Button key={index} variant={getNavButtonVariant(item.url)} size="icon"
                                    className="justify-center items-center"
                                    onClick={() => navigate(item.url)}>
                                {item.icon}
                            </Button>
                        ))}

                    </nav>
                </div>

            </div>
        )
    }

    return (
        <div className="grid grid-cols-[250px_minmax(0,1fr)] h-screen bg-white">
            <NavBar/>
            <main className="min-w-0 w-full flex-1 bg-white overflow-auto p-6 text-lg">
                <Header/>
                <div className="p-4 bg-background-light rounded-lg border-border border-2">
                    {children}
                </div>
            </main>
        </div>)
}

export default Navbar;