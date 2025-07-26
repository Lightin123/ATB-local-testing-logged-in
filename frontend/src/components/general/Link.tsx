import { Button } from "../ui/button.js";
import { LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { makeSelectObjectById } from "../../services/slices/objectSlice.js"; // <-- important: import the FACTORY
import { Tenant } from "../../utils/classes.ts";

function getTenantName(tenant: Tenant) {
    if (!tenant || !tenant.firstName || !tenant.lastName) return null;
    return `${tenant.firstName} ${tenant.lastName}`;
}

const makeSelectLinkData = (id, type) =>
    createSelector(
        makeSelectObjectById(id, type), // <-- this is a selector!
        object => {
            let label, link;
            switch (type) {
                case "unit":
                    label = object?.unitIdentifier || `Unit ${id}`;
                    link = `/rentals/${id}`;
                    break;
                case "tenant":
                    label = getTenantName(object) || `Tenant ${id}`;
                    link = `/tenants/${id}`;
                    break;
                case "lease":
                    label = `Lease ${id}`;
                    link = `/leases/${id}`;
                    break;
                case "property":
                    label = object?.title || `Property ${id}`;
                    link = `/properties/${id}`;
                    break;
                default:
                    label = `#${id}`;
                    link = "";
            }
            return { label, link };
        }
    );

const Link = ({ type, id, ...props }) => {
    const navigate = useNavigate();
    // Build a selector for this id/type
    const selector = useMemo(() => makeSelectLinkData(id, type), [id, type]);
    const { label, link } = useSelector(selector);

    return (
        <Button
            className="pl-0 text-foreground group"
            variant="link"
            onClick={() => navigate(link)}
            {...props}
        >
            <LinkIcon className="w-4 h-4 mr-1 transform transition-transform duration-300 group-hover:rotate-[180deg]" />
            {label}
        </Button>
    )
}

export default Link;
