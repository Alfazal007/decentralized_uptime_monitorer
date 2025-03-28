"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function AuthProtection() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="max-w-md w-full mx-4 p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">Authentication Required</h1>
                        <p className="text-muted-foreground">
                            Please sign in to access this page and monitor your websites.
                        </p>
                    </div>
                    <Link href="/routes/signin" className="w-full">
                        <Button className="w-full">
                            Sign In to Continue
                        </Button>
                    </Link>
                    <div className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/routes/signup" className="text-primary hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}
