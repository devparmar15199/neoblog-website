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
import { Upload, Save } from "lucide-react";
import toast from "react-hot-toast";

export const ProfileSettings = () => {
    // Get the user and profile from the Redux store
    const { user, profile } = useSelector((state: RootState) => state.auth);
    // Get actions from useAuth hook
    const { updateProfile, uploadAvatar } = useAuth();

    // Initialize state from profile slice data
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");



    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.display_name || "");
            setBio(profile.bio || "");
            setAvatarUrl(profile.avatar_url || "");
        }
    }, [profile]);

    // Helper for initials
    const getInitials = (name?: string | null) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };
    const initials = getInitials(displayName || profile?.username);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        const updates = { display_name: displayName, bio };

        try {
            await updateProfile(user.id, updates);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error(error);
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
            const newUrl = await uploadAvatar(user.id, file);
            setAvatarUrl(newUrl);
            toast.success("Avatar updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload avatar.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    if (!user || !profile) {
        return <div className="flex justify-center py-10"><LoadingSpinner /></div>;
    }

    return (
        <div className="flex justify-center py-10">
            <Card className="w-full max-w-xl p-4">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Your Profile</CardTitle>
                    <CardDescription>Update your public information, including your display name and bio.</CardDescription>
                </CardHeader>

                {/* Avatar Section */}
                <CardContent className="space-y-2">
                    <Label className="text-md font-bold">Avatar</Label>
                    <div className="flex items-center gap-6">
                        <Avatar className="size-20 shadow-md border-2 border-primary/50">
                            <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                        </Avatar>

                        <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            ref={fileInputRef}
                            disabled={isUploading}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            icon={isUploading ? undefined : Upload}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? <LoadingSpinner size="sm" /> : "Upload New Avatar"}
                        </Button>
                    </div>
                </CardContent>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {/* Display Name */}
                        <div>
                            <Label htmlFor="display-name" className="text-md font-bold mb-2">Display Name</Label>
                            <Input
                                id="display-name"
                                placeholder="Your public display name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                disabled={isSaving}
                                className="h-12"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <Label htmlFor="bio" className="text-md font-bold mb-2">Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us a little about yourself..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                disabled={isSaving}
                                rows={4}
                                maxLength={160}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className=" flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSaving || isUploading || !displayName}
                            icon={isSaving ? undefined : Save}
                            className="h-12"
                        >
                            {isSaving ? <LoadingSpinner size="sm" /> : "Save Changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};