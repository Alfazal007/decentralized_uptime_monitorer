"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Activity, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/context/UserContext";

export default function SignIn() {
    const { theme, setTheme } = useTheme();
    const [formData, setFormData] = useState({
        organization: "",
        password: "",
    });
    const router = useRouter()
    const { user, setUser } = useContext(UserContext)
    async function handleSubmit() {
        try {
            const response = await axios.post("http://localhost:3000/api/orgs/signin", {
                "name": formData.organization,
                "password": formData.password
            })
            console.log(response.status)
            if (response.status != 200) {
                toast("Issue signing in.")
                return;
            } else {
                console.log("insided else statement")
                const data = {
                    id: response.data.id,
                    accessToken: response.data.accessToken
                }
                console.log({ accessToken: data.accessToken, id: data.id })
                setUser({
                    accessToken: data.accessToken,
                    id: data.id
                });
                router.push("/dashboard")
            }
        } catch (err) {
            toast("Issue signing up.")
        }
    };

    return (
        <div className="min-h-screen">
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Activity className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">MonitorPro</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Card className="max-w-md mx-auto p-6">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold">Sign In</h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Welcome back! Please sign in to your organization.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="organization" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Organization Name
                            </label>
                            <Input
                                id="organization"
                                value={formData.organization}
                                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <Button onClick={handleSubmit} className="w-full">
                            Sign In
                        </Button>
                    </div>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <Link href="/routes/signup" className="text-primary hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </Card>
            </main>
        </div >
    );
}
