import {Boxes, Building2, LinkIcon, MoreHorizontal, Pencil, Plus, Trash2} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "../ui/dropdown-menu.tsx";
import {useNavigate, Link} from "react-router-dom";
import {RealEstateType} from "../../utils/magicNumbers.jsx";
import {useDeletePropertyMutation} from "../../services/api/propertyApi.ts";
import { toast } from "../ui/use-toast.ts";

import {Image} from "../ui/image.tsx"
import {cn} from "../../utils.ts";
import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error(error);
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong.</div>;
        }
        return this.props.children;
    }
}

const DetailedPropertyTable = ({ properties }) => {
    const navigate = useNavigate()

    const [deleteProperty, {isLoading: isDeletingProperty}] = useDeletePropertyMutation()


    const getLocation = (property) => {
        if (property?.city && property?.country) {
            return `${property?.city}, ${property?.country}`
        }
        else if (property?.city) {
            return property?.city
        }
        else if (property?.country) {
            return property?.country
        }
        else {
            return "No Location"
        }
    }

    const occupiedStatus = ["ACTIVE", "RENTED", "SOLD", "RESERVED"]





    const getOccupancy = (property) => {
        let totalUnits = property?.units?.length
        let occupiedUnits = property?.units?.filter(unit => occupiedStatus.includes(unit?.status) )?.length
        let vacantUnits = property?.units?.filter(unit =>  !occupiedStatus.includes(unit?.status))?.length
        let percentOccupied = (occupiedUnits / totalUnits) * 100
        return (
            <div className="flex flex-row gap-2 items-center">
                <div className="flex flex-row gap-2">
                    <div className="flex flex-col gap-2">
                        <p className="text-foreground">
                            Occupancy
                        </p>
                        <p className="text-muted-foreground">
                            {percentOccupied}%
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-foreground">
                            Occupied
                        </p>
                        <p className="text-muted-foreground">
                            {occupiedUnits}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-foreground">
                            Vacant
                        </p>
                        <p className="text-muted-foreground">
                            {vacantUnits}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const OptionsMenu = ({property}) => {
        const [deleteProp, { isLoading: deleting }] = useDeletePropertyMutation();

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-6 w-6 text-foreground"/>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-[200px]">
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="flex flex-row text-md gap-2" onClick={(e) => { e.stopPropagation(); navigate(`/properties/${property.id}`); }}>
                            <Building2 className="w-4 h-4 "/>
                            View Property
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-row text-md gap-2" disabled>
                            <Pencil className="w-4 h-4"/>
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="text-md">
                                <Boxes className="mr-2 h-4 w-4" />
                                <span>View Rentals</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {property?.units.map((unit, index) => {
                                        return (
                                            <DropdownMenuItem key={index} className="flex flex-row text-md gap-2" onClick={(e) => { e.stopPropagation(); navigate('/rentals/' + unit?.id ); }}>
                                                <LinkIcon className="w-4 h-4"/>
                                                <span>{unit?.unitIdentifier || ("Unit " + unit?.id)}</span>
                                            </DropdownMenuItem>
                                        )
                                    })}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem className="flex flex-row text-md gap-2" disabled>
                            <Plus className="w-4 h-4"/>
                            Add Rental
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            className="flex flex-row text-md gap-2 text-red-500"
                            onSelect={async (event) => {
                                event.preventDefault();
                                try {
                                    await deleteProp(property?.id).unwrap();
                                    toast({ title: "Success", description: "Property deleted", variant: "success" });
                                } catch (err) {
                                    console.error(err);
                                    toast({ title: "Failed to delete", variant: "error" });
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4"/>
                            Delete Property
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                </DropdownMenuContent>
            </DropdownMenu>
        )
    }


    const Header = () => {
        return (
            <div style={{gridTemplateColumns: "minmax(250px,400px) 1fr 1fr 1fr 50px" }} className="bg-background-light rounded-2xl border-gray-100 border-2 p-4 w-full grid grid-cols-5 gap-8 overflow-x-auto font-500 text-gray-800 h-fit">
                <div className="flex flex-row gap-4 w-full items-center">
                    Property
                </div>
                <div className="flex flex-row gap-4 w-full items-center">
                    Location
                </div>
                <div className="flex flex-row gap-4 w-full items-center">
                    Units
                </div>
                <div className="flex flex-row gap-4 w-full items-center">
                    Occupancy
                </div>
                <div className="flex flex-row gap-4 w-full items-center">
                    Options
                </div>
            </div>
        )
    }

    const PropertyRow = ({ property }) => {
        return (
            <Link to={`/properties/${property.id}`} className="block">
            <div style={{gridTemplateColumns: "minmax(250px,30%) 1fr 1fr 1fr 50px" }} className="bg-background-light rounded-2xl border-border border-2 p-4 w-full grid grid-cols-5 gap-8 overflow-auto h-[150px] hover:bg-secondary min-h-fit">
                <div className="flex flex-row gap-4 w-full items-center">
                    <Image
                      src={
                        property?.images?.[0]?.imageUrl
                        || '/assets/H2.jpg'
                      }
                      className="w-20 h-20 object-cover rounded-sm hover:opacity-75 cursor-pointer"
                      alt="Property Image"
                    />
                    <div className="flex flex-col justify-start overflow-hidden">
                        <p className="font-500 text-foreground text-[2vh] md:text-md overflow-hidden">
                            {property?.title}
                        </p>
                        <p className="text-muted-foreground text-sm">
                            {RealEstateType[property.realEstateType]}
                        </p>
                    </div>
                </div>


                <div className="flex flex-row items-center text-muted-foreground text-sm overflow-hidden">
                    {getLocation(property)}
                </div>

                <div className="flex items-center text-sm text-gray-700">
                    <svg
                        className="w-4 h-4 mr-1 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a1 1 0 112 0v3a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                    </svg>
                    {property._count?.units} Units
                </div>


                {getOccupancy(property)}

                <div className="self-start sticky flex items-center h-full">
                    <OptionsMenu property={property}/>



                </div>

            </div>
            </Link>
        )
    }


    if (!properties?.length) {
        return (
            <div className="flex flex-col gap-1 ">
                {/*<Header/>*/}
                <p className="text-muted-foreground font-400 w-full ">
                    No properties found.
                </p>
            </div>
        )
    }

    return (
        <ErrorBoundary>
            <div className="flex flex-col gap-2 ">
                {/*<Header/>*/}
                {properties?.map((property, index) => {
                    return <PropertyRow key={index} property={property} />
                })}

            </div>
        </ErrorBoundary>
    )


}

export default DetailedPropertyTable;