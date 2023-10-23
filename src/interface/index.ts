
export interface changePassword {
    currentPassword: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
}

export interface resetPassword {
    token: string;
    email: string;
    password: string;
    confirmPassword: string;
}