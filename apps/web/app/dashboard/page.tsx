"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Activity, ArrowLeft, Moon, Plus, Sun } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import AuthProtection from "../components/authProtector";

const websites = [
    {
        id: 1,
        name: "Example.com",
        url: "https://example.com",
        states: [
            { status: "Good", timestamp: "2024-03-20 15:00:00" },
            { status: "Good", timestamp: "2024-03-20 14:45:00" },
            { status: "Bad", timestamp: "2024-03-20 14:30:00" },
            { status: "Good", timestamp: "2024-03-20 14:15:00" },
            { status: "Good", timestamp: "2024-03-20 14:00:00" },
            { status: "Grey", timestamp: "2024-03-20 13:45:00" },
            { status: "Good", timestamp: "2024-03-20 13:30:00" },
            { status: "Good", timestamp: "2024-03-20 13:15:00" },
            { status: "Good", timestamp: "2024-03-20 13:00:00" },
            { status: "Good", timestamp: "2024-03-20 12:45:00" },
        ],
    },
    {
        id: 2,
        name: "Test Site",
        url: "https://test.example.com",
        states: [
            { status: "Bad", timestamp: "2024-03-20 15:00:00" },
            { status: "Bad", timestamp: "2024-03-20 14:45:00" },
            { status: "Grey", timestamp: "2024-03-20 14:30:00" },
            { status: "Grey", timestamp: "2024-03-20 14:15:00" },
            { status: "Good", timestamp: "2024-03-20 14:00:00" },
            { status: "Good", timestamp: "2024-03-20 13:45:00" },
            { status: "Good", timestamp: "2024-03-20 13:30:00" },
            { status: "Good", timestamp: "2024-03-20 13:15:00" },
            { status: "Good", timestamp: "2024-03-20 13:00:00" },
            { status: "Good", timestamp: "2024-03-20 12:45:00" },
        ],
    },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case "Good":
            return "bg-green-500";
        case "Bad":
            return "bg-red-500";
        default:
            return "bg-gray-400";
    }
};

export default function Dashboard() {
    const { theme, setTheme } = useTheme();
    const { user } = useContext(UserContext)

    if (!user) {
        return (
            <AuthProtection />
        )
    } else {
        return (
            <div className="min-h-screen">
                <header className="border-b">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Activity className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">MonitorPro</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            >
                                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                            <Link href="/add-website">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Website
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Monitored Websites</h1>

                    <div className="grid gap-6">
                        {websites.map((website) => (
                            <Card key={website.id} className="p-6">
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="states">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-4">
                                                <h2 className="text-xl font-semibold">{website.name}</h2>
                                                <span className="text-sm text-muted-foreground">{website.url}</span>
                                                <div className={`w-3 h-3 rounded-full ${getStatusColor(website.states[0].status)}`} />
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex gap-2 mt-4 overflow-x-auto pb-4">
                                                {website.states.slice().reverse().map((state, index) => (
                                                    <div key={index} className="flex flex-col items-center gap-2 min-w-[100px]">
                                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(state.status)}`} />
                                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                            {new Date(state.timestamp).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        );
    }
}
