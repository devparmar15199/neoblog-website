import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Upload, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export const UserSettings = () => {
    const { user, profile } = useSelector((state: RootState) => state.auth);
    const { updateProfile, uploadAvatar } = useAuth();

    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.display_name || "");
            setBio(profile.bio || "");
        }
    }, [profile]);

    const initials = (displayName || profile?.username || "U").substring(0, 2).toUpperCase();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        try {
            await updateProfile(user.id, { display_name: displayName, bio });
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(true);
        try {
            await uploadAvatar(user.id, file);
            toast.success("Avatar updated!");
        } catch (error) {
            toast.error("Failed to upload avatar.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (!user || !profile) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="flex items-center gap-2 mb-6">
                <Link to="/dashboard">
                    <Button variant="ghost" size="icon"><ChevronLeft className="size-5" /></Button>
                </Link>
                <h1 className="text-3xl font-bold">Settings</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update how you appear to others on the platform.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-muted/30 rounded-lg border">
                        <Avatar className="size-24 border-4 border-background shadow-sm">
                            <AvatarImage src={profile.avatar_url || undefined} />
                            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 text-center sm:text-left">
                            <h3 className="font-medium">Profile Picture</h3>
                            <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                            <div className="flex gap-2 justify-center sm:justify-start">
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isUploading}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {isUploading ? <LoadingSpinner size="sm" /> : <><Upload className="size-4 mr-2" /> Upload New</>}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="display-name">Display Name</Label>
                            <Input
                                id="display-name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={profile.username} disabled className="bg-muted" />
                            <p className="text-xs text-muted-foreground">Username cannot be changed.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell your story..."
                                rows={4}
                                className="resize-none"
                            />
                            <p className="text-xs text-right text-muted-foreground">{bio.length}/160</p>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="border-t bg-muted/10 px-6 py-4 flex justify-end">
                    <Button type="submit" form="profile-form" disabled={isSaving || isUploading}>
                        {isSaving ? <LoadingSpinner size="sm" /> : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};