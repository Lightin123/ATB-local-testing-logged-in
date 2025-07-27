import {Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";
import {useNavigate} from "react-router-dom";
import {ArrowRightIcon} from "lucide-react";
import {Skeleton} from "../ui/skeleton.tsx";


const InfoCard = ({title, number, link, ...props}) => {
    const navigate = useNavigate()

    return (
        <Card className="basis-[200px] flex-grow min-w-fit w-full shadow-sm relative">
            <CardHeader className="px-4 py-2 pb-0 flex flex-row justify-between items-center gap-4">
                {props.children}
                <CardTitle className="text-md text-foreground font-500 whitespace-nowrap">
                    {title}
                </CardTitle>
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 rounded-full p-2 cursor-pointer" onClick={() => navigate(link)} hidden={!link}>
                    <ArrowRightIcon className="w-6 h-6 fill-current text-white"/>
                </div>
            </CardHeader>
            <CardContent className="py-4 px-4 mb-4 text-3xl">
                {number !== undefined ? number : (
                    <Skeleton className="w-10 h-8" />
                )
                }
            </CardContent>
        </Card>
    )
}

export default InfoCard
