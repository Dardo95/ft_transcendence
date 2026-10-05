import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { useLanguage } from "../../languages";

export function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useLanguage();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alert(`Register attempt for: ${username}`);
        }, 1000);
    }

    return (
        <Card className="w-full max-w-sm mx-auto mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                {t("auth.register.title")}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label={t("auth.register.username")}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t("auth.register.placeholder")}
                    required
                />
                <Input
                    label={t("auth.register.password")}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("auth.register.passwordPlaceholder")}
                    required
                />

                <Button type="submit" disabled={isSubmitting} className="mt-2">
                    {isSubmitting
                        ? t("auth.register.connecting")
                        : t("auth.register.playNow")}
                </Button>
            </form>
        </Card>
    );
}