"use client";

import { ArrowRight, Activity, Shield, Zap, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function Home() {
    const { theme, setTheme } = useTheme();

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
                            className="cursor-pointer"
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                        <Link href="/dashboard">
                            <Button className="cursor-pointer">
                                Open Dashboard
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                <section className="py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Monitor Your Websites with Confidence
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Get real-time insights into your website's performance and uptime.
                            Never miss a beat with our advanced monitoring platform.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link href="/dashboard">
                                <Button size="lg" className="cursor-pointer">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-muted">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-card p-6 rounded-lg">
                                <Shield className="h-12 w-12 text-primary mb-4" />
                                <h3 className="text-xl font-semibold mb-2">24/7 Monitoring</h3>
                                <p className="text-muted-foreground">
                                    Continuous monitoring of your websites with instant alerts when issues arise.
                                </p>
                            </div>
                            <div className="bg-card p-6 rounded-lg">
                                <Activity className="h-12 w-12 text-primary mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Real-time Metrics</h3>
                                <p className="text-muted-foreground">
                                    Get detailed insights into your website's performance and availability.
                                </p>
                            </div>
                            <div className="bg-card p-6 rounded-lg">
                                <Zap className="h-12 w-12 text-primary mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Instant Alerts</h3>
                                <p className="text-muted-foreground">
                                    Receive immediate notifications when your websites experience issues.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
