"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Activity, ArrowLeft, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import AuthProtection from "../components/authProtector";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddWebsite() {
    const { theme, setTheme } = useTheme();
    const [url, setUrl] = useState("");
    const { user } = useContext(UserContext)
    const router = useRouter()
    async function handleSubmit() {
        console.log("Website URL:", url);
        if (!url) {
            toast("url should not be empty")
            return
        }
        try {
            const response = await axios.post("http://localhost:3000/api/protected/websites/addWebsite", {
                url
            }, { withCredentials: true })
            if (response.status != 200) {
                toast("Issue adding the website");
                return
            }
            toast("Successfully added the website");
            router.push("/dashboard")

        } catch (err) {
            toast("Issue adding the website url to the database")
        }
    };

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
                            <Link href="/dashboard">
                                <Button variant="outline">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Add New Website</h1>

                    <Card className="max-w-md mx-auto p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Website URL
                                </label>
                                <Input
                                    id="url"
                                    type="url"
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                />
                            </div>
                            <Button onClick={handleSubmit} className="w-full">
                                Add Website
                            </Button>
                        </div>
                    </Card>
                </main>
            </div >
        );
    }
}
