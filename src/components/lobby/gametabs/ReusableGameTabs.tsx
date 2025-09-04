
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import type {ReactNode} from "react";

export type TabsProps = {
    value:string;
    label:string;
    description:string;
    component:ReactNode;
}
export const ReusableGameTabs = ({gameTabs}:{gameTabs:TabsProps[]}) => {
    return (
        <Tabs defaultValue={gameTabs[0].value} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto">
                {gameTabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="
                          relative text-base font-medium py-3 px-4
                          after:absolute after:bottom-0 after:left-0 after:w-full
                          after:h-[2px] after:bg-red-500 after:scale-x-0 /* <-- THE CHANGE IS HERE */
                          after:transition-transform after:duration-300 after:ease-in-out
                          data-[state=active]:after:scale-x-100
                        "
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {gameTabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{tab.label}</CardTitle>
                            <CardDescription>{tab.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {tab.component}
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    );
};