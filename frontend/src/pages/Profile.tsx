import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/auth";
import { api, ApiError } from "../lib/api";
import { UserProfile } from "../types";

const profileSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  email: z.string().email("Некорректный email")
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Минимум 6 символов"),
  newPassword: z.string().min(6, "Минимум 6 символов"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"]
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Profile() {
  const { token, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [user, setUserState] = useState<UserProfile | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors }
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    if (!token) return;
    try {
      const { user } = await api.getProfile(token);
      setUserState(user);
      resetProfile({
        name: user.name,
        email: user.email
      });
    } catch (err) {
      if (!(err instanceof ApiError)) throw err;
    }
  }

  async function onProfileSubmit(data: ProfileFormData) {
    if (!token) return;
    setLoading(true);
    setSaved(false);

    try {
      const { user: updatedUser } = await api.updateProfile(token, data);
      setUserState(updatedUser);
      setUser(updatedUser);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert("Ошибка при сохранении");
      }
    } finally {
      setLoading(false);
    }
  }

  async function onPasswordSubmit(data: PasswordFormData) {
    if (!token) return;
    setLoading(true);
    setPasswordChanged(false);

    try {
      await api.changePassword(token, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });
      setPasswordChanged(true);
      resetPassword();
      setTimeout(() => setPasswordChanged(false), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert("Ошибка при смене пароля");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 space-y-6">
        <h2 className="text-lg font-semibold text-ink-900">Профиль пользователя</h2>

        <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Имя
              </label>
              <input
                {...registerProfile("name")}
                type="text"
                className="input w-full"
                placeholder="Иван Иванов"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Email
              </label>
              <input
                {...registerProfile("email")}
                type="email"
                className="input w-full"
                placeholder="ivan@example.com"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary px-6"
            >
              {loading ? "Сохранение..." : "Сохранить"}
            </button>

            {saved && (
              <span className="text-sm text-green-600">✓ Сохранено!</span>
            )}
          </div>
        </form>
      </div>

      <div className="card p-6 space-y-6">
        <h2 className="text-lg font-semibold text-ink-900">Смена пароля</h2>

        <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              Текущий пароль
            </label>
            <input
              {...registerPassword("currentPassword")}
              type="password"
              className="input w-full"
              placeholder="••••••••"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Новый пароль
              </label>
              <input
                {...registerPassword("newPassword")}
                type="password"
                className="input w-full"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Подтверждение пароля
              </label>
              <input
                {...registerPassword("confirmPassword")}
                type="password"
                className="input w-full"
                placeholder="••••••••"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary px-6"
            >
              {loading ? "Сохранение..." : "Изменить пароль"}
            </button>

            {passwordChanged && (
              <span className="text-sm text-green-600">✓ Пароль изменён!</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
