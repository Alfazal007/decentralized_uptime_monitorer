"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Activity, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const { theme, setTheme } = useTheme();
    const [formData, setFormData] = useState({
        organization: "",
        password: "",
        confirmPassword: "",
    });
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        if (formData.password !== formData.confirmPassword) {
            toast("Both password and confirm password must be same.")
            return
        }
        try {
            const response = await axios.post("http://localhost:3000/api/orgs/signup", {
                "name": formData.organization,
                "password": formData.password
            })
            if (response.status != 201) {
                toast("Issue signing up.")
                return;
            } else {
                router.push("/routes/signin")
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
                        <h1 className="text-2xl font-bold">Create Account</h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Sign up for your organization's monitoring account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Confirm Password
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link href="/routes/signin" className="text-primary hover:underline">
                            Sign In
                        </Link>
                    </div>
                </Card>
            </main>
        </div>
    );
}
