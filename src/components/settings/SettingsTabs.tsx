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
import {ChangeUserProfile} from "@/components/settings/ChangeUserProfile.tsx";



const settingsTabs = [
    {
        value: "UserProfile",
        label: "User Profile",
        description: "Change your profile, e.g username",
        component: <ChangeUserProfile/>,
    },

];

export const SettingsTabs = () => {
    return (
        <Tabs defaultValue={settingsTabs[0].value} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto">
                {settingsTabs.map((tab) => (
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

            {settingsTabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-4">
                    <Card className={"shadow-xs"}>
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