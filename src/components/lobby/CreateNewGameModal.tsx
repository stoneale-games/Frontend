"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/AnimatedButton";

import {createGame} from "@/api/game.ts";

const formSchema = z.object({
    smallBlind: z.number().min(5, { message: "Small blind must be at least 1." }),
    bigBlind: z.number().min(10, { message: "Big blind must be at least 2." }),
});

export const CreateGameModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            smallBlind: 5,
            bigBlind: 10,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            const game = await  createGame(values.smallBlind, values.bigBlind);
            console.log(game);
            if (game) {
                setIsOpen(false);
                form.reset();
            }
        } catch (error) {
            console.error("Failed to create game:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <AnimatedButton
                icon={<Plus size={20} />}
                className="p-4 w-full justify-center"
                onClick={() => setIsOpen(true)}
            >
                Create New Game
            </AnimatedButton>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create a New Game</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                            <FormField
                                control={form.control}
                                name="smallBlind"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Small Blind</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bigBlind"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Big Blind</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <AnimatedButton
                                className="p-2 w-full justify-center hover:bg-red-500 hover:text-white"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Game"}
                            </AnimatedButton>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};