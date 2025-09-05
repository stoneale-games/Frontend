import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {PlayPokerRule} from "@/components/rules/PlayPokerRule.tsx";



const rulesTabs = [
    {
        value: "Play-poker",
        label: "Play Poker",
        description: "Understand the poker game rule to win",
        component: <PlayPokerRule/>,
    },
    {
        value: "games",
        label: "Games",
        description: "Join a game that starts as soon as enough players join.",
        component: null,
    },
    {
        value: "Tournaments",
        label: "Tournaments",
        description: "Compete in our scheduled weekly events.",
        component: null,
    },
    {
        value: "Others",
        label: "Others",
        description: "Sign up for major tournaments with big prizes.",
        component:  null,
    },
];

export const RulesTabs = () => {
    return (
        <Tabs defaultValue={rulesTabs[0].value} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto">
                {rulesTabs.map((tab) => (
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

            {rulesTabs.map((tab) => (
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