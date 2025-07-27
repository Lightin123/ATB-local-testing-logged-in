import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormGroup,
} from "./ui/form.tsx";
import { Input } from "./ui/input.tsx";
import { Button } from "./ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.tsx";
import { useGetOwnersQuery, useChangeUnitOwnerMutation } from "../services/appApi";

const schema = z.object({
    ownerId: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
});

const ChangeOwnerForm = ({ unitId, onSuccess, className }) => {
    const { data: ownersData } = useGetOwnersQuery();
    const owners = ownersData;
    const [changeOwner, { isLoading }] = useChangeUnitOwnerMutation();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            ownerId: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
        },
    });

    const ownerId = form.watch("ownerId");
    const isNew = ownerId === "new";

    useEffect(() => {
        if (!isNew) {
            form.setValue("firstName", "");
            form.setValue("lastName", "");
            form.setValue("email", "");
            form.setValue("phone", "");
        }
    }, [isNew]);

    const onSubmit = async (values) => {
        const payload =
            values.ownerId === "new"
                ? { newOwner: { firstName: values.firstName, lastName: values.lastName, email: values.email, phone: values.phone } }
                : { ownerId: Number(values.ownerId) };
        const res = await changeOwner({ unitId, data: payload });
        if (!res.error) {
            form.reset();
            onSuccess && onSuccess();
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={`flex flex-col gap-2 ${className || ""}`}>
                <FormField
                    control={form.control}
                    name="ownerId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Owner</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select owner" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {owners?.map((o) => (
                                        <SelectItem key={o.id} value={String(o.id)}>
                                            {o.firstName} {o.lastName}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="new">+ New Owner</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {isNew && (
                    <>
                        <FormGroup useFlex>
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormGroup>
                        <FormGroup useFlex>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormGroup>
                    </>
                )}

                <Button type="submit" variant="cta" className="w-full mt-2" isLoading={isLoading}>
                    Save
                </Button>
            </form>
        </Form>
    );
};

export default ChangeOwnerForm;
